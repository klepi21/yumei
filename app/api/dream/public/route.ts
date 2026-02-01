import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET() {
    try {
        await dbConnect();

        // Fetch random completed comics from users who don't have privacyMode enabled
        const comics = await Dream.aggregate([
            { $match: { status: 'completed' } },
            // Join with User collection to check privacyMode
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'email', // Note: Check if userId stores email or _id
                    as: 'creator'
                }
            },
            // Filter out if user exists and privacyMode is true
            {
                $match: {
                    'creator.privacyMode': { $ne: true }
                }
            },
            { $sample: { size: 10 } },
            // Clean up the output
            {
                $project: {
                    creator: 0
                }
            }
        ]);

        return NextResponse.json(comics);
    } catch (error: any) {
        console.error('Public dreams API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
