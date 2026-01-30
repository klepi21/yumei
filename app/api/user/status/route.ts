
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

        let canGenerate = true;
        let remaining = 1;

        if (user && user.lastGenerationDate) {
            const lastGen = new Date(user.lastGenerationDate);
            const today = new Date();
            const isSameDay = lastGen.getDate() === today.getDate() &&
                lastGen.getMonth() === today.getMonth() &&
                lastGen.getFullYear() === today.getFullYear();

            if (isSameDay && !user.isPro) {
                // If they have credits, they CAN generate (credits take priority)
                if (user.credits && user.credits > 0) {
                    canGenerate = true;
                    remaining = user.credits;
                } else {
                    canGenerate = false;
                    remaining = 0;
                }
            }
        }

        // Pro users always have access
        if (user && user.isPro) {
            canGenerate = true;
            remaining = 999;
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
