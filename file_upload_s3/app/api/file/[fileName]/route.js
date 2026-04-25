import s3 from "@/lib/s3";
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
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

export async function DELETE(request, { params }) {
  const { fileName } = await params;
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    await s3.send(command);

    return Response.json({
      success: true,
      message: "File Deleted successfully",
    });
  } catch (error) {
    console.error("Delete error", error);
    return Response.json(
      {
        success: false,
        message: "Delete failed",
      },
      { status: 500 },
    );
  }
}
