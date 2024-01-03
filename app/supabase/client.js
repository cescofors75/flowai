/* eslint-disable no-undef */
import { createClient } from '@supabase/supabase-js';
//const { createClient } = require('@supabase/supabase-js');
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
  }
);


