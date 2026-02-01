import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET() {
    try {
        await dbConnect();

        // Fetch random completed comics
        // In a real app with many records, we might use $sample
        const comics = await Dream.aggregate([
            { $match: { status: 'completed' } },
            { $sample: { size: 10 } }
        ]);

        return NextResponse.json(comics);
    } catch (error: any) {
        console.error('Public dreams API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
