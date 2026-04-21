'use client'

const MONTHLY_DATA = [
  { month: 'Nov', revenue: 1800000, orders: 142 },
  { month: 'Dec', revenue: 2100000, orders: 168 },
  { month: 'Jan', revenue: 1950000, orders: 155 },
  { month: 'Feb', revenue: 2300000, orders: 178 },
  { month: 'Mar', revenue: 2150000, orders: 172 },
  { month: 'Apr', revenue: 2450000, orders: 187 },
]

const TOP_PRODUCTS = [
  { name: '1121 Super Basmati 5kg', sold: 245, revenue: 1004500 },
  { name: 'Super Basmati Classic 1kg', sold: 380, revenue: 247000 },
  { name: '1121 Basmati Bulk 25kg', sold: 42, revenue: 777000 },
  { name: 'IRRI-9 Everyday 1kg', sold: 520, revenue: 197600 },
  { name: 'Organic Brown Basmati 1kg', sold: 180, revenue: 171000 },
]

const TOP_CITIES = [
  { city: 'Karachi', orders: 52, pct: 28 },
  { city: 'Lahore', orders: 38, pct: 20 },
  { city: 'Islamabad', orders: 28, pct: 15 },
  { city: 'Faisalabad', orders: 22, pct: 12 },
  { city: 'Rawalpindi', orders: 18, pct: 10 },
  { city: 'Other', orders: 29, pct: 15 },
]

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map(d => d.revenue))

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Analytics</h1>
        <p className="text-sm text-mid-gray">Business performance overview — last 6 months</p>
      </div>

      {/* Revenue Chart (CSS-based) */}
      <div className="bg-ivory rounded-xl border border-brand p-8 mb-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Monthly Revenue</h2>
        <div className="flex items-end gap-4 h-48">
          {MONTHLY_DATA.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-2xs font-semibold text-charcoal">
                PKR {(d.revenue / 1000000).toFixed(1)}M
              </span>
              <div
                className="w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(d.revenue / maxRevenue) * 100}%`,
                  background: 'linear-gradient(to top, #006400, #008800)',
                  minHeight: '20px',
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
          <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Top Products (This Month)</h2>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-emerald/10 flex items-center justify-center text-xs font-bold text-emerald">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-charcoal truncate">{p.name}</p>
                  <p className="text-2xs text-mid-gray">{p.sold} units sold</p>
                </div>
                <span className="text-sm font-semibold text-charcoal">
                  PKR {(p.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-ivory rounded-xl border border-brand p-6">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Orders by City</h2>
          <div className="space-y-4">
            {TOP_CITIES.map(c => (
              <div key={c.city}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-charcoal">{c.city}</span>
                  <span className="text-mid-gray">{c.orders} orders ({c.pct}%)</span>
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
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-ivory rounded-xl border border-brand p-6 mt-8">
        <h2 className="font-display text-lg font-semibold text-charcoal mb-6">Payment Methods</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { method: 'COD', pct: 42, orders: 79 },
            { method: 'JazzCash', pct: 22, orders: 41 },
            { method: 'Card (Stripe)', pct: 18, orders: 34 },
            { method: 'EasyPaisa', pct: 12, orders: 22 },
            { method: 'Bank Transfer', pct: 6, orders: 11 },
          ].map(p => (
            <div key={p.method} className="text-center p-4 bg-cream rounded-lg">
              <p className="font-display text-2xl font-semibold text-charcoal">{p.pct}%</p>
              <p className="text-xs font-semibold text-mid-gray mt-1">{p.method}</p>
              <p className="text-2xs text-mid-gray/60">{p.orders} orders</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
