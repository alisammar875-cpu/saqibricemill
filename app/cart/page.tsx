'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/formatters'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'

export default function CartPage() {
  const { items, updateQty, removeItem, total, clearCart } = useCartStore()
  const subtotal = total()
  const shipping = subtotal >= 5000 ? 0 : 350
  const grandTotal = subtotal + shipping

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28 section-pad min-h-[70vh]">
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-2">Shopping Cart</h1>
        <p className="text-mid-gray mb-10">{items.length === 0 ? 'Your cart is empty' : `${items.length} item${items.length > 1 ? 's' : ''} in your cart`}</p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-4xl mx-auto mb-6">🌾</div>
            <h2 className="font-display text-xl font-semibold text-charcoal mb-2">Your cart is empty</h2>
            <p className="text-sm text-mid-gray mb-6">Add some premium rice to get started</p>
            <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Shop Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-ivory rounded-xl border border-brand p-6 flex gap-6">
                  {/* Product image placeholder */}
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(145deg,#0F1A0F,#1E3020)' }}>🌾</div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} className="font-display text-base font-semibold text-charcoal hover:text-emerald transition-colors">
                      {item.name}
                    </Link>
                    {item.variantName && <p className="text-2xs text-mid-gray mt-0.5">{item.variantName}</p>}
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-brand flex items-center justify-center text-sm hover:border-gold transition-all">−</button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-brand flex items-center justify-center text-sm hover:border-gold transition-all">+</button>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-4 text-2xs text-mid-gray hover:text-red-500 transition-colors">Remove</button>
                    </div>
                  </div>
                  <div className="font-display text-lg font-semibold text-charcoal flex-shrink-0">
                    {formatPKR(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <button onClick={clearCart} className="text-2xs text-mid-gray hover:text-red-500 transition-colors">
                Clear entire cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-ivory rounded-xl border border-brand p-7 h-fit sticky top-32">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-5">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Subtotal</span>
                  <span className="text-charcoal">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mid-gray">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald font-semibold">Free ✓</span>
                  ) : (
                    <span className="text-charcoal">{formatPKR(shipping)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-2xs text-mid-gray">Add {formatPKR(5000 - subtotal)} more for free shipping</p>
                )}
              </div>
              <div className="flex justify-between items-baseline border-t border-brand pt-4 mb-6">
                <span className="font-semibold">Total</span>
                <span className="font-display text-xl font-semibold">{formatPKR(grandTotal)}</span>
              </div>
              <Link href="/checkout" className="block w-full text-center btn btn-emerald py-4 justify-center text-sm">
                Proceed to Checkout →
              </Link>
              <Link href="/shop" className="block text-center mt-3 text-xs text-mid-gray hover:text-gold transition-colors">
                ← Continue Shopping
              </Link>
              <div className="text-center mt-4 text-2xs text-mid-gray flex items-center justify-center gap-1.5">
                🔒 Secure checkout · SSL encrypted · COD available
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
