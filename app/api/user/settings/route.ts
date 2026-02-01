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
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            privacyMode: user.privacyMode || false,
            notifications: user.notifications || false,
            haptics: user.haptics || false,
        });

    } catch (error: any) {
        console.error('Fetch settings failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { privacyMode, notifications, haptics } = await req.json();

        await dbConnect();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    ...(privacyMode !== undefined && { privacyMode }),
                    ...(notifications !== undefined && { notifications }),
                    ...(haptics !== undefined && { haptics }),
                }
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            settings: {
                privacyMode: user.privacyMode,
                notifications: user.notifications,
                haptics: user.haptics,
            }
        });

    } catch (error: any) {
        console.error('Update settings failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
