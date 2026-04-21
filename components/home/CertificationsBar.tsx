'use client'

import { motion } from 'framer-motion'

const CERTS = [
  { name: 'ISO 9001:2015', icon: '🏅' },
  { name: 'HACCP', icon: '✅' },
  { name: 'Halal Certified', icon: '☪️' },
  { name: 'PSQCA Approved', icon: '🇵🇰' },
  { name: 'SGS Tested', icon: '🔬' },
  { name: 'FDA Registered', icon: '🏛️' },
]

export function CertificationsBar() {
  return (
    <section className="py-12 bg-cream border-y border-brand">
      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <p className="text-center eyebrow text-mid-gray mb-8">Trusted Certifications & Quality Standards</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {CERTS.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-mid-gray hover:text-emerald transition-colors cursor-default"
            >
              <span className="text-xl">{cert.icon}</span>
              <span className="text-xs font-semibold tracking-wider uppercase">{cert.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
