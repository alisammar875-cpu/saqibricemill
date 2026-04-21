'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TESTIMONIALS = [
  {
    name: 'Ahmed Raza',
    city: 'Karachi',
    rating: 5,
    text: 'The 1121 Basmati from Saqib Rice Mills is simply the best biryani rice I have ever used. Every grain cooks perfectly separate and the aroma fills the entire house.',
    product: '1121 Super Basmati',
  },
  {
    name: 'Fatima Hassan',
    city: 'Lahore',
    rating: 5,
    text: 'I switched to Saqib Brown Basmati for health reasons and the taste is incredible. My family didn\'t even notice the switch! The packaging is also very premium.',
    product: 'Brown Basmati',
  },
  {
    name: 'Muhammad Ali Sheikh',
    city: 'Islamabad',
    rating: 5,
    text: 'As a restaurant owner, consistency matters. Saqib Rice Mills delivers the same exceptional quality in every 25kg sack. Their bulk pricing is unbeatable.',
    product: 'Bulk 1121 Basmati',
  },
  {
    name: 'Sarah Khan',
    city: 'Dubai, UAE',
    rating: 5,
    text: 'I order from Pakistan to Dubai and the quality is better than anything available locally. The vacuum packaging ensures it arrives perfectly fresh.',
    product: 'Super Basmati Export',
  },
  {
    name: 'Rashid Mehmood',
    city: 'Faisalabad',
    rating: 5,
    text: 'Running a catering business, I need reliable rice. Saqib IRRI-9 gives me consistency at amazing value. Delivery is always on time.',
    product: 'IRRI-9 Rice',
  },
  {
    name: 'Ayesha Malik',
    city: 'Multan',
    rating: 5,
    text: 'The Sella Basmati is perfect for pulao – each grain stays firm and separate. My guests always ask which brand I use. Highly recommended!',
    product: 'Sella Basmati',
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="section-pad bg-warm">
      <div className="text-center mb-14">
        <div className="eyebrow text-emerald mb-3">Customer Love</div>
        <h2 className="display-lg text-charcoal">
          What Our <em className="italic text-emerald">Customers</em> Say
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-ivory rounded-xl p-7 border border-brand hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-deep"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} className="text-sm" style={{ color: n <= t.rating ? '#D4AF77' : '#D1D1C7' }}>
                  ★
                </span>
              ))}
            </div>

            <p className="text-sm text-charcoal leading-relaxed mb-5 font-light">
              &ldquo;{t.text}&rdquo;
            </p>

            <div className="flex items-center justify-between border-t border-brand pt-4">
              <div>
                <p className="font-display text-sm font-semibold text-charcoal">{t.name}</p>
                <p className="text-2xs text-mid-gray">{t.city}</p>
              </div>
              <span className="text-2xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-cream text-emerald">
                {t.product}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
