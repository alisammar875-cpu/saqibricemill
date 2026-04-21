import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { HeroSection } from '@/components/home/HeroSection'
import { TrustBadges } from '@/components/home/TrustBadges'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { BestsellerProducts } from '@/components/home/BestsellerProducts'
import { WhySection } from '@/components/home/WhySection'
import { CertificationsBar } from '@/components/home/CertificationsBar'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { RecipesPreview } from '@/components/home/RecipesPreview'
import { FactoryStory } from '@/components/home/FactoryStory'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { ProductCardSkeleton } from '@/components/shop/ProductCardSkeleton'

export default async function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBadges />
        <CategoriesGrid />
        <Suspense fallback={
          <section className="section-pad bg-warm">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </section>
        }>
          <BestsellerProducts />
        </Suspense>
        <WhySection />
        <CertificationsBar />
        <TestimonialsSection />
        <RecipesPreview />
        <FactoryStory />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  )
}
