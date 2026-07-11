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
    .from("ai_tools")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
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

  if (!body.name || !body.slug) {
    return Response.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("ai_tools")
    .insert({
      slug: body.slug,
      name: body.name,
      tagline: body.tagline || "",
      description: body.description || "",
      logo_url: body.logo_url || "",
      website_url: body.website_url || "",
      category: body.category || "",
      subcategory: body.subcategory || "",
      pricing: body.pricing || { model: "free", plans: [] },
      features: body.features || [],
      tags: body.tags || [],
      company: body.company || "",
      founder: body.founder || "",
      rating: body.rating || 0,
      is_featured: body.is_featured || false,
      is_trending: body.is_trending || false,
      pros: body.pros || [],
      cons: body.cons || [],
      api_available: body.api_available || false,
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

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const fields = [
    "slug", "name", "tagline", "description", "logo_url", "website_url",
    "category", "subcategory", "pricing", "features", "tags", "company",
    "founder", "rating", "is_featured", "is_trending", "pros", "cons",
    "api_available",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) updates[f] = body[f];
  }

  const { data, error } = await supabaseAdmin
    .from("ai_tools")
    .update(updates)
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
    .from("ai_tools")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
