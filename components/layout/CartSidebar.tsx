'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/formatters'
import { motion, AnimatePresence } from 'framer-motion'

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, updateQty, removeItem, total } = useCartStore()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus close btn when opens
  useEffect(() => {
    if (open) setTimeout(() => closeBtnRef.current?.focus(), 100)
  }, [open])

  // Keyboard escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const subtotal = total()
  const shipping = subtotal >= 5000 ? 0 : 350
  const grandTotal = subtotal + shipping

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] bg-dark/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[420px] max-w-[100vw] bg-warm flex flex-col shadow-[-20px_0_60px_rgba(0,30,0,0.2)]"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-7 border-b border-brand flex-shrink-0">
              <div>
                <p className="font-display text-[1.4rem] font-semibold text-charcoal">Your Cart</p>
                <p className="text-xs text-mid-gray mt-0.5">
                  {items.length === 0 ? 'Empty' : `${items.length} item${items.length > 1 ? 's' : ''}`}
                </p>
              </div>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-mid-gray hover:bg-cream hover:text-charcoal transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-3xl">🌾</div>
                  <div>
                    <p className="font-display text-xl font-semibold text-charcoal mb-2">Your cart is empty</p>
                    <p className="text-xs text-mid-gray">Add some premium rice to get started</p>
                  </div>
                  <Link href="/shop" onClick={onClose} className="btn btn-emerald text-xs px-7 py-3">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                      className="flex gap-4 items-start py-5 border-b border-brand"
                    >
                      {/* Product thumbnail */}
                      <div className="w-[72px] h-[72px] rounded-md bg-cream flex-shrink-0 border border-brand overflow-hidden relative">
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="72px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.slug}`} onClick={onClose}
                          className="font-display text-[1rem] font-semibold text-charcoal hover:text-gold transition-colors line-clamp-2 leading-tight">
                          {item.name}
                        </Link>
                        {item.variantName && (
                          <p className="text-2xs text-mid-gray mt-0.5">{item.variantName}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-brand flex items-center justify-center text-sm text-charcoal hover:border-gold hover:text-gold transition-all"
                          >−</button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-brand flex items-center justify-center text-sm text-charcoal hover:border-gold hover:text-gold transition-all"
                          >+</button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-mid-gray hover:text-red-500 transition-colors text-2xs"
                          >Remove</button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="font-display text-[1.1rem] font-semibold text-charcoal whitespace-nowrap flex-shrink-0">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-brand bg-cream flex-shrink-0">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs text-mid-gray">
                    <span>Subtotal</span>
                    <span>{formatPKR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-mid-gray">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-emerald font-semibold">Free ✓</span>
                    ) : (
                      <span className="text-mid-gray">{formatPKR(shipping)}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-2xs text-mid-gray">
                      Add {formatPKR(5000 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-baseline mb-5">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-display text-[1.3rem] font-semibold">{formatPKR(grandTotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full text-center btn btn-emerald py-4 justify-center"
                >
                  Proceed to Checkout
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>

                <Link
                  href="/shop"
                  onClick={onClose}
                  className="block text-center mt-3 text-xs text-mid-gray hover:text-gold transition-colors"
                >
                  ← Continue Shopping
                </Link>

                <div className="text-center mt-4 text-2xs text-mid-gray flex items-center justify-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Secure checkout · SSL encrypted · COD available
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
