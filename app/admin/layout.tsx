import Link from 'next/link'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Admin Dashboard' }

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🌾' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/inventory', label: 'Inventory', icon: '🏭' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-display text-lg font-semibold" style={{ color: '#D4AF77' }}>
            SAQIB RICE MILLS
          </Link>
          <p className="text-2xs text-white/40 mt-1">Admin Portal</p>
        </div>
        <nav className="flex-1 py-4">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 text-sm text-white/60 hover:text-gold hover:bg-white/5 transition-all"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-white/10">
          <form action={async () => {
            'use server'
            const { logoutUser } = await import('@/actions/auth')
            await logoutUser()
            redirect('/sign-in')
          }}>
            <button type="submit" className="text-2xs text-white/40 hover:text-red-400 transition-colors mb-4 block">
              ⎋ Sign Out
            </button>
          </form>
          <Link href="/" className="text-2xs text-white/40 hover:text-gold transition-colors">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
