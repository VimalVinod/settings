const SUPABASE_URL = 'https://roresgetyaxzesksjzxa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmVzZ2V0eWF4emVza3NqenhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NDQ5MDksImV4cCI6MjA2NzUyMDkwOX0.G38tuXagIPwPus7bP2DGO4DrEEk-QsYz0mUEAQzHrUU'; // (keep full key)

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
