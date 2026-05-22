import { useState, type FormEvent } from 'react'
import { Icon } from '../components/icons/Icon'
import { AuthShell } from '../components/layout/AuthShell'
import { useAuth } from '../hooks/useAuth'
import type { Navigate } from '../types'
import {
  OAuthConfigError,
  signInWithAppleAccount,
  signInWithGoogleAccount,
} from '../utils/oauthProviders'

export function LoginPage({ navigate }: { navigate: Navigate }) {
  const { login, socialLogin } = useAuth()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
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
      setError('This account is not registered or the password is incorrect.')
      return
    }

    setError('')
    setInfo('')
    const pendingRoute = window.sessionStorage.getItem('vip-booking:pending-route')
    window.sessionStorage.removeItem('vip-booking:pending-route')
    navigate(pendingRoute === 'booking' ? 'booking' : 'home')
  }

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    try {
      setSocialLoading(provider)
      setError('')
      setInfo('')

      const account =
        provider === 'google' ? await signInWithGoogleAccount() : await signInWithAppleAccount()
      const authUser = socialLogin(provider, account.email)
      setInfo(`Signed in with ${provider === 'google' ? 'Google' : 'Apple'} as ${authUser.email}.`)
      const pendingRoute = window.sessionStorage.getItem('vip-booking:pending-route')
      window.sessionStorage.removeItem('vip-booking:pending-route')
      navigate(pendingRoute === 'booking' ? 'booking' : 'home')
    } catch (socialError) {
      const message =
        socialError instanceof OAuthConfigError
          ? socialError.message
          : socialError instanceof Error
            ? socialError.message
            : 'Social sign-in failed.'
      setError(message)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to access your luxury stays."
      iconName="lock"
      maxWidthClass="w-full max-w-[430px]"
    >
      <form onSubmit={handleSubmit}>
        {registeredEmail && (
          <p className="form-success">
            Registration successful. Please sign in with {registeredEmail}.
          </p>
        )}
        {bookingRequired && !registeredEmail && <p className="form-success">Please sign in to continue booking.</p>}
        {info && <p className="form-success">{info}</p>}
        <label>
          Email address
          <input
            name="email"
            type="email"
            defaultValue={registeredEmail || ''}
            placeholder="name@example.com"
          />
        </label>
        <label>
          Password
          <div className="relative">
            <input
              className="pr-10"
              name="password"
              type={showPassword ? 'text' : 'password'}
              defaultValue=""
              placeholder="Enter your password"
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
        <div className="my-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-700" />
          <span>Or continue with</span>
          <span className="h-px flex-1 bg-slate-700" />
        </div>
        <div className="grid gap-2">
          <button
            className="ghost-button full-width"
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocialSignIn('google')}
          >
            {socialLoading === 'google' ? 'Connecting Google...' : 'Google'}
          </button>
          <button
            className="ghost-button full-width"
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocialSignIn('apple')}
          >
            {socialLoading === 'apple' ? 'Connecting Apple...' : 'Apple'}
          </button>
        </div>
      </form>
      <p className="auth-switch">
        No account yet?{' '}
        <button type="button" onClick={() => navigate('register')}>
          Register
        </button>
      </p>
    </AuthShell>
  )
}
