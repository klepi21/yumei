import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        // Verify the signature
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;

        if (eventName === 'order_created') {
            const { custom_data, total_formatted } = payload.data.attributes;
            const userId = custom_data.user_id;
            const packName = custom_data.pack_name;

            // Determine credits based on pack name or variant
            let creditsToAdd = 0;
            const variantId = payload.data.attributes.variant_id.toString();

            // Mapping variant IDs or names to credits
            // The user should provide these IDs from their LS dashboard
            if (packName === 'PULSE PACK') creditsToAdd = 50;
            else if (packName === 'SYNAPSE PACK') creditsToAdd = 200;
            else if (packName === 'NEURAL ENGINE') creditsToAdd = 500;

            if (creditsToAdd > 0 && userId) {
                await dbConnect();
                await User.findByIdAndUpdate(userId, {
                    $inc: { credits: creditsToAdd }
                });
                console.log(`Added ${creditsToAdd} credits to user ${userId} for ${packName}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
