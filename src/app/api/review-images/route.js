import { NextResponse } from "next/server";
import { query } from "../../../lib/db";


export const POST = async (req) => {
  const { id, vendor_id, review_id, image_url, created_at } = await req.json();

  if (!id || !review_id || !image_url) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await query({
      query: "INSERT INTO review_images (id, vendor_id, review_id, image_url, created_at) VALUES (?, ?, ?, ?, ?)",
      values: [id, vendor_id, review_id, image_url, created_at],
    });

    return NextResponse.json({ message: 'Review image added successfully' });
  } catch (error) {
    console.error('Error adding review image:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
