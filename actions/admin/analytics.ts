// actions/admin/analytics.ts
'use server'
import { db } from '@/lib/firebase-admin'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export async function getDashboardStats() {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))

  const [ordersSnap, lastMonthOrdersSnap, usersSnap, productsSnap] = await Promise.all([
    db.collection('orders').where('createdAt', '>=', monthStart).where('createdAt', '<=', monthEnd).get(),
    db.collection('orders').where('createdAt', '>=', lastMonthStart).where('createdAt', '<=', lastMonthEnd).get(),
    db.collection('users').where('createdAt', '>=', monthStart).where('createdAt', '<=', monthEnd).get(),
    db.collection('products').where('isActive', '==', true).get(),
  ])

  const orders = ordersSnap.docs.map((d) => d.data() as any)
  const lastMonthOrders = lastMonthOrdersSnap.docs.map((d) => d.data() as any)
  const users = usersSnap.docs.map((d) => d.data() as any)
  const products = productsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))

  const revenue = orders
    .filter((o) => o.status === 'DELIVERED' || o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0)
  const previousRevenue = lastMonthOrders
    .filter((o) => o.status === 'DELIVERED' || o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + Number(o.total ?? 0), 0)

  const lowStock = products
    .flatMap((product) => (product.variants ?? []).map((variant: any) => ({
      product: { name: product.name },
      id: variant.id,
      stock: Number(variant.stock ?? 0),
    })))
    .filter((variant) => variant.stock < 50)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10)

  const customerCount = users.filter((u) => (u.role ?? 'CUSTOMER') === 'CUSTOMER').length
  const growthPct = previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0

  return {
    revenue,
    orders: orders.length,
    customers: customerCount,
    lowStock,
    growthPct,
  }
}