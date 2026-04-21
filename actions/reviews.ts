'use server'

import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { serializeDoc } from '@/lib/utils'

export async function addProductReview(productId: string, review: {
  rating: number,
  title: string,
  body: string,
  userName: string,
}) {
  try {
    const productRef = db.collection('products').doc(productId)
    const productDoc = await productRef.get()
    
    if (!productDoc.exists) {
      return { success: false, error: 'Product not found' }
    }

    const newReview = {
      ...review,
      createdAt: new Date().toISOString(),
      id: Math.random().toString(36).substring(7),
    }

    await productRef.update({
      reviews: FieldValue.arrayUnion(newReview)
    })

    revalidatePath(`/product/[slug]`, 'page')
    revalidatePath('/shop')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error adding review:', error)
    return { success: false, error: error.message }
  }
}
