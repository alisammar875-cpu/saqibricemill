// components/home/BestsellerProducts.tsx
import Link from 'next/link'
import { getFeaturedProducts, getAverageRating } from '@/actions/products'
import { ProductCard } from '@/components/shop/ProductCard'

export async function BestsellerProducts() {
  const products = await getFeaturedProducts()

  return (
    <section className="section-pad bg-warm">
      <div className="section-header flex justify-between items-end flex-wrap gap-5 mb-14 reveal">
        <div>
          <div className="eyebrow text-emerald mb-3">Bestsellers</div>
          <h2 className="display-lg text-charcoal">
            Our <em className="italic text-emerald">Finest</em> Selection
          </h2>
          <p className="text-mid-gray font-light text-base leading-relaxed mt-3 max-w-lg">
            Every bag is stone-sorted, triple-cleaned, and aged for optimal aroma and texture.
          </p>
        </div>
        <Link href="/shop" className="view-all inline-flex items-center gap-2 text-2xs font-semibold tracking-widest2 uppercase text-emerald border-b border-gold pb-0.5 hover:text-gold transition-colors">
          Browse Full Shop →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {products.map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            avgRating={getAverageRating(product.reviews)}
            className={`reveal reveal-delay-${Math.min(i + 1, 5)}`}
          />
        ))}
      </div>
    </section>
  )
}
