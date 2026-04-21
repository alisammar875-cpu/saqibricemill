'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/formatters'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { toast } from 'sonner'
import { placeOrder } from '@/actions/orders'

const STEPS = ['Address', 'Shipping', 'Payment']

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)

  const [address, setAddress] = useState({
    fullName: '', phone: '', email: '', line1: '', city: '', province: 'Punjab', postalCode: '',
  })
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState('COD')

  const subtotal = total()
  const shippingCost = subtotal >= 5000 ? 0 : shipping === 'express' ? 500 : 350
  const grandTotal = subtotal + shippingCost

  const handlePlaceOrder = async () => {
    setIsPlacing(true)
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        slug: item.slug,
      }))

      const res = await placeOrder({
        items: orderItems,
        subtotal,
        shippingCost,
        total: grandTotal,
        shippingMethod: shipping,
        paymentMethod: payment,
        guestName: address.fullName,
        guestEmail: address.email,
        guestPhone: address.phone,
        shippingAddress: {
          line1: address.line1,
          city: address.city,
          province: address.province,
          postalCode: address.postalCode,
        },
      })

      if (res.success) {
        setOrderId(res.orderId!)
        setCompleted(true)
        clearCart()
        toast.success(`Order placed successfully!`)
      } else {
        toast.error(res.error || 'Failed to place order')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsPlacing(false)
    }
  }

  if (items.length === 0 && !completed) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="pt-28 section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🛒</span>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Your cart is empty</h1>
          <p className="text-mid-gray mb-6">Add some premium rice to get started.</p>
          <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Shop Now</Link>
        </main>
        <Footer />
      </>
    )
  }

  if (completed) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <main className="pt-28 section-pad text-center min-h-[70vh] flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center text-4xl mb-6">✓</div>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Order Confirmed!</h1>
          <p className="text-mid-gray mb-2 max-w-md">
            Thank you for your order. We&apos;re preparing your premium rice for dispatch
            from our factory in Gujranwala.
          </p>
          <p className="text-sm font-semibold text-emerald mb-1">Order ID: {orderId}</p>
          <p className="text-sm text-mid-gray mb-8">A confirmation email will be sent to your inbox.</p>
          <div className="flex gap-4">
            <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Continue Shopping</Link>
            <Link href="/account" className="btn btn-outline-gold text-xs px-6 py-3">My Account</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28 section-pad">
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-8">Checkout</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                    i <= step ? 'bg-emerald text-white' : 'bg-cream text-mid-gray border border-brand',
                  ].join(' ')}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-semibold ${i <= step ? 'text-charcoal' : 'text-mid-gray'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-px ${i < step ? 'bg-emerald' : 'bg-brand'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Full Name *" required value={address.fullName}
                    onChange={e => setAddress({ ...address, fullName: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                  <input placeholder="Phone Number *" required value={address.phone}
                    onChange={e => setAddress({ ...address, phone: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <input placeholder="Email Address" value={address.email}
                  onChange={e => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                <input placeholder="Street Address *" required value={address.line1}
                  onChange={e => setAddress({ ...address, line1: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="City *" required value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                  <select value={address.province}
                    onChange={e => setAddress({ ...address, province: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
                    {['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad', 'AJK', 'GB'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <input placeholder="Postal Code" value={address.postalCode}
                    onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
                </div>
                <button
                  onClick={() => {
                    if (!address.fullName || !address.phone || !address.line1 || !address.city) {
                      toast.error('Please fill all required fields')
                      return
                    }
                    setStep(1)
                  }}
                  className="btn btn-emerald text-xs px-10 py-3.5"
                >Continue to Shipping →</button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Shipping Method</h2>
                {[
                  { id: 'standard', label: 'Standard Delivery', desc: '3-5 business days', price: subtotal >= 5000 ? 'Free' : 'PKR 350' },
                  { id: 'express', label: 'Express Delivery', desc: '1-2 business days', price: 'PKR 500' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={[
                      'flex items-center justify-between p-5 rounded-xl border cursor-pointer transition-all',
                      shipping === opt.id ? 'border-emerald bg-emerald/5' : 'border-brand bg-ivory hover:border-gold',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shipping === opt.id ? 'border-emerald' : 'border-brand'}`}>
                        {shipping === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                        <p className="text-2xs text-mid-gray">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-charcoal">{opt.price}</span>
                    <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)} className="sr-only" />
                  </label>
                ))}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(0)} className="btn text-xs px-6 py-3 border border-brand text-mid-gray hover:border-gold">← Back</button>
                  <button onClick={() => setStep(2)} className="btn btn-emerald text-xs px-10 py-3.5">Continue to Payment →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-4">Payment Method</h2>
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: '💵' },
                  { id: 'JAZZCASH', label: 'JazzCash', desc: 'Mobile wallet payment', icon: '📱' },
                  { id: 'EASYPAISA', label: 'EasyPaisa', desc: 'Mobile wallet payment', icon: '📱' },
                  { id: 'BANK_TRANSFER', label: 'Bank Transfer', desc: 'Direct bank deposit', icon: '🏦' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={[
                      'flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all',
                      payment === opt.id ? 'border-emerald bg-emerald/5' : 'border-brand bg-ivory hover:border-gold',
                    ].join(' ')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payment === opt.id ? 'border-emerald' : 'border-brand'}`}>
                      {payment === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald" />}
                    </div>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                      <p className="text-2xs text-mid-gray">{opt.desc}</p>
                    </div>
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)} className="sr-only" />
                  </label>
                ))}
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="btn text-xs px-6 py-3 border border-brand text-mid-gray hover:border-gold">← Back</button>
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={isPlacing}
                    className="btn btn-emerald text-xs px-10 py-3.5 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPlacing ? 'Placing Order...' : `Place Order — ${formatPKR(grandTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="bg-ivory rounded-xl border border-brand p-7 h-fit sticky top-32">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-5">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-charcoal line-clamp-1">{item.name}</p>
                    <p className="text-2xs text-mid-gray">{item.variantName} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-charcoal">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-brand pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-mid-gray">Subtotal</span>
                <span className="text-charcoal">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-mid-gray">Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-emerald font-semibold">Free ✓</span>
                ) : (
                  <span className="text-charcoal">{formatPKR(shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between text-base font-semibold border-t border-brand pt-3 mt-3">
                <span>Total</span>
                <span className="font-display text-xl">{formatPKR(grandTotal)}</span>
              </div>
            </div>
            <div className="mt-5 text-2xs text-mid-gray flex items-center gap-1.5">
              <span>🔒</span> Secure checkout · SSL encrypted · COD available
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
