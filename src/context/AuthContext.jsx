import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('guestMode') === 'true')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user on mount if token exists
  const getMe = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        // Check if guest mode was active
        if (localStorage.getItem('guestMode') === 'true') {
          setIsGuest(true)
        }
        setLoading(false)
        return
      }
      const res = await api.get('/auth/me')
      setUser(res.data.data)
      setError(null)
    } catch (err) {
      // Token invalid or expired
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getMe()
  }, [getMe])

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })
      const { data, token: jwt } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(data))
      setToken(jwt)
      setUser(data)
      return data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Login failed. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    try {
      setError(null)
      setLoading(true)
      const res = await api.post('/auth/register', { name, email, password })
      const { data, token: jwt } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(data))
      setToken(jwt)
      setUser(data)
      return data
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async (phone) => {
    try {
      setError(null)
      const res = await api.post('/auth/otp/send', { phone })
      return res.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP'
      setError(message)
      throw new Error(message)
    }
  }

  const loginWithPhone = async (phone, code) => {
    try {
      setError(null)
      setLoading(true)
      const res = await api.post('/auth/otp/verify', { phone, code })
      const { data, token: jwt } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(data))
      setToken(jwt)
      setUser(data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'OTP verification failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const registerWithPhone = async (name, phone, code) => {
    try {
      setError(null)
      setLoading(true)
      const res = await api.post('/auth/register-phone', { name, phone, code })
      const { data, token: jwt } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(data))
      setToken(jwt)
      setUser(data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Phone registration failed'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const socialLogin = async (provider) => {
    try {
      setError(null)
      setLoading(true)
      // Mock OAuth — creates/logs in a demo user for the provider
      const mockName = provider === 'google' ? 'Google User' : 'GitHub User'
      const mockEmail = provider === 'google' ? 'user@gmail.com' : 'user@github.com'
      const mockPassword = 'oauth_mock_12345'

      // Try login first, if fails then register
      try {
        const res = await api.post('/auth/login', { email: mockEmail, password: mockPassword })
        const { data, token: jwt } = res.data
        localStorage.setItem('token', jwt)
        localStorage.setItem('user', JSON.stringify(data))
        setToken(jwt)
        setUser(data)
        return data
      } catch {
        // User doesn't exist, register
        const res = await api.post('/auth/register', { name: mockName, email: mockEmail, password: mockPassword })
        const { data, token: jwt } = res.data
        localStorage.setItem('token', jwt)
        localStorage.setItem('user', JSON.stringify(data))
        setToken(jwt)
        setUser(data)
        return data
      }
    } catch (err) {
      const message = err.response?.data?.message || `${provider} login failed`
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const loginAsGuest = useCallback(() => {
    localStorage.setItem('guestMode', 'true')
    setIsGuest(true)
    setUser(null)
    setToken(null)
    setError(null)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestMode')
    setToken(null)
    setUser(null)
    setIsGuest(false)
    setError(null)
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = {
    user,
    token,
    loading,
    error,
    isGuest,
    login,
    register,
    sendOtp,
    loginWithPhone,
    registerWithPhone,
    socialLogin,
    loginAsGuest,
    logout,
    getMe,
    clearError,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
