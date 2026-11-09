'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  Edit3,
  FileText,
  Filter,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  X,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Status = 'Approved' | 'Pending Review' | 'Rejected'
type Submission = {
  id: string
  emoji: string
  name: string
  category: string
  date: string
  description: string
  tags: string[]
  status: Status
  feedback?: string
}

const initialSubmissions: Submission[] = [
  { id: 'png:824253-crying-cat', emoji: '😭', name: 'Crying Cat', category: 'Reactions', date: 'Mar 12, 2025', description: 'When the vibes are too much and you need to let the tears do the talking.', tags: ['crying', 'cat', 'reaction'], status: 'Approved' },
  { id: 'png:824278-side-eye', emoji: '🤨', name: 'Side Eye Supreme', category: 'Reactions', date: 'Mar 15, 2025', description: 'A raised eyebrow says more than a thousand words.', tags: ['side-eye', 'sus'], status: 'Pending Review' },
  { id: 'png:824291-cursed-pepe', emoji: '🐸', name: 'Cursed Pepe', category: 'Memes', date: 'Mar 09, 2025', description: 'A little cursed, a lot of personality.', tags: ['pepe', 'cursed', 'meme'], status: 'Rejected', feedback: 'This emoji is too similar to an existing submission. Please add a more distinct variation and resubmit.' },
  { id: 'png:824301-cozy-bear', emoji: '🧸', name: 'Cozy Bear', category: 'Cute', date: 'Mar 03, 2025', description: 'A soft little friend for cozy conversations.', tags: ['cute', 'bear', 'cozy'], status: 'Approved' },
  { id: 'png:824315-salute', emoji: '🫡', name: 'Respectfully', category: 'Funny', date: 'Feb 26, 2025', description: 'Reporting for duty, respectfully.', tags: ['salute', 'respect'], status: 'Rejected', feedback: 'The file has a transparent border that is visible at small sizes. Trim the canvas and try again.' },
]

const statusStyles: Record<Status, string> = {
  Approved: 'bg-emerald-500/12 text-emerald-500 border-emerald-500/20',
  'Pending Review': 'bg-amber-500/12 text-amber-500 border-amber-500/20',
  Rejected: 'bg-red-500/12 text-red-500 border-red-500/20',
}

function Logo() {
  return <Link href="/" className="flex items-center gap-2.5" aria-label="Yapmoji home"><span className="grid size-9 place-items-center rounded-xl bg-[#FC6A39] text-xl shadow-[0_6px_20px_rgba(252,106,57,0.24)]">◒</span><span className="text-[17px] font-bold tracking-tight">yapmoji</span></Link>
}

function StatusBadge({ status }: { status: Status }) {
  const Icon = status === 'Approved' ? Check : status === 'Rejected' ? X : Clock3
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}><Icon className="size-3.5" />{status}</span>
}

function Sidebar({ mobile = false }: { mobile?: boolean }) {
  return <nav aria-label="Dashboard navigation" className={mobile ? 'flex gap-2 overflow-x-auto' : 'flex flex-col gap-1'}>{[{ label: 'Overview', icon: LayoutDashboard, href: '/dashboard' }, { label: 'My Submissions', icon: FileText, href: '/dashboard#submissions' }, { label: 'Upload Emoji', icon: Upload, href: '/upload' }, { label: 'Profile', icon: UserRound, href: '/dashboard#profile' }].map(({ label, icon: Icon, href }) => <Link key={label} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${label === 'Overview' ? 'bg-[#FC6A39]/12 text-[#FC6A39]' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon className="size-4" />{label}</Link>)}</nav>
}

function StatCard({ label, value, icon: Icon, detail, accent }: { label: string; value: string; icon: typeof Check; detail: string; accent?: boolean }) {
  return <article className="rounded-2xl border border-border bg-card p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${accent ? 'bg-[#FC6A39]/12 text-[#FC6A39]' : 'bg-muted text-muted-foreground'}`}><Icon className="size-5" /></span></div><p className="mt-4 text-xs text-muted-foreground">{detail}</p></article>
}

function EmptyState({ rejected = false }: { rejected?: boolean }) {
  return <div className="rounded-2xl border border-dashed border-border p-10 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">{rejected ? <ShieldCheck /> : <Search />}</span><h3 className="mt-4 font-semibold">{rejected ? 'No rejected submissions' : 'No submissions found'}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{rejected ? 'Nice work. Keep creating and sharing your best ideas.' : 'Try changing your search or filters to see more submissions.'}</p></div>
}

export default function DashboardPage() {
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [sort, setSort] = useState('Newest first')
  const [selected, setSelected] = useState<Submission | null>(null)
  const [editing, setEditing] = useState<Submission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null)
  const [notice, setNotice] = useState('')

  const categories = [...new Set(submissions.map((item) => item.category))]
  const filtered = useMemo(() => [...submissions].filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'All statuses' || item.status === statusFilter) && (categoryFilter === 'All categories' || item.category === categoryFilter)).sort((a, b) => sort === 'Alphabetical' ? a.name.localeCompare(b.name) : sort === 'Oldest first' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)), [submissions, query, statusFilter, categoryFilter, sort])
  const stats = { total: submissions.length, approved: submissions.filter((item) => item.status === 'Approved').length, pending: submissions.filter((item) => item.status === 'Pending Review').length, rejected: submissions.filter((item) => item.status === 'Rejected').length }

  function clearFilters() { setQuery(''); setStatusFilter('All statuses'); setCategoryFilter('All categories'); setSort('Newest first') }
  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  function saveEdit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!editing) return; const data = new FormData(event.currentTarget); const updated = { ...editing, name: String(data.get('name') || editing.name), description: String(data.get('description') || ''), category: String(data.get('category') || editing.category), tags: String(data.get('tags') || '').split(',').map((tag) => tag.trim()).filter(Boolean) }; setSubmissions((current) => current.map((item) => item.id === editing.id ? updated : item)); setEditing(null); setSelected(updated); showNotice('Submission changes saved locally.') }
  function resubmit(item: Submission) { const updated = { ...item, status: 'Pending Review' as Status }; setSubmissions((current) => current.map((entry) => entry.id === item.id ? updated : entry)); setSelected(updated); showNotice('Submission moved back to pending review.') }
  function confirmDelete() { if (!deleteTarget) return; setSubmissions((current) => current.filter((item) => item.id !== deleteTarget.id)); setDeleteTarget(null); setSelected(null); showNotice('Demo submission deleted.') }

  return <div className={dark ? 'dark min-h-screen bg-[#101114] text-white' : 'min-h-screen bg-[#fafafa] text-[#101114]'}><header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 lg:px-8"><Logo /><div className="flex items-center gap-2"><Button variant="ghost" size="icon" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun /> : <Moon />}</Button><Link href="/upload" className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#FC6A39] px-2.5 text-sm font-medium text-white hover:bg-[#e85d2d] sm:inline-flex"><Upload className="size-4" /> Upload Emoji</Link><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'}>{menuOpen ? <X /> : <Menu />}</Button></div></div></header>
    <div className="mx-auto flex max-w-7xl gap-8 px-5 lg:px-8"><aside className="hidden w-52 shrink-0 border-r border-border py-8 lg:block"><p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Creator studio</p><Sidebar /></aside><main className="min-w-0 flex-1 py-7 lg:py-10">{menuOpen && <div className="mb-6 rounded-2xl border border-border bg-card p-3 lg:hidden"><Sidebar mobile /></div>}<div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-[#FC6A39]">Creator studio</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Welcome back, Alex</h1><p className="mt-2 text-sm text-muted-foreground">Manage your emoji submissions and keep an eye on their review status.</p></div><Link href="/upload" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FC6A39] px-4 text-sm font-medium text-white hover:bg-[#e85d2d]"><Upload className="size-4" /> Upload Emoji</Link></div>
      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Uploads" value={String(stats.total)} icon={FileText} detail="All demo submissions" accent /><StatCard label="Approved" value={String(stats.approved)} icon={ShieldCheck} detail="Live in the library" /><StatCard label="Pending Review" value={String(stats.pending)} icon={Clock3} detail="Awaiting moderation" /><StatCard label="Rejected" value={String(stats.rejected)} icon={CircleAlert} detail="Needs your attention" /></section>
      <section id="submissions" className="mt-10"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-xl font-bold">My Emoji Submissions</h2><p className="mt-1 text-sm text-muted-foreground">A frontend-only view of your creator activity.</p></div><span className="text-xs text-muted-foreground">{filtered.length} of {submissions.length} shown</span></div><div className="mt-5 rounded-2xl border border-border bg-card p-3"><div className="flex flex-col gap-3 xl:flex-row"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search submissions..." className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-[#FC6A39]" aria-label="Search submissions" /></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-xs outline-none" aria-label="Filter by status"><option>All statuses</option><option>Approved</option><option>Pending Review</option><option>Rejected</option></select><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-lg border border-input bg-background px-3 text-xs outline-none" aria-label="Filter by category"><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="col-span-2 h-10 rounded-lg border border-input bg-background px-3 text-xs outline-none sm:col-span-1" aria-label="Sort submissions"><option>Newest first</option><option>Oldest first</option><option>Alphabetical</option></select></div></div>{(query || statusFilter !== 'All statuses' || categoryFilter !== 'All categories') && <button onClick={clearFilters} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#FC6A39] hover:underline"><Filter className="size-3.5" /> Clear filters</button>}</div><div className="mt-4 flex flex-col gap-3">{filtered.length === 0 ? <EmptyState rejected={statusFilter === 'Rejected'} /> : filtered.map((item) => <article key={item.id} className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[#FC6A39]/45 sm:flex-row sm:items-center"><button className="flex min-w-0 flex-1 items-center gap-4 text-left" onClick={() => setSelected(item)}><span className="grid size-16 shrink-0 place-items-center rounded-xl bg-muted text-4xl">{item.emoji}</span><span className="min-w-0"><span className="block truncate font-semibold">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">{item.category} · Submitted {item.date}</span><span className="mt-2 block"><StatusBadge status={item.status} /></span></span></button><div className="flex items-center justify-between gap-2 sm:justify-end"><Button variant="ghost" size="sm" onClick={() => setSelected(item)}>View details</Button><Button variant="outline" size="icon-sm" onClick={() => setEditing(item)} aria-label={`Edit ${item.name}`}><Edit3 /></Button><Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-red-500" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.name}`}><Trash2 /></Button></div></article>)}</div></section>
    </main></div>{notice && <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#FC6A39]/30 bg-card px-4 py-3 text-sm shadow-xl"><Check className="size-4 text-[#FC6A39]" />{notice}</div>}{selected && <div className="fixed inset-0 z-40 grid place-items-center bg-black/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section role="dialog" aria-modal="true" aria-labelledby="submission-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#FC6A39]">Submission details</p><h2 id="submission-title" className="mt-2 text-2xl font-bold">{selected.name}</h2></div><Button variant="ghost" size="icon" onClick={() => setSelected(null)} aria-label="Close details"><X /></Button></div><div className="mt-6 flex items-center gap-4"><span className="grid size-24 place-items-center rounded-2xl bg-muted text-6xl">{selected.emoji}</span><div><StatusBadge status={selected.status} /><p className="mt-2 font-mono text-xs text-muted-foreground">{selected.id}</p></div></div><p className="mt-6 text-sm leading-6 text-muted-foreground">{selected.description}</p><div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm"><div><p className="text-xs text-muted-foreground">Category</p><p className="mt-1 font-medium">{selected.category}</p></div><div><p className="text-xs text-muted-foreground">Submitted</p><p className="mt-1 font-medium">{selected.date}</p></div></div><div className="mt-5 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">#{tag}</span>)}</div>{selected.feedback && <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/8 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-red-500"><AlertTriangle className="size-4" /> Review feedback</div><p className="mt-2 text-sm leading-6 text-muted-foreground">{selected.feedback}</p></div>}<div className="mt-7 flex flex-wrap gap-2">{selected.status === 'Approved' && <Link href={`/emojis/${selected.name.toLowerCase().replaceAll(' ', '-')}`} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#FC6A39] px-3 text-sm font-medium text-white hover:bg-[#e85d2d]">View Emoji <ArrowRight className="size-4" /></Link>}{selected.status === 'Rejected' && <Button className="bg-[#FC6A39] text-white hover:bg-[#e85d2d]" onClick={() => resubmit(selected)}>Resubmit</Button>}<Button variant="outline" onClick={() => { setEditing(selected); setSelected(null) }}>Edit</Button><Button variant="ghost" className="text-red-500 hover:text-red-500" onClick={() => setDeleteTarget(selected)}>Delete</Button></div></section></div>}{editing && <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"><form onSubmit={saveEdit} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-[#FC6A39]">Edit submission</p><h2 className="mt-2 text-2xl font-bold">Update your emoji</h2></div><Button type="button" variant="ghost" size="icon" onClick={() => setEditing(null)} aria-label="Close edit form"><X /></Button></div><div className="mt-6 flex flex-col gap-4"><div><label htmlFor="edit-name" className="text-sm font-medium">Name</label><input id="edit-name" name="name" defaultValue={editing.name} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-[#FC6A39]" /></div><div><label htmlFor="edit-description" className="text-sm font-medium">Description</label><textarea id="edit-description" name="description" defaultValue={editing.description} rows={3} className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-[#FC6A39]" /></div><div><label htmlFor="edit-category" className="text-sm font-medium">Category</label><select id="edit-category" name="category" defaultValue={editing.category} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-[#FC6A39]"><option>Memes</option><option>Reactions</option><option>Animals</option><option>Gaming</option><option>Anime</option><option>Funny</option><option>Cute</option></select></div><div><label htmlFor="edit-tags" className="text-sm font-medium">Tags</label><input id="edit-tags" name="tags" defaultValue={editing.tags.join(', ')} className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-[#FC6A39]" /></div></div><Button type="submit" className="mt-7 w-full bg-[#FC6A39] text-white hover:bg-[#e85d2d]">Save changes</Button></form></div>}{deleteTarget && <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm"><section role="alertdialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl"><span className="grid size-11 place-items-center rounded-xl bg-red-500/12 text-red-500"><Trash2 className="size-5" /></span><h2 id="delete-title" className="mt-5 text-xl font-bold">Delete submission?</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">This removes “{deleteTarget.name}” from the demo dashboard. This cannot be undone.</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="bg-red-500 text-white hover:bg-red-600" onClick={confirmDelete}>Delete</Button></div></section></div>}</div>
}
