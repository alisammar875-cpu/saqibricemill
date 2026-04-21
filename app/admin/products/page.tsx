import Link from 'next/link'
import { formatPKR } from '@/lib/formatters'
import { getAdminProducts } from '@/lib/firestore'
import { DeleteProductButton } from './DeleteProductButton'

export default async function AdminProductsPage() {
  const PRODUCTS = await getAdminProducts()
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">Products</h1>
          <p className="text-sm text-mid-gray">{PRODUCTS.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-emerald text-xs px-6 py-3">+ Add Product</Link>
      </div>

      <div className="bg-ivory rounded-xl border border-brand overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream border-b border-brand">
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Image</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Type</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Price</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Variants</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-2xs text-mid-gray font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-mid-gray">
                  <p className="text-4xl mb-3">🌾</p>
                  <p className="text-sm font-semibold">No products yet</p>
                  <p className="text-2xs mt-1">Click &quot;+ Add Product&quot; to create your first product.</p>
                </td>
              </tr>
            )}
            {PRODUCTS.map((p: any) => {
              const primaryImage = p.images?.find((img: any) => img.isPrimary)?.url ?? p.images?.[0]?.url
              const totalStock = (p.variants ?? []).reduce((sum: number, v: any) => sum + Number(v.stock ?? 0), 0)
              
              return (
                <tr key={p.id} className="border-b border-brand/50 hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    {primaryImage ? (
                      <img src={primaryImage} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-brand" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cream flex items-center justify-center text-xl border border-brand">🌾</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-charcoal">{p.name}</p>
                    <p className="text-2xs text-mid-gray font-mono">{p.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-2xs text-mid-gray">{(p.riceType ?? '').replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 font-semibold">{formatPKR(p.basePrice)}</td>
                  <td className="px-6 py-4">
                    <span className={totalStock < 50 ? 'text-red-600 font-semibold' : 'text-charcoal'}>
                      {p.variants?.length ?? 0} ({totalStock} units)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-2xs font-semibold rounded-full ${p.isActive ? 'bg-emerald/10 text-emerald' : 'bg-red-50 text-red-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {p.isFeatured && (
                      <span className="ml-1.5 px-2 py-0.5 text-2xs font-semibold rounded-full bg-gold/20 text-gold-dark">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/products/${p.id}`} className="text-2xs font-semibold text-emerald hover:text-gold">
                        Edit
                      </Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
