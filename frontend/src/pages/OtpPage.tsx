import { AuthShell } from '../components/layout/AuthShell'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function OtpPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Secure Verification" subtitle="Enter the six-digit code sent to your inbox.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'reset', navigate)}>
        <div className="otp-grid">
          {['2', '4', '1', '8', '6', '9'].map((digit, index) => (
            <input
              aria-label={`Verification digit ${index + 1}`}
              defaultValue={digit}
              inputMode="numeric"
              key={`${digit}-${index}`}
              maxLength={1}
            />
          ))}
        </div>
        <button className="primary-button full-width" type="submit">
          Verify Account
        </button>
      </form>
      <p className="auth-switch">
        Did not receive it? <button>Resend code</button>
      </p>
    </AuthShell>
  )
}
