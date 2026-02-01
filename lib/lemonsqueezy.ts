import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Initializes the Lemon Squeezy SDK with the API key from environment variables.
 */
export function setupLemonSqueezy() {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) {
        throw new Error('LEMONSQUEEZY_API_KEY is not set in environment variables');
    }

    lemonSqueezySetup({
        apiKey,
        onError: (error) => {
            console.error('Lemon Squeezy SDK error:', error);
        },
    });
}
