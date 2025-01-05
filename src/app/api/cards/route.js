// import { NextResponse } from "next/server";
// import { query } from "../../../lib/db";

// export const GET = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const city = searchParams.get('city');

//     // Fetch vendors with city filter
//     const vendors = await query({
//       query: "SELECT * FROM vendors WHERE city = ?",
//       values: [city],
//     });
    
//     // Fetch images and menus for each vendor
//     const vendorsWithImages = await Promise.all(vendors.map(async (vendor) => {
//       const images = await query({
//         query: "SELECT image_url FROM VendorImages WHERE vendor_id = ?",
//         values: [vendor.id],
//       });

//       const menu = await query({
//         query: "SELECT image_url FROM MenuImages WHERE vendor_id = ?",
//         values: [vendor.id],
//       });

//       return { 
//         ...vendor, 
//         images: images.map(img => img.image_url), 
//         menu: menu.map(menu => menu.image_url) 
//       };
//     }));

//     return NextResponse.json(vendorsWithImages);
//   } catch (e) {
//     console.error("Error fetching vendors or images:", e);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// };

import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

// Fetch all vendor details for a given city
export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    // Fetch vendors with city filter
    const vendors = await query({
      query: "SELECT * FROM vendors WHERE city = ?",
      values: [city],
    });

    // Fetch images and menus for each vendor
    const vendorsWithImages = await Promise.all(
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
          images: images.map((img) => img.image_url),
          menu: menu.map((menu) => menu.image_url),
        };
      })
    );

    return NextResponse.json(vendorsWithImages);
  } catch (e) {
    console.error("Error fetching vendors or images:", e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

