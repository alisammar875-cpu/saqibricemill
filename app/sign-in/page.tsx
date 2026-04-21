'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { loginUser } from '@/actions/auth'

export default function SignInPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await loginUser(formData)
    setIsSubmitting(false)

    if (res.success) {
      toast.success('Logged in successfully!')
      if (res.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    } else {
      toast.error(res.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-warm flex flex-col justify-center items-center p-6">
      <Link href="/" className="font-display text-2xl font-bold text-charcoal mb-8 tracking-widest uppercase">
        Saqib Rice Mills
      </Link>
      
      <div className="bg-ivory p-8 rounded-2xl shadow-card w-full max-w-md border border-brand">
        <h1 className="text-2xl font-semibold text-charcoal mb-2">Welcome Back</h1>
        <p className="text-sm text-mid-gray mb-6">Enter your email and password to access your account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal block mb-1.5">Email Address</label>
            <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="ali@example.com" />
          </div>
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="text-xs font-semibold text-charcoal block">Password</label>
              <Link href="#" className="text-[10px] text-mid-gray hover:text-gold transition-colors">Forgot password?</Link>
            </div>
            <input name="password" type="password" required className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full btn btn-emerald justify-center py-3.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand text-center flex flex-col gap-3">
          <Link href="/sign-up" className="text-xs text-charcoal hover:text-gold transition-colors font-medium">
            Don't have an account? <span className="text-emerald">Sign up</span>
          </Link>
          <Link href="/admin/register" className="text-[10px] text-mid-gray hover:text-charcoal transition-colors">
            Register as Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
