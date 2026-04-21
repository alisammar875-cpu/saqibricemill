import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import type { Metadata } from 'next'

const RECIPES_DB: Record<string, any> = {
  'chicken-biryani': {
    title: 'Classic Chicken Biryani',
    emoji: '🍗',
    rice: '1121 Basmati',
    time: '90 min',
    servings: '6',
    difficulty: 'Medium',
    category: 'Main Course',
    intro: 'The undisputed king of Pakistani cuisine. This authentic biryani recipe uses our aged 1121 Super Basmati to create layers of perfectly spiced chicken and aromatic rice that will transport you to the streets of Old Karachi.',
    ingredients: [
      '500g Saqib 1121 Super Basmati Rice',
      '1kg chicken (bone-in pieces)',
      '2 large onions, thinly sliced',
      '1 cup yogurt',
      '4 green chilies',
      '1 tbsp ginger-garlic paste',
      '1 tsp turmeric powder',
      '2 tsp red chili powder',
      '1 tsp garam masala',
      '4-5 whole cardamom pods',
      '4-5 whole cloves',
      '2 bay leaves',
      '1 cinnamon stick',
      'Saffron strands soaked in warm milk',
      'Fresh mint and coriander leaves',
      '3 tbsp cooking oil + 2 tbsp ghee',
      'Salt to taste',
    ],
    steps: [
      'Wash and soak the 1121 Basmati rice for 30 minutes. This is crucial — our aged basmati absorbs water perfectly, ensuring each grain cooks to its maximum length.',
      'Boil water with whole spices (cardamom, cloves, bay leaves, cinnamon). Add soaked rice and cook until 70% done. Drain and set aside.',
      'In a heavy-bottomed pot, heat oil and fry onions until deep golden brown. Remove half for garnish.',
      'Add ginger-garlic paste to remaining onions, cook for 2 minutes. Add chicken pieces and seal on high heat.',
      'Add yogurt, turmeric, red chili, and salt. Cook on medium heat until chicken is 80% done and gravy is thick.',
      'Layer the partially cooked rice over the chicken. Drizzle saffron milk, scatter remaining fried onions, mint, and coriander.',
      'Seal the pot tightly with foil and lid. Cook on lowest flame for 25-30 minutes (dum).',
      'Gently mix layers before serving. The 1121 grains should be long, separate, and aromatic.',
    ],
    tips: [
      'Using aged 1121 Basmati is key — it absorbs less water and stays separate.',
      'Never over-soak the rice. 30 minutes is the sweet spot.',
      'The dum (slow steam) process is what marries all the flavors together.',
      'Serve with raita, salad, and a squeeze of lemon.',
    ],
    nutrition: { calories: '420 per serving', protein: '28g', carbs: '52g', fat: '12g' },
  },
  'mutton-pulao': {
    title: 'Mutton Pulao',
    emoji: '🥩',
    rice: 'Super Basmati',
    time: '120 min',
    servings: '8',
    difficulty: 'Medium',
    category: 'Main Course',
    intro: 'A Peshawari classic that celebrates simplicity. Tender mutton cooked with whole spices and our aromatic Super Basmati rice creates a dish that\'s both elegant and deeply satisfying.',
    ingredients: [
      '600g Saqib Super Basmati Rice',
      '750g mutton (bone-in)',
      '2 onions, sliced',
      '1 tbsp ginger-garlic paste',
      '6 whole black peppercorns',
      '4 green cardamom',
      '2 black cardamom',
      '1 cinnamon stick',
      '4 cloves',
      '2 bay leaves',
      'Salt to taste',
      '3 tbsp oil',
    ],
    steps: [
      'Wash and soak Super Basmati rice for 20 minutes.',
      'In a large pot, heat oil and fry onions until golden.',
      'Add mutton pieces and sear on high heat for 5 minutes.',
      'Add ginger-garlic paste and all whole spices. Stir for 2 minutes.',
      'Add water (double the volume of rice) and salt. Bring to boil, then simmer until mutton is tender (about 45 minutes).',
      'Add drained rice to the pot. Cook on medium heat until water level drops to rice level.',
      'Reduce heat to lowest, cover tightly and cook for 20 minutes.',
      'Let it rest for 10 minutes before serving.',
    ],
    tips: [
      'Super Basmati\'s natural aroma complements mutton perfectly.',
      'The stock from the mutton is what gives pulao its rich flavor.',
    ],
    nutrition: { calories: '480 per serving', protein: '32g', carbs: '48g', fat: '16g' },
  },
  'buddha-bowl': {
    title: 'Brown Rice Buddha Bowl',
    emoji: '🥗',
    rice: 'Brown Basmati',
    time: '35 min',
    servings: '2',
    difficulty: 'Easy',
    category: 'Healthy',
    intro: 'A vibrant, nutrient-packed bowl that proves healthy eating can be absolutely delicious. Our organic Brown Basmati provides a nutty base for a rainbow of grilled vegetables and creamy tahini dressing.',
    ingredients: [
      '200g Saqib Organic Brown Basmati Rice',
      '1 sweet potato, cubed',
      '1 cup chickpeas (cooked)',
      '1 avocado, sliced',
      '1 cup edamame',
      'Cherry tomatoes, halved',
      'Baby spinach',
      'Tahini dressing',
      'Sesame seeds',
      'Olive oil, salt, pepper',
    ],
    steps: [
      'Cook Brown Basmati rice according to package directions (about 25 minutes). It retains a lovely nutty bite.',
      'Roast sweet potato cubes with olive oil at 200°C for 20 minutes.',
      'Warm the chickpeas with a pinch of cumin and paprika.',
      'Assemble: place rice as the base, arrange all toppings in sections.',
      'Drizzle with tahini dressing and sprinkle sesame seeds.',
    ],
    tips: [
      'Brown Basmati has 3x more fiber than white rice — perfect for health-conscious meals.',
      'Prep the rice ahead of time for quick weekday meals.',
    ],
    nutrition: { calories: '380 per serving', protein: '14g', carbs: '52g', fat: '14g' },
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const recipe = RECIPES_DB[slug]
  if (!recipe) return { title: 'Recipe Not Found' }
  return { title: recipe.title, description: recipe.intro.slice(0, 160) }
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = RECIPES_DB[slug]

  if (!recipe) {
    return (
      <>
        <AnnouncementBar /><Navbar />
        <main className="pt-28 section-pad text-center min-h-[60vh] flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">📖</span>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Recipe Not Found</h1>
          <a href="/recipes" className="btn btn-emerald text-xs px-8 py-3 mt-4">Browse Recipes</a>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <AnnouncementBar /><Navbar />
      <main className="pt-28">
        {/* Hero */}
        <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, #1a0e08 0%, #2d1810 100%)' }}>
          <span className="text-7xl block mb-4">{recipe.emoji}</span>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">{recipe.title}</h1>
          <div className="flex items-center justify-center gap-6 text-white/50 text-sm">
            <span>⏱ {recipe.time}</span>
            <span>👥 {recipe.servings} servings</span>
            <span>📊 {recipe.difficulty}</span>
            <span className="px-3 py-1 rounded-full text-2xs font-semibold tracking-wider uppercase" style={{ background: 'rgba(0,100,0,0.3)', color: '#D4AF77' }}>
              Best with: {recipe.rice}
            </span>
          </div>
        </section>

        <div className="section-pad max-w-3xl mx-auto">
          <p className="text-mid-gray font-light leading-relaxed text-lg mb-12">{recipe.intro}</p>

          {/* Ingredients */}
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">🧾 Ingredients</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
            {recipe.ingredients.map((ing: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-mid-gray">
                <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                {ing}
              </li>
            ))}
          </ul>

          {/* Steps */}
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">👨‍🍳 Instructions</h2>
          <ol className="space-y-6 mb-12">
            {recipe.steps.map((step: string, i: number) => (
              <li key={i} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-emerald/10 flex items-center justify-center text-sm font-bold text-emerald flex-shrink-0">{i + 1}</span>
                <p className="text-sm text-mid-gray font-light leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>

          {/* Tips */}
          {recipe.tips && (
            <>
              <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">💡 Pro Tips</h2>
              <div className="bg-cream rounded-xl p-6 mb-12 space-y-3">
                {recipe.tips.map((tip: string, i: number) => (
                  <p key={i} className="text-sm text-mid-gray font-light flex items-start gap-2">
                    <span className="text-gold">✦</span> {tip}
                  </p>
                ))}
              </div>
            </>
          )}

          {/* Nutrition */}
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">📊 Nutrition Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {Object.entries(recipe.nutrition).map(([key, val]) => (
              <div key={key} className="bg-ivory rounded-xl border border-brand p-4 text-center">
                <p className="font-display text-lg font-semibold text-charcoal">{val as string}</p>
                <p className="text-2xs text-mid-gray uppercase tracking-wider mt-1 capitalize">{key}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-emerald/5 rounded-xl border border-emerald/20 p-8 text-center">
            <p className="font-display text-xl font-semibold text-charcoal mb-2">Make this with Saqib {recipe.rice}</p>
            <p className="text-sm text-mid-gray mb-4">Get the perfect rice for this recipe, delivered to your door.</p>
            <a href="/shop" className="btn btn-emerald text-xs px-8 py-3">Shop {recipe.rice} →</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
