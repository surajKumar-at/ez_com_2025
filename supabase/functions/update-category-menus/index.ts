
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request payload
    const { secret } = await req.json();
    
    // Verify the secret key for added security
    // In a real app, you'd store this in Supabase secrets
    if (secret !== Deno.env.get("CATEGORY_UPDATE_SECRET")) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Get all unique categories from the products table
    const { data: categoriesData, error: categoriesError } = await supabaseClient
      .from('products')
      .select('category')
      .order('category');
      
    if (categoriesError) {
      throw new Error(`Error fetching categories: ${categoriesError.message}`);
    }
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(categoriesData.map((item: any) => item.category))
    );
    
    console.log(`Found ${uniqueCategories.length} unique categories in products`);
    console.log("Categories:", uniqueCategories);
    
    // 2. Check if the "Categories" parent menu item exists
    const { data: parentMenu, error: parentError } = await supabaseClient
      .from('menu_items')
      .select('id')
      .eq('path', '#categories')
      .maybeSingle(); // Use maybeSingle to avoid PGRST116 error
      
    let parentId;
    
    if (parentError) {
      console.error('Error checking if Categories menu exists:', parentError);
      throw new Error(`Error checking Categories menu: ${parentError.message}`);
    }
    
    if (!parentMenu) {
      console.log('Categories menu not found, creating it...');
      
      // Create new parent menu item with auto-generated ID
      const { data: newParent, error: createError } = await supabaseClient
        .from('menu_items')
        .insert({
          path: '#categories',
          icon: 'Layers',
          is_external: false,
          sort_order: 20,
          requires_auth: false
        })
        .select('id')
        .single();
        
      if (createError) {
        // Check if this is a duplicate key error
        if (createError.code === '23505') {
          console.log('Menu item with this path already exists, fetching it instead');
          
          // If insertion failed due to duplicate key, fetch the existing record
          const { data: existingParent, error: fetchError } = await supabaseClient
            .from('menu_items')
            .select('id')
            .eq('path', '#categories')
            .single();
            
          if (fetchError) {
            throw new Error(`Error fetching existing Categories menu: ${fetchError.message}`);
          }
          
          parentId = existingParent.id;
        } else {
          console.error('Error creating Categories menu:', createError);
          throw new Error(`Error creating Categories menu: ${JSON.stringify(createError)}`);
        }
      } else {
        // Also add it to all roles - IMPORTANT: include 'customer' role
        const roles = ['customer', 'admin', 'content-admin'];
        for (const role of roles) {
          const { error: roleError } = await supabaseClient
            .from('role_menu_items')
            .insert({
              role,
              menu_item_id: newParent.id
            });
            
          if (roleError) {
            console.error(`Error assigning role ${role} to Categories menu:`, roleError);
          } else {
            console.log(`Assigned role ${role} to Categories menu`);
          }
        }
        
        // Create a translation for this menu item
        await supabaseClient
          .from('menu_item_translations')
          .insert({
            menu_item_id: newParent.id,
            language_code: 'en-US',
            title: 'Categories'
          });
        
        parentId = newParent.id;
        console.log(`Created Categories parent menu with ID: ${parentId}`);
      }
    } else {
      parentId = parentMenu.id;
      console.log(`Found existing Categories parent menu with ID: ${parentId}`);
      
      // Ensure the Categories parent has role assignments for customers
      // This ensures existing Categories menu items are visible to customers
      const { data: existingRoles } = await supabaseClient
        .from('role_menu_items')
        .select('role')
        .eq('menu_item_id', parentId);
        
      console.log(`Existing roles for Categories menu:`, existingRoles);
      const hasCustomerRole = existingRoles?.some((r: any) => r.role === 'customer');
      
      if (!hasCustomerRole) {
        console.log('Adding customer role to existing Categories menu');
        const { error: roleError } = await supabaseClient
          .from('role_menu_items')
          .insert({
            role: 'customer',
            menu_item_id: parentId
          });
          
        if (roleError) {
          console.error('Error adding customer role to Categories menu:', roleError);
        } else {
          console.log('Successfully added customer role to Categories menu');
        }
      }
    }
    
    // Verify all role assignments for Categories parent menu
    const { data: allRoleAssignments, error: roleCheckError } = await supabaseClient
      .from('role_menu_items')
      .select('role')
      .eq('menu_item_id', parentId);
      
    if (roleCheckError) {
      console.error('Error checking role assignments:', roleCheckError);
    } else {
      console.log(`Role assignments for Categories menu (ID ${parentId}):`, 
        allRoleAssignments.map((r: any) => r.role));
    }
    
    // 3. Get existing category menu items
    const { data: existingItems, error: itemsError } = await supabaseClient
      .from('menu_items')
      .select('id, path')
      .eq('parent_id', parentId);
      
    if (itemsError) {
      throw new Error(`Error fetching existing category menu items: ${itemsError.message}`);
    }
    
    // Create a map of existing paths to menu item IDs
    const existingPaths = new Map();
    existingItems.forEach((item: any) => {
      // Extract the category from the path (e.g., "/products/beds" -> "beds")
      const pathParts = item.path.split('/');
      const category = pathParts[pathParts.length - 1];
      existingPaths.set(category, item.id);
    });
    
    console.log(`Found ${existingPaths.size} existing category menu items`);
    
    // 4. Update menu items based on current categories
    let added = 0, removed = 0, skipped = 0;
    for (const category of uniqueCategories) {
      if (!existingPaths.has(category)) {
        try {
          // Create new menu item for this category
          const { data: newItem, error: insertError } = await supabaseClient
            .from('menu_items')
            .insert({
              parent_id: parentId,
              path: `/products/${category}`,
              icon: null,
              is_external: false,
              sort_order: 10,
              requires_auth: false
            })
            .select('id')
            .single();
            
          if (insertError) {
            console.error(`Error creating menu item for ${category}:`, insertError);
            skipped++;
            continue;
          }
          
          // Create a translation for this menu item
          const formattedName = formatCategoryName(category);
          await supabaseClient
            .from('menu_item_translations')
            .insert({
              menu_item_id: newItem.id,
              language_code: 'en-US',
              title: formattedName
            });
            
          // Add to all roles including customer role
          const roles = ['customer', 'admin', 'content-admin'];
          for (const role of roles) {
            const { error: roleError } = await supabaseClient
              .from('role_menu_items')
              .insert({
                role,
                menu_item_id: newItem.id
              });
              
            if (roleError) {
              console.error(`Error assigning role ${role} to menu item for ${category}:`, roleError);
            } else {
              console.log(`Assigned role ${role} to menu item for ${category}`);
            }
          }
          
          console.log(`Created menu item for category: ${category}`);
          added++;
        } catch (err) {
          console.error(`Error processing category ${category}:`, err);
          skipped++;
        }
      } else {
        // Check if this item has the customer role assigned
        const menuItemId = existingPaths.get(category);
        const { data: roleAssignments, error: roleCheckError } = await supabaseClient
          .from('role_menu_items')
          .select('role')
          .eq('menu_item_id', menuItemId);
          
        if (roleCheckError) {
          console.error(`Error checking roles for category ${category}:`, roleCheckError);
          continue;
        }
        
        console.log(`Existing roles for category ${category}:`, 
          roleAssignments?.map((r: any) => r.role));
          
        const hasCustomerRole = roleAssignments?.some((r: any) => r.role === 'customer');
        
        if (!hasCustomerRole) {
          console.log(`Adding customer role to existing menu item for category: ${category}`);
          const { error: insertRoleError } = await supabaseClient
            .from('role_menu_items')
            .insert({
              role: 'customer',
              menu_item_id: menuItemId
            });
            
          if (insertRoleError) {
            console.error(`Error adding customer role to menu item for ${category}:`, insertRoleError);
          } else {
            console.log(`Successfully added customer role to menu item for ${category}`);
          }
        }
      }
      
      // Remove the category from the map so we can track which ones to delete
      existingPaths.delete(category);
    }
    
    // 5. Delete menu items for categories that no longer exist
    for (const [category, itemId] of existingPaths.entries()) {
      try {
        // First delete from role_menu_items
        await supabaseClient
          .from('role_menu_items')
          .delete()
          .eq('menu_item_id', itemId);
          
        // Then delete from menu_item_translations
        await supabaseClient
          .from('menu_item_translations')
          .delete()
          .eq('menu_item_id', itemId);
          
        // Finally delete the menu item itself
        await supabaseClient
          .from('menu_items')
          .delete()
          .eq('id', itemId);
          
        console.log(`Deleted menu item for category: ${category}`);
        removed++;
      } catch (err) {
        console.error(`Error deleting menu item for ${category}:`, err);
        skipped++;
      }
    }
    
    // Verify role assignments for all menu items at the end
    const { data: allMenuItems } = await supabaseClient
      .from('menu_items')
      .select('id, path')
      .eq('parent_id', parentId);
      
    if (allMenuItems && allMenuItems.length > 0) {
      console.log(`Verifying role assignments for ${allMenuItems.length} category menu items...`);
      
      let missingCustomerRoles = 0;
      
      for (const item of allMenuItems) {
        const { data: roles } = await supabaseClient
          .from('role_menu_items')
          .select('role')
          .eq('menu_item_id', item.id);
          
        const pathParts = item.path.split('/');
        const category = pathParts[pathParts.length - 1];
        
        const hasCustomerRole = roles?.some((r: any) => r.role === 'customer');
        console.log(`Category "${category}" (ID: ${item.id}) roles:`, 
          roles?.map((r: any) => r.role), `Has customer role: ${hasCustomerRole}`);
          
        if (!hasCustomerRole) {
          missingCustomerRoles++;
          console.log(`MISSING CUSTOMER ROLE: Adding it to ${category}`);
          
          await supabaseClient
            .from('role_menu_items')
            .insert({
              role: 'customer',
              menu_item_id: item.id
            });
        }
      }
      
      if (missingCustomerRoles > 0) {
        console.log(`Fixed ${missingCustomerRoles} menu items missing customer role assignments`);
      } else {
        console.log('All category menu items have correct customer role assignments');
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Category menu items updated successfully: ${added} added, ${removed} removed, ${skipped} skipped` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Helper function to format category name for display
function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
