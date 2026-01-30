import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import dbConnect from '@/lib/db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log('🔑 SignIn Attempt:', user.email);
            try {
                await dbConnect();
                console.log('✅ DB Connected in SignIn');

                const existingUser = await User.findOne({ email: user.email });
                console.log('👤 User found in DB:', !!existingUser);

                if (!existingUser) {
                    const newUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        betaAccess: false,
                    });
                    console.log('🆕 Created new user:', newUser.email);
                }
                return true;
            } catch (error) {
                console.error("❌ SignIn Callback Error:", error);
                return false;
            }
        },
        async session({ session, token }) {
            if (session.user && token) {
                // @ts-ignore
                session.user.id = token.id || token.sub;
                // @ts-ignore
                session.user.betaAccess = token.betaAccess;
                // @ts-ignore
                session.user.credits = token.credits;
            }
            return session;
        },
        async jwt({ token, user, trigger, session }) {
            if (token.email) {
                try {
                    await dbConnect();
                    const dbUser = await User.findOne({ email: token.email });
                    if (dbUser) {
                        token.betaAccess = dbUser.betaAccess;
                        token.credits = dbUser.credits || 0;
                        token.id = dbUser._id.toString();
                        console.log('🎫 JWT Updated for:', token.email, 'Access:', token.betaAccess);
                    }
                } catch (error) {
                    console.error("❌ JWT Callback Error:", error);
                }
            }
            return token;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
    debug: process.env.NODE_ENV === 'development' || true, // Enable for now to debug production
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
