'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { registerCustomer } from '@/actions/auth'

export default function SignUpPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await registerCustomer(formData)
    setIsSubmitting(false)

    if (res.success) {
      toast.success('Account created successfully!')
      router.push('/')
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
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Create an Account</h1>
        <p className="text-sm text-mid-gray mb-6">Join us to order premium rice and track your shipments.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1.5">First Name</label>
              <input name="firstName" required className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Ali" />
            </div>
            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1.5">Last Name</label>
              <input name="lastName" required className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="Khan" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Email Address</label>
            <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="ali@example.com" />
          </div>
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Password</label>
            <input name="password" type="password" required minLength={6} className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full btn btn-emerald justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand text-center flex flex-col gap-3">
          <Link href="/sign-in" className="text-xs text-charcoal hover:text-gold transition-colors font-medium">
            Already have an account? <span className="text-emerald">Login here</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
