
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({
                canGenerate: true,
                remaining: 1,
                isPro: false,
                credits: 0
            });
        }

        let canGenerate = true;
        let remaining = 0;

        if (user.isPro) {
            canGenerate = true;
            remaining = 999;
        } else {
            // If they have credits, that's their "remaining" balance
            if (user.credits > 0) {
                remaining = user.credits;
                canGenerate = true;
            } else {
                // Only if credit is 0 do we check the daily free gift
                const lastGen = user.lastGenerationDate ? new Date(user.lastGenerationDate) : null;
                const today = new Date();
                const isSameDay = lastGen &&
                    lastGen.getDate() === today.getDate() &&
                    lastGen.getMonth() === today.getMonth() &&
                    lastGen.getFullYear() === today.getFullYear();

                remaining = isSameDay ? 0 : 1;
                canGenerate = remaining > 0;
            }
        }

        return NextResponse.json({
            canGenerate,
            remaining,
            isPro: user?.isPro || false,
            credits: user?.credits || 0,
            debug: {
                foundUser: !!user,
                email: session.user.email,
                lastGen: user?.lastGenerationDate,
                serverTime: new Date(),
                isSameDay: user?.lastGenerationDate ?
                    (new Date(user.lastGenerationDate).toDateString() === new Date().toDateString()) : 'N/A'
            }
        });

    } catch (error) {
        console.error('User status check failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
