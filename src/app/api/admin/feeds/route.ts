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
    .from("rss_feeds")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data || []);
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.url) {
    return Response.json(
      { error: "Name and URL are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("rss_feeds")
    .insert({
      name: body.name,
      url: body.url,
      category: body.category || "General",
      is_active: body.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return Response.json({ error: "ID required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("rss_feeds")
    .update({
      name: body.name,
      url: body.url,
      category: body.category,
      is_active: body.is_active,
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("rss_feeds")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
