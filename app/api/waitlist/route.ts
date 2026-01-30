import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Waitlist from '@/models/Waitlist';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        try {
            await Waitlist.create({ email });
            return NextResponse.json({ message: 'Successfully joined waitlist!' }, { status: 201 });
        } catch (e: any) {
            if (e.code === 11000) {
                return NextResponse.json({ message: 'You are already on the list!' }, { status: 200 }); // Treat duplicate as success for UX
            }
            throw e;
        }
    } catch (error) {
        console.error('Waitlist Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
