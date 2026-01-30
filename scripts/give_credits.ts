
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });


import mongoose from 'mongoose';
import User from '../models/User';
import dbConnect from '../lib/db';

async function main() {
    console.log('🔌 Connecting to database...');
    try {
        await dbConnect();
        console.log('✅ Connected.');
    } catch (e) {
        console.error('❌ DB Connection failed:', e);
        process.exit(1);
    }

    const targetId = '697b575f1265af0ee44c094f';
    const targetEmail = 'kolepidas@gmail.com';

    console.log(`🔍 Searching for user: ID=${targetId} OR Email=${targetEmail}`);

    // Try finding by ID first
    let user;
    try {
        user = await User.findById(targetId);
    } catch (e) {
        console.log('⚠️ Invalid ID format or not found by ID.');
    }

    // If not found, try email
    if (!user) {
        console.log('⚠️ User not found by ID. Trying email...');
        user = await User.findOne({ email: targetEmail });
    }

    if (!user) {
        console.error('❌ User not found!');
        process.exit(1);
    }

    console.log(`👤 Found User: ${user.name} (${user.email})`);
    console.log(`   Current Credits: ${user.credits || 0}`);

    // Update credits
    user.credits = 5;
    await user.save();

    console.log(`✅ SUCCESS! Updated credits to: ${user.credits}`);

    // Verify
    const verifyUser = await User.findById(user._id);
    console.log(`   Verified DB Value: ${verifyUser?.credits}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(console.error);
