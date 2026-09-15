import { useState, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from './Input'
import { IconButton } from './Button'

interface TagInputProps {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}

/** Editable chip list — used for the technology marquee, tags, and similar flat string arrays. */
export function TagInput({ value, onChange, placeholder = 'Add an item…' }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function commit() {
    const trimmed = draft.trim()
    if (!trimmed) return
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...value, trimmed])
    setDraft('')
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      remove(value.length - 1)
    }
  }

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-bg-alt py-1 pl-3 pr-1.5 font-mono text-xs text-text"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Remove ${item}`}
                className="flex h-4 w-4 items-center justify-center rounded-full text-faint transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <IconButton type="button" onClick={commit} aria-label="Add" className="shrink-0">
          <Plus size={15} />
        </IconButton>
      </div>
    </div>
  )
}
