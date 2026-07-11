import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return Response.json(
      { error: "Admin secret not configured" },
      { status: 500 }
    );
  }

  if (password === adminSecret) {
    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid password" }, { status: 401 });
}
