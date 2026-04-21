'use server'

import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { revalidatePath } from 'next/cache'
import { sendOrderStatusUpdateEmail } from '@/lib/email'

export async function createProductAction(formData: FormData) {
  try {
    const file = formData.get('image') as File | null
    let imageUrl = ''

    if (file && file.size > 0) {
      const imgbbKey = process.env.IMGBB_API_KEY
      if (!imgbbKey) {
        throw new Error('IMGBB_API_KEY is not defined in environment variables')
      }

      // Convert file to base64 for ImgBB
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const imgFormData = new FormData()
      imgFormData.append('key', imgbbKey)
      imgFormData.append('image', base64)

      const imgRes = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: imgFormData,
      })

      if (!imgRes.ok) {
        const errorText = await imgRes.text()
        console.error('ImgBB Upload Error:', errorText)
        throw new Error('Failed to upload image to ImgBB')
      }

      const imgData = await imgRes.json()
      imageUrl = imgData.data.url
    }

    // Parse basic fields
    const name = formData.get('name') as string
    const nameUrdu = formData.get('nameUrdu') as string
    const slug = formData.get('slug') as string
    const description = formData.get('description') as string
    const riceType = formData.get('riceType') as string
    const grainLength = formData.get('grainLength') as string
    const ageMonths = formData.get('ageMonths') ? Number(formData.get('ageMonths')) : null
    const origin = formData.get('origin') as string
    const organic = formData.get('organic') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const basePrice = Number(formData.get('basePrice'))
    const comparePrice = formData.get('comparePrice') ? Number(formData.get('comparePrice')) : null

    // Parse variants
    const variantsJson = formData.get('variants') as string
    let parsedVariants: any[] = []
    if (variantsJson) {
      parsedVariants = JSON.parse(variantsJson).map((v: any) => ({
        id: v.sku || Date.now().toString(),
        name: v.name,
        weight: Number(v.weight),
        priceOffset: Number(v.priceOffset),
        stock: Number(v.stock),
        isActive: true,
      }))
    }

    // Construct Product Object
    const productData = {
      name,
      nameUrdu,
      slug,
      description,
      riceType,
      grainLength,
      ageMonths,
      origin,
      organic,
      isFeatured,
      basePrice,
      comparePrice,
      isNew: true,
      isActive: true,
      glutenFree: true,
      category: {
        name: riceType?.includes('BASMATI') ? 'Premium Basmati' : 'Specialty Rice',
        slug: riceType?.includes('BASMATI') ? 'premium-basmati' : 'specialty-rice',
      },
      tags: [],
      images: imageUrl ? [{ url: imageUrl, altText: name, isPrimary: true }] : [],
      variants: parsedVariants,
      reviews: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    // Check if slug already exists
    const productsRef = db.collection('products')
    const existing = await productsRef.where('slug', '==', slug).get()
    if (!existing.empty) {
      throw new Error(`A product with slug "${slug}" already exists.`)
    }

    const newDoc = await productsRef.add(productData)

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')
    
    return { success: true, id: newDoc.id }
  } catch (error: any) {
    console.error('Server Action Error - createProduct:', error)
    return { success: false, error: error.message || 'Something went wrong' }
  }
}

export async function updateProductAction(productId: string, formData: FormData) {
  try {
    const file = formData.get('image') as File | null
    let imageUrl = ''

    if (file && file.size > 0) {
      const imgbbKey = process.env.IMGBB_API_KEY
      if (!imgbbKey) throw new Error('IMGBB_API_KEY is not defined')

      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const imgFormData = new FormData()
      imgFormData.append('key', imgbbKey)
      imgFormData.append('image', base64)

      const imgRes = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: imgFormData })
      if (!imgRes.ok) throw new Error('Failed to upload image to ImgBB')

      const imgData = await imgRes.json()
      imageUrl = imgData.data.url
    }

    const name = formData.get('name') as string
    const nameUrdu = formData.get('nameUrdu') as string
    const description = formData.get('description') as string
    const riceType = formData.get('riceType') as string
    const grainLength = formData.get('grainLength') as string
    const ageMonths = formData.get('ageMonths') ? Number(formData.get('ageMonths')) : null
    const origin = formData.get('origin') as string
    const organic = formData.get('organic') === 'true'
    const isFeatured = formData.get('isFeatured') === 'true'
    const isActive = formData.get('isActive') !== 'false'
    const basePrice = Number(formData.get('basePrice'))
    const comparePrice = formData.get('comparePrice') ? Number(formData.get('comparePrice')) : null

    const variantsJson = formData.get('variants') as string
    let parsedVariants: any[] = []
    if (variantsJson) {
      parsedVariants = JSON.parse(variantsJson).map((v: any) => ({
        id: v.sku || v.id || Date.now().toString(),
        name: v.name,
        weight: Number(v.weight),
        priceOffset: Number(v.priceOffset),
        stock: Number(v.stock),
        isActive: true,
      }))
    }

    const updateData: any = {
      name, nameUrdu, description, riceType, grainLength, ageMonths,
      origin, organic, isFeatured, isActive, basePrice, comparePrice,
      variants: parsedVariants,
      category: {
        name: riceType?.includes('BASMATI') ? 'Premium Basmati' : 'Specialty Rice',
        slug: riceType?.includes('BASMATI') ? 'premium-basmati' : 'specialty-rice',
      },
      updatedAt: FieldValue.serverTimestamp(),
    }

    if (imageUrl) {
      updateData.images = [{ url: imageUrl, altText: name, isPrimary: true }]
    }

    await db.collection('products').doc(productId).set(updateData, { merge: true })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${productId}`)
    revalidatePath('/shop')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('Server Action Error - updateProduct:', error)
    return { success: false, error: error.message || 'Something went wrong' }
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await db.collection('products').doc(productId).delete()
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Server Action Error - deleteProduct:', error)
    return { success: false, error: error.message || 'Failed to delete product' }
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const orderRef = db.collection('orders').doc(orderId)
    const doc = await orderRef.get()
    
    await orderRef.set(
      { status, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    )

    if (doc.exists) {
      const orderData = doc.data()
      if (orderData?.guestEmail) {
        sendOrderStatusUpdateEmail(orderId, orderData, status).catch(err => {
          console.error('Failed to send status update email:', err)
        })
      }
    }

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Server Action Error - updateOrderStatus:', error)
    return { success: false, error: error.message || 'Failed to update order status' }
  }
}
