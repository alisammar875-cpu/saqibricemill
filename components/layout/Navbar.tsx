'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useTheme } from '@/components/providers/ThemeProvider'
import { CartSidebar } from './CartSidebar'
import { SaqibLogo } from '@/components/ui/SaqibLogo'
import { getSession, logoutUser } from '@/actions/auth'

const NAV_LINKS = [
  { href: '/shop',     label: 'Shop' },
  { href: '/shop?cat=premium-basmati', label: 'Basmati' },
  { href: '/shop?cat=bulk-export',     label: 'Bulk Orders' },
  { href: '/recipes',  label: 'Recipes' },
  { href: '/about',    label: 'Our Story' },
  { href: '/export',   label: 'Export' },
]

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen]     = useState(false)
  const [session, setSession]       = useState<{name?: string, role?: string} | null>(null)
  
  const pathname  = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const itemCount = useCartStore(s => s.itemCount())

  useEffect(() => {
    getSession().then((s: any) => setSession(s)).catch(() => {})
  }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    await logoutUser()
    setSession(null)
    router.push('/')
    router.refresh()
  }

  const isHeroPage = pathname === '/'

  return (
    <>
      <header
        className={[
          'sticky top-0 z-50 flex items-center justify-between w-full',
          'px-[5vw] transition-all duration-500',
          scrolled 
            ? 'bg-warm/95 dark:bg-[#0F1A0F]/95 backdrop-blur-xl shadow-card border-b border-brand dark:border-brand/30 h-[68px]'
            : 'bg-warm dark:bg-[#0F1A0F] h-20 border-b border-brand/20 dark:border-white/10',
        ].join(' ')}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <SaqibLogo
            height={scrolled ? 38 : 44}
            lightText={theme === 'dark'}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={[
                'relative text-2xs font-semibold tracking-widest2 uppercase transition-colors duration-300',
                'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-gold',
                'after:scale-x-0 after:origin-right after:transition-transform after:duration-300',
                'hover:after:scale-x-100 hover:after:origin-left',
                'text-charcoal dark:text-white/90 hover:text-gold dark:hover:text-gold',
              ].join(' ')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={[
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
              'hover:bg-gold/15',
              'text-charcoal dark:text-white/90',
            ].join(' ')}
          >
            {theme === 'dark' ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {/* Search */}
          <Link
            href="/shop"
            aria-label="Search products"
            className={[
              'w-10 h-10 rounded-full hidden sm:flex items-center justify-center transition-all duration-300',
              'hover:bg-gold/15',
              'text-charcoal dark:text-white/90',
            ].join(' ')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </Link>

          {/* Mobile Auth Icon (Only visible on mobile) */}
          <Link
            href={session ? (session.role === 'ADMIN' ? '/admin' : '/account') : '/sign-in'}
            aria-label="Account"
            className={[
              'w-10 h-10 rounded-full flex sm:hidden items-center justify-center transition-all duration-300',
              'hover:bg-gold/15',
              'text-charcoal dark:text-white/90',
            ].join(' ')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className={[
              'relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
              'hover:bg-gold/15',
              'text-charcoal dark:text-white/90',
            ].join(' ')}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-gold text-dark text-[10px] font-bold flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Desktop Auth */}
          {session ? (
            <div className="hidden sm:flex items-center gap-4 ml-2">
              <Link href={session.role === 'ADMIN' ? '/admin' : '/account'} className={[
                'text-2xs font-semibold transition-colors',
                'text-charcoal dark:text-white/90 hover:text-gold'
              ].join(' ')}>
                {(session.name as string)?.split(' ')[0] || 'Profile'}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-2xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="hidden sm:flex btn btn-emerald text-2xs px-5 py-2.5 ml-2"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
            className={[
              'lg:hidden flex flex-col gap-[5px] w-8 py-1 ml-1 transition-colors',
              'text-charcoal dark:text-white/90',
            ].join(' ')}
          >
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        className={[
          'fixed inset-0 z-40 lg:hidden transition-all duration-500',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-dark/60 backdrop-blur-sm transition-opacity duration-400 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <nav
          className={[
            'absolute top-0 right-0 h-full w-72 bg-warm dark:bg-[#0F1A0F] shadow-deep',
            'flex flex-col pt-24 px-8 pb-10 gap-6 transition-transform duration-500',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-display text-xl font-semibold text-charcoal dark:text-white/90 hover:text-gold transition-colors border-b border-brand dark:border-brand/30 pb-4"
            >
              {label}
            </Link>
          ))}
          {session ? (
             <div className="flex flex-col gap-4 mt-4">
              <Link href={session.role === 'ADMIN' ? '/admin' : '/account'} className="font-display text-xl font-semibold text-emerald dark:text-emerald-light">
                {(session.name as string)?.split(' ')[0] || 'My Account'}
              </Link>
              <button 
                onClick={handleLogout}
                className="text-left w-full font-display text-xl font-semibold text-red-500 dark:text-red-400"
              >
                Logout
              </button>
             </div>
          ) : (
            <Link href="/sign-in" className="btn btn-emerald mt-4">Sign In</Link>
          )}
        </nav>
      </div>

      {/* Cart sidebar */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
