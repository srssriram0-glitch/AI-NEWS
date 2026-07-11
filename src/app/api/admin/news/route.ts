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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabaseAdmin
    .from("news_articles")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data: data || [], total: count || 0 });
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.title || !body.slug) {
    return Response.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .insert({
      slug: body.slug,
      title: body.title,
      summary: body.summary || "",
      content: body.content || "",
      source: body.source || "",
      source_url: body.source_url || "",
      image_url: body.image_url || "",
      category: body.category || "General",
      tags: body.tags || [],
      impact_score: body.impact_score || 50,
      related_tools: body.related_tools || [],
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
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .update({
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      content: body.content,
      source: body.source,
      source_url: body.source_url,
      image_url: body.image_url,
      category: body.category,
      tags: body.tags,
      impact_score: body.impact_score,
      related_tools: body.related_tools,
      updated_at: new Date().toISOString(),
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

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("news_articles")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
