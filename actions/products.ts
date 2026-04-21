import { cache } from 'react'
import { type DbProduct, getFeaturedProductsFromDb, getProductBySlugFromDb } from '@/lib/firestore'
import { db } from '@/lib/firebase-admin'

// Cached featured products for homepage
export const getFeaturedProducts = cache(async () => {
  try {
    return await getFeaturedProductsFromDb(8)
  } catch (error) {
    console.error('Failed to load featured products:', error)
    return []
  }
})

// Shop page - with filters
export async function getProducts({
  category,
  riceType,
  minPrice,
  maxPrice,
  sort = 'featured',
  page = 1,
  limit = 12,
  search,
}: {
  category?: string
  riceType?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'
  page?: number
  limit?: number
  search?: string
} = {}) {
  const normalizedCategory =
    category === 'premium-basmati' || category === 'bulk-export'
      ? 'BASMATI_1121'
      : category

  const snap = await db.collection('products').where('isActive', '==', true).get().catch((error: unknown) => {
    console.error('Failed to load products:', error)
    return null
  })
  const all = (snap?.docs ?? []).map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...(d.data() as Omit<DbProduct, 'id'>) }))

  const filtered = all
    .filter((p: DbProduct) =>
      normalizedCategory
        ? p.category?.slug === normalizedCategory || p.riceType === normalizedCategory
        : true
    )
    .filter((p: DbProduct) => (riceType ? p.riceType === riceType : true))
    .filter((p: DbProduct) => (minPrice ? Number(p.basePrice) >= minPrice : true))
    .filter((p: DbProduct) => (maxPrice ? Number(p.basePrice) <= maxPrice : true))
    .filter((p: DbProduct) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t: string) => t.toLowerCase().includes(q))
      )
    })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return Number(a.basePrice) - Number(b.basePrice)
      case 'price-desc':
        return Number(b.basePrice) - Number(a.basePrice)
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case 'rating': {
        const ar = (a.reviews ?? []).length
        const br = (b.reviews ?? []).length
        return br - ar
      }
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
  })

  const total = sorted.length
  const skip = (page - 1) * limit
  const products = sorted.slice(skip, skip + limit)

  return {
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  }
}

// Single product by slug
export const getProductBySlug = cache(async (slug: string) => {
  try {
    return await getProductBySlugFromDb(slug)
  } catch (error) {
    console.error(`Failed to load product by slug "${slug}":`, error)
    return null
  }
})

// All categories
export const getCategories = cache(async () => {
  try {
    const snap = await db.collection('categories').where('isActive', '==', true).get()
    return snap.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }))
  } catch (error) {
    console.error('Failed to load categories:', error)
    return []
  }
})

// Product average rating helper
export function getAverageRating(reviews: { rating: number }[]): number {
  if (!reviews.length) return 0
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
}
