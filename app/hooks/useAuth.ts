import { useState, useEffect } from 'react'
import { supabase } from '~/lib/supabase'
import toast from 'react-hot-toast'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message);
      } else if (data.user && !data.session) {
        toast.success('Check your email for verification link!', {
          duration: 5000,
        });
      }

      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error('An unexpected error occurred');
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email first');
        } else {
          toast.error(error.message);
        }
      } else if (data.session) {
        // Show success toast only when explicitly signing in
        toast.success(`Welcome back${data.user?.email ? `, ${data.user.email.split('@')[0]}` : ''}!`, {
          duration: 3000,
        });
      }

      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('An unexpected error occurred');
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Error signing out');
      } else {
        // Show success toast only when explicitly signing out
        toast.success('Signed out successfully', {
          duration: 2000,
        });
      }
      return { error }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Error signing out');
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error('Error with Google sign in');
      }

      return { data, error }
    } catch (error) {
      console.error('Google sign in error:', error)
      toast.error('Error with Google sign in');
      return { data: null, error: { message: 'An unexpected error occurred' } }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  }
}