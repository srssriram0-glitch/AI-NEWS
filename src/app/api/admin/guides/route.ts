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

  const { data, error, count } = await supabaseAdmin
    .from("guides")
    .select("*", { count: "exact" })
    .order("published_at", { ascending: false })
    .limit(50);

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

  const { data, error } = await supabaseAdmin
    .from("guides")
    .insert({
      slug: body.slug,
      title: body.title,
      summary: body.summary || "",
      content: body.content || "",
      category: body.category || "",
      difficulty: body.difficulty || "beginner",
      read_time: body.read_time || 10,
      author: body.author || "AI World Hub",
      tags: body.tags || [],
      requirements: body.requirements || [],
      steps: body.steps || [],
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
    .from("guides")
    .update({
      slug: body.slug,
      title: body.title,
      summary: body.summary,
      content: body.content,
      category: body.category,
      difficulty: body.difficulty,
      read_time: body.read_time,
      tags: body.tags,
      requirements: body.requirements,
      steps: body.steps,
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
  if (!id) return Response.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("guides").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}
