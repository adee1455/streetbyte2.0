import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    const reviews = await query({
      query: `
        SELECT r.id, r.vendor_id as vendorId, v.name as vendorName,
               r.rating, r.review as comment, r.created as createdAt,
               r.profile, r.user_id as userId
        FROM reviews r
        JOIN vendors v ON r.vendor_id = v.id
        WHERE r.name = ?
        ORDER BY r.created DESC
      `,
      values: [username],
    });

    const reviewsWithImages = await Promise.all(
      reviews.map(async (review) => {
        const images = await query({
          query: `
            SELECT image_url 
            FROM review_images 
            WHERE review_id = ?
          `,
          values: [review.id],
        });

        return {
          ...review,
          images: images.map(img => img.image_url)
        };
      })
    );

    return NextResponse.json(reviewsWithImages);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};