import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminLayoutClient } from './AdminLayoutClient'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const signOutAction = async () => {
    'use server'
    const { logoutUser } = await import('@/actions/auth')
    await logoutUser()
    redirect('/sign-in')
  }

  return (
    <AdminLayoutClient signOutAction={signOutAction}>
      {children}
    </AdminLayoutClient>
  )
}
