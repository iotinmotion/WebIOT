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
      .collection("novedades")
      .find({ activo: { $ne: false } })
      .sort({ fecha: -1 })
      .toArray();

    return NextResponse.json(
      docs.map((n) => ({
        _id: n._id.toString(),
        titulo: n.titulo || n.title || "",
        descripcion: n.descripcion || n.description || n.cuerpo || "",
        fecha: n.fecha || n.date || n.createdAt || null,
        categoria: n.categoria || n.category || "",
        catKey: n.catKey || "",
        imagenId:
          n.imagenId?.toString() || n.imagen?.toString() || null,
        activo: n.activo ?? true,
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
    const result = await db.collection("novedades").insertOne({
      titulo: body.titulo,
      descripcion: body.descripcion,
      fecha: body.fecha ? new Date(body.fecha) : new Date(),
      categoria: body.categoria,
      catKey: body.catKey,
      imagenId: body.imagenId ? new ObjectId(body.imagenId) : null,
      activo: true,
    });
    return NextResponse.json({ _id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
