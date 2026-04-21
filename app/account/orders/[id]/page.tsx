import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'

// Order tracking page with timeline
export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = await params

  // Demo order data
  const order = {
    id: orderId,
    date: '15 April 2026',
    status: 'Shipped',
    total: 4100,
    shipping: 0,
    payment: 'Cash on Delivery',
    address: { name: 'Ahmed Raza', phone: '+92 300 1234567', line1: '45-B, Block 6, PECHS', city: 'Karachi', province: 'Sindh', postal: '75400' },
    items: [
      { name: '1121 Super Basmati Extra Long Grain', variant: '1kg Bag', qty: 2, price: 850 },
      { name: 'Super Basmati Classic Aromatic', variant: '5kg Bag', qty: 1, price: 3250 },
    ],
    tracking: [
      { status: 'Order Placed', date: '15 April 2026, 10:30 AM', desc: 'Your order has been confirmed', done: true },
      { status: 'Processing', date: '15 April 2026, 2:00 PM', desc: 'Your order is being packed at our Gujranwala factory', done: true },
      { status: 'Shipped', date: '16 April 2026, 9:15 AM', desc: 'Handed over to TCS courier. Tracking: TCS-2026041600123', done: true },
      { status: 'In Transit', date: '17 April 2026', desc: 'Package is on its way to Karachi hub', done: true },
      { status: 'Out for Delivery', date: 'Expected: 18 April 2026', desc: 'Arriving today', done: false },
      { status: 'Delivered', date: '', desc: 'Pending', done: false },
    ],
  }

  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28 section-pad min-h-[70vh]">
        <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          <span>/</span>
          <Link href="/account/orders" className="hover:text-gold transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-charcoal font-semibold">{orderId}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-display text-2xl font-semibold text-charcoal">{order.id}</h1>
            <p className="text-sm text-mid-gray">{order.date}</p>
          </div>
          <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 tracking-wider uppercase">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Tracking + Items */}
          <div className="lg:col-span-2 space-y-10">
            {/* Order Tracking Timeline */}
            <div className="bg-ivory rounded-xl border border-brand p-8">
              <h2 className="font-display text-xl font-semibold text-charcoal mb-8">📦 Order Tracking</h2>
              <div className="space-y-0">
                {order.tracking.map((step, i) => (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={[
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 border-2',
                        step.done ? 'bg-emerald text-white border-emerald' : 'bg-cream text-mid-gray border-brand',
                      ].join(' ')}>
                        {step.done ? '✓' : i + 1}
                      </div>
                      {i < order.tracking.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.done ? 'bg-emerald' : 'bg-brand'}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`text-sm font-semibold ${step.done ? 'text-charcoal' : 'text-mid-gray'}`}>{step.status}</p>
                      {step.date && <p className="text-2xs text-mid-gray mt-0.5">{step.date}</p>}
                      <p className="text-2xs text-mid-gray mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="bg-ivory rounded-xl border border-brand p-6">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Items</h2>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-brand/50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                    <p className="text-2xs text-mid-gray">{item.variant} × {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold">PKR {(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary + Address */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-ivory rounded-xl border border-brand p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-mid-gray">Subtotal</span><span>PKR {order.total.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-mid-gray">Shipping</span><span className="text-emerald font-semibold">{order.shipping === 0 ? 'Free' : `PKR ${order.shipping}`}</span></div>
                <div className="flex justify-between font-semibold border-t border-brand pt-2 mt-2">
                  <span>Total</span><span className="font-display text-lg">PKR {(order.total + order.shipping).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-2xs text-mid-gray mt-3">💳 {order.payment}</p>
            </div>

            {/* Shipping Address */}
            <div className="bg-ivory rounded-xl border border-brand p-6">
              <h3 className="font-display text-lg font-semibold text-charcoal mb-4">Shipping Address</h3>
              <div className="text-sm text-mid-gray space-y-1">
                <p className="font-semibold text-charcoal">{order.address.name}</p>
                <p>{order.address.phone}</p>
                <p>{order.address.line1}</p>
                <p>{order.address.city}, {order.address.province} {order.address.postal}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full btn btn-outline-gold text-xs py-3 justify-center">📞 Contact Support</button>
              <button className="w-full btn text-xs py-3 justify-center border border-brand text-mid-gray hover:border-gold">
                🔄 Reorder These Items
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
