import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const GET = async (req) => {
  console.log('VendorPage API route called');
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  console.log('Vendor ID:', id);

  if (!id) {
    return NextResponse.json(
      { message: 'Vendor ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch vendor details
    const vendors = await query({
      query: "SELECT * FROM vendors WHERE id = ?",
      values: [id],
    });

    if (vendors.length === 0) {
      console.log('No vendor found with ID:', id);
      return NextResponse.json(
        { message: 'Vendor not found' },
        { status: 404 }
      );
    }

    // Fetch related data
    const images = await query({
      query: "SELECT image_url FROM VendorImages WHERE vendor_id = ?",
      values: [id],
    });

    const menu = await query({
      query: "SELECT image_url FROM MenuImages WHERE vendor_id = ?",
      values: [id],
    });

    const reviews = await query({
      query: "SELECT * FROM reviews WHERE vendor_id = ?",
      values: [id],
    });

    console.log('Fetched Data:', { vendors, images, menu, reviews });

    // Construct response object
    const vendorWithDetails = {
      ...vendors[0],
      images: images.map((img) => img.image_url),
      menu: menu.map((item) => item.image_url),
      reviews,
    };

    return NextResponse.json(vendorWithDetails);
  } catch (e) {
    console.error('Error fetching vendor details:', e.message);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
