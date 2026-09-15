import { Component, type ReactNode } from 'react'
import { AlertOctagon } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--r-card)] border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 text-red-400">
        <AlertOctagon size={20} />
      </div>
      <h3 className="font-display text-xl uppercase tracking-wide text-text">Something went wrong</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        {message ?? 'An unexpected error occurred while loading this content.'}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}

interface BoundaryState {
  hasError: boolean
}

/** Class component required by React for error boundaries. */
export class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wrap py-24">
          <ErrorState onRetry={() => this.setState({ hasError: false })} />
        </div>
      )
    }
    return this.props.children
  }
}
