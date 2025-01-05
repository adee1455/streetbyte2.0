import { query } from "../../../lib/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    const result = await query({
      query: "SELECT COUNT(*) AS count FROM vendors WHERE city = ?",
      values: [city],
    });

    return new Response(JSON.stringify(result[0].count > 0));
  } catch (error) {
    console.error("Error checking city availability:", error);
    return new Response(JSON.stringify(false), { status: 500 });
  }
};
