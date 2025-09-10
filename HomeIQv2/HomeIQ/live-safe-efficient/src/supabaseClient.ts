import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://gklsblxfbnliketzmqoo.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHNibHhmYm5saWtldHptcW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NDczMTUsImV4cCI6MjA3MjMyMzMxNX0.Y136mC8IO80QDrptedB-9eD_f-t0Tdpy9hBE0R-MhgU"

// Create Supabase client with disabled session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic session persistence
    persistSession: false,
    // Disable automatic token refresh
    autoRefreshToken: false,
    // Don't detect session from URL
    detectSessionInUrl: false,
    // Use memory storage instead of localStorage
    storage: {
      getItem: (key: string) => {
        // Always return null to prevent session restoration
        console.log('Storage getItem called for:', key, '- returning null to force fresh login')
        return null
      },
      setItem: (key: string, value: string) => {
        // Don't actually store anything
        console.log('Storage setItem called for:', key, '- not storing to prevent persistence')
      },
      removeItem: (key: string) => {
        console.log('Storage removeItem called for:', key)
      }
    }
  }
})