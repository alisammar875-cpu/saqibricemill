import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Factory Story & Certifications',
  description: 'Learn about Saqib Rice Mills — 37 years of premium rice production from Gujranwala, Punjab. ISO 9001 certified, exporting to 42 countries.',
}

export default function AboutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28">
        {/* Hero */}
        <section
          className="py-20 md:py-28 text-center"
          style={{ background: 'linear-gradient(135deg, #001800 0%, #003300 50%, #001200 100%)' }}
        >
          <div className="px-6 max-w-3xl mx-auto">
            <div className="eyebrow mb-4" style={{ color: '#D4AF77' }}>Est. 1987 · Gujranwala, Punjab</div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-6">
              Our <em className="italic" style={{ color: '#D4AF77' }}>Story</em>
            </h1>
            <p className="text-white/55 font-light leading-relaxed text-lg">
              From a small family mill to one of Pakistan&apos;s most trusted rice exporters —
              our journey is built on quality, integrity, and a deep love for the grain.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-pad">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-semibold text-charcoal mb-12 text-center">
              37 Years of <em className="italic text-emerald">Excellence</em>
            </h2>
            <div className="space-y-12">
              {[
                { year: '1987', title: 'The Beginning', desc: 'Saqib founded a small rice husking unit in Industrial Area Phase-II, Gujranwala with a single processing line and a vision for quality.' },
                { year: '1995', title: 'First Export', desc: 'After years of building a reputation for quality domestically, we shipped our first container of 1121 Basmati to the UAE.' },
                { year: '2005', title: 'ISO Certification', desc: 'Achieved ISO 9001:2000 certification, formalizing our commitment to quality management and international standards.' },
                { year: '2012', title: 'Modern Factory', desc: 'Inaugurated our state-of-the-art processing facility with color sorters, destoners, and automated packaging lines.' },
                { year: '2020', title: 'Digital Transformation', desc: 'Launched direct-to-consumer online sales, bringing factory-fresh rice to customers across Pakistan.' },
                { year: '2026', title: 'Today', desc: 'Exporting to 42 countries, partnering with 500+ farmers, processing 500 tonnes monthly, and serving 100,000+ happy customers.' },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-6">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald/10 border-2 border-emerald flex items-center justify-center">
                      <span className="text-sm font-bold text-emerald">{item.year}</span>
                    </div>
                    {i < 5 && <div className="w-px h-full bg-brand mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
                    <p className="text-sm text-mid-gray font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section id="certifications" className="py-20 bg-cream">
          <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
            <h2 className="font-display text-3xl font-semibold text-charcoal mb-4 text-center">
              Certifications & <em className="italic text-emerald">Standards</em>
            </h2>
            <p className="text-mid-gray text-center mb-12 max-w-lg mx-auto font-light">
              We maintain the highest international quality certifications to ensure every grain meets global standards.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: 'ISO 9001:2015', icon: '🏅', desc: 'Quality Management' },
                { name: 'HACCP', icon: '✅', desc: 'Food Safety' },
                { name: 'Halal', icon: '☪️', desc: 'Halal Certified' },
                { name: 'PSQCA', icon: '🇵🇰', desc: 'Pakistan Standards' },
                { name: 'SGS', icon: '🔬', desc: 'Lab Tested' },
                { name: 'FDA', icon: '🏛️', desc: 'US FDA Registered' },
              ].map(cert => (
                <div key={cert.name} className="bg-ivory rounded-xl border border-brand p-6 text-center hover:border-gold/40 transition-all">
                  <span className="text-3xl block mb-3">{cert.icon}</span>
                  <p className="font-display text-sm font-semibold text-charcoal">{cert.name}</p>
                  <p className="text-2xs text-mid-gray mt-1">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Factory Stats */}
        <section className="py-16" style={{ background: 'var(--charcoal, #1A1A18)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto">
            {[
              { num: '37+', label: 'Years' },
              { num: '500+', label: 'Partner Farmers' },
              { num: '200+', label: 'Employees' },
              { num: '42', label: 'Export Countries' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl font-semibold" style={{ color: '#D4AF77' }}>{s.num}</p>
                <p className="text-xs uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section-pad text-center">
          <h2 className="font-display text-3xl font-semibold text-charcoal mb-4">
            Visit Our <em className="italic text-emerald">Factory</em>
          </h2>
          <p className="text-mid-gray font-light max-w-lg mx-auto mb-8">
            We welcome factory visits. See our processing facility, meet our team, and learn about rice production firsthand.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+92553842100" className="btn btn-emerald text-xs px-8 py-3.5">📞 Call Us</a>
            <a href="https://wa.me/923007654321" className="btn btn-outline-gold text-xs px-7 py-3">💬 WhatsApp</a>
          </div>
          <div className="mt-8 text-sm text-mid-gray">
            <p>📍 Industrial Area Phase-II, Gujranwala, Punjab 52250, Pakistan</p>
            <p className="mt-1">🕐 Mon–Sat: 8:00 AM – 6:00 PM PKT</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
