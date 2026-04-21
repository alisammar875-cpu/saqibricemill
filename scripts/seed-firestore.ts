import { db } from '@/lib/firebase-admin'

const categories = [
  { id: 'basmati', name: 'Premium Basmati', slug: 'basmati', isActive: true, sortOrder: 1 },
  { id: 'irri', name: 'IRRI Rice', slug: 'irri', isActive: true, sortOrder: 2 },
  { id: 'specialty', name: 'Specialty Rice', slug: 'specialty', isActive: true, sortOrder: 3 },
]

const products = [
  { id: 'p1', slug: '1121-super-basmati', name: '1121 Super Basmati Extra Long Grain', description: 'Premium aged basmati for biryani.', basePrice: 850, comparePrice: 950, riceType: 'BASMATI_1121', isFeatured: true, isNew: false, organic: false, category: { name: 'Premium Basmati', slug: 'basmati' }, variants: [{ id: 'v1', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 500 }], images: [], reviews: [{ rating: 5 }, { rating: 4 }], tags: ['premium', 'biryani'] },
  { id: 'p2', slug: 'super-basmati-classic', name: 'Super Basmati Classic Aromatic', description: 'Daily premium aromatic basmati.', basePrice: 650, comparePrice: null, riceType: 'BASMATI_SUPER', isFeatured: true, isNew: false, organic: false, category: { name: 'Premium Basmati', slug: 'basmati' }, variants: [{ id: 'v2', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 300 }], images: [], reviews: [{ rating: 5 }], tags: ['classic'] },
  { id: 'p3', slug: 'brown-basmati-organic', name: 'Organic Brown Basmati Rice', description: 'High-fiber organic brown basmati.', basePrice: 950, comparePrice: 1100, riceType: 'BROWN_BASMATI', isFeatured: true, isNew: true, organic: true, category: { name: 'Specialty Rice', slug: 'specialty' }, variants: [{ id: 'v3', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 200 }], images: [], reviews: [{ rating: 5 }, { rating: 5 }], tags: ['organic', 'brown'] },
  { id: 'p4', slug: 'irri-9-everyday', name: 'IRRI-9 Everyday Premium Rice', description: 'Best value daily use rice.', basePrice: 380, comparePrice: null, riceType: 'IRRI_9', isFeatured: false, isNew: false, organic: false, category: { name: 'IRRI Rice', slug: 'irri' }, variants: [{ id: 'v4', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 800 }], images: [], reviews: [{ rating: 4 }], tags: ['daily'] },
]

async function main() {
  for (const category of categories) {
    await db.collection('categories').doc(category.id).set(category, { merge: true })
  }

  for (const product of products) {
    await db.collection('products').doc(product.id).set(
      {
        ...product,
        isActive: true,
      },
      { merge: true }
    )
  }

  console.log('Firestore seed completed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
