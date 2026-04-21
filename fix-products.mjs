import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';




if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

async function fix() {
  const snap = await db.collection('products').get();
  console.log(`Found ${snap.size} products.`);
  
  let fixedCount = 0;
  for (const doc of snap.docs) {
    const data = doc.data();
    let needsUpdate = false;
    let updates = {};

    if (!data.slug) {
      updates.slug = (data.name || doc.id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      needsUpdate = true;
    }

    if (data.basePrice === undefined) {
      updates.basePrice = 0;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await db.collection('products').doc(doc.id).update(updates);
      console.log(`Fixed product: ${data.name || doc.id} (Set slug: ${updates.slug})`);
      fixedCount++;
    }
  }
  
  console.log(`Finished fixing ${fixedCount} products.`);
}

fix().catch(console.error).finally(() => process.exit(0));
