import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock, Mail, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { StreakMark } from '@/components/brand/StreakMark'
import { Field } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SEO } from '@/components/layout/SEO'
import { ADMIN_ROUTES, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/constants'

export default function Login() {
  const { isAuthenticated, login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) return <Navigate to={ADMIN_ROUTES.dashboard} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <SEO title="Admin Login" noIndex />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <StreakMark className="mb-4 h-10 w-10" />
          <h1 className="font-display text-2xl uppercase tracking-wide text-text">Studio Admin</h1>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">Restricted access</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[var(--r-card)] border border-line bg-surface/50 p-7">
          <Field label="Email" required>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phantomsurge.studio"
                className="pl-10"
              />
            </div>
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <Lock size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="pl-10"
              />
            </div>
          </Field>

          {error && (
            <p className="mb-4 flex items-center gap-2 text-xs text-red-400">
              <ShieldAlert size={14} /> {error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 rounded-[var(--r-control)] border border-line bg-surface/30 p-4 text-center font-mono text-[11px] text-faint">
          <p className="mb-1.5 uppercase tracking-wide text-muted">Demo credentials</p>
          <p>{DEMO_ADMIN_EMAIL}</p>
          <p>{DEMO_ADMIN_PASSWORD}</p>
          <p className="mt-2 text-[10px] normal-case leading-relaxed text-faint">
            Mock authentication for demonstration only — not production secure.
          </p>
        </div>
      </div>
    </div>
  )
}
