import type { Context, Next } from 'hono'

type Validator = (body: unknown) => string | null

export function validate(check: Validator) {
  return async (c: Context, next: Next) => {
    const body = await c.req.json().catch(() => null)
    if (!body) return c.json({ error: 'Invalid JSON body' }, 400)
    const error = check(body)
    if (error) return c.json({ error }, 400)
    c.set('validatedBody', body)
    await next()
  }
}

export function requireFields(...fields: string[]): Validator {
  return (body: unknown) => {
    if (!body || typeof body !== 'object') return 'Request body must be a JSON object'
    for (const field of fields) {
      if (!(field in body) || (body as Record<string, unknown>)[field] === undefined) {
        return `Missing required field: ${field}`
      }
    }
    return null
  }
}
