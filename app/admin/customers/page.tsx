import { getAdminCustomers } from '@/lib/firestore'

export default async function AdminCustomersPage() {
  const CUSTOMERS = await getAdminCustomers()
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Customers</h1>
        <p className="text-sm text-mid-gray">{CUSTOMERS.length} registered customers</p>
      </div>

      <div className="bg-ivory rounded-xl border border-brand overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-brand">
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Phone</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">City</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Orders</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Total Spent</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c: any) => (
              <tr key={c.id} className="border-b border-brand/50 hover:bg-cream/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-charcoal">{c.name}</p>
                  <p className="text-2xs text-mid-gray">{c.email}</p>
                </td>
                <td className="px-6 py-4 text-mid-gray text-2xs">{c.phone}</td>
                <td className="px-6 py-4 text-mid-gray">{c.city}</td>
                <td className="px-6 py-4 font-semibold text-charcoal">{c.orders}</td>
                <td className="px-6 py-4 font-semibold text-charcoal">PKR {c.spent.toLocaleString()}</td>
                <td className="px-6 py-4 text-2xs text-mid-gray">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
