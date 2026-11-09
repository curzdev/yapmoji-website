'use client'

import { ChangeEvent, DragEvent, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  FileImage,
  ImagePlus,
  Menu,
  Moon,
  Sun,
  Tag,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const categories = ['Memes', 'Reactions', 'Animals', 'Gaming', 'Anime', 'Funny', 'Cute', 'Other']

function Logo() {
  return <Link href="/" className="flex items-center gap-2.5" aria-label="Yapmoji home"><span className="grid size-9 place-items-center rounded-xl bg-[#FC6A39] text-xl shadow-[0_6px_20px_rgba(252,106,57,0.24)]">◒</span><span className="text-[17px] font-bold tracking-tight">yapmoji</span></Link>
}

export default function UploadPage() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function selectFile(nextFile: File | undefined) {
    if (!nextFile) return
    const nextErrors: Record<string, string> = {}
    if (!['image/png', 'image/gif'].includes(nextFile.type)) nextErrors.file = 'Please choose a PNG or GIF file.'
    if (nextFile.size > MAX_FILE_SIZE) nextErrors.file = 'That file is larger than the 8 MB limit.'
    setErrors((current) => ({ ...current, file: nextErrors.file ?? '' }))
    if (nextErrors.file) return
    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    selectFile(event.dataTransfer.files[0])
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
  }

  function addTag() {
    const nextTag = tagInput.trim().toLowerCase().replace(/^#/, '')
    if (!nextTag) return
    if (tags.includes(nextTag)) {
      setErrors((current) => ({ ...current, tags: 'That tag has already been added.' }))
      return
    }
    setTags((current) => [...current, nextTag])
    setTagInput('')
    setErrors((current) => ({ ...current, tags: '' }))
  }

  function removeFile() {
    setFile(null)
    setPreview(null)
    setErrors((current) => ({ ...current, file: '' }))
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (!file) nextErrors.file = 'Choose an emoji file before submitting.'
    if (!name.trim()) nextErrors.name = 'Give your emoji a name.'
    if (name.trim().length > 48) nextErrors.name = 'Names must be 48 characters or fewer.'
    if (!category) nextErrors.category = 'Choose a category.'
    if (new Set(tags).size !== tags.length) nextErrors.tags = 'Tags must be unique.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (validate()) setSubmitted(true)
  }

  return <div className={dark ? 'dark min-h-screen bg-[#101114] text-white' : 'min-h-screen bg-[#fafafa] text-[#101114]'}>
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 lg:px-8"><Logo /><nav className={`${menuOpen ? 'absolute left-0 right-0 top-[72px] flex border-b border-border bg-background p-5' : 'hidden'} flex-col gap-4 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`} aria-label="Main navigation">{['Emojis', 'Packs', 'Stickers', 'Marketplace', 'Tools'].map((label) => <Link key={label} href={`/${label.toLowerCase()}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}<button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">More <ChevronDown className="size-3.5" /></button></nav><div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun /> : <Moon />}</Button><Button variant="ghost" className="hidden sm:inline-flex">Log in</Button><Link href="/upload" className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#FC6A39] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e85d2d] sm:inline-flex"><Upload className="size-4" /> Upload Emoji</Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</Button></div></div></header>

    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14"><div className="mx-auto max-w-3xl"><p className="text-sm font-medium text-[#FC6A39]">Creator tools</p><h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Upload an Emoji</h1><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Share something great with the community. Submitted emojis are reviewed before they appear publicly.</p></div>
      {submitted ? <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#FC6A39]/25 bg-card p-8 text-center shadow-xl sm:p-12"><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#FC6A39]/12 text-[#FC6A39]"><Check className="size-8" /></span><h2 className="mt-6 text-2xl font-bold">Sent for review</h2><p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">Your emoji is now awaiting moderator approval. This is a frontend-only demo, so nothing has been uploaded yet.</p><Link href="/" className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-[#FC6A39] px-5 text-sm font-medium text-white hover:bg-[#e85d2d]">Return to emoji library</Link></section> : <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start"><section className="rounded-3xl border border-border bg-card p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-lg font-semibold">Emoji file</h2><p className="mt-1 text-sm text-muted-foreground">PNG or GIF, up to 8 MB</p></div><ImagePlus className="text-[#FC6A39]" /></div><input id="emoji-file" type="file" accept="image/png,image/gif" className="sr-only" onChange={handleFileChange} /><div className={`mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition-colors ${errors.file ? 'border-destructive bg-destructive/5' : 'border-border hover:border-[#FC6A39]/60'}`} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>{preview && file ? <div className="flex w-full flex-col items-center gap-4"><div className="grid size-36 place-items-center overflow-hidden rounded-2xl bg-muted"><img src={preview} alt="Selected emoji preview" className="size-full object-contain" /></div><div><p className="max-w-xs truncate text-sm font-medium">{file.name}</p><p className="mt-1 text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div><div className="flex gap-2"><label htmlFor="emoji-file" className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium hover:bg-muted"><Upload className="size-3.5" /> Replace</label><Button type="button" variant="ghost" size="sm" onClick={removeFile}><Trash2 data-icon="inline-start" /> Remove</Button></div></div> : <><span className="grid size-14 place-items-center rounded-2xl bg-[#FC6A39]/12 text-[#FC6A39]"><FileImage /></span><p className="mt-4 text-sm font-medium">Drag and drop your emoji here</p><p className="mt-1 text-xs text-muted-foreground">or browse from your device</p><label htmlFor="emoji-file" className="mt-5 inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-[#FC6A39] px-4 text-sm font-medium text-white hover:bg-[#e85d2d]">Browse files</label></>}</div>{errors.file && <p className="mt-3 text-xs text-destructive">{errors.file}</p>}</section>

        <section className="rounded-3xl border border-border bg-card p-5 sm:p-7"><h2 className="text-lg font-semibold">Emoji information</h2><p className="mt-1 text-sm text-muted-foreground">Help people find and understand your emoji.</p><div className="mt-6 flex flex-col gap-5"><div><label htmlFor="name" className="text-sm font-medium">Emoji name <span className="text-[#FC6A39]">*</span></label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. glossy facepalm" className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#FC6A39] focus:ring-2 focus:ring-[#FC6A39]/20" aria-invalid={Boolean(errors.name)} />{errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}</div><div><label htmlFor="description" className="text-sm font-medium">Description <span className="text-xs font-normal text-muted-foreground">(optional)</span></label><textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What makes this emoji special?" rows={3} className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-[#FC6A39] focus:ring-2 focus:ring-[#FC6A39]/20" /></div><div><label htmlFor="category" className="text-sm font-medium">Category <span className="text-[#FC6A39]">*</span></label><select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-[#FC6A39]" aria-invalid={Boolean(errors.category)}><option value="">Select a category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>{errors.category && <p className="mt-1.5 text-xs text-destructive">{errors.category}</p>}</div><div><label htmlFor="tags" className="text-sm font-medium">Tags</label><div className="mt-2 flex gap-2"><div className="relative flex-1"><Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="tags" value={tagInput} onChange={(event) => setTagInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addTag() } }} placeholder="Add a tag and press Enter" className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-[#FC6A39]" /></div><Button type="button" variant="outline" onClick={addTag}>Add</Button></div>{tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{tags.map((tag) => <button type="button" key={tag} onClick={() => setTags((current) => current.filter((item) => item !== tag))} className="flex items-center gap-1 rounded-full bg-[#FC6A39]/12 px-2.5 py-1 text-xs font-medium text-[#FC6A39]">#{tag}<X className="size-3" /></button>)}</div>}{errors.tags && <p className="mt-1.5 text-xs text-destructive">{errors.tags}</p>}</div></div><div className="mt-7 border-t border-border pt-5"><Button type="submit" className="w-full bg-[#FC6A39] text-white hover:bg-[#e85d2d]">Submit for Review <Upload data-icon="inline-end" /></Button><p className="mt-3 text-center text-xs text-muted-foreground">Demo only. Your file will not be stored or uploaded.</p></div></section></form>}
    </main>
  </div>
}
