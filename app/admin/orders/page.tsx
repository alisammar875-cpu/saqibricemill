import Link from 'next/link'
import { formatPKR } from '@/lib/formatters'
import { getAdminOrders } from '@/lib/firestore'

export default async function AdminOrdersPage() {
  const ORDERS = await getAdminOrders()
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="text-sm text-mid-gray">{ORDERS.length} orders this month</p>
        </div>
        <div className="flex gap-3">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(filter => (
            <button key={filter} className="px-4 py-2 text-2xs font-semibold rounded-full border border-brand bg-ivory text-mid-gray hover:border-gold hover:text-gold transition-all">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-ivory rounded-xl border border-brand overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-brand">
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Order</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Items</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Total</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Payment</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order: any) => (
              <tr key={order.id} className="border-b border-brand/50 hover:bg-cream/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-charcoal">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-charcoal">{order.guestName ?? 'Customer'}</p>
                  <p className="text-2xs text-mid-gray">{order.guestEmail ?? '-'}</p>
                </td>
                <td className="px-6 py-4 text-mid-gray">{order.items?.length ?? 0}</td>
                <td className="px-6 py-4 font-semibold">{formatPKR(Number(order.total ?? 0))}</td>
                <td className="px-6 py-4 text-2xs text-mid-gray">{order.paymentMethod ?? '-'}</td>
                <td className="px-6 py-4">
                  <span className={[
                    'px-2 py-0.5 text-2xs font-semibold rounded-full',
                    order.status === 'Delivered' ? 'bg-emerald/10 text-emerald' :
                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'Processing' ? 'bg-gold/20 text-gold-dark' :
                    'bg-cream text-mid-gray',
                  ].join(' ')}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-2xs text-mid-gray">{new Date(order.createdAt?.toDate?.() ?? order.createdAt ?? Date.now()).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-2xs font-semibold text-emerald hover:text-gold">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
