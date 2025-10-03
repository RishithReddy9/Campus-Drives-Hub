import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await req.json();
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key, // e.g. "drives/12345-myfile.pdf"
      ResponseContentDisposition: "inline", // 👈 ensures inline browser view
    });

    // URL expires in 5 minutes
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ url: signedUrl });
  } catch (err: any) {
    console.error("Signed URL error:", err);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}
