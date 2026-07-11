import { NextRequest } from "next/server";
import { searchContent } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  const type = searchParams.get("type");

  if (!query) {
    return Response.json({ results: [], query: "" });
  }

  let results = await searchContent(query, limit);

  if (type && type !== "all") {
    results = results.filter((r) => r.type === type);
  }

  return Response.json({ results, query });
}
