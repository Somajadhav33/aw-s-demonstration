import s3 from "@/lib/s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const data = await s3.send(command);

    const files =
      data.Contents?.map((file) => ({
        name: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
      })) || [];

    return Response.json({ success: true, files });
  } catch (error) {
    console.error("List files error:", error);
    return Response.json(
      { success: false, message: "Could not fetch files" },
      { status: 500 },
    );
  }
}
