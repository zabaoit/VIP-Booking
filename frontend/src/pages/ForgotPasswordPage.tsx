import { AuthShell } from '../components/layout/AuthShell'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function ForgotPasswordPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email to receive a verification code.">
      <form
        onSubmit={(event) => {
          window.sessionStorage.setItem('vip-booking:otp-flow', 'reset')
          handleRouteSubmit(event, 'otp', navigate)
        }}
      >
        <label>
          Email address
          <input defaultValue="guest@vipbooking.vn" type="email" />
        </label>
        <button className="primary-button full-width" type="submit">
          Send Reset Code
        </button>
      </form>
      <p className="auth-switch">
        Remembered it? <button onClick={() => navigate('login')}>Login here</button>
      </p>
    </AuthShell>
  )
}