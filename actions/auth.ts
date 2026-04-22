'use server'

import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'fallback_secret_for_development_do_not_use_in_prod'
)

export async function createToken(payload: { id: string; email: string; role: string; name?: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload
  } catch (err) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export async function registerCustomer(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = (formData.get('email') as string).toLowerCase()
    const password = formData.get('password') as string

    if (!email || !password || password.length < 6) {
      throw new Error('Email and a strong password (6+ characters) are required')
    }

    const usersRef = db.collection('users')
    const existing = await usersRef.where('email', '==', email).limit(1).get()
    
    if (!existing.empty) {
      throw new Error('User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newDoc = await usersRef.add({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const token = await createToken({ id: newDoc.id, email, role: 'CUSTOMER', name: `${firstName} ${lastName}` })
    
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Something went wrong' }
  }
}

export async function registerAdmin(formData: FormData) {
  try {
    const email = (formData.get('email') as string).toLowerCase()
    const password = formData.get('password') as string
    const adminSecret = formData.get('adminSecret') as string

    if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
      throw new Error('Invalid Admin Secret Key')
    }

    if (!email || !password || password.length < 6) {
      throw new Error('Email and a strong password (6+ characters) are required')
    }

    const usersRef = db.collection('users')
    const existing = await usersRef.where('email', '==', email).limit(1).get()
    
    if (!existing.empty) {
      throw new Error('Admin with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newDoc = await usersRef.add({
      email,
      password: hashedPassword,
      role: 'ADMIN',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const token = await createToken({ id: newDoc.id, email, role: 'ADMIN', name: 'Admin' })
    
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration failed' }
  }
}

export async function loginUser(formData: FormData) {
  try {
    const email = (formData.get('email') as string).toLowerCase()
    const password = formData.get('password') as string

    if (!email || !password) throw new Error('Provide email and password')

    const usersRef = db.collection('users')
    const snapshot = await usersRef.where('email', '==', email).limit(1).get()

    if (snapshot.empty) {
      throw new Error('Invalid email or password')
    }

    const userDoc = snapshot.docs[0]
    const userData = userDoc.data()

    // If there's no password (maybe they used Clerk before but no password saved), block
    if (!userData.password) {
      throw new Error('Account was created via another method. Please reset password or contact support.')
    }

    const passwordMatch = await bcrypt.compare(password, userData.password)
    
    if (!passwordMatch) {
      throw new Error('Invalid email or password')
    }

    const name = userData.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : 'User'

    const token = await createToken({ 
      id: userDoc.id, 
      email, 
      role: userData.role || 'CUSTOMER', 
      name 
    })
    
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return { success: true, role: userData.role || 'CUSTOMER' }
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' }
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}
