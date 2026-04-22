'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    try {
      const { subscribeToNewsletter } = await import('@/actions/newsletter')
      const res = await subscribeToNewsletter(email)
      if (res.success) {
        setSubmitted(true)
        setEmail('')
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        toast.error(res.error || 'Could not subscribe. Please try again.')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again later.')
    }
  }

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="px-6 md:px-12 lg:px-20 max-w-[700px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-4xl mb-5">🌾</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal mb-4">
            Stay Connected
          </h2>
          <p className="text-mid-gray font-light leading-relaxed mb-8 max-w-md mx-auto">
            Get exclusive offers, new harvest announcements, and authentic rice recipes delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-5 px-8 bg-emerald/10 rounded-xl border border-emerald/30"
            >
              <p className="text-emerald font-semibold">✓ Thank you for subscribing!</p>
              <p className="text-sm text-mid-gray mt-1">Welcome to the Saqib Rice Mills family.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-lg border border-brand bg-ivory text-charcoal text-sm placeholder:text-mid-gray/60 focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="btn btn-emerald text-xs px-7 py-3.5 flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-2xs text-mid-gray/60 mt-4">
            No spam, ever. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
