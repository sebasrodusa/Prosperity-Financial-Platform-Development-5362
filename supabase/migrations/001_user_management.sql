-- Create user profiles table with approval workflow
CREATE TABLE IF NOT EXISTS user_profiles_ak73hs4r1t (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE user_profiles_ak73hs4r1t ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY "Admins have full access to profiles" ON user_profiles_ak73hs4r1t
  USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON user_profiles_ak73hs4r1t
  FOR SELECT USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles_ak73hs4r1t (id, email, role)
  VALUES (new.id, new.email, 'pending');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create user activity logs
CREATE TABLE IF NOT EXISTS user_activity_logs_ak73hs4r1t (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for activity logs
ALTER TABLE user_activity_logs_ak73hs4r1t ENABLE ROW LEVEL SECURITY;

-- Admins can read all activity logs
CREATE POLICY "Admins can read all activity logs" ON user_activity_logs_ak73hs4r1t
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read their own activity logs
CREATE POLICY "Users can read their own logs" ON user_activity_logs_ak73hs4r1t
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can insert logs
CREATE POLICY "Allow all inserts to activity logs" ON user_activity_logs_ak73hs4r1t
  FOR INSERT WITH CHECK (true);

-- Create pending users view for admin dashboard
CREATE OR REPLACE VIEW pending_users_view AS
SELECT id, email, created_at
FROM user_profiles_ak73hs4r1t
WHERE role = 'pending';

-- Create function to approve user
CREATE OR REPLACE FUNCTION approve_user(user_id UUID, new_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_profiles_ak73hs4r1t
  SET role = new_role, updated_at = NOW()
  WHERE id = user_id AND role = 'pending';
  
  INSERT INTO user_activity_logs_ak73hs4r1t (user_id, action, details)
  VALUES (user_id, 'account_approved', jsonb_build_object('approved_by', auth.uid(), 'new_role', new_role));
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;