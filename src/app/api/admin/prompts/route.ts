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
    .from("prompts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
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
    .from("prompts")
    .insert({
      slug: body.slug,
      title: body.title,
      description: body.description || "",
      prompt_text: body.prompt_text || "",
      category: body.category || "",
      model: body.model || "",
      tags: body.tags || [],
      use_case: body.use_case || "",
      tips: body.tips || [],
      author: body.author || "AI World Hub",
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
  if (!body.id) return Response.json({ error: "ID required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("prompts")
    .update({
      slug: body.slug,
      title: body.title,
      description: body.description,
      prompt_text: body.prompt_text,
      category: body.category,
      model: body.model,
      tags: body.tags,
      use_case: body.use_case,
      tips: body.tips,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "ID required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("prompts").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}
