-- Create clients table
CREATE TABLE IF NOT EXISTS clients_ak73hs4r1t (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  financial_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  insurance JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for clients
ALTER TABLE clients_ak73hs4r1t ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins have full access to clients" 
ON clients_ak73hs4r1t
USING (auth.jwt() ->> 'role' = 'admin');

-- Advisors can read all clients and modify their own
CREATE POLICY "Advisors can read all clients" 
ON clients_ak73hs4r1t
FOR SELECT
USING (auth.jwt() ->> 'role' = 'advisor');

CREATE POLICY "Advisors can modify their own clients" 
ON clients_ak73hs4r1t
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'advisor' AND 
  user_id = auth.uid()
);

CREATE POLICY "Advisors can insert clients" 
ON clients_ak73hs4r1t
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'advisor'
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports_ak73hs4r1t (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients_ak73hs4r1t(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'completed'
);

-- Create RLS policies for reports
ALTER TABLE reports_ak73hs4r1t ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins have full access to reports" 
ON reports_ak73hs4r1t
USING (auth.jwt() ->> 'role' = 'admin');

-- Advisors can access their own reports
CREATE POLICY "Advisors can access their own reports" 
ON reports_ak73hs4r1t
USING (
  auth.jwt() ->> 'role' = 'advisor' AND 
  user_id = auth.uid()
);

-- Create function to help sync data from local to database
CREATE OR REPLACE FUNCTION sync_clients(client_data JSONB)
RETURNS JSONB AS $$
DECLARE
  client_id UUID;
  result JSONB;
BEGIN
  -- Check if client exists
  SELECT id INTO client_id 
  FROM clients_ak73hs4r1t 
  WHERE id = (client_data->>'id')::UUID;
  
  IF client_id IS NULL THEN
    -- Insert new client
    INSERT INTO clients_ak73hs4r1t(
      id, 
      user_id, 
      personal_info, 
      financial_info, 
      goals, 
      insurance, 
      created_at, 
      updated_at
    )
    VALUES (
      (client_data->>'id')::UUID, 
      (client_data->>'userId')::UUID, 
      client_data->'personalInfo', 
      client_data->'financialInfo', 
      client_data->'goals', 
      client_data->'insurance',
      (client_data->>'createdAt')::TIMESTAMP WITH TIME ZONE, 
      (client_data->>'updatedAt')::TIMESTAMP WITH TIME ZONE
    )
    RETURNING id INTO client_id;
    
    result = jsonb_build_object('status', 'inserted', 'id', client_id);
  ELSE
    -- Update existing client
    UPDATE clients_ak73hs4r1t
    SET 
      personal_info = client_data->'personalInfo',
      financial_info = client_data->'financialInfo',
      goals = client_data->'goals',
      insurance = client_data->'insurance',
      updated_at = (client_data->>'updatedAt')::TIMESTAMP WITH TIME ZONE
    WHERE id = client_id;
    
    result = jsonb_build_object('status', 'updated', 'id', client_id);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to help sync reports from local to database
CREATE OR REPLACE FUNCTION sync_reports(report_data JSONB)
RETURNS JSONB AS $$
DECLARE
  report_id UUID;
  result JSONB;
BEGIN
  -- Check if report exists
  SELECT id INTO report_id 
  FROM reports_ak73hs4r1t 
  WHERE id = (report_data->>'id')::UUID;
  
  IF report_id IS NULL THEN
    -- Insert new report
    INSERT INTO reports_ak73hs4r1t(
      id, 
      client_id, 
      user_id, 
      title, 
      type, 
      content, 
      generated_at, 
      status
    )
    VALUES (
      (report_data->>'id')::UUID, 
      (report_data->>'clientId')::UUID, 
      (report_data->>'userId')::UUID, 
      report_data->>'title', 
      report_data->>'type',
      '{}'::jsonb, 
      (report_data->>'generatedAt')::TIMESTAMP WITH TIME ZONE, 
      report_data->>'status'
    )
    RETURNING id INTO report_id;
    
    result = jsonb_build_object('status', 'inserted', 'id', report_id);
  ELSE
    -- Update existing report
    UPDATE reports_ak73hs4r1t
    SET 
      title = report_data->>'title',
      type = report_data->>'type',
      status = report_data->>'status'
    WHERE id = report_id;
    
    result = jsonb_build_object('status', 'updated', 'id', report_id);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;