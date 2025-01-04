import { NextResponse } from "next/server";
import { query } from "../../../lib/db"; // Replace with your database query utility
import { hash } from "bcryptjs"; // For password hashing

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await query({
      query: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash the password before saving it
    const hashedPassword = await hash(password, 12);

    // Log the email and hashed password for debugging
    console.log("Inserting user:", { email, hashedPassword });

    // Insert new user into the database
    const result = await query({
      query: "INSERT INTO users (email, password) VALUES (?, ?)",
      values: [email, hashedPassword],
    });

    // Log the result of the insert operation
    console.log("Insert result:", result);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
