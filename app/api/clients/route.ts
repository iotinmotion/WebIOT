import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("clientes")
      .find({})
      .sort({ order: 1, _id: 1 })
      .toArray();

    return NextResponse.json(
      docs.map((c) => ({
        _id: c._id.toString(),
        nombre: c.name || c.nombre || "",
        logoId: c.image?.toString() || c.logoId?.toString() || null,
        orden: c.order ?? c.orden ?? 0,
      }))
    );
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return new NextResponse("Unauthorized", { status: 401 });
  try {
    const db = await getDb();
    const body = await req.json();
    const result = await db.collection("clientes").insertOne({
      name: body.nombre,
      image: body.logoId ? new ObjectId(body.logoId) : null,
      order: body.orden ?? 999,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ _id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
