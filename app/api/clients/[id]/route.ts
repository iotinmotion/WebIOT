import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_PASSWORD;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = await getDb();
    const body = await req.json();
    if (body.logoId) body.logoId = new ObjectId(body.logoId);
    await db
      .collection("clientes")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: body });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdmin(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = await getDb();
    await db
      .collection("clientes")
      .deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
