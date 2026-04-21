import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { getSession } from '@/actions/auth'
import { getOrdersForUser } from '@/lib/firestore'
import { formatPKR } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Account' }

export default async function AccountPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/sign-in')
  }

  const orders = await getOrdersForUser(session.id as string)
  const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0)

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28 section-pad min-h-[80vh]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-3xl font-semibold text-charcoal">My Account</h1>
          <form action={async () => {
            'use server'
            const { logoutUser } = await import('@/actions/auth')
            await logoutUser()
            redirect('/sign-in')
          }}>
            <button type="submit" className="text-2xs font-semibold text-red-400 hover:text-red-600 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
        <p className="text-mid-gray mb-10">
          Welcome back, <span className="font-semibold text-charcoal">{(session.name as string) || (session.email as string)}</span>. 
          Manage your orders and profile.
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Orders', value: String(orders.length), icon: '📦' },
            { label: 'Total Spent', value: formatPKR(totalSpent), icon: '💰' },
            { label: 'Member Since', value: new Date().getFullYear().toString(), icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-ivory rounded-xl border border-brand p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="font-display text-2xl font-semibold text-charcoal">{s.value}</p>
                <p className="text-2xs text-mid-gray uppercase tracking-wider">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <h2 className="font-display text-xl font-semibold text-charcoal mb-6 pb-4 border-b border-brand">
          Recent Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-sm font-semibold text-charcoal mb-1">No orders yet</p>
            <p className="text-2xs text-mid-gray mb-6">Your order history will appear here.</p>
            <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-ivory rounded-xl border border-brand p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gold/40 transition-all"
              >
                <div>
                  <p className="font-display text-base font-semibold text-charcoal">{order.id}</p>
                  <p className="text-2xs text-mid-gray mt-1">
                    {new Date(order.createdAt?.toDate?.() ?? order.createdAt ?? Date.now()).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{order.items?.length ?? 0} item{(order.items?.length ?? 0) > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className={[
                    'px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full',
                    order.status === 'Delivered' ? 'bg-emerald/10 text-emerald' :
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'Processing' ? 'bg-gold/20 text-gold-dark' :
                    'bg-cream text-mid-gray',
                  ].join(' ')}>
                    {order.status}
                  </span>
                  <span className="font-display text-lg font-semibold text-charcoal">
                    {formatPKR(Number(order.total ?? 0))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
