'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  profile?: {
    riskPreference: string
    investmentAmount: number
    investmentPeriod: string
    investmentGoal: string
  } | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, token: string) => void
  logout: () => void
  updateUser: (userData: User) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // 从localStorage恢复登录状态
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    
    setIsLoading(false)
  }, [mounted])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    router.push('/login')
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
