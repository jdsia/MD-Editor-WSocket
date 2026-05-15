import { createClient } from '@supabase/supabase-js'

// 1. Grab environment variables
// (Vite exposes env variables on import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Create and export the client!
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: window.sessionStorage
    }
})
