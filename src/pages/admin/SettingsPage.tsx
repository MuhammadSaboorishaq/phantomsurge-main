import { useState } from 'react'
import { ArrowDown, ArrowUp, Save } from 'lucide-react'
import { useSite } from '@/context/SiteContext'
import { useToast } from '@/context/ToastContext'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { TagInput } from '@/components/ui/TagInput'
import { VideoField } from '@/components/admin/VideoField'
import type { SiteSettings } from '@/types'

export default function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSite()
  const { show } = useToast()
  const [form, setForm] = useState<SiteSettings>(settings)

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    updateSettings(form)
    show('Settings saved.', 'success')
  }

  function moveSection(index: number, dir: -1 | 1) {
    const sections = [...form.sections].sort((a, b) => a.order - b.order)
    const target = index + dir
    if (target < 0 || target >= sections.length) return
    ;[sections[index], sections[target]] = [sections[target], sections[index]]
    sections.forEach((s, i) => (s.order = i + 1))
    set('sections', sections)
  }

  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div className="max-w-xl space-y-1">
          <Field label="Brand Name" required>
            <Input value={form.brandName} onChange={(e) => set('brandName', e.target.value)} />
          </Field>
          <Field label="Tagline" hint='Shown above the hero headline, e.g. "Games & AI Studio"'>
            <Input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
          </Field>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
          </div>
          <Field label="Address">
            <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field label="Contact Email" hint="Where contact form submissions notionally route">
            <Input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
          </Field>
          <Field label="Footer Text">
            <Input value={form.footerText} onChange={(e) => set('footerText', e.target.value)} />
          </Field>
          <Field label="Copyright">
            <Input value={form.copyright} onChange={(e) => set('copyright', e.target.value)} />
          </Field>
        </div>
      ),
    },
    {
      id: 'seo',
      label: 'SEO',
      content: (
        <div className="max-w-xl space-y-1">
          <Field label="SEO Title" required>
            <Input value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
          </Field>
          <Field label="SEO Description" required>
            <Textarea value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
          </Field>
          <Field label="OG Image">
            <ImageUploader value={form.ogImage} onChange={(v) => set('ogImage', v)} onRemove={() => set('ogImage', '')} aspect="aspect-video" />
          </Field>
          <Field label="Google Analytics ID" hint="Optional, e.g. G-XXXXXXX">
            <Input value={form.googleAnalyticsId} onChange={(e) => set('googleAnalyticsId', e.target.value)} />
          </Field>
        </div>
      ),
    },
    {
      id: 'social',
      label: 'Social',
      content: (
        <div className="max-w-xl space-y-1">
          {(['twitter', 'linkedin', 'github', 'instagram', 'youtube'] as const).map((key) => (
            <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
              <Input
                value={form.social[key] ?? ''}
                onChange={(e) => set('social', { ...form.social, [key]: e.target.value })}
                placeholder={`https://${key}.com/…`}
              />
            </Field>
          ))}
        </div>
      ),
    },
    {
      id: 'logo',
      label: 'Logo',
      content: (
        <div className="grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          <Field label="Main Logo" hint="Falls back to the text/streak treatment if empty">
            <ImageUploader value={form.logo.main} onChange={(v) => set('logo', { ...form.logo, main: v })} onRemove={() => set('logo', { ...form.logo, main: undefined })} aspect="aspect-video" />
          </Field>
          <Field label="Logo Mark" hint="Compact icon-only version">
            <ImageUploader value={form.logo.mark} onChange={(v) => set('logo', { ...form.logo, mark: v })} onRemove={() => set('logo', { ...form.logo, mark: undefined })} aspect="aspect-square" />
          </Field>
          <Field label="Light Logo">
            <ImageUploader value={form.logo.light} onChange={(v) => set('logo', { ...form.logo, light: v })} onRemove={() => set('logo', { ...form.logo, light: undefined })} aspect="aspect-video" />
          </Field>
          <Field label="Dark Logo">
            <ImageUploader value={form.logo.dark} onChange={(v) => set('logo', { ...form.logo, dark: v })} onRemove={() => set('logo', { ...form.logo, dark: undefined })} aspect="aspect-video" />
          </Field>
          <Field label="Favicon" hint="Falls back to the studio streak mark">
            <ImageUploader value={form.favicon} onChange={(v) => set('favicon', v)} onRemove={() => set('favicon', '')} aspect="aspect-square" />
          </Field>
        </div>
      ),
    },
    {
      id: 'media',
      label: 'Media',
      content: (
        <div className="max-w-xl space-y-5">
          <VideoField
            label="Hero Background Video"
            description="Plays muted and looped behind the homepage hero. Falls back to the standard gradient background when disabled."
            value={form.media.heroVideo}
            onChange={(v) => set('media', { ...form.media, heroVideo: v })}
          />
          <VideoField
            label="Contact Section Video"
            description="Plays muted and looped behind the “Start your project” card. Loads only once a visitor scrolls near it."
            value={form.media.contactVideo}
            onChange={(v) => set('media', { ...form.media, contactVideo: v })}
          />
          <p className="text-[11px] leading-relaxed text-faint">
            New video files can&rsquo;t be uploaded directly here — a single clip is tens of megabytes, well past what
            this demo&rsquo;s localStorage-backed persistence can hold. Add new files to <code>/public/videos</code> in
            the project and they&rsquo;ll appear in the source list above, or paste a hosted URL as a custom source.
          </p>
        </div>
      ),
    },
    {
      id: 'display',
      label: 'Display',
      content: (
        <div className="max-w-xl space-y-4">
          <p className="text-sm text-muted">
            How many items show before a &ldquo;Load More&rdquo; button appears. Portfolio has its own dedicated{' '}
            <code>/work</code> page instead, so it isn&rsquo;t limited here.
          </p>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-3">
            <Field label="Services" hint="Homepage &amp; /services">
              <Input
                type="number"
                min={1}
                value={form.displayLimits.services}
                onChange={(e) => set('displayLimits', { ...form.displayLimits, services: Math.max(1, Number(e.target.value) || 1) })}
              />
            </Field>
            <Field label="Testimonials" hint="Homepage">
              <Input
                type="number"
                min={1}
                value={form.displayLimits.testimonials}
                onChange={(e) => set('displayLimits', { ...form.displayLimits, testimonials: Math.max(1, Number(e.target.value) || 1) })}
              />
            </Field>
            <Field label="Team" hint="About page">
              <Input
                type="number"
                min={1}
                value={form.displayLimits.team}
                onChange={(e) => set('displayLimits', { ...form.displayLimits, team: Math.max(1, Number(e.target.value) || 1) })}
              />
            </Field>
          </div>
        </div>
      ),
    },
    {
      id: 'technologies',
      label: 'Technologies',
      content: (
        <div className="max-w-xl">
          <Field
            label="Technology Marquee"
            hint="Shown in the scrolling technology band and the Technologies section. Press Enter or click + to add."
          >
            <TagInput
              value={form.technologies}
              onChange={(next) => set('technologies', next)}
              placeholder="e.g. Unreal Engine"
            />
          </Field>
        </div>
      ),
    },
    {
      id: 'sections',
      label: 'Sections',
      content: (
        <div className="max-w-xl space-y-2">
          <p className="mb-4 text-sm text-muted">Toggle homepage sections on or off, and reorder them.</p>
          {[...form.sections].sort((a, b) => a.order - b.order).map((section, i) => (
            <div key={section.key} className="flex items-center justify-between rounded-[var(--r-control)] border border-line px-4 py-3">
              <span className="text-sm text-text">{section.label}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => moveSection(i, -1)} className="text-faint hover:text-text" aria-label="Move up"><ArrowUp size={14} /></button>
                <button onClick={() => moveSection(i, 1)} className="text-faint hover:text-text" aria-label="Move down"><ArrowDown size={14} /></button>
                <Switch
                  checked={section.enabled}
                  onChange={(v) =>
                    set(
                      'sections',
                      form.sections.map((s) => (s.key === section.key ? { ...s, enabled: v } : s)),
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'advanced',
      label: 'Advanced',
      content: (
        <div className="max-w-xl space-y-5">
          <div className="flex items-center justify-between rounded-[var(--r-control)] border border-amber-500/30 bg-amber-500/5 p-4">
            <div>
              <p className="text-sm text-text">Maintenance Mode</p>
              <p className="text-xs text-faint">Shows a maintenance screen to visitors. Preview mode bypasses it.</p>
            </div>
            <Switch checked={form.maintenanceMode} onChange={(v) => set('maintenanceMode', v)} />
          </div>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <Field label="Default Language">
              <Input value={form.defaultLanguage} onChange={(e) => set('defaultLanguage', e.target.value)} />
            </Field>
            <Field label="Timezone">
              <Input value={form.timezone} onChange={(e) => set('timezone', e.target.value)} />
            </Field>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-text">Site Settings</h1>
          <p className="mt-1 text-sm text-muted">Global content and configuration for the public website.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { resetSettings(); setForm(settings); show('Settings reset to default.', 'info') }}>
            Reset
          </Button>
          <Button variant="primary" size="sm" icon={<Save size={13} />} onClick={save}>
            Save Settings
          </Button>
        </div>
      </div>

      <div className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6 md:p-8">
        <Tabs tabs={tabs} />
      </div>
    </div>
  )
}
