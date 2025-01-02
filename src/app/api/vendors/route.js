import { NextResponse } from "next/server";
import { query } from "../../../lib/db"; // Assuming you're using a database query helper

// Handle POST request for adding a vendor
export const POST = async (req) => {
  try {
    const {
      id,
      name,
      foodType,
      address,
      contact_number,
      rating,
      description,
      created_by,
    } = await req.json();

    // Validate required fields
    if (!id || !name || !foodType || !address || !contact_number || !description) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert vendor into the database
    const insertVendorQuery = `
      INSERT INTO vendors (id, name, description, address, contact_number, rating, foodType, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, name, description, address, contact_number, rating, foodType, created_by];

    // Perform the insert operation
    await query({
      query: insertVendorQuery,
      values: values,
    });

    // Respond with a success message
    return NextResponse.json({
      message: "Vendor added successfully",
    });
  } catch (error) {
    console.error("Error adding vendor:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
