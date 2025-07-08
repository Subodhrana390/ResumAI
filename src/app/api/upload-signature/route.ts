import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export async function POST() {
    // Check for required environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        return NextResponse.json(
            { error: 'Cloudinary credentials are not configured.' },
            { status: 500 }
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
    
    const timestamp = Math.round(new Date().getTime() / 1000);

    try {
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
            },
            apiSecret
        );
        
        return NextResponse.json({ timestamp, signature, apiKey, cloudName });

    } catch (error) {
        console.error('Error generating Cloudinary signature:', error);
        return NextResponse.json(
            { error: 'Failed to generate upload signature.' },
            { status: 500 }
        );
    }
}
