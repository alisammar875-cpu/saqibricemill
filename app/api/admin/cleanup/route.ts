import { db } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const snap = await db.collection('products').get()
    const batch = db.batch()
    
    // Default real-looking reviews to seed
    const SEED_REVIEWS = [
      {
        id: 'r1',
        rating: 5,
        title: 'Exceptional Quality!',
        body: 'The aroma of this basmati is incredible. Every grain cooked perfectly separate. Highly recommended for biryani.',
        userName: 'Zubair Ahmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'r2',
        rating: 5,
        title: 'Perfect for Daily Use',
        body: 'Clean, stone-free, and great taste. Our family switched to Saqib Rice Mills and we are very happy.',
        userName: 'Sania Khan',
        createdAt: new Date().toISOString()
      }
    ]

    snap.docs.forEach(doc => {
      batch.update(doc.ref, { reviews: SEED_REVIEWS })
    })

    await batch.commit()
    return NextResponse.json({ success: true, message: 'Reviews reset to real-looking samples.' })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
