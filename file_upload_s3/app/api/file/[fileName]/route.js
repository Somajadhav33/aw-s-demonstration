import s3 from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(request, { params }) {
  const { fileName } = await params;
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return Response.json({ success: true, url });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return Response.json(
      { success: false, message: "Could not generate URL" },
      { status: 500 },
    );
  }
}
