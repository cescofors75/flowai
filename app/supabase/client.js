/* eslint-disable no-undef */
import { createClient } from '@supabase/supabase-js';
//const { createClient } = require('@supabase/supabase-js');
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
  }
);



