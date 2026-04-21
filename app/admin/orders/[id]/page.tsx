import Link from 'next/link'
import { getAdminOrderById } from '@/lib/firestore'
import { formatPKR } from '@/lib/formatters'
import { OrderStatusUpdate } from './OrderStatusUpdate'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const raw = await getAdminOrderById(id)

  if (!raw) {
    return <div className="text-sm text-mid-gray">Order not found.</div>
  }

  const order = {
    id: raw.id,
    customer: {
      name: raw.guestName ?? 'Customer',
      email: raw.guestEmail ?? '-',
      phone: raw.guestPhone ?? '-',
    },
    date: new Date(raw.createdAt?.toDate?.() ?? raw.createdAt ?? Date.now()).toLocaleString(),
    status: raw.status ?? 'Processing',
    paymentMethod: raw.paymentMethod ?? '-',
    paymentStatus: raw.paymentStatus ?? 'PENDING',
    address: raw.shippingAddress ?? { line1: '-', city: '-', province: '-', postalCode: '-' },
    items: (raw.items ?? []).map((i: any) => ({
      name: i.name ?? i.productName ?? 'Item',
      variant: i.variantName ?? '-',
      qty: i.quantity ?? 1,
      price: Number(i.price ?? i.unitPrice ?? 0),
      imageUrl: i.imageUrl,
    })),
    subtotal: Number(raw.subtotal ?? 0),
    shipping: Number(raw.shippingCost ?? 0),
    total: Number(raw.total ?? 0),
    notes: raw.notes ?? '',
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
        <Link href="/admin/orders" className="hover:text-gold transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">{order.id}</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal">{order.id}</h1>
          <p className="text-sm text-mid-gray">{order.date}</p>
        </div>
        <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-ivory rounded-xl border border-brand overflow-hidden">
            <div className="px-6 py-4 bg-cream border-b border-brand">
              <h2 className="font-display text-base font-semibold text-charcoal">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand/50">
                  <th className="text-left px-6 py-3 text-2xs text-mid-gray font-semibold">Product</th>
                  <th className="text-left px-6 py-3 text-2xs text-mid-gray font-semibold">Variant</th>
                  <th className="text-left px-6 py-3 text-2xs text-mid-gray font-semibold">Qty</th>
                  <th className="text-left px-6 py-3 text-2xs text-mid-gray font-semibold">Price</th>
                  <th className="text-left px-6 py-3 text-2xs text-mid-gray font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i} className="border-b border-brand/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-brand" />
                        )}
                        <span className="font-semibold text-charcoal">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-mid-gray">{item.variant}</td>
                    <td className="px-6 py-3">{item.qty}</td>
                    <td className="px-6 py-3">{formatPKR(item.price)}</td>
                    <td className="px-6 py-3 font-semibold">{formatPKR(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-4 bg-cream border-t border-brand space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-mid-gray">Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-mid-gray">Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPKR(order.shipping)}</span></div>
              <div className="flex justify-between font-semibold text-base border-t border-brand pt-2 mt-2">
                <span>Total</span><span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-ivory rounded-xl border border-brand p-6">
              <h3 className="font-display text-base font-semibold text-charcoal mb-2">Customer Notes</h3>
              <p className="text-sm text-mid-gray">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          <div className="bg-ivory rounded-xl border border-brand p-6">
            <h3 className="font-display text-base font-semibold text-charcoal mb-4">Customer</h3>
            <div className="text-sm text-mid-gray space-y-1">
              <p className="font-semibold text-charcoal">{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
          </div>

          <div className="bg-ivory rounded-xl border border-brand p-6">
            <h3 className="font-display text-base font-semibold text-charcoal mb-4">Shipping Address</h3>
            <div className="text-sm text-mid-gray space-y-1">
              <p>{order.address.line1}</p>
              <p>{order.address.city}, {order.address.province} {order.address.postalCode}</p>
            </div>
          </div>

          <div className="bg-ivory rounded-xl border border-brand p-6">
            <h3 className="font-display text-base font-semibold text-charcoal mb-4">Payment</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-mid-gray">Method</span><span className="font-semibold">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-mid-gray">Status</span>
                <span className={`px-2 py-0.5 text-2xs font-semibold rounded-full ${
                  order.paymentStatus === 'PAID' ? 'bg-emerald/10 text-emerald' : 'bg-gold/20 text-gold-dark'
                }`}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
