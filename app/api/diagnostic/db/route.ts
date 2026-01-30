
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Dream from '@/models/Dream';

export async function GET() {
    try {
        await dbConnect();

        // 1. Check Connection State
        const state = mongoose.connection.readyState;
        const stateMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        // 2. Try simple write
        const testDoc = await Dream.create({
            userId: 'test_diagnostic',
            input: 'diagnostic_test',
            style: 'test',
            comicImageUrl: 'http://test.com',
            panelCount: 1,
            imagePrompt: 'test',
            status: 'diagnostic',
            sanitizedDream: 'diagnostic_test'
        });

        // 3. Delete verify
        await Dream.deleteOne({ _id: testDoc._id });

        return NextResponse.json({
            status: 'success',
            connectionState: stateMap[state],
            databaseName: mongoose.connection.db?.databaseName,
            writeTest: 'passed'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
