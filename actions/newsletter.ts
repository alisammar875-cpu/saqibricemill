'use server'

import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function subscribeToNewsletter(email: string) {
  try {
    // Check if already exists
    const snap = await db.collection('newsletter').where('email', '==', email).get()
    if (!snap.empty) {
      return { success: true } // Already subscribed
    }

    await db.collection('newsletter').add({
      email,
      subscribedAt: FieldValue.serverTimestamp(),
      isActive: true,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Newsletter error:', error)
    return { success: false, error: error.message }
  }
}
