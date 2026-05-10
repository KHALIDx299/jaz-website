import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://gpnkutppljklfwzmzhag.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwbmt1dHBwbGprbGZ3em16aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODQ5NzMsImV4cCI6MjA5Mzk2MDk3M30.GEKjIPpUfNaaZcSepvsZaG_QJaeKX3MCZmG2u0HqdCM'
)