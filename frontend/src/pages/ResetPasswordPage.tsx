import { useMemo, useState, type FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { Icon } from '../components/icons/Icon'
import type { Navigate } from '../types'

export function ResetPasswordPage({ navigate }: { navigate: Navigate }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const checks = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
    }),
    [password],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!Object.values(checks).every(Boolean)) {
      setError('Your password does not meet all required conditions.')
      return
    }

    if (password !== confirmPassword) {
      setError('Password confirmation does not match.')
      return
    }

    setError('')
    navigate('login')
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your new password below to secure your account."
      maxWidthClass="w-full max-w-[500px]"
    >
      <form onSubmit={handleSubmit}>
        <label>
          New Password
          <input
            defaultValue=""
            value={password}
            type="password"
            placeholder="Enter new password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Confirm Password
          <input
            defaultValue=""
            value={confirmPassword}
            type="password"
            placeholder="Re-enter new password"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <div className="grid gap-1 text-sm">
          <label className="check-row">
            <input checked={checks.minLength} readOnly type="checkbox" />
            <span>At least 8 characters</span>
          </label>
          <label className="check-row">
            <input checked={checks.hasNumber} readOnly type="checkbox" />
            <span>At least 1 number</span>
          </label>
          <label className="check-row">
            <input checked={checks.hasUppercase} readOnly type="checkbox" />
            <span>At least 1 uppercase letter</span>
          </label>
          <label className="check-row">
            <input checked={checks.hasSpecial} readOnly type="checkbox" />
            <span>At least 1 special character</span>
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full-width" type="submit">
          Reset Password
          <Icon name="lock" size={14} />
        </button>
      </form>
    </AuthShell>
  )
}
