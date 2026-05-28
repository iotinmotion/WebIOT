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
    const update: Record<string, unknown> = {
      title_es: body.title_es,
      title_en: body.title_en,
      summary_es: body.summary_es,
      summary_en: body.summary_en,
      category_es: body.category_es,
      category_en: body.category_en,
      link: body.link ?? "",
      updatedAt: new Date(),
    };
    if (body.date) update.date = new Date(body.date);
    if (body.imagenId) update.images = [new ObjectId(body.imagenId)];
    await db
      .collection("novedads")
      .updateOne({ _id: new ObjectId(params.id) }, { $set: update });
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
      .collection("novedads")
      .deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
