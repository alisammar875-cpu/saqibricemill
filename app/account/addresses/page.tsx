import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import Link from 'next/link'

export default function AddressesPage() {
  const addresses = [
    { id: 1, label: 'Home', name: 'Ahmed Raza', phone: '+92 300 1234567', line1: '45-B, Block 6, PECHS', city: 'Karachi', province: 'Sindh', postal: '75400', isDefault: true },
    { id: 2, label: 'Office', name: 'Ahmed Raza', phone: '+92 300 1234567', line1: 'Suite 302, Business Bay, Clifton', city: 'Karachi', province: 'Sindh', postal: '75600', isDefault: false },
  ]

  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28 section-pad min-h-[70vh]">
        <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          <span>/</span>
          <span className="text-charcoal font-semibold">Addresses</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-charcoal">Saved Addresses</h1>
          <button className="btn btn-emerald text-xs px-6 py-3">+ Add Address</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          {addresses.map(addr => (
            <div key={addr.id} className={`bg-ivory rounded-xl border p-6 relative ${addr.isDefault ? 'border-emerald' : 'border-brand'}`}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald/10 text-emerald">Default</span>
              )}
              <p className="text-2xs font-semibold tracking-wider uppercase text-gold mb-3">{addr.label}</p>
              <div className="text-sm text-mid-gray space-y-1">
                <p className="font-semibold text-charcoal">{addr.name}</p>
                <p>{addr.phone}</p>
                <p>{addr.line1}</p>
                <p>{addr.city}, {addr.province} {addr.postal}</p>
              </div>
              <div className="flex gap-4 mt-4 pt-4 border-t border-brand">
                <button className="text-2xs font-semibold text-emerald hover:text-gold transition-colors">Edit</button>
                {!addr.isDefault && (
                  <>
                    <button className="text-2xs font-semibold text-mid-gray hover:text-emerald transition-colors">Set as Default</button>
                    <button className="text-2xs font-semibold text-mid-gray hover:text-red-500 transition-colors">Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
