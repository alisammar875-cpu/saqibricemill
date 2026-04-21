import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { ShopContent } from '@/components/shop/ShopContent'
import { ProductCardSkeleton } from '@/components/shop/ProductCardSkeleton'
import type { Metadata } from 'next'
import { getProducts } from '@/actions/products'

export const metadata: Metadata = {
  title: 'Shop Premium Rice',
  description: 'Browse our complete collection of premium basmati, IRRI, and specialty rice varieties. Direct factory pricing with free delivery above PKR 5,000.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sort?: string; min?: string; max?: string; q?: string; page?: string }>
}) {
  const sp = await searchParams
  const data = await getProducts({
    category: sp.cat,
    sort: sp.sort as any,
    search: sp.q,
    page: Number(sp.page ?? 1),
  })

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28">
        {/* Hero Banner */}
        <section
          className="py-16 md:py-20 text-center"
          style={{ background: 'linear-gradient(135deg, #001800 0%, #003300 50%, #001200 100%)' }}
        >
          <div className="px-6 max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
              Our <em className="italic" style={{ color: '#D4AF77' }}>Rice</em> Collection
            </h1>
            <p className="text-white/50 font-light leading-relaxed">
              Premium basmati and specialty rice, sourced from the finest fields of Punjab.
              Every bag is triple-cleaned, stone-sorted, and aged for optimal quality.
            </p>
          </div>
        </section>

        <Suspense
          fallback={
            <section className="section-pad">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </section>
          }
        >
          <ShopContent searchParams={sp} initialProducts={data.products as any[]} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
