-- SQL Script: Promote User to Admin
-- Required: The user must already exist in Supabase Auth (already signed up).

-- 1. Insert the user into the 'public.users' table
-- Change 'admin@example.com' to the actual email of the user you want to promote.
-- Change 'ADMIN' to 'SUPERADMIN' if you want higher privileges.

INSERT INTO public.users (id, email, full_name, role)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name', 
    'ADMIN' -- or 'SUPERADMIN'
FROM auth.users 
WHERE email = 'TU-EMAIL@EJEMPLO.COM' -- <--- CAMBIA ESTO
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = now();

-- 2. Verify the user was added
SELECT * FROM public.users WHERE email = 'TU-EMAIL@EJEMPLO.COM'; -- <--- CAMBIA ESTO
