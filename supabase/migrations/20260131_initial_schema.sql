-- ==========================================
-- COMPLETE SCHEMA RESET WITH PROPER RLS
-- ==========================================

-- Drop and recreate all policies to ensure clean slate
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.tablename) || '_policy ON ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Disable RLS temporarily
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS task_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activity_log DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- PROFILES - Level 0 (No dependencies)
-- ==========================================

CREATE POLICY "profiles_allow_all_select"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_allow_own_insert"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_allow_own_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ==========================================
-- TEAMS - Level 1 (Only depends on profiles)
-- ==========================================

-- Function to check team ownership (avoids recursion)
CREATE OR REPLACE FUNCTION is_team_owner(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM teams WHERE id = team_uuid AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check team membership (avoids recursion)
CREATE OR REPLACE FUNCTION is_team_member(team_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members 
    WHERE team_id = team_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE POLICY "teams_select"
  ON teams FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid() 
    OR is_team_member(id)
  );

CREATE POLICY "teams_insert"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "teams_update"
  ON teams FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "teams_delete"
  ON teams FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ==========================================
-- TEAM_MEMBERS - Level 2 (Depends on teams)
-- ==========================================

CREATE POLICY "team_members_select"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR is_team_owner(team_id)
  );

CREATE POLICY "team_members_insert"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (is_team_owner(team_id));

CREATE POLICY "team_members_update"
  ON team_members FOR UPDATE
  TO authenticated
  USING (is_team_owner(team_id))
  WITH CHECK (is_team_owner(team_id));

CREATE POLICY "team_members_delete"
  ON team_members FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR is_team_owner(team_id)
  );

-- ==========================================
-- TASKS - Level 3 (Depends on teams and team_members)
-- ==========================================

CREATE POLICY "tasks_select"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR assigned_to = auth.uid()
    OR (team_id IS NOT NULL AND is_team_member(team_id))
  );

CREATE POLICY "tasks_insert"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "tasks_update"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (team_id IS NOT NULL AND is_team_owner(team_id))
  )
  WITH CHECK (
    user_id = auth.uid()
    OR (team_id IS NOT NULL AND is_team_owner(team_id))
  );

CREATE POLICY "tasks_delete"
  ON tasks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ==========================================
-- GRANTS - Ensure authenticated users can access
-- ==========================================

GRANT ALL ON profiles TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON teams TO authenticated;
GRANT ALL ON team_members TO authenticated;

-- ==========================================
-- VERIFICATION
-- ==========================================

-- Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;