'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Heart,
  Menu,
  MessageCircle,
  Moon,
  Sun,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const emojiData = {
  'crying-cat': { emoji: '😭', name: 'Crying Cat', creator: 'milo', category: 'Reactions', id: 'png:824253-crying-cat', date: 'March 12, 2025', description: 'When the vibes are too much and you need to let the tears do the talking.', tags: ['crying', 'cat', 'reaction'], tone: 'from-orange-500/20 to-rose-500/10', downloads: '12.8k', additions: '3.2k', favorites: '892' },
  'skull-laugh': { emoji: '💀', name: 'Skull Laugh', creator: 'yapster', category: 'Memes', id: 'png:824254-skull-laugh', date: 'March 10, 2025', description: 'For when something is so funny you simply cannot survive it.', tags: ['skull', 'laugh', 'meme'], tone: 'from-slate-400/20 to-slate-700/10', downloads: '9.4k', additions: '2.7k', favorites: '641' },
  'side-eye': { emoji: '🤨', name: 'Side Eye', creator: 'pixelpete', category: 'Reactions', id: 'png:824255-side-eye', date: 'March 8, 2025', description: 'A raised eyebrow says more than a thousand words.', tags: ['side-eye', 'sus', 'reaction'], tone: 'from-amber-500/20 to-yellow-500/10', downloads: '8.1k', additions: '2.1k', favorites: '514' },
  'salute': { emoji: '🫡', name: 'Salute', creator: 'orbit', category: 'Funny', id: 'png:824256-salute', date: 'March 7, 2025', description: 'Respectfully reporting for duty.', tags: ['salute', 'respect', 'funny'], tone: 'from-blue-500/20 to-indigo-500/10', downloads: '7.6k', additions: '1.9k', favorites: '433' },
}

type Emoji = (typeof emojiData)[keyof typeof emojiData]

function Logo() {
  return <Link href="/" className="flex items-center gap-2.5" aria-label="Yapmoji home"><span className="grid size-9 place-items-center rounded-xl bg-[#FC6A39] text-xl shadow-[0_6px_20px_rgba(252,106,57,0.24)]">◒</span><span className="text-[17px] font-bold tracking-tight">yapmoji</span></Link>
}

function getEmoji(id: string): Emoji {
  return emojiData[id as keyof typeof emojiData] ?? emojiData['crying-cat']
}

function RelatedCard({ item }: { item: Emoji }) {
  const slug = item.name.toLowerCase().replaceAll(' ', '-')
  return <Link href={`/emojis/${slug}`} className="group rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-1 hover:border-[#FC6A39]/60"><div className={`grid aspect-square place-items-center rounded-xl bg-gradient-to-br ${item.tone}`}><span className="text-5xl transition-transform group-hover:scale-110" role="img" aria-label={item.name}>{item.emoji}</span></div><p className="mt-3 truncate text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">by @{item.creator}</p></Link>
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <Button variant="outline" size="icon" onClick={copy} aria-label={`Copy ${label}`}>{copied ? <Check className="text-[#FC6A39]" /> : <Copy />}</Button>
}

function AddBotModal({ item, onClose }: { item: Emoji; onClose: () => void }) {
  const command = `/add type:emoji id:${item.id}`
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" aria-labelledby="bot-modal-title" className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-[#FC6A39]">YapIn for Discord</p><h2 id="bot-modal-title" className="mt-2 text-2xl font-bold">Add {item.name}</h2></div><Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog"><X /></Button></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Copy the command below, then run it in the Discord server where YapIn is installed.</p><div className="mt-6 flex items-center gap-2"><div className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 font-mono text-xs text-foreground">{command}</div><CopyButton value={command} label="command" /></div><div className="mt-3 flex items-center gap-2"><div className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</div><CopyButton value={item.id} label="emoji ID" /></div><Button className="mt-6 w-full bg-[#FC6A39] text-white hover:bg-[#e85d2d]">Add YapIn to Discord <ArrowRight data-icon="inline-end" /></Button><p className="mt-4 text-center text-xs text-muted-foreground">Yapmoji demo interface — bot actions are not connected yet.</p></section></div>
}

export default function EmojiDetailPage() {
  const params = useParams<{ id: string }>()
  const item = getEmoji(params.id)
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const asset = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" rx="96" fill="#24262D"/><text x="256" y="330" text-anchor="middle" font-size="240">${item.emoji}</text></svg>`)}`

  return <div className={dark ? 'dark min-h-screen bg-[#101114] text-white' : 'min-h-screen bg-[#fafafa] text-[#101114]'}>
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 lg:px-8"><Logo /><nav className={`${menuOpen ? 'absolute left-0 right-0 top-[72px] flex border-b border-border bg-background p-5' : 'hidden'} flex-col gap-4 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`} aria-label="Main navigation">{['Emojis', 'Packs', 'Stickers', 'Marketplace', 'Tools'].map((label) => <Link key={label} href={`/${label.toLowerCase()}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}<button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">More <ChevronDown className="size-3.5" /></button></nav><div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun /> : <Moon />}</Button><Button variant="ghost" className="hidden sm:inline-flex">Log in</Button><Button className="hidden bg-[#FC6A39] text-white hover:bg-[#e85d2d] sm:inline-flex"><Upload data-icon="inline-start" /> Upload Emoji</Button><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</Button></div></div></header>
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12"><nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground">Home</Link><span>/</span><Link href="/#explore" className="hover:text-foreground">Emojis</Link><span>/</span><span className="truncate text-foreground">{item.name}</span></nav><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_1.15fr] lg:items-start"><div className={`relative grid min-h-[340px] place-items-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${item.tone} lg:min-h-[520px]`}><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,106,57,0.15),transparent_48%)]" /><span className="relative z-10 font-sans text-[8rem] leading-none drop-shadow-[0_24px_25px_rgba(0,0,0,0.22)] sm:text-[11rem]" role="img" aria-label={item.name}>{item.emoji}</span><span className="absolute bottom-5 left-5 rounded-full border border-border/70 bg-background/65 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">Demo asset preview</span></div><div className="min-w-0"><div className="flex items-start justify-between gap-4"><div><span className="inline-flex rounded-full border border-[#FC6A39]/25 bg-[#FC6A39]/10 px-3 py-1 text-xs font-medium text-[#FC6A39]">{item.category}</span><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{item.name}</h1></div><Button variant="outline" size="icon-lg" onClick={() => setFavorite((value) => !value)} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={favorite} className={favorite ? 'border-[#FC6A39] text-[#FC6A39]' : ''}><Heart className={favorite ? 'fill-current' : ''} /></Button></div><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{item.description}</p><div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 text-sm sm:grid-cols-4"><div><p className="text-xs text-muted-foreground">Created by</p><Link href={`/creators/${item.creator}`} className="mt-1 block font-medium hover:text-[#FC6A39]">@{item.creator}</Link></div><div><p className="text-xs text-muted-foreground">Emoji ID</p><p className="mt-1 truncate font-mono text-xs">{item.id}</p></div><div><p className="text-xs text-muted-foreground">Uploaded</p><p className="mt-1 font-medium">{item.date}</p></div><div><p className="text-xs text-muted-foreground">Format</p><p className="mt-1 font-medium">PNG</p></div></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={asset} download={`${item.name.toLowerCase().replaceAll(' ', '-')}.svg`} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#FC6A39] px-4 text-sm font-medium text-white transition-colors hover:bg-[#e85d2d]"><Download className="size-4" /> Download Emoji</a><Button variant="outline" onClick={() => setModalOpen(true)}><MessageCircle data-icon="inline-start" /> Add using the bot</Button></div><div className="mt-6 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">#{tag}</span>)}</div></div></div><section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="Emoji statistics">{[['Downloads', item.downloads], ['Bot additions', item.additions], ['Favorites', favorite ? '893' : item.favorites]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">Sample frontend statistic</p></div>)}</section><section className="mt-16"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-[#FC6A39]">Keep exploring</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Related emojis</h2></div><Link href="/" className="hidden items-center gap-1 text-sm text-muted-foreground hover:text-[#FC6A39] sm:flex">Browse library <ArrowLeft className="size-4" /></Link></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{Object.values(emojiData).filter((related) => related.name !== item.name).map((related) => <RelatedCard key={related.name} item={related} />)}</div></section><section className="mt-16 rounded-3xl border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between sm:p-8"><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-[#FC6A39]/12 text-2xl">{item.creator === 'milo' ? '🪩' : '🧃'}</span><div><p className="text-xs text-muted-foreground">Created by</p><Link href={`/creators/${item.creator}`} className="mt-1 block text-lg font-semibold hover:text-[#FC6A39]">@{item.creator}</Link><p className="mt-1 text-sm text-muted-foreground">Community creator · Sample profile</p></div></div><Link href={`/creators/${item.creator}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#FC6A39] sm:mt-0">View creator profile <ArrowRight className="size-4" /></Link></section></main>{modalOpen && <AddBotModal item={item} onClose={() => setModalOpen(false)} />}</div>
}
