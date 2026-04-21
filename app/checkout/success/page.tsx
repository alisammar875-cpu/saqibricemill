import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'

export default function CheckoutSuccessPage() {
  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28 section-pad text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald/10 flex items-center justify-center text-4xl mb-6 mx-auto">✓</div>
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Order Confirmed!</h1>
        <p className="text-mid-gray max-w-md mb-2">
          Thank you for your order. We&apos;re preparing your premium rice for dispatch from our factory in Gujranwala.
        </p>
        <p className="text-sm text-mid-gray mb-8">A confirmation email with tracking details will be sent shortly.</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/shop" className="btn btn-emerald text-xs px-8 py-3">Continue Shopping</Link>
          <Link href="/account/orders" className="btn btn-outline-gold text-xs px-6 py-3">Track My Orders</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
