
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.log('❌ History fetch unauthorized: No session');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userEmail = session.user.email;
        const userId = (session.user as any).id;

        console.log(`🔍 Fetching history for: ${userEmail} OR ${userId}`);

        // Search for dreams where userId is either the email OR the auth ID
        // This covers both legacy and new save formats
        const query = {
            userId: { $in: [userEmail, userId].filter(Boolean) }
        };

        const dreams = await Dream.find(query)
            .sort({ createdAt: -1 })
            .select('createdAt input sanitizedDream comicImageUrl style emotion status')
            .limit(31);

        console.log(`✅ Found ${dreams.length} dreams`);

        return NextResponse.json({ dreams });
    } catch (error) {
        console.error('Failed to fetch dream history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
