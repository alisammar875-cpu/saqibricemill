'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🌾' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/inventory', label: 'Inventory', icon: '🏭' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

export function AdminLayoutClient({ children, signOutAction }: { children: React.ReactNode; signOutAction: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-charcoal p-4 text-white z-20">
        <Link href="/admin" className="font-display text-lg font-semibold" style={{ color: '#D4AF77' }}>
          SAQIB RICE MILLS
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={[
          'fixed inset-y-0 left-0 z-40 w-64 bg-charcoal flex-shrink-0 flex flex-col transition-transform duration-300 md:static md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        <div className="p-6 border-b border-white/10 hidden md:block">
          <Link href="/admin" className="font-display text-lg font-semibold" style={{ color: '#D4AF77' }}>
            SAQIB RICE MILLS
          </Link>
          <p className="text-2xs text-white/40 mt-1">Admin Portal</p>
        </div>
        
        {/* Mobile Header in Sidebar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between md:hidden">
           <span className="font-display text-lg font-semibold" style={{ color: '#D4AF77' }}>Menu</span>
           <button onClick={() => setMobileOpen(false)} className="text-white/60">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
           </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-6 py-3 text-sm transition-all',
                  isActive ? 'bg-white/10 text-gold border-r-2 border-gold' : 'text-white/60 hover:text-gold hover:bg-white/5'
                ].join(' ')}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={signOutAction} className="text-2xs text-white/40 hover:text-red-400 transition-colors mb-4 block w-full text-left">
            ⎋ Sign Out
          </button>
          <Link href="/" className="text-2xs text-white/40 hover:text-gold transition-colors block">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <div className="p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
