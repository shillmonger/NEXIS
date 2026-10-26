/**
 * Migration Script: Add Sentinel Fields to Existing BotEntitlements
 * 
 * This script adds the Sentinel synchronization fields to existing BotEntitlement
 * documents that were created before the schema was updated.
 * 
 * Run with: npx ts-node scripts/migrate-entitlements.ts
 */

import mongoose from 'mongoose';
import { BotEntitlement } from '../models';
import connectDB from '../lib/db';

async function migrateEntitlements() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find entitlements without sentinelEventId
    const entitlementsWithoutEventId = await BotEntitlement.find({
      sentinelEventId: { $exists: false }
    });

    console.log(`Found ${entitlementsWithoutEventId.length} entitlements without sentinelEventId`);

    if (entitlementsWithoutEventId.length === 0) {
      console.log('No migration needed. All entitlements have sentinelEventId.');
      return;
    }

    // Update each entitlement
    let updated = 0;
    for (const entitlement of entitlementsWithoutEventId) {
      const { randomUUID } = await import('crypto');
      const sentinelEventId = randomUUID();
      
      await BotEntitlement.findByIdAndUpdate(entitlement._id, {
        sentinelEventId,
        sentinelSyncStatus: 'pending',
        sentinelRetryCount: 0,
      });
      
      updated++;
      console.log(`Updated entitlement ${entitlement._id} with sentinelEventId: ${sentinelEventId}`);
    }

    console.log(`Migration complete. Updated ${updated} entitlements.`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration
migrateEntitlements();
