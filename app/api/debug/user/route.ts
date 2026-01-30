
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'No session' });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        return NextResponse.json({
            email: session.user.email,
            userRecord: user,
            explanation: user?.betaAccess ? "User has betaAccess=true, so they are PRO" : "User is FREE tier"
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message });
    }
}
