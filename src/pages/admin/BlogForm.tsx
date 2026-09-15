import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { blogService } from '@/services/blogService'
import { useAsync } from '@/hooks/useAsync'
import { useToast } from '@/context/ToastContext'
import { Field } from '@/components/ui/Field'
import { Input, Textarea } from '@/components/ui/Input'
import { Button, IconButton } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { ADMIN_ROUTES } from '@/lib/constants'
import { slugify } from '@/lib/utils'
import type { BlogPost } from '@/types'

const EMPTY: Omit<BlogPost, 'id'> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Phantom Surge Studios',
  category: 'Studio Notes',
  tags: [],
  publishedDate: new Date().toISOString().slice(0, 10),
  readingTime: 1,
  featured: false,
  published: false,
}

export default function BlogForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { show } = useToast()
  const isNew = !id || id === 'new'
  const { data: existing, isLoading } = useAsync(
    () => (!isNew ? blogService.get(id!) : Promise.resolve(undefined)),
    undefined,
    [id],
  )

  const [form, setForm] = useState({ ...EMPTY })
  const [tagsInput, setTagsInput] = useState('')
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isNew && !existing) {
      setNotFound(true)
    } else if (existing && !initialized) {
      setForm({ ...existing })
      setTagsInput(existing.tags.join(', '))
      setInitialized(true)
    }
  }, [isNew, existing, isLoading, initialized])

  if (notFound) return <Navigate to={ADMIN_ROUTES.blog} replace />

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleTitleChange(value: string) {
    set('title', value)
    if (!slugTouched) set('slug', slugify(value))
  }

  function handleSave(publish?: boolean) {
    if (!form.title.trim() || !form.content.trim()) {
      show('Title and content are required.', 'error')
      return
    }
    const payload: Partial<BlogPost> = {
      ...form,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      published: publish ?? form.published,
    }
    if (isNew) {
      blogService.create(payload).then((created) => {
        show('Post created.', 'success')
        navigate(ADMIN_ROUTES.blogEdit(created.id))
      })
    } else {
      blogService.update(id!, payload).then(() => {
        show('Post saved.', 'success')
      })
    }
  }

  function handleDelete() {
    if (!id) return
    blogService.remove(id).then(() => {
      show('Post deleted.', 'success')
      navigate(ADMIN_ROUTES.blog)
    })
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate(ADMIN_ROUTES.blog)} className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted hover:text-text">
            <ArrowLeft size={13} /> Blog
          </button>
          <h1 className="font-display text-2xl uppercase tracking-wide text-text md:text-3xl">
            {isNew ? 'New Post' : form.title || 'Edit Post'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <IconButton onClick={() => setDeleteOpen(true)} className="hover:border-red-500/40 hover:text-red-400" aria-label="Delete">
              <Trash2 size={15} />
            </IconButton>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave(false)} icon={<Save size={13} />}>
            Save Draft
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSave(true)}>
            {form.published ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-1 rounded-[var(--r-card)] border border-line bg-surface/30 p-6 md:p-8">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </Field>
          <Field label="Slug" required>
            <Input value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} />
          </Field>
          <Field label="Excerpt" required hint="Short summary shown on cards">
            <Textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
          </Field>
          <Field label="Content" required hint="Separate paragraphs with a blank line">
            <Textarea className="min-h-[360px]" value={form.content} onChange={(e) => set('content', e.target.value)} />
          </Field>
        </div>

        <div className="space-y-6">
          <div className="rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
            <Field label="Cover Image" required>
              <ImageUploader value={form.coverImage} onChange={(v) => set('coverImage', v)} onRemove={() => set('coverImage', '')} aspect="aspect-video" />
            </Field>
          </div>

          <div className="space-y-1 rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
            <Field label="Author">
              <Input value={form.author} onChange={(e) => set('author', e.target.value)} />
            </Field>
            <Field label="Category">
              <Input value={form.category} onChange={(e) => set('category', e.target.value)} />
            </Field>
            <Field label="Tags" hint="Comma-separated">
              <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
            </Field>
            <Field label="Published Date">
              <Input type="date" value={form.publishedDate.slice(0, 10)} onChange={(e) => set('publishedDate', e.target.value)} />
            </Field>
          </div>

          <div className="space-y-3 rounded-[var(--r-card)] border border-line bg-surface/30 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Featured</span>
              <Switch checked={form.featured} onChange={(v) => set('featured', v)} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Published</span>
              <Switch checked={form.published} onChange={(v) => set('published', v)} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete post"
        description="This permanently removes the post. This cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  )
}
