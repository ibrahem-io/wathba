/*
  # Fix User Registration RLS Policies

  1. Security Updates
    - Add policy to allow user registration (INSERT) for authenticated users
    - Add policy to allow user registration during sign-up process
    - Ensure users can create their own profile during registration

  2. Changes
    - Add INSERT policy for users table to allow profile creation during sign-up
    - Update existing policies to ensure proper access control
*/

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Allow users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to insert their own profile during registration
CREATE POLICY "Users can create their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow service role to insert users (for server-side operations)
CREATE POLICY "Service role can manage users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);