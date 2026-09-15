import { useState, type FormEvent } from 'react'
import { CheckCircle2, Mail, MapPin, Phone, XCircle } from 'lucide-react'
import { useSite } from '@/context/SiteContext'
import { SEO } from '@/components/layout/SEO'
import { Reveal } from '@/components/motion/Reveal'
import { TextReveal } from '@/components/motion/TextReveal'
import { Field } from '@/components/ui/Field'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { contactService, type ContactSubmission } from '@/services/contactService'
import { isValidEmail } from '@/lib/utils'
import type { Budget, ProjectType } from '@/types'

const PROJECT_TYPES: { value: ProjectType; label: string }[] = [
  { value: 'game-development', label: 'Game Development' },
  { value: 'ai-development', label: 'AI Development' },
  { value: 'art-animation', label: 'Game Art & Animation' },
  { value: 'immersive', label: 'Immersive Experiences' },
  { value: 'tools', label: 'Technology & Tools' },
  { value: 'other', label: 'Something else' },
]

const BUDGETS: { value: Budget; label: string }[] = [
  { value: 'under-10k', label: 'Under $10k' },
  { value: '10k-50k', label: '$10k – $50k' },
  { value: '50k-150k', label: '$50k – $150k' },
  { value: '150k-plus', label: '$150k+' },
  { value: 'not-sure', label: 'Not sure yet' },
]

type FormState = Omit<ContactSubmission, 'projectType' | 'budget'> & { projectType: ProjectType | ''; budget: Budget | '' }

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  message: '',
}

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = 'Your name is required.'
    if (!form.email.trim()) next.email = 'Your email is required.'
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'
    if (!form.projectType) next.projectType = 'Select a project type.'
    if (!form.budget) next.budget = 'Select a budget range.'
    if (!form.message.trim() || form.message.trim().length < 12) next.message = 'Tell us a little more (12+ characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    try {
      await contactService.submit({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company?.trim(),
        projectType: form.projectType as ProjectType,
        budget: form.budget as Budget,
        message: form.message.trim(),
      })
      setStatus('success')
      setForm(INITIAL_STATE)
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <SEO title="Contact" description="Tell us about your project and we'll follow up within one business day." />

      <section className="pb-16 pt-36 md:pt-44">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Get in touch</span>
          </Reveal>
          <h1 className="font-display chrome-text mt-4 max-w-2xl text-[clamp(38px,6vw,68px)] leading-[1.02]">
            <TextReveal text="Let's build something extraordinary" />
          </h1>
        </div>
      </section>

      <section className="pb-28">
        <div className="wrap grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              Tell us about your project and we&rsquo;ll follow up within one business day. Prefer to reach out
              directly? Use the details below.
            </p>
            <div className="mt-10 space-y-5 font-mono text-sm">
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-text transition-colors hover:text-accent">
                <Mail size={16} className="text-accent" /> {settings.email}
              </a>
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`} className="flex items-center gap-3 text-text transition-colors hover:text-accent">
                <Phone size={16} className="text-accent" /> {settings.phone}
              </a>
              <div className="flex items-start gap-3 text-text">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" /> {settings.address}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {status === 'success' ? (
              <div className="flex flex-col items-start gap-4 rounded-[var(--r-card)] border border-accent/30 bg-accent/5 p-10">
                <CheckCircle2 size={32} className="text-accent" />
                <h2 className="font-display text-2xl uppercase tracking-wide text-text">Message sent</h2>
                <p className="text-sm text-muted">
                  Thanks for reaching out — a member of the studio will follow up within one business day.
                </p>
                <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {status === 'error' && (
                  <div className="mb-6 flex items-center gap-2 rounded-[var(--r-control)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <XCircle size={16} /> Something went wrong sending your message. Please try again.
                  </div>
                )}

                <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  <Field label="Your Name" required error={errors.name}>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Jordan Ellis"
                      error={!!errors.name}
                      aria-invalid={!!errors.name}
                    />
                  </Field>
                  <Field label="Your Email" required error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jordan@studio.com"
                      error={!!errors.email}
                      aria-invalid={!!errors.email}
                    />
                  </Field>
                </div>

                <Field label="Company" hint="Optional">
                  <Input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="Studio or company name"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                  <Field label="Project Type" required error={errors.projectType}>
                    <Select
                      value={form.projectType}
                      onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value as ProjectType }))}
                      error={!!errors.projectType}
                    >
                      <option value="">Select a type</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Budget" required error={errors.budget}>
                    <Select
                      value={form.budget}
                      onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value as Budget }))}
                      error={!!errors.budget}
                    >
                      <option value="">Select a range</option>
                      {BUDGETS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </Select>
                  </Field>
                </div>

                <Field label="Project Brief" required error={errors.message}>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what you're building..."
                    error={!!errors.message}
                  />
                </Field>

                <Button type="submit" variant="primary" fullWidth loading={status === 'loading'} className="mt-2">
                  {status === 'loading' ? 'Sending…' : 'Start Your Project Today'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
