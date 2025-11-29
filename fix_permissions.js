
export const FIX_PERMISSIONS_SQL = `
-- 1. Enable Row Level Security
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 2. Drop all conflicting policies to start fresh
DROP POLICY IF EXISTS "Public Read Access" ON public.modules;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can insert modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can update modules" ON public.modules;
DROP POLICY IF EXISTS "Admins can delete modules" ON public.modules;
DROP POLICY IF EXISTS "Authenticated users can manage modules" ON public.modules;

-- 3. Create READ Policy (Everyone can see modules)
CREATE POLICY "Public Read Access"
ON public.modules FOR SELECT
USING (true);

-- 4. Create WRITE Policy (Authenticated users can Edit/Delete)
-- We are temporarily allowing ALL logged-in users to delete to fix your issue.
CREATE POLICY "Authenticated users can manage modules"
ON public.modules
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
`;
