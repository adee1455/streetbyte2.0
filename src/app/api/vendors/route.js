import { NextResponse } from "next/server";
import { query } from "../../../lib/db";


export const POST = async (req) => {
  const { id, vendor_id, image_url } = await req.json();

  if (!id || !vendor_id || !image_url) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    await query({
      query: "INSERT INTO VendorImages (id, vendor_id, image_url) VALUES (?, ?, ?)",
      values: [id, vendor_id, image_url],
    });

    return NextResponse.json({ message: 'Vendor image added successfully' });
  } catch (error) {
    console.error('Error adding vendor image:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
