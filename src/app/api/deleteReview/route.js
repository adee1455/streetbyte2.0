import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return new NextResponse('Review ID is required', { status: 400 });
    }

    // First delete associated images
    await query({
      query: "DELETE FROM review_images WHERE review_id = ?",
      values: [reviewId],
    });

    // Then delete the review
    const result = await query({
      query: "DELETE FROM reviews WHERE id = ?",
      values: [reviewId],
    });

    if (result.affectedRows === 0) {
      return new NextResponse('Review not found', { status: 404 });
    }

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('[DELETE_REVIEW_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}