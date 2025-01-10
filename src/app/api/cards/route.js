import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

// Fetch all vendor details for a given city
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    if (!city) {
      return NextResponse.json(
        { message: "City parameter is required" },
        { status: 400 }
      );
    }

    let queryString = "SELECT * FROM vendors WHERE city = ?";
    let queryValues = [city];

    if (search) {
      queryString += " AND name LIKE ?";
      queryValues.push(`%${search}%`);
    }

    if (category) {
      queryString += " AND foodType = ?";
      queryValues.push(category);
    }

    console.log("Query:", queryString, "Values:", queryValues);

    const vendors = await query({
      query: queryString,
      values: queryValues,
    });

    if (!vendors || vendors.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch images and menus for each vendor
    const vendorsWithImages = await Promise.all(
      vendors.map(async (vendor) => {
        try {
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
            images: images.map((img) => img.image_url),
            menu: menu.map((menu) => menu.image_url),
          };
        } catch (error) {
          console.error(
            `Error fetching images for vendor ${vendor.id}:`,
            error
          );
          return {
            ...vendor,
            images: [],
            menu: [],
          };
        }
      })
    );

    return NextResponse.json(vendorsWithImages);
  } catch (error) {
    // Log the full error details
    console.error("Detailed error in /api/cards:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });

    return NextResponse.json(
      { message: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};
