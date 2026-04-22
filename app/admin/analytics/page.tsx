import { getAdminOrders } from '@/lib/firestore'
import { formatPKR } from '@/lib/formatters'

export default async function AdminAnalyticsPage() {
  const orders = await getAdminOrders()
  const activeOrders = orders.filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'Cancelled')

  // 1. Monthly Data (Last 6 Months)
  const MONTHLY_DATA: { month: string; monthKey: string; revenue: number; orders: number }[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    MONTHLY_DATA.push({
      month: d.toLocaleString('en-US', { month: 'short' }),
      monthKey: `${d.getFullYear()}-${d.getMonth()}`,
      revenue: 0,
      orders: 0
    })
  }

  activeOrders.forEach((o: any) => {
    const d = new Date(o.createdAt?.toDate?.() ?? o.createdAt ?? Date.now())
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    const monthData = MONTHLY_DATA.find(m => m.monthKey === monthKey)
    if (monthData) {
      monthData.revenue += Number(o.total || 0)
      monthData.orders += 1
    }
  })

  // 2. Top Products
  const productStats: Record<string, { name: string; sold: number; revenue: number }> = {}
  activeOrders.forEach((o: any) => {
    ;(o.items || []).forEach((item: any) => {
      if (!productStats[item.name]) {
        productStats[item.name] = { name: item.name, sold: 0, revenue: 0 }
      }
      productStats[item.name].sold += Number(item.quantity || 1)
      productStats[item.name].revenue += Number(item.price || 0) * Number(item.quantity || 1)
    })
  })
  const TOP_PRODUCTS = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // 3. Top Cities
  const cityStats: Record<string, number> = {}
  activeOrders.forEach((o: any) => {
    const city = o.shippingAddress?.city || 'Unknown'
    cityStats[city] = (cityStats[city] || 0) + 1
  })
  const totalValidOrders = activeOrders.length || 1
  const sortedCities = Object.entries(cityStats).sort((a, b) => b[1] - a[1])
  const TOP_CITIES = sortedCities.slice(0, 5).map(([city, count]) => ({
    city,
    orders: count,
    pct: Math.round((count / totalValidOrders) * 100)
  }))
  const otherOrders = sortedCities.slice(5).reduce((sum, [_, count]) => sum + count, 0)
  if (otherOrders > 0) {
    TOP_CITIES.push({ city: 'Other', orders: otherOrders, pct: Math.round((otherOrders / totalValidOrders) * 100) })
  }

  // 4. Payment Methods
  const paymentStats: Record<string, number> = {}
  activeOrders.forEach((o: any) => {
    const method = o.paymentMethod || 'Unknown'
    paymentStats[method] = (paymentStats[method] || 0) + 1
  })
  const PAYMENT_METHODS = Object.entries(paymentStats)
    .sort((a, b) => b[1] - a[1])
    .map(([method, count]) => ({
      method,
      orders: count,
      pct: Math.round((count / totalValidOrders) * 100)
    }))

  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue), 1)

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Analytics</h1>
        <p className="text-sm text-mid-gray">Business performance overview — last 6 months</p>
      </div>

      {/* Revenue Chart */}
      <div className="bg-ivory rounded-xl border border-brand p-8 mb-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Monthly Revenue</h2>
        <div className="flex items-end gap-4 h-48">
          {MONTHLY_DATA.map(d => (
            <div key={d.monthKey} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-2xs font-semibold text-charcoal whitespace-nowrap">
                {d.revenue > 0 ? (d.revenue >= 1000000 ? `PKR ${(d.revenue / 1000000).toFixed(1)}M` : `PKR ${(d.revenue / 1000).toFixed(1)}K`) : '—'}
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(d.revenue / maxRevenue) * 100}%`,
                  background: 'linear-gradient(to top, #006400, #008800)',
                  minHeight: d.revenue > 0 ? '20px' : '4px',
                  opacity: d.revenue > 0 ? 1 : 0.3
                }}
              />
              <span className="text-2xs text-mid-gray">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-ivory rounded-xl border border-brand p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Top Products (All Time)</h2>
          {TOP_PRODUCTS.length === 0 ? (
             <p className="text-sm text-mid-gray italic">No sales data yet.</p>
          ) : (
            <div className="space-y-4">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center text-xs font-bold text-emerald shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal truncate" title={p.name}>{p.name}</p>
                    <p className="text-2xs text-mid-gray">{p.sold} units sold</p>
                  </div>
                  <span className="text-sm font-semibold text-charcoal whitespace-nowrap">
                    {p.revenue >= 1000000 ? `PKR ${(p.revenue / 1000000).toFixed(1)}M` : `PKR ${(p.revenue / 1000).toFixed(0)}K`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="bg-ivory rounded-xl border border-brand p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Orders by City</h2>
          {TOP_CITIES.length === 0 ? (
            <p className="text-sm text-mid-gray italic">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {TOP_CITIES.map(c => (
                <div key={c.city}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-charcoal truncate mr-2" title={c.city}>{c.city}</span>
                    <span className="text-mid-gray whitespace-nowrap">{c.orders} orders ({c.pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.pct}%`,
                        background: 'linear-gradient(to right, #006400, #D4AF77)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-ivory rounded-xl border border-brand p-6 mt-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Payment Methods</h2>
        {PAYMENT_METHODS.length === 0 ? (
           <p className="text-sm text-mid-gray italic">No payment data yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PAYMENT_METHODS.map(p => (
              <div key={p.method} className="text-center p-4 bg-cream rounded-lg">
                <p className="font-display text-2xl font-semibold text-charcoal">{p.pct}%</p>
                <p className="text-xs font-semibold text-mid-gray mt-1 truncate" title={p.method}>{p.method}</p>
                <p className="text-2xs text-mid-gray/60">{p.orders} orders</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
