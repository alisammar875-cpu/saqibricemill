import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'
import type { Metadata } from 'next'
import { getProductBySlug } from '@/actions/products'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="pt-28 section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🌾</span>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Product Not Found</h1>
          <p className="text-mid-gray mb-6">The rice variety you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/shop" className="btn btn-emerald text-xs px-8 py-3">Browse Shop</a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  )
}
