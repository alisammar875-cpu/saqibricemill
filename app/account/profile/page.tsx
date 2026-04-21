import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28 section-pad min-h-[70vh]">
        <div className="flex items-center gap-2 text-2xs text-mid-gray mb-6">
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          <span>/</span>
          <span className="text-charcoal font-semibold">Profile</span>
        </div>
        <h1 className="font-display text-3xl font-semibold text-charcoal mb-8">Profile Settings</h1>

        <div className="max-w-xl space-y-6">
          <div className="bg-ivory rounded-xl border border-brand p-6">
            <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-2xs font-semibold text-charcoal block mb-1.5">First Name</label>
                <input defaultValue="Ahmed" className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="text-2xs font-semibold text-charcoal block mb-1.5">Last Name</label>
                <input defaultValue="Raza" className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="text-2xs font-semibold text-charcoal block mb-1.5">Email</label>
                <input type="email" defaultValue="ahmed@email.com" className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
              <div>
                <label className="text-2xs font-semibold text-charcoal block mb-1.5">Phone</label>
                <input type="tel" defaultValue="+92 300 1234567" className="w-full px-4 py-3 rounded-lg border border-brand bg-ivory text-sm focus:outline-none focus:border-gold transition-colors" />
              </div>
            </div>
            <button className="btn btn-emerald text-xs px-8 py-3 mt-6">Save Changes</button>
          </div>

          <div className="bg-ivory rounded-xl border border-brand p-6">
            <h2 className="font-display text-lg font-semibold text-charcoal mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-brand accent-emerald" />
                <span className="text-sm text-mid-gray">Receive order status updates via email</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-brand accent-emerald" />
                <span className="text-sm text-mid-gray">Receive promotional offers and new harvest announcements</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-brand accent-emerald" />
                <span className="text-sm text-mid-gray">Receive SMS notifications</span>
              </label>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
