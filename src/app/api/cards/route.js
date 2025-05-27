import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

// Helper function to retry database operations
const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
};

// Fetch all vendor details for a given city
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    console.log("API Request params:", { city, search, category });

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

    // Use retry logic for the main vendors query
    const vendors = await retryOperation(() => 
      query({
        query: queryString,
        values: queryValues,
      })
    );

    if (!vendors || vendors.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch images and menus for each vendor with retry logic
    const vendorsWithImages = await Promise.all(
      vendors.map(async (vendor) => {
        try {
          const [images, menu] = await Promise.all([
            retryOperation(() => 
              query({
                query: "SELECT image_url FROM VendorImages WHERE vendor_id = ?",
                values: [vendor.id],
              })
            ),
            retryOperation(() => 
              query({
                query: "SELECT image_url FROM MenuImages WHERE vendor_id = ?",
                values: [vendor.id],
              })
            )
          ]);

          return {
            ...vendor,
            images: images.map((img) => img.image_url),
            menu: menu.map((menu) => menu.image_url),
          };
        } catch (error) {
          console.error(`Error fetching images for vendor ${vendor.id}:`, error);
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
    console.error("Error in /api/cards:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error", 
        error: error.message,
        code: error.code,
        errno: error.errno,
        sqlState: error.sqlState,
        sqlMessage: error.sqlMessage
      },
      { status: 500 }
    );
  }
};
