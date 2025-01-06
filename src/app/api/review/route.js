import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const POST = async (req) => {
    const { id, vendor_id, user_id, name, rating, review, created } = await req.json();

  if (!id || !vendor_id || !user_id || !rating || !review) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    await query({
      query: "INSERT INTO reviews (id, vendor_id, user_id, name, rating, review, created) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values: [id, vendor_id, user_id, name, rating, review, created],
    });

    return NextResponse.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};