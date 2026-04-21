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

async function clearReviews() {
  const snap = await db.collection('products').get()
  console.log(`Clearing reviews for ${snap.size} products...`)
  
  const batch = db.batch()
  snap.docs.forEach(doc => {
    batch.update(doc.ref, { reviews: [] })
  })
  
  await batch.commit()
  console.log('Done! All fake reviews removed.')
}

clearReviews().catch(console.error)
