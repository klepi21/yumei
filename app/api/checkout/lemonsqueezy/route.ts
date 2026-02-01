import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { setupLemonSqueezy } from '@/lib/lemonsqueezy';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { variantId, packName } = await req.json();

        if (!variantId) {
            return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
        }

        setupLemonSqueezy();

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            throw new Error('LEMONSQUEEZY_STORE_ID is not set');
        }

        // Create a checkout session
        const { data, error } = await createCheckout(
            storeId,
            variantId,
            {
                checkoutData: {
                    email: session.user.email ?? undefined,
                    custom: {
                        user_id: (session.user as any).id,
                        pack_name: packName,
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXTAUTH_URL}/dream/upgrade?success=true`,
                },
            }
        );

        if (error) {
            console.error('Lemon Squeezy checkout error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ url: data?.data.attributes.url });
    } catch (error: any) {
        console.error('Checkout API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
