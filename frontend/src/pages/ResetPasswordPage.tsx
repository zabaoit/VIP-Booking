import { AuthShell } from '../components/layout/AuthShell'
import type { Navigate } from '../types'
import { handleRouteSubmit } from '../utils/forms'

export function ResetPasswordPage({ navigate }: { navigate: Navigate }) {
  return (
    <AuthShell title="Reset Password" subtitle="Create a new secure password for your account.">
      <form onSubmit={(event) => handleRouteSubmit(event, 'login', navigate)}>
        <label>
          New password
          <input defaultValue="newvipbooking" type="password" />
        </label>
        <label>
          Confirm password
          <input defaultValue="newvipbooking" type="password" />
        </label>
        <label className="check-row consent-row">
          <input defaultChecked type="checkbox" />
          <span>Sign out from all other devices.</span>
        </label>
        <button className="primary-button full-width" type="submit">
          Reset Password
        </button>
      </form>
    </AuthShell>
  )
}
