import fs from 'fs'
import path from 'path'

// Manually load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '')
    }
  })
}

import { db } from './lib/firebase-admin'

async function checkProducts() {
  const snap = await db.collection('products').get()
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  
  console.log(`Checking ${products.length} products...`)
  
  products.forEach((p: any) => {
    console.log(`- Product: ${p.name} (ID: ${p.id})`)
    if (!p.slug) console.error(`  ❌ Missing slug`)
    if (!p.basePrice && p.basePrice !== 0) console.error(`  ❌ Missing basePrice`)
    if (!p.category) console.error(`  ❌ Missing category`)
    if (!p.variants || !p.variants.length) console.warn(`  ⚠️ No variants`)
    if (p.category && typeof p.category !== 'object') console.error(`  ❌ Category is not an object: ${typeof p.category}`)
  })
}

checkProducts().catch(console.error)
