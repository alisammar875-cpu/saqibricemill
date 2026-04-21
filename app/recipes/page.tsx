import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rice Recipes',
  description: 'Explore chef-crafted recipes using premium Saqib Rice Mills basmati and specialty rice varieties.',
}

const RECIPES = [
  {
    slug: 'chicken-biryani',
    title: 'Classic Chicken Biryani',
    desc: 'The ultimate Pakistani biryani using our aged 1121 Basmati — layers of spiced chicken and aromatic rice cooked to perfection.',
    time: '90 min', servings: '6', difficulty: 'Medium', rice: '1121 Basmati', emoji: '🍗',
    category: 'Main Course',
  },
  {
    slug: 'mutton-pulao',
    title: 'Mutton Pulao',
    desc: 'A traditional Peshawari-style pulao with tender mutton, whole spices, and our Super Basmati rice.',
    time: '120 min', servings: '8', difficulty: 'Medium', rice: 'Super Basmati', emoji: '🥩',
    category: 'Main Course',
  },
  {
    slug: 'buddha-bowl',
    title: 'Brown Rice Buddha Bowl',
    desc: 'A healthy, colorful bowl with our organic Brown Basmati, grilled vegetables, chickpeas, and tahini dressing.',
    time: '35 min', servings: '2', difficulty: 'Easy', rice: 'Brown Basmati', emoji: '🥗',
    category: 'Healthy',
  },
  {
    slug: 'chicken-fried-rice',
    title: 'Chicken Fried Rice',
    desc: 'Quick and flavorful stir-fried rice with vegetables and scrambled eggs, using day-old IRRI-9 rice.',
    time: '25 min', servings: '4', difficulty: 'Easy', rice: 'IRRI-9', emoji: '🍳',
    category: 'Quick Meals',
  },
  {
    slug: 'kheer',
    title: 'Traditional Rice Kheer',
    desc: 'Rich and creamy Pakistani dessert made with broken basmati, whole milk, cardamom, and pistachios.',
    time: '60 min', servings: '6', difficulty: 'Easy', rice: 'Super Basmati', emoji: '🍮',
    category: 'Dessert',
  },
  {
    slug: 'beef-tahiri',
    title: 'Beef Tahiri (Sindhi Biryani)',
    desc: 'Sindhi-style one-pot biryani with spicy beef, potatoes, and our aromatic 1121 Basmati.',
    time: '105 min', servings: '8', difficulty: 'Medium', rice: '1121 Basmati', emoji: '🫕',
    category: 'Main Course',
  },
]

export default function RecipesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="pt-28">
        {/* Hero */}
        <section
          className="py-16 md:py-20 text-center"
          style={{ background: 'linear-gradient(135deg, #1a0e08 0%, #2d1810 50%, #1a0e08 100%)' }}
        >
          <div className="px-6 max-w-3xl mx-auto">
            <div className="eyebrow mb-3" style={{ color: '#D4AF77' }}>From Our Kitchen</div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
              Premium <em className="italic" style={{ color: '#D4AF77' }}>Recipes</em>
            </h1>
            <p className="text-white/50 font-light leading-relaxed">
              Chef-crafted recipes that showcase the exceptional quality of our rice varieties.
              From traditional biryani to modern healthy bowls.
            </p>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="section-pad">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {RECIPES.map(recipe => (
              <Link
                key={recipe.slug}
                href={`/recipes/${recipe.slug}`}
                className="group block bg-ivory rounded-xl overflow-hidden border border-brand hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-deep"
              >
                {/* Image */}
                <div
                  className="h-52 flex items-center justify-center text-7xl"
                  style={{ background: 'linear-gradient(135deg, #0a1f0a 0%, #002200 100%)' }}
                >
                  {recipe.emoji}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-cream text-emerald">
                      {recipe.rice}
                    </span>
                    <span className="text-2xs text-mid-gray">{recipe.category}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-charcoal group-hover:text-emerald transition-colors mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-sm font-light text-mid-gray leading-relaxed line-clamp-2 mb-4">
                    {recipe.desc}
                  </p>
                  <div className="flex items-center gap-4 text-2xs text-mid-gray border-t border-brand pt-4">
                    <span>⏱ {recipe.time}</span>
                    <span>👥 {recipe.servings} servings</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
