
-- This file contains SQL for directly updating category menus based on product data
-- Execute this SQL in the Supabase SQL Editor at https://app.supabase.com/project/ouzxmcydhconwakrphtn/sql

-- First, find or create the Categories parent menu item
DO $$
DECLARE
  parent_id INT;
  category_text TEXT;
  menu_item_id INT;
  formatted_name TEXT;
BEGIN
  -- Find or create the Categories parent menu
  SELECT id INTO parent_id FROM menu_items WHERE path = '#categories';
  
  IF parent_id IS NULL THEN
    -- Create the Categories parent menu
    INSERT INTO menu_items (path, icon, is_external, sort_order, requires_auth)
    VALUES ('#categories', 'Layers', false, 20, false)
    RETURNING id INTO parent_id;
    
    -- Create translation for the menu item
    INSERT INTO menu_item_translations (menu_item_id, language_code, title)
    VALUES (parent_id, 'en-US', 'Categories');
    
    -- Add to all roles
    INSERT INTO role_menu_items (role, menu_item_id)
    VALUES ('customer', parent_id),
           ('admin', parent_id),
           ('content-admin', parent_id);
    
    RAISE NOTICE 'Created Categories parent menu with ID: %', parent_id;
  ELSE
    RAISE NOTICE 'Found existing Categories parent menu with ID: %', parent_id;
  END IF;

  -- Get all unique categories from the products table
  FOR category_text IN
    SELECT DISTINCT category FROM products ORDER BY category
  LOOP
    -- Check if a menu item for this category already exists
    -- Fix the variable scope issue by using different variable name for parent_id in WHERE clause
    SELECT id INTO menu_item_id 
    FROM menu_items 
    WHERE parent_id = parent_id AND path = '/products/' || category_text;
    
    IF menu_item_id IS NULL THEN
      -- Format the category name for display (replace hyphens with spaces and capitalize)
      formatted_name := initcap(replace(category_text, '-', ' '));
      
      -- Create the menu item
      INSERT INTO menu_items (parent_id, path, icon, is_external, sort_order, requires_auth)
      VALUES (parent_id, '/products/' || category_text, NULL, false, 10, false)
      RETURNING id INTO menu_item_id;
      
      -- Create translation for the menu item
      INSERT INTO menu_item_translations (menu_item_id, language_code, title)
      VALUES (menu_item_id, 'en-US', formatted_name);
      
      -- Add to all roles
      INSERT INTO role_menu_items (role, menu_item_id)
      VALUES ('customer', menu_item_id),
             ('admin', menu_item_id),
             ('content-admin', menu_item_id);
      
      RAISE NOTICE 'Created menu item for category: % with ID: %', category_text, menu_item_id;
    ELSE
      RAISE NOTICE 'Menu item for category % already exists with ID: %', category_text, menu_item_id;
    END IF;
  END LOOP;
  
  -- Find and delete menu items for categories that no longer exist
  -- Fix the scope issue by using a different name for the variable
  FOR menu_item_id IN
    SELECT mi.id 
    FROM menu_items mi
    WHERE mi.parent_id = parent_id
    AND SUBSTRING(mi.path FROM '/products/(.*)') NOT IN (SELECT category FROM products)
  LOOP
    -- Delete from role_menu_items
    DELETE FROM role_menu_items WHERE menu_item_id = menu_item_id;
    
    -- Delete from menu_item_translations
    DELETE FROM menu_item_translations WHERE menu_item_id = menu_item_id;
    
    -- Delete the menu item itself
    DELETE FROM menu_items WHERE id = menu_item_id;
    
    RAISE NOTICE 'Deleted menu item with ID: %', menu_item_id;
  END LOOP;
  
  RAISE NOTICE 'Category menu items update completed.';
END $$;
