import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        const globalCount = await Dream.countDocuments({ status: 'completed' });

        let userCount = 0;
        if (session?.user) {
            const userEmail = session.user.email;
            const userId = (session.user as any).id;

            userCount = await Dream.countDocuments({
                userId: { $in: [userEmail, userId].filter(Boolean) },
                status: 'completed'
            });
        }

        return NextResponse.json({
            globalCount,
            userCount
        });
    } catch (error) {
        console.error('Stats fetch failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
