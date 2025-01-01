import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const GET = async (req) => {
  try {
    // Fetch all vendors
    const vendors = await query({
      query: "SELECT * FROM vendors",
    });

    // Fetch images and menus for each vendor
    const vendorsWithImages = await Promise.all(vendors.map(async (vendor) => {
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
        menu: menu.map(menu => menu.image_url) 
      };
    }));

    // Respond with the enriched vendors data
    return NextResponse.json(vendorsWithImages);
  } catch (e) {
    console.error("Error fetching vendors or images:", e); // Log errors for debugging
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 }); // Send error response
  }
};
