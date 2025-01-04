import { NextResponse } from "next/server";
import { query } from "../../../lib/db"; // Assuming you're using a database query helper

// Handle POST request for adding a vendor
export const POST = async (req) => {
  try {
    const {
      id,
      vendor_id,
      user_id,
      name,
      rating,
      review,
      created,
    } = await req.json();

    // Validate required fields
    if (!id || !rating || !review ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert vendor into the database
    const insertReview = `
      INSERT INTO reviews (id, vendor_id, user_id, name, rating, review, created)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, vendor_id, user_id, name, rating, review, created];

    // Perform the insert operation
    await query({
      query: insertReview,
      values: values,
    });

    // Respond with a success message
    return NextResponse.json({
      message: "Review added successfully",
    });
  } catch (error) {
    console.error("Error adding vendor:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
