import { AuthShell } from '../components/layout/AuthShell'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function RegisterPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell
      title="Create Account"
      subtitle="Join VIP Booking to reserve rooms and services faster."
    >
      <form onSubmit={(event) => handleRouteSubmit(event, 'otp', navigate)}>
        <label>
          Full name
          <input defaultValue="Anh Nguyen" />
        </label>
        <label>
          Email address
          <input defaultValue="anh.nguyen@example.com" type="email" />
        </label>
        <label>
          Phone number
          <input defaultValue="+84 901 123 456" />
        </label>
        <label>
          Password
          <input defaultValue="vipbooking" type="password" />
        </label>
        <label>
          Confirm password
          <input defaultValue="vipbooking" type="password" />
        </label>
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
