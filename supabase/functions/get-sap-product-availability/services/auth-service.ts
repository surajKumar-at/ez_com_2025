
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function checkUserAuthorization(req: Request) {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  // Check for the user's role
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  if (!user) {
    console.log("No authenticated user found");
    return { authorized: false, user: null };
  }
  
  console.log("Authenticated user:", user.email);
  
  // Get user roles using the RPC function that returns text array
  const { data: userRolesArray, error: userRolesError } = await supabaseClient.rpc(
    'get_user_roles_as_text',
    { user_id_param: user.id }
  );
  
  let isAdmin = false;
  let isContentAdmin = false;
  
  if (userRolesError) {
    console.error("Error fetching user roles with RPC:", userRolesError);
    
    // Alternative: use the query_user_roles RPC that returns rows
    const { data: userRolesData, error: queryError } = await supabaseClient.rpc(
      'query_user_roles',
      { user_id_param: user.id }
    );
    
    if (queryError) {
      console.error("Error with alternative RPC:", queryError);
      
      // Last resort: direct query with casting
      const { data: directQueryData, error: directError } = await supabaseClient
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);
        
      if (directError) {
        console.error("Direct query error:", directError);
      } else if (directQueryData && directQueryData.length > 0) {
        console.log("Direct query roles:", JSON.stringify(directQueryData));
        // Handle enum values by converting to string
        isAdmin = directQueryData.some(r => String(r.role) === 'admin');
        isContentAdmin = directQueryData.some(r => String(r.role) === 'content-admin' || String(r.role) === 'admin');
      }
    } else if (userRolesData && userRolesData.length > 0) {
      console.log("Query RPC roles:", JSON.stringify(userRolesData));
      
      // These are already strings from our RPC
      isAdmin = userRolesData.some(r => r.role === 'admin');
      isContentAdmin = userRolesData.some(r => r.role === 'content-admin' || r.role === 'admin');
    }
  } else if (userRolesArray && userRolesArray.length > 0) {
    console.log("Role array from RPC:", userRolesArray);
    isAdmin = userRolesArray.includes('admin');
    isContentAdmin = userRolesArray.includes('content-admin') || userRolesArray.includes('admin');
  }
  
  console.log("User authorization result:", { isAdmin, isContentAdmin });

  return { authorized: true, user, isAdmin, isContentAdmin };
}
