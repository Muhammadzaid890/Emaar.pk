import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File provide nahi ki gayi.' },
        { status: 400 }
      );
    }

    // Convert file blob to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Auto-detect whether it is an image or video
    const isVideo = file.type?.startsWith('video');
    const resourceType = isVideo ? 'video' : 'image';

    // Stream upload directly to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'emaar_properties',
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
    });
  } catch (error) {
    console.error('Cloudinary API upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}