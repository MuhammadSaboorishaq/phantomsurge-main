import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Copy, Eye, Save, Trash2, X } from 'lucide-react'
import { portfolioService } from '@/services/portfolioService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { Field } from '@/components/ui/Field'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button, IconButton } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { Tabs } from '@/components/ui/Tabs'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ADMIN_ROUTES } from '@/lib/constants'
import { generateId, slugify } from '@/lib/utils'
import type { GalleryItem, PortfolioItem } from '@/types'

const CATEGORIES = ['Game Development', 'AI Development', 'Design & Game Dev', 'Archviz', 'Immersive Experiences', 'Technology & Tools']

const EMPTY: Omit<PortfolioItem, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  slug: '',
  category: CATEGORIES[0],
  client: '',
  year: new Date().getFullYear(),
  shortDescription: '',
  longDescription: '',
  thumbnail: '',
  heroImage: '',
  gallery: [],
  videoUrl: '',
  youtubeUrl: '',
  vimeoUrl: '',
  technologies: [],
  services: [],
  challenge: '',
  solution: '',
  results: '',
  websiteUrl: '',
  githubUrl: '',
  caseStudyUrl: '',
  featured: false,
  published: false,
  order: 999,
}

export default function PortfolioForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const isNew = !id || id === 'new'
  const { data: existing, isLoading } = useAsync(
    () => (!isNew ? portfolioService.get(id!) : Promise.resolve(undefined)),
    undefined,
    [id],
  )

  const [form, setForm] = useState({ ...EMPTY })
  const [techInput, setTechInput] = useState('')
  const [servicesInput, setServicesInput] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [notFound, setNotFound] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isNew && !existing) {
      setNotFound(true)
    } else if (existing && !initialized) {
      setForm({ ...existing })
      setTechInput(existing.technologies.join(', '))
      setServicesInput(existing.services.join(', '))
      setInitialized(true)
    }
  }, [isNew, existing, isLoading, initialized])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleTitleChange(value: string) {
    set('title', value)
    if (!slugTouched) set('slug', slugify(value))
  }

  function addGalleryImage(url: string) {
    const item: GalleryItem = { id: generateId('gal'), url, kind: 'image' }
    set('gallery', [...form.gallery, item])
  }

  function removeGalleryItem(galId: string) {
    set('gallery', form.gallery.filter((g) => g.id !== galId))
  }

  function handleSave(publish?: boolean) {
    if (!form.title.trim()) {
      show('Title is required.', 'error')
      return
    }
    const payload: Partial<PortfolioItem> = {
      ...form,
      technologies: techInput.split(',').map((t) => t.trim()).filter(Boolean),
      services: servicesInput.split(',').map((s) => s.trim()).filter(Boolean),
      published: publish ?? form.published,
    }

    if (isNew) {
      portfolioService.create(payload).then((created) => {
        show('Project created.', 'success')
        navigate(ADMIN_ROUTES.portfolioEdit(created.id))
      })
    } else {
      portfolioService.update(id!, payload).then(() => {
        show('Project saved.', 'success')
      })
    }
  }

  function handleDuplicate() {
    if (!id) return
    portfolioService.duplicate(id).then((copy) => {
      if (copy) {
        show('Project duplicated.', 'success')
        navigate(ADMIN_ROUTES.portfolioEdit(copy.id))
      }
    })
  }

  function handleDelete() {
    if (!id) return
    portfolioService.remove(id).then(() => {
      show('Project deleted.', 'success')
      navigate(ADMIN_ROUTES.portfolio)
    })
  }

  const tabs = useMemo(
    () => [
      {
        id: 'basic',
        label: 'Basic Info',
        content: (
          <div className="max-w-2xl space-y-1">
            <Field label="Title" required>
              <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Project title" />
            </Field>
            <Field label="Slug" required hint="Used in the URL: /work/your-slug">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true)
                  set('slug', slugify(e.target.value))
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-x-6">
              <Field label="Category">
                <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Year">
                <Input type="number" value={form.year} onChange={(e) => set('year', Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Client" hint="Optional">
              <Input value={form.client} onChange={(e) => set('client', e.target.value)} placeholder="Client or studio name" />
            </Field>
            <Field label="Short Description" required hint="Shown on cards and previews">
              <Textarea value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
            </Field>
            <Field label="Full Description" required hint="Shown on the project detail page">
              <Textarea className="min-h-[160px]" value={form.longDescription} onChange={(e) => set('longDescription', e.target.value)} />
            </Field>
          </div>
        ),
      },
      {
        id: 'media',
        label: 'Media',
        content: (
          <div className="max-w-3xl space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Field label="Thumbnail" required hint="Used in grid cards (4:5)">
                <ImageUploader value={form.thumbnail} onChange={(v) => set('thumbnail', v)} onRemove={() => set('thumbnail', '')} aspect="aspect-[4/5]" />
              </Field>
              <Field label="Hero Image" required hint="Used on the detail page (16:9)">
                <ImageUploader value={form.heroImage} onChange={(v) => set('heroImage', v)} onRemove={() => set('heroImage', '')} aspect="aspect-video" />
              </Field>
            </div>

            <div>
              <Field label="Gallery" hint="Add additional images shown on the detail page">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {form.gallery.map((g) => (
                    <div key={g.id} className="group relative aspect-square overflow-hidden rounded-[var(--r-control)] border border-line">
                      <img src={g.url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeGalleryItem(g.id)}
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <ImageUploader value="" onChange={addGalleryImage} aspect="aspect-square" label="Add image" />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-3">
              <Field label="Video URL" hint="Direct .mp4 link">
                <Input value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://…/video.mp4" />
              </Field>
              <Field label="YouTube URL">
                <Input value={form.youtubeUrl} onChange={(e) => set('youtubeUrl', e.target.value)} placeholder="https://youtube.com/watch?v=…" />
              </Field>
              <Field label="Vimeo URL">
                <Input value={form.vimeoUrl} onChange={(e) => set('vimeoUrl', e.target.value)} placeholder="https://vimeo.com/…" />
              </Field>
            </div>
          </div>
        ),
      },
      {
        id: 'info',
        label: 'Project Info',
        content: (
          <div className="max-w-2xl space-y-1">
            <Field label="Technologies" hint="Comma-separated, e.g. Unreal Engine, C++, MetaHuman">
              <Input value={techInput} onChange={(e) => setTechInput(e.target.value)} />
            </Field>
            <Field label="Services" hint="Comma-separated, e.g. Game Development, AI Development">
              <Input value={servicesInput} onChange={(e) => setServicesInput(e.target.value)} />
            </Field>
            <Field label="Challenge">
              <Textarea value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
            </Field>
            <Field label="Solution">
              <Textarea value={form.solution} onChange={(e) => set('solution', e.target.value)} />
            </Field>
            <Field label="Results">
              <Textarea value={form.results} onChange={(e) => set('results', e.target.value)} />
            </Field>
          </div>
        ),
      },
      {
        id: 'links',
        label: 'Links',
        content: (
          <div className="max-w-2xl space-y-1">
            <Field label="Website URL">
              <Input value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="GitHub URL">
              <Input value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/…" />
            </Field>
            <Field label="Case Study URL">
              <Input value={form.caseStudyUrl} onChange={(e) => set('caseStudyUrl', e.target.value)} placeholder="https://…" />
            </Field>
          </div>
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        content: (
          <div className="max-w-md space-y-5">
            <div className="flex items-center justify-between rounded-[var(--r-control)] border border-line p-4">
              <div>
                <p className="text-sm text-text">Featured</p>
                <p className="text-xs text-faint">Show in the homepage featured grid</p>
              </div>
              <Switch checked={form.featured} onChange={(v) => set('featured', v)} label="Featured" />
            </div>
            <div className="flex items-center justify-between rounded-[var(--r-control)] border border-line p-4">
              <div>
                <p className="text-sm text-text">Published</p>
                <p className="text-xs text-faint">Visible on the public website</p>
              </div>
              <Switch checked={form.published} onChange={(v) => set('published', v)} label="Published" />
            </div>
            <Field label="Sort Order" hint="Lower numbers appear first">
              <Input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} />
            </Field>
          </div>
        ),
      },
    ],
    [form, techInput, servicesInput, handleTitleChange, addGalleryImage, removeGalleryItem],
  )

  if (notFound) return <Navigate to={ADMIN_ROUTES.portfolio} replace />

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(ADMIN_ROUTES.portfolio)}
            className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted hover:text-text"
          >
            <ArrowLeft size={13} /> Portfolio
          </button>
          <h1 className="font-display text-2xl uppercase tracking-wide text-text md:text-3xl">
            {isNew ? 'New Project' : form.title || 'Edit Project'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IconButton onClick={() => setPreviewOpen(true)} aria-label="Preview">
            <Eye size={15} />
          </IconButton>
          {!isNew && (
            <>
              <IconButton onClick={handleDuplicate} aria-label="Duplicate">
                <Copy size={15} />
              </IconButton>
              <IconButton onClick={() => setDeleteOpen(true)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
                <Trash2 size={15} />
              </IconButton>
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave(false)} icon={<Save size={13} />}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSave(true)}>
            {form.published ? 'Save & Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6 md:p-8">
        <Tabs tabs={tabs} />
      </div>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview" size="lg">
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-[var(--r-card)] border border-line bg-bg-alt">
            {form.heroImage ? (
              <img src={form.heroImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-faint">No hero image yet</div>
            )}
          </div>
          <span className="eyebrow">{form.category}</span>
          <h2 className="font-display chrome-text text-4xl">{form.title || 'Untitled Project'}</h2>
          <p className="text-muted">{form.shortDescription || 'No short description yet.'}</p>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete project"
        description="This permanently removes the project from the CMS. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
