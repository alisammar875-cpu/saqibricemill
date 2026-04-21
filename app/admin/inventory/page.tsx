import { formatPKR } from '@/lib/formatters'
import { getInventoryRows } from '@/lib/firestore'

export default async function AdminInventoryPage() {
  const INVENTORY = await getInventoryRows()
  const lowCount = INVENTORY.filter(i => i.status === 'LOW' || i.status === 'CRITICAL').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Inventory Management</h1>
          <p className="text-sm text-mid-gray">
            {INVENTORY.length} SKUs tracked · {lowCount > 0 && (
              <span className="text-red-600 font-semibold">{lowCount} items need restocking</span>
            )}
          </p>
        </div>
        <button className="btn btn-emerald text-xs px-6 py-3">📥 Factory Restock</button>
      </div>

      {/* Stock summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total SKUs', value: INVENTORY.length, icon: '📦', color: 'text-charcoal' },
          { label: 'In Stock', value: INVENTORY.filter(i => i.status === 'OK').length, icon: '✅', color: 'text-emerald' },
          { label: 'Low Stock', value: INVENTORY.filter(i => i.status === 'LOW').length, icon: '⚠️', color: 'text-yellow-600' },
          { label: 'Critical', value: INVENTORY.filter(i => i.status === 'CRITICAL').length, icon: '🔴', color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-ivory rounded-xl border border-brand p-5 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`font-display text-xl font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-2xs text-mid-gray uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-ivory rounded-xl border border-brand overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-brand">
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">SKU</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Variant</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Reorder Level</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Last Restock</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map(item => (
              <tr key={item.sku} className={`border-b border-brand/50 hover:bg-cream/50 transition-colors ${item.status === 'CRITICAL' ? 'bg-red-50/50' : item.status === 'LOW' ? 'bg-yellow-50/50' : ''}`}>
                <td className="px-6 py-4 font-mono text-2xs text-mid-gray">{item.sku}</td>
                <td className="px-6 py-4 font-semibold text-charcoal">{item.product}</td>
                <td className="px-6 py-4 text-mid-gray">{item.variant}</td>
                <td className="px-6 py-4">
                  <span className={`font-semibold ${item.status === 'CRITICAL' ? 'text-red-600' : item.status === 'LOW' ? 'text-yellow-600' : 'text-charcoal'}`}>
                    {item.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-mid-gray">{item.reorder}</td>
                <td className="px-6 py-4 text-2xs text-mid-gray">{item.lastRestock}</td>
                <td className="px-6 py-4">
                  <span className={[
                    'px-2 py-0.5 text-2xs font-semibold rounded-full',
                    item.status === 'OK' ? 'bg-emerald/10 text-emerald' :
                    item.status === 'LOW' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700',
                  ].join(' ')}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-2xs font-semibold text-emerald hover:text-gold transition-colors">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
