import { useState } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function OtpPage({ navigate }: { navigate: Navigate }) {
  const otpFlow = window.sessionStorage.getItem('vip-booking:otp-flow')
  const nextRoute = otpFlow === 'register' ? 'login' : 'reset'
  const [resendMessage, setResendMessage] = useState('')

  return (
    <AuthShell title="Secure Verification" subtitle="Enter the six-digit code sent to your inbox.">
      <form onSubmit={(event) => handleRouteSubmit(event, nextRoute, navigate)}>
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
          {otpFlow === 'register' ? 'Verify Account' : 'Verify Reset Code'}
        </button>
      </form>
      <p className="auth-switch">
        Did not receive it?{' '}
        <button
          type="button"
          onClick={() => setResendMessage('A new verification code has been sent to your email.')}
        >
          Resend code
        </button>
      </p>
      {resendMessage && <p className="auth-switch">{resendMessage}</p>}
    </AuthShell>
  )
}
