import { useState, type FormEvent } from 'react'
import { AuthShell } from '../components/layout/AuthShell'
import { Icon } from '../components/icons/Icon'
import { useToast } from '../context/ToastContext'
import type { Navigate } from '../types'

export function ResetPasswordPage({ navigate }: { navigate: Navigate }) {
  const { showToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password.length < 8) {
      const message = 'Password must be at least 8 characters.'
      showToast({ title: 'Password is too short', message, variant: 'error' })
      return
    }

    if (password !== confirmPassword) {
      const message = 'Password confirmation does not match.'
      showToast({ title: 'Password mismatch', message, variant: 'error' })
      return
    }

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
            value={password}
            type="password"
            placeholder="Enter new password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Confirm Password
          <input
            value={confirmPassword}
            type="password"
            placeholder="Re-enter new password"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <button className="primary-button full-width" type="submit">
          Reset Password
          <Icon name="lock" size={14} />
        </button>
      </form>
    </AuthShell>
  )
}
