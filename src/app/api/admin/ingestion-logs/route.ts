import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("ingestion_logs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(20);

  if (error) {
    return Response.json([]);
  }

  return Response.json(data);
}
