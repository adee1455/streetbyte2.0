import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 }
      );
    }

    const vendors = await query({
      query: "SELECT * FROM vendors WHERE created_by = ?",
      values: [username],
    });

    const vendorsWithDetails = await Promise.all(
      vendors.map(async (vendor) => {
        const images = await query({
          query: "SELECT image_url FROM VendorImages WHERE vendor_id = ?",
          values: [vendor.id],
        });

        const menu = await query({
          query: "SELECT image_url FROM MenuImages WHERE vendor_id = ?",
          values: [vendor.id],
        });

        return {
          ...vendor,
          images: images.map(img => img.image_url),
          menu: menu.map(menu => menu.image_url),
        };
      })
    );

    return NextResponse.json(vendorsWithDetails);
  } catch (error) {
    console.error("Error fetching profile vendors:", error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};