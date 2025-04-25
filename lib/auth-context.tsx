"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type User = {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on initial load
  useEffect(() => {
    checkAuth()
  }, [])

  // Function to check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      // First check localStorage for token
      const token = localStorage.getItem("auth-token")

      if (!token) {
        // If no token in localStorage, check if we have auth-state cookie
        // which indicates we should have an HTTP-only cookie with the token
        const authState = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth-state="))
          ?.split("=")[1]

        if (authState !== "authenticated") {
          // Check if we're in setup mode (no admin exists yet)
          try {
            const setupResponse = await fetch("/api/setup")

            // If the response is not ok, we'll assume we're not authenticated
            if (!setupResponse.ok) {
              setUser(null)
              setLoading(false)
              return false
            }

            const setupData = await setupResponse.json()

            // If we need setup, we're not in an error state, just not authenticated yet
            if (setupData.needsSetup) {
              setUser(null)
              setLoading(false)
              return false
            }
          } catch (error) {
            console.error("Error checking setup status:", error)
            // If we can't check the setup status, we'll assume we're not authenticated
            setUser(null)
            setLoading(false)
            return false
          }

          setUser(null)
          setLoading(false)
          return false
        }
      }

      // Fetch current user data
      const response = await fetch("/api/auth/me")

      if (!response.ok) {
        setUser(null)
        setLoading(false)
        return false
      }

      const data = await response.json()
      setUser(data.user)
      setLoading(false)
      return true
    } catch (error) {
      console.error("Error checking authentication:", error)
      setUser(null)
      setLoading(false)
      return false
    }
  }

  // Sign in function
  const signin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to sign in" }
      }

      // Store token in localStorage for client-side access
      if (data.token) {
        localStorage.setItem("auth-token", data.token)
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error("Error during signin:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Sign up function
  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Failed to sign up" }
      }

      // Store token in localStorage for client-side access
      if (data.token) {
        localStorage.setItem("auth-token", data.token)
      }

      setUser(data.user)
      return { success: true }
    } catch (error) {
      console.error("Error during signup:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Sign out function
  const signout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
      })

      // Clear localStorage
      localStorage.removeItem("auth-token")

      setUser(null)
    } catch (error) {
      console.error("Error during signout:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
