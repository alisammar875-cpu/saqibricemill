import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Export & Bulk Orders',
  description: 'Saqib Rice Mills exports premium Pakistani basmati rice to 42 countries. Get factory-direct bulk pricing for containers and pallets.',
}

export default function ExportPage() {
  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28">
        {/* Hero */}
        <section className="py-20 md:py-28 text-center" style={{ background: 'linear-gradient(135deg, #001800 0%, #003300 50%, #001200 100%)' }}>
          <div className="px-6 max-w-3xl mx-auto">
            <div className="eyebrow mb-4" style={{ color: '#D4AF77' }}>International Trade</div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white mb-6">
              Export & <em className="italic" style={{ color: '#D4AF77' }}>Bulk Orders</em>
            </h1>
            <p className="text-white/55 font-light leading-relaxed text-lg">
              Factory-direct pricing for containers and bulk shipments. We export to 42 countries across the Middle East, Europe, North America, and Asia.
            </p>
          </div>
        </section>

        {/* Export offerings */}
        <section className="section-pad">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { title: 'Full Container (20ft)', desc: '18-20 metric tonnes of premium rice. Available in all varieties. FOB/CIF pricing.', icon: '🚛', price: 'From $650/MT' },
              { title: 'Half Container', desc: '9-10 metric tonnes. Ideal for first-time importers. Mixed varieties available.', icon: '📦', price: 'From $680/MT' },
              { title: 'Custom Packing', desc: 'OEM/ODM branding available. We pack under your label with your design.', icon: '🏷️', price: 'Quote on request' },
            ].map(item => (
              <div key={item.title} className="bg-ivory rounded-xl border border-brand p-8 hover:border-gold/40 transition-all hover:-translate-y-1 hover:shadow-deep">
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-mid-gray font-light leading-relaxed mb-4">{item.desc}</p>
                <p className="font-display text-lg font-semibold" style={{ color: '#D4AF77' }}>{item.price}</p>
              </div>
            ))}
          </div>

          {/* Key export markets */}
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-semibold text-charcoal mb-4">Export <em className="italic text-emerald">Markets</em></h2>
            <div className="flex flex-wrap justify-center gap-3 mt-6 max-w-3xl mx-auto">
              {['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Oman', 'Bahrain', 'UK', 'USA', 'Canada', 'Germany', 'France', 'Italy',
                'Kenya', 'Tanzania', 'South Africa', 'Malaysia', 'Singapore', 'Australia'].map(c => (
                <span key={c} className="px-4 py-2 rounded-full text-2xs font-semibold bg-cream text-charcoal border border-brand">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="max-w-2xl mx-auto bg-ivory rounded-xl border border-brand p-8">
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-6 text-center">Request Export Quote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Company Name *" className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              <input placeholder="Contact Person *" className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              <input type="email" placeholder="Email *" className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              <input placeholder="Country *" className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              <select className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
                <option>Rice Type</option>
                <option>1121 Basmati</option>
                <option>Super Basmati</option>
                <option>IRRI-6</option>
                <option>IRRI-9</option>
                <option>Sella Basmati</option>
                <option>Brown Basmati</option>
              </select>
              <select className="px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors">
                <option>Quantity</option>
                <option>1-10 MT</option>
                <option>10-20 MT (1 Container)</option>
                <option>20-40 MT (2 Containers)</option>
                <option>40+ MT</option>
              </select>
            </div>
            <textarea rows={4} placeholder="Additional requirements (packaging, labeling, certifications)..."
              className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors resize-none mb-4" />
            <button className="w-full btn btn-emerald py-4 justify-center text-sm">Submit Export Enquiry</button>
            <p className="text-center text-2xs text-mid-gray mt-3">We typically respond within 24 business hours</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
