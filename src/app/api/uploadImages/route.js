import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a temporary file
    const tempFilePath = join(tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${Date.now()}-${encodeURIComponent(file.name)}`,
      Body: buffer,
      ContentType: file.type,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      return NextResponse.json({ url: uploadResult.Location });
    } catch (s3Error) {
      console.error('S3 Upload error:', {
        message: s3Error.message,
        code: s3Error.code,
        requestId: s3Error.requestId,
      });
      return NextResponse.json(
        { error: `S3 upload failed: ${s3Error.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
