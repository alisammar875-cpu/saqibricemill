'use server'

import { createOrder } from '@/lib/firestore'
import { getSession } from '@/actions/auth'

export async function placeOrder(data: {
  items: {
    productId: string
    name: string
    variantName?: string
    price: number
    quantity: number
    imageUrl?: string
    slug: string
  }[]
  subtotal: number
  shippingCost: number
  total: number
  shippingMethod: string
  paymentMethod: string
  guestName: string
  guestEmail: string
  guestPhone: string
  shippingAddress: {
    line1: string
    city: string
    province: string
    postalCode: string
  }
}) {
  try {
    // Get session if logged in
    const session = await getSession()

    const orderId = await createOrder({
      userId: session?.id ?? null,
      items: data.items,
      subtotal: data.subtotal,
      shippingCost: data.shippingCost,
      total: data.total,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'COD' ? 'PENDING' : 'AWAITING',
      status: 'Processing',
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      shippingAddress: data.shippingAddress,
    })

    return { success: true, orderId }
  } catch (error: any) {
    console.error('Failed to place order:', error)
    return { success: false, error: error.message || 'Failed to place order' }
  }
}
