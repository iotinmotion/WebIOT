import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-admin-key") === process.env.ADMIN_PASSWORD;
}

function deriveCatKey(categoryEn: string): string {
  const cat = (categoryEn || "").toLowerCase();
  if (cat.includes("event")) return "events";
  if (cat.includes("exhib")) return "exhibition";
  if (cat.includes("energy")) return "energy";
  if (cat.includes("health") || cat.includes("clinical")) return "health";
  if (cat.includes("network") || cat.includes("lorawan")) return "networks";
  if (cat.includes("case") || cat.includes("study")) return "case";
  return "networks";
}

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("novedads")
      .find({})
      .sort({ order: 1, date: -1 })
      .toArray();

    return NextResponse.json(
      docs.map((n) => {
        const catEn = n.category_en || "";
        const firstImage = Array.isArray(n.images) && n.images.length > 0
          ? n.images[0]?.toString()
          : null;
        return {
          _id: n._id.toString(),
          titulo: { es: n.title_es || "", en: n.title_en || "" },
          descripcion: { es: n.summary_es || "", en: n.summary_en || "" },
          fecha: n.date || n.createdAt || null,
          categoria: { es: n.category_es || "", en: catEn },
          catKey: deriveCatKey(catEn),
          imagenId: firstImage,
          link: n.link || null,
        };
      })
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
    const result = await db.collection("novedads").insertOne({
      title_es: body.title_es,
      title_en: body.title_en,
      summary_es: body.summary_es,
      summary_en: body.summary_en,
      body_es: body.body_es || "",
      body_en: body.body_en || "",
      category_es: body.category_es,
      category_en: body.category_en,
      date: body.date ? new Date(body.date) : new Date(),
      images: body.imagenId ? [new ObjectId(body.imagenId)] : [],
      link: body.link || "",
      order: body.order ?? 999,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ _id: result.insertedId.toString() });
  } catch {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
