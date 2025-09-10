import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, userData: UserProfileData) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>
  createMissingProfile: () => Promise<{ error: any }>
}

interface UserProfile {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  password?: string
  phone: string
  address: string
  emergency_contact: string
  emergency_phone: string
  group_chat?: string | null
  created_at: string
  updated_at: string
}

interface UserProfileData {
  username: string
  firstName: string
  lastName: string
  phone: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  groupChat?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Enhanced logging for state changes
  useEffect(() => {
    console.log('=== AUTH STATE CHANGED ===')
    console.log('User:', user ? {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at
    } : null)
    console.log('Profile:', profile ? {
      id: profile.id,
      username: profile.username,
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email
    } : null)
    console.log('Loading:', loading)
    console.log('=== END AUTH STATE ===')
  }, [user, session, profile, loading])

  const fetchProfile = async (userId: string, retryCount = 0): Promise<UserProfile | null> => {
    try {
      console.log('Fetching profile for user:', userId, 'Retry:', retryCount)
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Profile not found for user:', userId)
          
          // If it's the first attempt and we have a user, try to create a basic profile
          if (retryCount === 0 && user) {
            console.log('Attempting to create basic profile for existing user')
            const basicProfile = await createBasicProfile(userId, user.email || '')
            if (basicProfile) {
              console.log('Basic profile created, setting profile state')
              setProfile(basicProfile)
              return basicProfile
            }
          }
          
          setProfile(null)
          return null
        }
        
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
      return data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setProfile(null)
      return null
    }
  }

  const createBasicProfile = async (userId: string, email: string): Promise<UserProfile | null> => {
    try {
      console.log('Creating basic profile for user:', userId)
      
      // Extract name from email for basic profile
      const emailName = email.split('@')[0]
      const now = new Date().toISOString()
      
      const basicProfileData = {
        id: userId,
        username: emailName,
        first_name: emailName,
        last_name: '',
        email: email,
        phone: '',
        address: '',
        emergency_contact: '',
        emergency_phone: '',
        group_chat: null,
        created_at: now,
        updated_at: now
      }
      
      console.log('Basic profile data:', basicProfileData)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(basicProfileData)
        .select()
        .single()

      if (error) {
        console.error('Error creating basic profile:', error)
        return null
      }
      
      console.log('Basic profile created successfully:', data)
      return data
    } catch (error) {
      console.error('Failed to create basic profile:', error)
      return null
    }
  }

  const createMissingProfile = async () => {
    if (!user) {
      return { error: 'No user found' }
    }

    try {
      const profile = await createBasicProfile(user.id, user.email || '')
      if (profile) {
        setProfile(profile)
        return { error: null }
      } else {
        return { error: 'Failed to create profile' }
      }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData: UserProfileData) => {
    try {
      console.log('Starting signup process for:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Signup error:', error)
        return { error }
      }

      console.log('User auth created:', data.user?.id)

      if (data.user) {
        const now = new Date().toISOString()
        
        const profileData = {
          id: data.user.id,
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: email,
          phone: userData.phone,
          address: userData.address,
          emergency_contact: userData.emergencyContact,
          emergency_phone: userData.emergencyPhone,
          group_chat: userData.groupChat || null,
          created_at: now,
          updated_at: now
        }
        
        console.log('Creating profile with data:', profileData)
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)

        if (profileError) {
          console.error('Error creating profile:', profileError)
          return { error: profileError }
        }
        
        console.log('Profile created successfully')
        
        // Clear the session after signup to force fresh login
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setProfile(null)
      }

      return { error: null }
    } catch (error) {
      console.error('Unexpected signup error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting signin process for:', email)
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Signin error:', error)
        setLoading(false)
        return { error }
      }
      
      if (data.user && data.session) {
        console.log('Signin successful, setting auth state')
        setUser(data.user)
        setSession(data.session)
        
        // Fetch or create profile
        const fetchedProfile = await fetchProfile(data.user.id)
        
        if (!fetchedProfile) {
          console.log('No profile found, creating basic profile')
          await createBasicProfile(data.user.id, data.user.email || '')
        }
      }
      
      setLoading(false)
      return { error: null }
    } catch (error) {
      console.error('Unexpected signin error:', error)
      setLoading(false)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out user')
      setLoading(true)
      
      await supabase.auth.signOut()
      
      setUser(null)
      setSession(null)
      setProfile(null)
      
      console.log('Signout complete')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.log('Cannot update profile: Not authenticated')
      return { error: 'Not authenticated' }
    }

    try {
      console.log('Updating profile for user:', user.id)
      console.log('Updates to apply:', updates)
      
      // Remove sensitive fields and format data
      const { password, id, created_at, ...safeUpdates } = updates
      
      const updateData = {
        ...safeUpdates,
        updated_at: new Date().toISOString(),
      }
      
      console.log('Final update data:', updateData)
      
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        console.error('Error updating profile:', error)
        return { error: error.message || error }
      }

      console.log('Profile update successful, refetching profile data')
      await fetchProfile(user.id)
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected error updating profile:', error)
      return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    console.log('AuthProvider initializing...')
    setLoading(true)
    
    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.log('Initial session check:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: error?.message
        })
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('Found existing session for user:', session.user.id)
          setUser(session.user)
          setSession(session)
          
          // Fetch profile for existing session
          await fetchProfile(session.user.id)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error in getSession:', error)
        setLoading(false)
      }
    }
    
    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event)
        console.log('New session:', session ? 'Present' : 'None')
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in via auth state change')
          setUser(session.user)
          setSession(session)
          await fetchProfile(session.user.id)
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out via auth state change')
          setUser(null)
          setSession(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createMissingProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}