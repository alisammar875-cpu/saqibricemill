import admin from 'firebase-admin';
import fs from 'fs';

const DEMO_PRODUCTS = [
  {
    id: '1', slug: '1121-super-basmati', name: '1121 Super Basmati Extra Long Grain',
    nameUrdu: '۱۱۲۱ سپر باسمتی', description: 'The king of rice. Aged for 2 years, delivering exceptional aroma.',
    basePrice: 850, comparePrice: 950, riceType: 'BASMATI_1121', isNew: false, organic: false, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v1', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 500 }],
    images: [], reviews: [{ rating: 5 }, { rating: 5 }, { rating: 4 }], tags: ['basmati', 'premium']
  },
  {
    id: '2', slug: 'super-basmati-classic', name: 'Super Basmati Classic Aromatic',
    nameUrdu: 'سپر باسمتی کلاسک', description: 'Traditional aromatic basmati — perfect for everyday pulao and biryani.',
    basePrice: 650, comparePrice: null, riceType: 'BASMATI_SUPER', isNew: false, organic: false, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v2', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 300 }],
    images: [], reviews: [{ rating: 5 }, { rating: 4 }], tags: ['basmati', 'classic']
  },
  {
    id: '3', slug: 'brown-basmati-organic', name: 'Organic Brown Basmati Rice',
    nameUrdu: 'آرگینک براؤن باسمتی', description: 'Unpolished, nutrient-rich brown basmati. High fiber, nutty flavor.',
    basePrice: 950, comparePrice: 1100, riceType: 'BROWN_BASMATI', isNew: true, organic: true, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v3', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 200 }],
    images: [], reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }], tags: ['organic', 'brown']
  },
  {
    id: '4', slug: 'irri-9-everyday', name: 'IRRI-9 Everyday Premium Rice',
    nameUrdu: 'آئی آر آر آئی ۹', description: 'Best value everyday rice. Medium grain, perfect for daily cooking.',
    basePrice: 380, comparePrice: null, riceType: 'IRRI_9', isNew: false, organic: false, isFeatured: false, isActive: true,
    category: { name: 'IRRI Rice', slug: 'irri' },
    variants: [{ id: 'v4', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 800 }],
    images: [], reviews: [{ rating: 4 }, { rating: 4 }], tags: ['daily']
  },
  {
    id: '5', slug: 'sella-basmati-parboiled', name: 'Sella Basmati Parboiled Golden',
    nameUrdu: 'سیلا باسمتی', description: 'Parboiled basmati retaining nutrients. Non-sticky, perfect for pulao.',
    basePrice: 720, comparePrice: 800, riceType: 'SELLA_BASMATI', isNew: false, organic: false, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v5', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 400 }],
    images: [], reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }], tags: ['sella', 'parboiled']
  },
  {
    id: '6', slug: 'irri-6-value-pack', name: 'IRRI-6 Value Pack Rice',
    nameUrdu: 'آئی آر آر آئی ۶', description: 'Budget-friendly quality rice for large families and commercial use.',
    basePrice: 320, comparePrice: null, riceType: 'IRRI_6', isNew: false, organic: false, isFeatured: false, isActive: true,
    category: { name: 'IRRI Rice', slug: 'irri' },
    variants: [{ id: 'v6', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 1000 }],
    images: [], reviews: [{ rating: 4 }], tags: ['value', 'bulk']
  },
  {
    id: '7', slug: 'kainat-basmati-premium', name: 'Kainat Basmati Premium Select',
    nameUrdu: 'کائنات باسمتی', description: 'Hand-picked long grain basmati from Hafizabad region. Aged 18 months.',
    basePrice: 780, comparePrice: null, riceType: 'BASMATI_1121', isNew: true, organic: false, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v7', name: '1kg Bag', weight: 1000, priceOffset: 0, stock: 250 }],
    images: [], reviews: [{ rating: 5 }, { rating: 5 }], tags: ['premium', 'aged']
  },
  {
    id: '8', slug: '1121-bulk-25kg', name: '1121 Basmati Bulk Pack (25kg)',
    nameUrdu: '۱۱۲۱ بلک پیک', description: 'Factory-sealed 25kg sack for restaurants and bulk buyers. Best wholesale price.',
    basePrice: 18500, comparePrice: 21000, riceType: 'BASMATI_1121', isNew: false, organic: false, isFeatured: true, isActive: true,
    category: { name: 'Premium Basmati', slug: 'basmati' },
    variants: [{ id: 'v8', name: '25kg Sack', weight: 25000, priceOffset: 0, stock: 50 }],
    images: [], reviews: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }], tags: ['bulk', 'wholesale']
  },
];

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function seed() {
  console.log('Starting seed...');
  for (const product of DEMO_PRODUCTS) {
    await db.collection('products').doc(product.id).set(product, { merge: true });
    console.log(`Inserted: ${product.name}`);
  }
  console.log('Successfully seeded 8 products.');
}

seed().catch(console.error).finally(() => process.exit(0));
