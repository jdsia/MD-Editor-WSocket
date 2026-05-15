import { create } from 'zustand'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
    session: Session | null
    user: User | null
    setSession: (session: Session | null) => void

    // Helper functions
    signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>
    signUpWithEmail: (email: string, pass: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    // When the session changes, we also extract and store the user object for convenience
    setSession: (session) => set({ session, user: session?.user ?? null }),
    signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error }
    },
    signUpWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signUp({ email, password })
        return { error }
    },
    signOut: async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Error signing out:', error.message)
        } else {
            // Clear the store when they log out successfully
            set({ session: null, user: null })
        }
    }
}))
