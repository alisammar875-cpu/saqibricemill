'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/formatters'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface ProductDetailClientProps {
  product: {
    id: string
    slug: string
    name: string
    nameUrdu?: string | null
    description: string
    longDescription?: string | null
    basePrice: number
    comparePrice?: number | null
    riceType: string
    grainLength?: string | null
    ageMonths?: number | null
    origin?: string | null
    harvestYear?: number | null
    cookingTime?: number | null
    proteinPer100g?: number | null
    caloriesPer100g?: number | null
    glutenFree?: boolean
    organic?: boolean
    isNew?: boolean
    category: { name: string; slug: string }
    variants: { id: string; name: string; weight: number; priceOffset: number; stock: number; isActive?: boolean }[]
    images: { url: string; altText?: string | null; isPrimary?: boolean }[]
    reviews: { rating: number; title?: string; body?: string; userName?: string; user?: { firstName: string; lastName: string }; createdAt?: string }[]
    tags?: string[]
  }
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description')
  const addItem = useCartStore(s => s.addItem)

  const variant = product.variants?.[selectedVariant] || product.variants?.[0]
  const price = Number(product.basePrice || 0) + (variant?.priceOffset ?? 0)
  const avgRating = (product.reviews?.length ?? 0)
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0
  const stars = Math.round(avgRating)

  const handleAddToCart = () => {
    if (!variant || variant.stock === 0) return
    addItem({
      id: `${product.id}-${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantName: variant.name,
      price,
      imageUrl: undefined,
      slug: product.slug,
      stock: variant.stock,
    })
    toast.success(`${product.name} added to cart`, { description: variant.name, icon: '🌾' })
  }

  return (
    <div className="section-pad">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-2xs text-mid-gray mb-8">
        <Link href="/" className="hover:text-gold transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?cat=${product.category?.slug || 'rice'}`} className="hover:text-gold transition-colors">
          {product.category?.name || 'Rice'}
        </Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
        {/* Left: Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden h-[450px] md:h-[550px]"
          style={{ background: 'linear-gradient(145deg, #0F1A0F, #1E3020)' }}
        >
          {product.images?.[0]?.url ? (
            <img 
              src={product.images[0].url} 
              alt={product.images[0].altText || product.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                className="w-[180px] h-[240px] rounded-[24px_24px_32px_32px] flex flex-col items-center justify-center relative"
                style={{
                  background: 'linear-gradient(145deg,#007A00,#004A00,#002800)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.4)',
                }}
              >
                <div className="absolute top-8 left-4 right-4 h-14 rounded-lg" style={{ background: 'rgba(212,175,119,0.25)' }} />
                <span className="font-display text-sm font-bold tracking-[0.15em] uppercase text-center leading-snug z-10" style={{ color: '#D4AF77' }}>
                  SAQIB<br />RICE MILLS
                </span>
                <span className="absolute bottom-5 text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(212,175,119,0.7)' }}>
                  {variant ? `${variant.weight / 1000}KG` : ''}
                </span>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-gold text-dark">New Harvest</span>
            )}
            {product.organic && (
              <span className="px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-emerald text-white">Organic</span>
            )}
            {product.glutenFree && (
              <span className="px-3 py-1 text-2xs font-semibold tracking-wider uppercase rounded-full bg-charcoal text-gold">Gluten Free</span>
            )}
          </div>
        </motion.div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="eyebrow text-emerald mb-2">{product.category?.name || 'Rice'}</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-charcoal leading-tight mb-2">
            {product.name}
          </h1>
          {product.nameUrdu && (
            <p className="text-lg text-mid-gray mb-4" style={{ fontFamily: 'Noto Nastaliq Urdu, serif' }}>
              {product.nameUrdu}
            </p>
          )}

          {/* Rating */}
          {(product.reviews?.length ?? 0) > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className="text-base" style={{ color: n <= stars ? '#D4AF77' : '#D1D1C7' }}>★</span>
                ))}
              </div>
              <span className="text-sm text-mid-gray">{avgRating.toFixed(1)} ({product.reviews.length} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-semibold text-charcoal">{formatPKR(price)}</span>
            {product.comparePrice && product.comparePrice > price && (
              <span className="text-lg text-mid-gray line-through">{formatPKR(product.comparePrice)}</span>
            )}
          </div>

          <p className="text-sm text-mid-gray font-light leading-relaxed mb-8">{product.description}</p>

          {/* Variant Selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-3">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {(product.variants || []).map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVariant(i); setQuantity(1) }}
                  className={[
                    'px-5 py-3 rounded-lg border text-sm font-semibold transition-all duration-300',
                    selectedVariant === i
                      ? 'border-emerald bg-emerald/10 text-emerald'
                      : 'border-brand bg-ivory text-charcoal hover:border-gold',
                    v.stock === 0 ? 'opacity-40 cursor-not-allowed' : '',
                  ].join(' ')}
                  disabled={v.stock === 0}
                >
                  {v.name}
                  <span className="block text-2xs font-normal text-mid-gray mt-0.5">
                    {formatPKR(Number(product.basePrice || 0) + v.priceOffset)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border border-brand flex items-center justify-center text-lg text-charcoal hover:border-gold hover:text-gold transition-all"
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(variant?.stock ?? 99, q + 1))}
                className="w-10 h-10 rounded-full border border-brand flex items-center justify-center text-lg text-charcoal hover:border-gold hover:text-gold transition-all"
              >
                +
              </button>
              {variant && (
                <span className="text-2xs text-mid-gray ml-2">{variant.stock} in stock</span>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={!variant || variant.stock === 0}
              className="flex-1 btn btn-emerald py-4 justify-center text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Add to Cart — {formatPKR(price * quantity)}
            </button>
          </div>

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: '🚚', text: 'Free shipping above PKR 5,000' },
              { icon: '🔄', text: '7-day return policy' },
              { icon: '🔒', text: 'Secure checkout' },
              { icon: '📦', text: 'Factory sealed packaging' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2 text-2xs text-mid-gray">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Quick Info */}
          {(product.origin || product.grainLength || product.ageMonths) && (
            <div className="border-t border-brand pt-6 space-y-2">
              {product.origin && (
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Origin</span>
                  <span className="font-semibold text-charcoal">{product.origin}</span>
                </div>
              )}
              {product.grainLength && (
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Grain Length</span>
                  <span className="font-semibold text-charcoal">{product.grainLength.replace('_', ' ')}</span>
                </div>
              )}
              {product.ageMonths && (
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Aged</span>
                  <span className="font-semibold text-charcoal">{product.ageMonths} months</span>
                </div>
              )}
              {product.cookingTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Cooking Time</span>
                  <span className="font-semibold text-charcoal">{product.cookingTime} minutes</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Tabs: Description / Nutrition / Reviews */}
      <div className="border-t border-brand pt-12 mb-20">
        <div className="flex gap-8 mb-8 border-b border-brand">
          {(['description', 'nutrition', 'reviews'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'pb-4 text-sm font-semibold tracking-wider uppercase transition-all border-b-2',
                activeTab === tab
                  ? 'border-gold text-charcoal'
                  : 'border-transparent text-mid-gray hover:text-charcoal',
              ].join(' ')}
            >
              {tab === 'reviews' ? `Reviews (${product.reviews.length})` : tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="max-w-3xl">
            {product.longDescription?.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-mid-gray font-light leading-relaxed mb-4">{para}</p>
            )) || <p className="text-sm text-mid-gray font-light leading-relaxed">{product.description}</p>}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="max-w-md">
            <h3 className="font-display text-xl font-semibold text-charcoal mb-6">Nutritional Information</h3>
            <p className="text-2xs text-mid-gray mb-4">Per 100g serving (uncooked)</p>
            <div className="border border-brand rounded-xl overflow-hidden">
              {[
                { label: 'Calories', value: product.caloriesPer100g ? `${product.caloriesPer100g} kcal` : '~350 kcal' },
                { label: 'Protein', value: product.proteinPer100g ? `${product.proteinPer100g}g` : '~7g' },
                { label: 'Carbohydrates', value: '78g' },
                { label: 'Fat', value: '0.6g' },
                { label: 'Fiber', value: product.riceType === 'BROWN_BASMATI' ? '3.5g' : '0.4g' },
                { label: 'Sodium', value: '5mg' },
                { label: 'Gluten', value: product.glutenFree ? 'Free ✓' : 'Contains gluten' },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`flex justify-between px-5 py-3 text-sm ${i % 2 === 0 ? 'bg-cream' : 'bg-ivory'}`}
                >
                  <span className="text-mid-gray">{row.label}</span>
                  <span className="font-semibold text-charcoal">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-2xl">
            {/* Write a Review */}
            <div className="bg-ivory rounded-xl p-8 border border-brand mb-10">
              <h3 className="font-display text-xl font-semibold text-charcoal mb-6">Write a Review</h3>
              <ReviewForm productId={product.id} />
            </div>

            {(product.reviews?.length ?? 0) === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">⭐</span>
                <p className="text-mid-gray italic">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(product.reviews || []).map((review, i) => (
                  <div key={i} className="bg-ivory rounded-xl p-6 border border-brand transition-all hover:border-gold/30">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <span key={n} className="text-sm" style={{ color: n <= review.rating ? '#D4AF77' : '#D1D1C7' }}>★</span>
                        ))}
                      </div>
                      {review.title && <span className="text-sm font-semibold text-charcoal">{review.title}</span>}
                    </div>
                    {review.body && <p className="text-sm text-mid-gray font-light leading-relaxed mb-3">{review.body}</p>}
                    <div className="flex items-center gap-2 text-2xs text-mid-gray">
                      <span className="font-semibold text-emerald">{review.userName || 'Verified Buyer'}</span>
                      {review.createdAt && (
                        <span>· {new Date(review.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [userName, setUserName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { addProductReview } = await import('@/actions/reviews')
      const res = await addProductReview(productId, { rating, title, body, userName })
      if (res.success) {
        toast.success('Review submitted successfully!')
        setTitle('')
        setBody('')
        setUserName('')
      } else {
        toast.error(res.error || 'Failed to submit review')
      }
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-charcoal uppercase tracking-wider">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="text-xl transition-transform hover:scale-110"
              style={{ color: n <= rating ? '#D4AF77' : '#D1D1C7' }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          placeholder="Your Name *" required value={userName}
          onChange={e => setUserName(e.target.value)}
          className="px-4 py-3 rounded-lg border border-brand bg-white text-sm focus:outline-none focus:border-gold transition-colors" />
        <input 
          placeholder="Review Title *" required value={title}
          onChange={e => setTitle(e.target.value)}
          className="px-4 py-3 rounded-lg border border-brand bg-white text-sm focus:outline-none focus:border-gold transition-colors" />
      </div>
      <textarea 
        placeholder="Share your experience with this rice..." required rows={4} value={body}
        onChange={e => setBody(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-brand bg-white text-sm focus:outline-none focus:border-gold transition-colors resize-none" />
      <button 
        disabled={submitting}
        className="btn btn-emerald text-xs px-10 py-3 disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
