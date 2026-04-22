'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const RECIPES = [
  {
    title: 'Classic Chicken Biryani',
    desc: 'The ultimate Pakistani biryani recipe using our aged 1121 Basmati — layers of spiced chicken and aromatic rice.',
    time: '90 min',
    rice: '1121 Basmati',
    slug: 'chicken-biryani',
    emoji: '🍗',
  },
  {
    title: 'Mutton Pulao',
    desc: 'A traditional Peshawari-style pulao with tender mutton, whole spices, and our Super Basmati rice.',
    time: '120 min',
    rice: 'Super Basmati',
    slug: 'mutton-pulao',
    emoji: '🥩',
  },
  {
    title: 'Royal Zarda',
    desc: 'A celebratory sweet rice dish with aromatic spices, saffron, and premium 1121 Sella Basmati.',
    time: '45 min',
    rice: '1121 Sella',
    slug: 'royal-zarda',
    emoji: '🍚',
  },
  {
    title: 'Chicken Fried Rice',
    desc: 'Quick, healthy and packed with flavor — the perfect way to use our versatile IRRI-9 rice.',
    time: '25 min',
    rice: 'IRRI-9 Rice',
    slug: 'chicken-fried-rice',
    emoji: '🥡',
  },
  {
    title: 'Beef Tahiri (Sindhi Style)',
    desc: 'A robust and spicy specialty using our 1121 Basmati and traditional Sindhi spices.',
    time: '120 min',
    rice: '1121 Basmati',
    slug: 'beef-tahiri',
    emoji: '🥘',
  },
  {
    title: 'Traditional Rice Kheer',
    desc: 'The ultimate creamy dessert made with slow-cooked milk and our aromatic broken basmati.',
    time: '60 min',
    rice: 'Broken Basmati',
    slug: 'rice-kheer',
    emoji: '🥣',
  },
]

export function RecipesPreview() {
  return (
    <section className="section-pad">
      <div className="flex justify-between items-end flex-wrap gap-5 mb-14">
        <div>
          <div className="eyebrow text-emerald mb-3">From Our Kitchen</div>
          <h2 className="display-lg text-charcoal">
            Premium <em className="italic text-emerald">Recipes</em>
          </h2>
          <p className="text-mid-gray font-light text-base leading-relaxed mt-3 max-w-lg">
            Explore chef-crafted recipes that showcase the exceptional quality of our rice varieties.
          </p>
        </div>
        <Link
          href="/recipes"
          className="text-2xs font-semibold tracking-widest2 uppercase text-emerald border-b border-gold pb-0.5 hover:text-gold transition-colors"
        >
          View All Recipes →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {RECIPES.map((recipe, i) => (
          <motion.div
            key={recipe.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/recipes/${recipe.slug}`}
              className="group block bg-ivory rounded-xl overflow-hidden border border-brand hover:border-gold/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-deep"
            >
              {/* Image placeholder */}
              <div
                className="h-48 flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #0a1f0a 0%, #002200 100%)' }}
              >
                {recipe.emoji}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-cream text-emerald">
                    {recipe.rice}
                  </span>
                  <span className="text-2xs text-mid-gray">⏱ {recipe.time}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-charcoal group-hover:text-emerald transition-colors mb-2">
                  {recipe.title}
                </h3>
                <p className="text-sm font-light text-mid-gray leading-relaxed line-clamp-2">
                  {recipe.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
