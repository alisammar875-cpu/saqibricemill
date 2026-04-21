import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { getSession } from '@/actions/auth'
import { getOrdersForUser } from '@/lib/firestore'
import { formatPKR } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders' }

export default async function OrdersPage() {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  const ORDERS = await getOrdersForUser(session.id as string)

  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28 section-pad min-h-[70vh]">
        <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          <span>/</span>
          <span className="text-charcoal font-semibold">My Orders</span>
        </div>
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-8">My Orders</h1>

        {ORDERS.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-sm font-semibold text-charcoal mb-1">No orders yet</p>
            <p className="text-2xs text-mid-gray mb-6">Your order history will appear here.</p>
            <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ORDERS.map((order: any) => (
              <div key={order.id} className="bg-ivory rounded-xl border border-brand overflow-hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-cream border-b border-brand">
                  <div>
                    <p className="font-display text-base font-semibold text-charcoal">{order.id}</p>
                    <p className="text-2xs text-mid-gray">
                      {new Date(order.createdAt?.toDate?.() ?? order.createdAt ?? Date.now()).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span className={[
                      'px-3 py-1 text-2xs font-semibold rounded-full',
                      order.status === 'Delivered' ? 'bg-emerald/10 text-emerald' :
                      order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                      'bg-gold/20 text-gold-dark',
                    ].join(' ')}>{order.status}</span>
                    <span className="font-display text-lg font-semibold">{formatPKR(Number(order.total ?? 0))}</span>
                  </div>
                </div>
                {/* Items */}
                <div className="p-6">
                  {(order.items ?? []).map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-2 text-sm">
                      <span className="text-mid-gray">{item.name ?? 'Item'} × {item.quantity ?? 1}</span>
                      <span className="font-semibold text-charcoal">{formatPKR(Number(item.price ?? 0) * Number(item.quantity ?? 1))}</span>
                    </div>
                  ))}
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
