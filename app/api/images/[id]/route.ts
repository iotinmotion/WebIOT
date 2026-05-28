import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getGridFS } from "@/lib/mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bucket = await getGridFS();
    const fileId = new ObjectId(params.id);

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) return new NextResponse("Not found", { status: 404 });

    const chunks: Buffer[] = [];
    const stream = bucket.openDownloadStream(fileId);
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentType = (files[0] as any).contentType || files[0].metadata?.contentType || "image/jpeg";
    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
