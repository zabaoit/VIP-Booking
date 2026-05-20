import { useState, type FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function RegisterPage({ navigate }: { navigate: Navigate }) {
  const { register } = useAuth()
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    if (!email || !password) {
      setError('Vui long nhap email va mat khau.')
      return
    }

    if (password !== confirmPassword) {
      setError('Mat khau xac nhan khong khop.')
      return
    }

    register(email, password)
    setError('')
    window.sessionStorage.setItem('vip-booking:register-success', email)
    navigate('login')
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Join VIP Booking to reserve rooms and services faster."
    >
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input defaultValue="Anh Nguyen" name="fullName" />
        </label>
        <label>
          Email address
          <input defaultValue="anh.nguyen@example.com" name="email" type="email" />
        </label>
        <label>
          Phone number
          <input defaultValue="+84 901 123 456" name="phone" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" name="password" type="password" />
        </label>
        <label>
          Confirm password
          <input defaultValue="vipbooking" name="confirmPassword" type="password" />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full-width" type="submit">
          Create Account
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <button onClick={() => navigate('login')}>Sign in</button>
      </p>
    </AuthShell>
  )
}
