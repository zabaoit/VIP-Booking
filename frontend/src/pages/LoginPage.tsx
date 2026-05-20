import { useState, type FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function LoginPage({ navigate }: { navigate: Navigate }) {
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [registeredEmail] = useState(() => {
    const email = window.sessionStorage.getItem('vip-booking:register-success') ?? ''
    window.sessionStorage.removeItem('vip-booking:register-success')
    return email
  })
  const [bookingRequired] = useState(() => {
    return window.sessionStorage.getItem('vip-booking:pending-route') === 'booking'
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!login(email, password)) {
      setError('Tai khoan chua dang ky hoac mat khau khong dung.')
      return
    }

    setError('')
    const pendingRoute = window.sessionStorage.getItem('vip-booking:pending-route')
    window.sessionStorage.removeItem('vip-booking:pending-route')
    navigate(pendingRoute === 'booking' ? 'booking' : 'home')
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue your VIP booking experience.">
      <form onSubmit={handleSubmit}>
        {registeredEmail && (
          <p className="form-success">
            Dang ky thanh cong. Hay dang nhap bang tai khoan {registeredEmail}.
          </p>
        )}
        {bookingRequired && !registeredEmail && (
          <p className="form-success">Vui long dang nhap de tiep tuc dat phong.</p>
        )}
        <label>
          Email address
          <input defaultValue={registeredEmail || 'guest@vipbooking.vn'} name="email" type="email" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" name="password" type="password" />
        </label>
        {error && <p className="form-error">{error}</p>}
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
