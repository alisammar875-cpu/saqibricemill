import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase-admin'
import { serializeDoc } from '@/lib/utils'

export interface DbProduct {
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
  glutenFree: boolean
  organic: boolean
  isNew: boolean
  isFeatured: boolean
  isActive: boolean
  category: { name: string; slug: string }
  tags: string[]
  images: { url: string; altText?: string | null; isPrimary?: boolean }[]
  variants: { id: string; name: string; weight: number; priceOffset: number; stock: number; isActive?: boolean; sortOrder?: number }[]
  reviews: { rating: number }[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// ── Product Queries ─────────────────────────────────────────────────────────

export async function getFeaturedProductsFromDb(limit = 8): Promise<DbProduct[]> {
  const snap = await db.collection('products')
    .where('isActive', '==', true)
    .where('isFeatured', '==', true)
    .limit(limit)
    .get()

  return snap.docs.map((doc) => serializeDoc({ id: doc.id, ...doc.data() }))
}

export async function getProductBySlugFromDb(slug: string): Promise<DbProduct | null> {
  const snap = await db.collection('products').where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return serializeDoc({ id: doc.id, ...doc.data() })
}

export async function getProductsByIdsFromDb(ids: string[]): Promise<DbProduct[]> {
  const uniqueIds = [...new Set(ids)].filter(Boolean)
  if (!uniqueIds.length) return []
  const docs = await Promise.all(uniqueIds.map((id) => db.collection('products').doc(id).get()))
  return docs.filter((d) => d.exists).map((d) => serializeDoc({ id: d.id, ...d.data() }))
}

export async function getProductByIdFromDb(id: string): Promise<DbProduct | null> {
  const doc = await db.collection('products').doc(id).get()
  if (!doc.exists) return null
  return serializeDoc({ id: doc.id, ...doc.data() })
}

// ── Order Queries ───────────────────────────────────────────────────────────

export async function createOrder(data: Record<string, unknown>) {
  const ref = db.collection('orders').doc()
  await ref.set({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
  return ref.id
}

export async function updateOrder(orderId: string, patch: Record<string, unknown>) {
  await db.collection('orders').doc(orderId).set(
    {
      ...patch,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  )
}

// ── Admin Queries ───────────────────────────────────────────────────────────

export async function getAdminProducts() {
  try {
    const snap = await db.collection('products').get()
    return snap.docs.map((doc) => serializeDoc({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Failed to load admin products:', error)
    return []
  }
}

export async function deleteProduct(productId: string) {
  await db.collection('products').doc(productId).delete()
}

export async function updateProduct(productId: string, data: Record<string, unknown>) {
  await db.collection('products').doc(productId).set(
    { ...data, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  )
}

export async function getAdminOrders() {
  try {
    const snap = await db.collection('orders').get()
    const rows = snap.docs.map((doc) => serializeDoc({ id: doc.id, ...doc.data() }))
    return rows.sort((a, b) => {
      const ad = new Date(a.createdAt?.toDate?.() ?? a.createdAt ?? 0).getTime()
      const bd = new Date(b.createdAt?.toDate?.() ?? b.createdAt ?? 0).getTime()
      return bd - ad
    })
  } catch (error) {
    console.error('Failed to load admin orders:', error)
    return []
  }
}

export async function getOrdersForUser(userId?: string | null) {
  if (!userId) return []
  try {
    const snap = await db.collection('orders').where('userId', '==', userId).get()
    const rows = snap.docs.map((doc) => serializeDoc({ id: doc.id, ...doc.data() }))
    return rows.sort((a, b) => {
      const ad = new Date(a.createdAt?.toDate?.() ?? a.createdAt ?? 0).getTime()
      const bd = new Date(b.createdAt?.toDate?.() ?? b.createdAt ?? 0).getTime()
      return bd - ad
    })
  } catch (error) {
    console.error('Failed to load user orders:', error)
    return []
  }
}

export async function getAdminOrderById(orderId: string) {
  try {
    const doc = await db.collection('orders').doc(orderId).get()
    if (!doc.exists) return null
    return serializeDoc({ id: doc.id, ...doc.data() })
  } catch (error) {
    console.error('Failed to load order by id:', error)
    return null
  }
}

export async function getAdminCustomers() {
  try {
    const [usersSnap, ordersSnap] = await Promise.all([db.collection('users').get(), db.collection('orders').get()])
    const users = usersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    const orders = ordersSnap.docs.map((d) => d.data() as any)

    return users
      .filter((u) => u.role === 'CUSTOMER')
      .map((u) => {
        const userOrders = orders.filter((o) => o.userId === u.id)
        const spent = userOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0)
        return {
          id: u.id,
          name: [u.firstName, u.lastName].filter(Boolean).join(' ') || 'Customer',
          email: u.email ?? '',
          phone: u.phone ?? '-',
          orders: userOrders.length,
          spent,
          city: u.city ?? '-',
          joined: u.createdAt?.toDate?.()?.toLocaleDateString?.() ?? '-',
        }
      })
  } catch (error) {
    console.error('Failed to load admin customers:', error)
    return []
  }
}

export async function getInventoryRows() {
  const products = await getAdminProducts()
  return products.flatMap((p: any) =>
    (p.variants ?? []).map((v: any) => ({
      sku: v.sku ?? v.id,
      product: p.name,
      variant: v.name,
      stock: Number(v.stock ?? 0),
      reorder: 50,
      status: Number(v.stock ?? 0) < 10 ? 'CRITICAL' : Number(v.stock ?? 0) < 50 ? 'LOW' : 'OK',
      lastRestock: '-',
    }))
  )
}

export async function getAdminDashboardData() {
  const [orders, inventory] = await Promise.all([getAdminOrders(), getInventoryRows()])
  
  // Calculate revenue from all non-cancelled orders for a more "live" view
  const activeOrders = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'Cancelled')
  const totalRevenue = activeOrders.reduce((sum, o) => sum + Number(o.total ?? 0), 0)
  
  const lowStock = inventory.filter((i) => i.status !== 'OK').slice(0, 5)
  
  return {
    revenue: totalRevenue,
    ordersCount: orders.length,
    customersCount: await db.collection('users').where('role', '==', 'CUSTOMER').get().then((s) => s.size).catch(() => 0),
    avgOrderValue: activeOrders.length ? totalRevenue / activeOrders.length : 0,
    recentOrders: orders.slice(0, 5),
    lowStock,
  }
}
