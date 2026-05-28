import { NextRequest, NextResponse } from "next/server";
import { getGridFS } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-key") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return new NextResponse("No file", { status: 400 });

    const bucket = await getGridFS();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: { contentType: file.type },
    });

    return new Promise<NextResponse>((resolve) => {
      uploadStream.on("finish", () =>
        resolve(NextResponse.json({ id: uploadStream.id.toString() }))
      );
      uploadStream.on("error", () =>
        resolve(new NextResponse("Upload failed", { status: 500 }))
      );
      uploadStream.end(buffer);
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
