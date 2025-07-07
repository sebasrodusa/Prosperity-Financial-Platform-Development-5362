import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zkfsykmkwtkfpusesrir.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZnN5a21rd3RrZnB1c2VzcmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NzQxNTQsImV4cCI6MjA2NzQ1MDE1NH0.QACOK3FuUnWqXakeZadPVvnC0zAwHyDvNu7q1WKilng'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){ 
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})