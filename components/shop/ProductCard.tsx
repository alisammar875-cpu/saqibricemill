'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPKR, calcDiscount } from '@/lib/formatters'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    slug: string
    name: string
    nameUrdu?: string | null
    description: string
    basePrice: any
    comparePrice?: any
    isNew: boolean
    organic: boolean
    images: { url: string; altText?: string | null }[]
    variants: { id: string; name: string; weight: number; priceOffset: any; stock: number }[]
    category: { name: string; slug: string }
    reviews: { rating: number }[]
    _count?: { reviews: number }
  }
  avgRating?: number
  className?: string
}

export function ProductCard({ product, avgRating = 0, className = '' }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore(s => s.addItem)

  const baseVariant = product.variants[0]
  const price = Number(product.basePrice) + Number(baseVariant?.priceOffset ?? 0)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null
  const discount = comparePrice ? calcDiscount(comparePrice, price) : null
  const reviewCount = product._count?.reviews ?? product.reviews.length
  const primaryImage = product.images[0]

  const badge = product.isNew
    ? { label: 'New Harvest', style: 'bg-gold text-dark' }
    : product.organic
    ? { label: 'Organic', style: 'bg-emerald text-white' }
    : discount && discount >= 10
    ? { label: `${discount}% Off`, style: 'bg-charcoal text-gold' }
    : avgRating >= 4.5 && reviewCount >= 100
    ? { label: 'Bestseller', style: 'bg-emerald text-white' }
    : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!baseVariant || baseVariant.stock === 0) return
    setAdding(true)
    addItem({
      id: `${product.id}-${baseVariant?.id ?? ''}`,
      productId: product.id,
      variantId: baseVariant?.id,
      name: product.name,
      variantName: baseVariant?.name,
      price,
      imageUrl: primaryImage?.url,
      slug: product.slug,
      stock: baseVariant?.stock ?? 99,
    })
    toast.success(`${product.name} added to cart`, {
      description: baseVariant?.name,
      icon: '🌾',
    })
    setTimeout(() => setAdding(false), 1400)
  }

  const stars = Math.round(avgRating)

  return (
    <div className={`group relative bg-ivory rounded-lg overflow-hidden border border-brand transition-all duration-500 hover:-translate-y-1.5 hover:shadow-deep hover:border-gold/40 ${className}`}>
      <Link href={`/product/${product.slug}`}>
        {/* Image area */}
        <div className="relative h-60 overflow-hidden bg-cream">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            /* CSS placeholder */
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(145deg,#0F1A0F,#1E3020)' }}>
              <div className="relative">
                {/* Rice bag SVG art */}
                <div
                  className="w-[120px] h-[165px] rounded-[18px_18px_26px_26px] flex flex-col items-center justify-center relative"
                  style={{ background: 'linear-gradient(145deg,#007A00,#004A00,#002800)', boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
                >
                  <div className="absolute top-7 left-2.5 right-2.5 h-11 rounded-lg" style={{ background: 'rgba(212,175,119,0.25)' }} />
                  <span className="font-display text-[0.7rem] font-bold tracking-[0.15em] uppercase text-center leading-snug z-10" style={{ color: 'var(--gold)' }}>
                    SAQIB<br/>RICE MILLS
                  </span>
                  <span className="absolute bottom-4 text-[0.6rem] tracking-[0.1em] uppercase" style={{ color: 'rgba(212,175,119,0.7)' }}>
                    {baseVariant ? `${baseVariant.weight / 1000}KG` : ''}
                  </span>
                </div>
                {/* Scattered grains */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="absolute w-1 h-2.5 rounded-full opacity-30" style={{ background: 'var(--gold)', top: `${20 + i * 12}%`, left: i % 2 === 0 ? `${5 + i * 3}%` : 'auto', right: i % 2 !== 0 ? `${5 + i * 3}%` : 'auto', transform: `rotate(${-30 + i * 15}deg)` }} />
                ))}
              </div>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <span className={`absolute top-3.5 left-3.5 px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full z-10 ${badge.style}`}>
              {badge.label}
            </span>
          )}

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(v => !v) }}
            className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 ${wishlisted ? 'bg-gold text-dark opacity-100' : 'bg-white/90 text-mid-gray hover:bg-gold hover:text-dark'}`}
          >
            {wishlisted ? '♥' : '♡'}
          </button>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-2xs font-semibold tracking-widest uppercase text-emerald mb-1.5">{product.category.name}</p>
          <h3 className="font-display text-[1.25rem] font-semibold text-charcoal leading-tight mb-1.5 group-hover:text-emerald transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.nameUrdu && (
            <p className="font-urdu text-xs text-mid-gray mb-2 leading-relaxed">{product.nameUrdu}</p>
          )}

          {/* Stars */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className="text-xs" style={{ color: n <= stars ? 'var(--gold)' : 'var(--light-gray)' }}>★</span>
                ))}
              </div>
              <span className="text-2xs text-mid-gray">({reviewCount})</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[1.35rem] font-semibold text-charcoal">
                {formatPKR(price)}
              </span>
              {baseVariant && (
                <span className="text-2xs text-mid-gray">/{baseVariant.name}</span>
              )}
              {comparePrice && comparePrice > price && (
                <span className="text-xs text-mid-gray line-through">{formatPKR(comparePrice)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={adding || (baseVariant?.stock ?? 0) === 0}
          className={`w-full btn text-2xs py-2.5 justify-center transition-all duration-400 ${
            adding
              ? 'bg-gold text-dark'
              : baseVariant?.stock === 0
              ? 'bg-light-gray text-mid-gray cursor-not-allowed'
              : 'bg-emerald text-white hover:bg-emerald-light'
          }`}
        >
          {baseVariant?.stock === 0 ? (
            'Out of Stock'
          ) : adding ? (
            <>✓ Added to Cart</>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  )
}