import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return new NextResponse('vendor ID is required', { status: 400 });
    }
    console.log(vendorId);
    // First delete associated images
    await query({
      query: "DELETE FROM VendorImages WHERE vendor_id = ?",
      values: [vendorId],
    });

    // First delete associated menu
      await query({
        query: "DELETE FROM MenuImages WHERE vendor_id = ?",
        values: [vendorId],
      });

    // Then delete the review
    const result = await query({
      query: "DELETE FROM vendors WHERE id = ?",
      values: [vendorId],
    });

    if (result.affectedRows === 0) {
      return new NextResponse('vendor not found', { status: 404 });
    }

    return NextResponse.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('[DELETE_VENDOR_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}