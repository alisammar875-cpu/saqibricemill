'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { registerAdmin } from '@/actions/auth'

export default function AdminRegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await registerAdmin(formData)
    setIsSubmitting(false)

    if (res.success) {
      toast.success('Admin registered and logged in successfully!')
      router.push('/admin')
      router.refresh()
    } else {
      toast.error(res.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-warm flex flex-col justify-center items-center p-6">
      <Link href="/" className="font-display text-2xl font-bold text-charcoal mb-8 tracking-widest uppercase">
        Saqib Rice Mills
      </Link>
      
      <div className="bg-ivory p-8 rounded-2xl shadow-card w-full max-w-md border border-brand">
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Admin Setup</h1>
        <p className="text-sm text-mid-gray mb-6">Enter your details and the secret key to register an admin account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="admin@saqibricemills.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Admin Secret Key</label>
            <input 
              name="adminSecret" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="Enter ADMIN_SECRET"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn btn-emerald justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register as Admin'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand text-center">
          <Link href="/sign-in" className="text-xs text-emerald hover:text-gold transition-colors font-medium">
            Already have an account? Login here →
          </Link>
        </div>
      </div>
    </div>
  )
}
