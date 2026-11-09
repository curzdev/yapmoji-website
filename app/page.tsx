'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Flame,
  Grid3X3,
  Heart,
  Menu,
  MessageCircle,
  Moon,
  MoreHorizontal,
  Search,
  Sparkles,
  Sun,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = ['All', 'Trending', 'Popular', 'Newest', 'Memes', 'Reactions', 'Animals', 'Gaming', 'Anime', 'Funny']

const emojis = [
  { emoji: '😭', name: 'Crying Cat', creator: 'milo', category: 'Reactions', tone: 'from-orange-500/20 to-rose-500/10' },
  { emoji: '💀', name: 'Skull Laugh', creator: 'yapster', category: 'Memes', tone: 'from-slate-400/20 to-slate-700/10' },
  { emoji: '🤨', name: 'Side Eye', creator: 'pixelpete', category: 'Reactions', tone: 'from-amber-500/20 to-yellow-500/10' },
  { emoji: '🫡', name: 'Salute', creator: 'orbit', category: 'Funny', tone: 'from-blue-500/20 to-indigo-500/10' },
  { emoji: '😈', name: 'Mischief', creator: 'luna', category: 'Memes', tone: 'from-fuchsia-500/20 to-purple-500/10' },
  { emoji: '🤝', name: 'Handshake', creator: 'nori', category: 'Reactions', tone: 'from-emerald-500/20 to-teal-500/10' },
  { emoji: '🐸', name: 'Froggo', creator: 'toadally', category: 'Animals', tone: 'from-green-500/20 to-lime-500/10' },
  { emoji: '🗿', name: 'Moai', creator: 'ancientone', category: 'Funny', tone: 'from-stone-400/20 to-stone-700/10' },
  { emoji: '✨', name: 'Sparkle Pop', creator: 'stardust', category: 'Popular', tone: 'from-yellow-500/20 to-orange-500/10' },
  { emoji: '😎', name: 'Cool Story', creator: 'sunnies', category: 'Memes', tone: 'from-cyan-500/20 to-blue-500/10' },
]

const packs = [
  { title: 'The Reaction Pack', count: '48 emojis', icon: '😂', color: 'bg-orange-500/15' },
  { title: 'Cursed Classics', count: '32 emojis', icon: '👁️', color: 'bg-violet-500/15' },
  { title: 'Cozy & Cute', count: '24 emojis', icon: '🧸', color: 'bg-rose-500/15' },
]

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Yapmoji home">
      <span className="grid size-9 place-items-center rounded-xl bg-[#FC6A39] text-xl shadow-[0_6px_20px_rgba(252,106,57,0.24)]">◒</span>
      <span className="text-[17px] font-bold tracking-tight">yapmoji</span>
    </Link>
  )
}

function EmojiCard({ item }: { item: (typeof emojis)[number] }) {
  return (
    <Link href={`/emojis/${item.name.toLowerCase().replaceAll(' ', '-')}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#FC6A39]/60 hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]">
        <div className={`relative grid aspect-square place-items-center rounded-xl bg-gradient-to-br ${item.tone}`}>
          <span className="text-[4.4rem] leading-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:scale-110" role="img" aria-label={`${item.name} emoji`}>
            {item.emoji}
          </span>
          <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-background/75 text-[#FC6A39] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <ArrowRight aria-hidden="true" />
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 px-1 pt-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{item.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">by @{item.creator}</p>
          </div>
          <Heart className="mb-0.5 size-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
        </div>
      </article>
    </Link>
  )
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? emojis : emojis.filter((item) => item.category === activeCategory)

  return (
    <div className={dark ? 'dark min-h-screen bg-[#101114] text-white' : 'min-h-screen bg-[#fafafa] text-[#101114]'}>
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
          <Logo />
          <nav className={`${menuOpen ? 'absolute left-0 right-0 top-[72px] flex border-b border-border bg-background p-5' : 'hidden'} flex-col gap-4 lg:static lg:flex lg:flex-row lg:items-center lg:border-0 lg:bg-transparent lg:p-0`} aria-label="Main navigation">
            {['Emojis', 'Packs', 'Stickers', 'Marketplace', 'Tools', 'Dashboard'].map((label) => <Link key={label} href={`/${label.toLowerCase()}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}
            <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">More <ChevronDown className="size-3.5" aria-hidden="true" /></button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setDark((value) => !value)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun data-icon="inline-start" /> : <Moon data-icon="inline-start" />}</Button>
            <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            <Link href="/upload" className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#FC6A39] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[#e85d2d] sm:inline-flex"><Upload className="size-4" /> Upload Emoji</Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute left-1/2 top-[-220px] size-[520px] -translate-x-1/2 rounded-full bg-[#FC6A39]/10 blur-[110px]" />
          <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-20 text-center lg:pt-24">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#FC6A39]/20 bg-[#FC6A39]/10 px-3 py-1.5 text-xs font-medium text-[#FC6A39]"><Sparkles className="size-3.5" aria-hidden="true" /> Built for the chronically online</div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Say it with an <span className="text-[#FC6A39]">emoji.</span></h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">Discover the internet&apos;s best community-made emojis and bring more personality to your Discord server.</p>
            <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-2xl shadow-black/10 sm:flex-row">
              <div className="flex min-h-12 flex-1 items-center gap-3 px-3"><Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /><input type="search" aria-label="Search emojis" placeholder="Search thousands of emojis..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70" /></div>
              <Button className="min-h-12 bg-[#FC6A39] px-7 text-white hover:bg-[#e85d2d]">Search</Button>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">Popular: {['pepe', 'laughing', 'cute', 'gaming'].map((tag) => <button key={tag} className="font-medium text-foreground/80 underline decoration-border underline-offset-4 hover:text-[#FC6A39]">{tag}</button>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#FC6A39]/20 bg-[#191B20] px-6 py-8 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-10">
            <div className="pointer-events-none absolute -right-14 -top-20 size-64 rounded-full bg-[#FC6A39]/10 blur-3xl" />
            <div className="relative max-w-xl"><div className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#FC6A39]"><span className="grid size-7 place-items-center rounded-lg bg-[#FC6A39]/15"><MessageCircle className="size-4" /></span> YapIn for Discord</div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Bring your favorite emojis to Discord</h2><p className="mt-3 leading-7 text-[#A1A1AA]">Add thousands of community-made emojis to your Discord server using YapIn.</p></div>
            <div className="relative mt-7 flex items-center gap-5 lg:mt-0"><Button className="bg-[#FC6A39] text-white hover:bg-[#e85d2d]">Add YapIn to Discord <ArrowRight data-icon="inline-end" /></Button><span className="text-xs text-[#A1A1AA]">Free to use</span></div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
          <div className="flex flex-col gap-6 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#FC6A39]"><Compass className="size-4" /> Library</div><h2 className="text-3xl font-bold tracking-tight">Explore Emojis</h2><p className="mt-2 text-sm text-muted-foreground">Discover and add your favorite emojis to your Discord server.</p></div><div className="flex items-center gap-2"><label htmlFor="sort" className="sr-only">Sort emojis</label><select id="sort" className="h-9 rounded-lg border border-border bg-card px-3 text-xs font-medium outline-none"><option>Most Popular</option><option>Recently Added</option><option>Most Downloaded</option></select><Button variant="outline" size="icon" aria-label="Change grid view"><Grid3X3 /></Button></div></div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Emoji categories">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors ${activeCategory === category ? 'border-[#FC6A39] bg-[#FC6A39] text-white' : 'border-border bg-card text-muted-foreground hover:border-[#FC6A39]/50 hover:text-foreground'}`} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">{filtered.map((item) => <EmojiCard key={item.name} item={item} />)}</div>

          <div className="mt-20 flex items-end justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#FC6A39]"><Flame className="size-4" /> Trending now</div><h2 className="text-2xl font-bold tracking-tight">The internet&apos;s current mood</h2></div><Link href="/emojis?sort=trending" className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#FC6A39] sm:flex">View all <ArrowRight className="size-4" /></Link></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{emojis.slice(5, 9).map((item) => <EmojiCard key={`trend-${item.name}`} item={item} />)}</div>

          <div className="mt-20 flex items-end justify-between"><div><div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#FC6A39]"><Zap className="size-4" /> Curated collections</div><h2 className="text-2xl font-bold tracking-tight">Popular emoji packs</h2></div><Link href="/packs" className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#FC6A39] sm:flex">Browse packs <ArrowRight className="size-4" /></Link></div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">{packs.map((pack) => <Link href="/packs" key={pack.title} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-[#FC6A39]/50"><span className={`grid size-14 shrink-0 place-items-center rounded-xl text-3xl ${pack.color}`}>{pack.icon}</span><span className="min-w-0"><span className="block truncate font-semibold">{pack.title}</span><span className="mt-1 block text-xs text-muted-foreground">{pack.count} <span className="mx-1">·</span> Community pack</span></span><ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[#FC6A39]" /></Link>)}</div>
        </section>
      </main>

      <footer className="border-t border-border/70 bg-card/40"><div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8"><div><Logo /><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">The community-powered emoji library for people who have something to say.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><Link href="/about" className="hover:text-foreground">About</Link><Link href="/contact" className="hover:text-foreground">Contact</Link><Link href="/terms" className="hover:text-foreground">Terms of Service</Link><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link><Link href="/discord" className="hover:text-[#FC6A39]">Discord server ↗</Link></div></div><div className="mx-auto max-w-7xl border-t border-border/70 px-5 py-5 text-xs text-muted-foreground lg:px-8">© 2025 Yapmoji. Sample content for the initial frontend.</div></footer>
    </div>
  )
}
