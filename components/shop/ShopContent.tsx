'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatPKR } from '@/lib/formatters'

const RICE_TYPES = [
  { label: 'All', value: '' },
  { label: '1121 Basmati', value: 'BASMATI_1121' },
  { label: 'Super Basmati', value: 'BASMATI_SUPER' },
  { label: 'IRRI-6', value: 'IRRI_6' },
  { label: 'IRRI-9', value: 'IRRI_9' },
  { label: 'Brown Basmati', value: 'BROWN_BASMATI' },
  { label: 'Sella', value: 'SELLA_BASMATI' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
]



interface ShopContentProps {
  searchParams: { cat?: string; sort?: string; min?: string; max?: string; q?: string; page?: string }
  initialProducts?: any[]
}

export function ShopContent({ searchParams, initialProducts }: ShopContentProps) {
  const normalizeCategory = (cat?: string) => {
    if (!cat) return ''
    if (cat === 'premium-basmati') return 'BASMATI_1121'
    return cat
  }

  const [activeType, setActiveType] = useState(normalizeCategory(searchParams.cat))
  const [sortBy, setSortBy] = useState(searchParams.sort || 'featured')
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '')

  const filtered = useMemo(() => {
    let products = [...(initialProducts || [])]

    if (activeType) {
      products = products.filter(p => p.riceType === activeType)
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    }

    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.basePrice - b.basePrice)
        break
      case 'price-desc':
        products.sort((a, b) => b.basePrice - a.basePrice)
        break
      case 'newest':
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return products
  }, [activeType, sortBy, searchQuery])

  const avgRating = (reviews: { rating: number }[]) =>
    reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <section className="section-pad">
      {/* Filter bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        {/* Type filters */}
        <div className="flex flex-wrap gap-2">
          {RICE_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setActiveType(t.value)}
              className={[
                'px-4 py-2 rounded-full text-2xs font-semibold tracking-wider uppercase transition-all duration-300 border',
                activeType === t.value
                  ? 'bg-emerald text-white border-emerald'
                  : 'bg-ivory text-mid-gray border-brand hover:border-gold hover:text-gold',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search rice..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-brand bg-ivory text-sm text-charcoal placeholder:text-mid-gray/50 focus:outline-none focus:border-gold transition-colors w-48"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-brand bg-ivory text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
          >
            {SORT_OPTIONS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-mid-gray mb-6">
        Showing <span className="font-semibold text-charcoal">{filtered.length}</span> products
      </p>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl mb-4 block">🌾</span>
          <h3 className="font-display text-xl font-semibold text-charcoal mb-2">No products found</h3>
          <p className="text-sm text-mid-gray">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filtered.map(product => {
            const baseVariant = product.variants?.[0]
            const price = Number(product.basePrice || 0) + (baseVariant?.priceOffset ?? 0)
            const rating = avgRating(product.reviews || [])
            const stars = Math.round(rating)
            const discount = product.comparePrice
              ? Math.round(((product.comparePrice - price) / product.comparePrice) * 100)
              : null

            return (
              <div
                key={product.id}
                className="group relative bg-ivory rounded-lg overflow-hidden border border-brand transition-all duration-500 hover:-translate-y-1.5 hover:shadow-deep hover:border-gold/40"
              >
                <Link href={`/product/${product.slug}`}>
                  {/* Image placeholder */}
                  <div
                    className="relative h-60 flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(145deg,#0F1A0F,#1E3020)' }}
                  >
                    {product.images?.[0]?.url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.images[0].altText || product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="relative">
                        <div
                          className="w-[120px] h-[165px] rounded-[18px_18px_26px_26px] flex flex-col items-center justify-center"
                          style={{
                            background: 'linear-gradient(145deg,#007A00,#004A00,#002800)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                          }}
                        >
                          <span
                            className="font-display text-[0.7rem] font-bold tracking-[0.15em] uppercase text-center leading-snug z-10"
                            style={{ color: '#D4AF77' }}
                          >
                            SAQIB<br />RICE MILLS
                          </span>
                          <span
                            className="absolute bottom-4 text-[0.6rem] tracking-[0.1em] uppercase"
                            style={{ color: 'rgba(212,175,119,0.7)' }}
                          >
                            {baseVariant ? `${baseVariant.weight / 1000}KG` : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badge */}
                    {product.isNew && (
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-gold text-dark z-10">
                        New Harvest
                      </span>
                    )}
                    {product.organic && !product.isNew && (
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-emerald text-white z-10">
                        Organic
                      </span>
                    )}
                    {discount && discount >= 10 && !product.isNew && !product.organic && (
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-charcoal text-gold z-10">
                        {discount}% Off
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-2xs font-semibold tracking-widest uppercase text-emerald mb-1.5">
                      {product.category?.name || 'Rice'}
                    </p>
                    <h3 className="font-display text-[1.25rem] font-semibold text-charcoal leading-tight mb-1.5 group-hover:text-emerald transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.nameUrdu && (
                      <p className="text-xs text-mid-gray mb-2 leading-relaxed" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
                        {product.nameUrdu}
                      </p>
                    )}

                    {/* Stars */}
                    {(product.reviews?.length ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(n => (
                            <span key={n} className="text-xs" style={{ color: n <= stars ? '#D4AF77' : '#D1D1C7' }}>★</span>
                          ))}
                        </div>
                        <span className="text-2xs text-mid-gray">({product.reviews.length})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-[1.35rem] font-semibold text-charcoal">
                        {formatPKR(price)}
                      </span>
                      {baseVariant && (
                        <span className="text-2xs text-mid-gray">/{baseVariant.name}</span>
                      )}
                      {product.comparePrice && (
                        <span className="text-xs text-mid-gray line-through">{formatPKR(product.comparePrice)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
