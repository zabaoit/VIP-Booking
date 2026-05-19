import type { FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function LoginPage({ navigate }: { navigate: Navigate }) {
  const { login } = useAuth()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '')

    login(email)
    navigate('home')
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue your VIP booking experience.">
      <form onSubmit={handleSubmit}>
        <label>
          Email address
          <input defaultValue="guest@vipbooking.vn" name="email" type="email" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" type="password" />
        </label>
        <div className="auth-row">
          <label className="check-row">
            <input defaultChecked type="checkbox" />
            <span>Remember me</span>
          </label>
          <button className="link-button" type="button" onClick={() => navigate('forgot')}>
            Forgot password?
          </button>
        </div>
        <button className="primary-button full-width" type="submit">
          Sign In
        </button>
      </form>
      <p className="auth-switch">
        No account yet? <button onClick={() => navigate('register')}>Register</button>
      </p>
    </AuthShell>
  )
}