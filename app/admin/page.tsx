import Link from 'next/link'
import { formatPKR } from '@/lib/formatters'
import { getAdminDashboardData } from '@/lib/firestore'

export default async function AdminDashboard() {
  const data = await getAdminDashboardData()
  const STATS = [
    { label: 'Total Revenue', value: formatPKR(data.revenue), desc: 'All active orders', icon: '💰' },
    { label: 'Total Orders', value: String(data.ordersCount), desc: 'Lifetime orders', icon: '📦' },
    { label: 'Active Customers', value: String(data.customersCount), desc: 'Registered users', icon: '👥' },
    { label: 'Avg. Order Value', value: formatPKR(data.avgOrderValue), desc: 'Per active order', icon: '📊' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Dashboard</h1>
          <p className="text-sm text-mid-gray">Welcome back, Saqib. Here&apos;s your factory overview.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn btn-emerald text-xs px-6 py-3"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-ivory rounded-xl border border-brand p-6 hover:shadow-card transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl p-2 bg-emerald/5 rounded-lg">{stat.icon}</span>
            </div>
            <p className="font-display text-2xl font-semibold text-charcoal">{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-2xs text-mid-gray uppercase tracking-wider">{stat.label}</p>
              <span className="text-[10px] text-emerald font-medium">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-ivory rounded-xl border border-brand p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="text-2xs font-semibold text-emerald hover:text-gold">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand">
                  <th className="text-left py-3 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Order</th>
                  <th className="text-left py-3 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-brand/50 hover:bg-cream/50">
                    <td className="py-3 font-semibold text-charcoal">{order.id}</td>
                    <td className="py-3 text-mid-gray">{order.guestName ?? 'Customer'}</td>
                    <td className="py-3 font-semibold">{formatPKR(Number(order.total ?? 0))}</td>
                    <td className="py-3">
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
                    <td className="py-3 text-2xs text-mid-gray">{new Date(order.createdAt?.toDate?.() ?? order.createdAt ?? Date.now()).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-ivory rounded-xl border border-brand p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-6">⚠️ Low Stock Alerts</h2>
          <div className="space-y-4">
            {data.lowStock.map((item: any) => (
              <div key={item.sku} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm font-semibold text-charcoal">{item.product} — {item.variant}</p>
                  <p className="text-2xs text-mid-gray">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{item.stock}</p>
                  <p className="text-2xs text-red-500">units left</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="block text-center mt-4 text-2xs font-semibold text-emerald hover:text-gold">
            Manage Inventory →
          </Link>
        </div>
      </div>
    </div>
  )
}
