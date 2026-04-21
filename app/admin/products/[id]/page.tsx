import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByIdFromDb } from '@/lib/firestore'
import { ProductEditForm } from './ProductEditForm'

export default async function AdminProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductByIdFromDb(id)

  if (!product) return notFound()

  return (
    <div>
      <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
        <Link href="/admin/products" className="hover:text-gold transition-colors">Products</Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">{product.name}</span>
      </div>

      <h1 className="font-display text-2xl font-semibold text-charcoal mb-8">Edit Product</h1>

      <ProductEditForm product={product} />
    </div>
  )
}
