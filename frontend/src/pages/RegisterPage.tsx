import { useState, type FormEvent } from 'react'
import { Icon } from '../components/icons/Icon'
import { AuthShell } from '../components/layout/AuthShell'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'

export function RegisterPage({ navigate }: { navigate: Navigate }) {
  const { register } = useAuth()
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const strength = Math.min(password.length, 12) / 12
  const strengthLabel =
    password.length < 8 ? 'Weak strength' : password.length < 11 ? 'Medium strength' : 'Strong'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const nextPassword = String(formData.get('password') ?? '')
    const nextConfirmPassword = String(formData.get('confirmPassword') ?? '')
    const acceptedTerms = formData.get('terms') === 'on'

    if (!email || !nextPassword) {
      setError('Please enter email and password.')
      return
    }

    if (nextPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (nextPassword !== nextConfirmPassword) {
      setError('Password confirmation does not match.')
      return
    }

    if (!acceptedTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    register(email, nextPassword)
    setError('')
    window.sessionStorage.setItem('vip-booking:register-success', email)
    navigate('login')
  }

  return (
    <AuthShell title="Create Account" subtitle="Join our exclusive luxury community." maxWidthClass="w-full max-w-[460px]">
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input defaultValue="" name="fullName" placeholder="Enter your full name" />
        </label>
        <label>
          Email address
          <input defaultValue="" name="email" type="email" placeholder="Enter your email address" />
        </label>
        <label>
          Phone number
          <input defaultValue="" name="phone" placeholder="Enter your phone number" />
        </label>
        <label>
          Password
          <div className="relative">
            <input
              value={password}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} size={16} />
            </button>
          </div>
          <div className="mt-2">
            <div className="h-1.5 rounded bg-slate-800">
              <div
                className="h-1.5 rounded bg-amber-400 transition-all"
                style={{ width: `${Math.max(strength * 100, 8)}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[11px] text-amber-300">{strengthLabel}</p>
          </div>
        </label>
        <label>
          Confirm password
          <input
            value={confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        <label className="check-row">
          <input name="terms" type="checkbox" />
          <span>
            I agree to the <button className="link-button" type="button">Terms of Service</button> and{' '}
            <button className="link-button" type="button">Privacy Policy</button>.
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full-width" type="submit">
          Create Account
          <Icon name="chevron" size={14} />
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" onClick={() => navigate('login')}>
          Sign in
        </button>
      </p>
    </AuthShell>
  )
}
