import { AuthShell } from '../components/layout/AuthShell'
import { Icon } from '../components/icons/Icon'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function ForgotPasswordPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell
      title="Reset Your Password"
      subtitle="Enter your email address below and we'll send you instructions to safely reset your password."
      iconName="lock"
      maxWidthClass="w-full max-w-[420px]"
    >
      <form
        onSubmit={(event) => {
          window.sessionStorage.setItem('vip-booking:otp-flow', 'reset')
          handleRouteSubmit(event, 'otp', navigate)
        }}
      >
        <label>
          Email Address
          <input defaultValue="" type="email" placeholder="Enter your email address" />
        </label>
        <button className="primary-button full-width" type="submit">
          Send Reset Link
          <Icon name="chevron" size={14} />
        </button>
      </form>
      <p className="auth-switch">
        Remembered your password?{' '}
        <button type="button" onClick={() => navigate('login')}>
          Log in here
        </button>
      </p>
    </AuthShell>
  )
}
