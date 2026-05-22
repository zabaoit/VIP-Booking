import { useState, type FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { Icon } from '../components/icons/Icon'
import type { Navigate } from '../types'

export function ResetPasswordPage({ navigate }: { navigate: Navigate }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
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

        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full-width" type="submit">
          Reset Password
          <Icon name="lock" size={14} />
        </button>
      </form>
    </AuthShell>
  )
}
