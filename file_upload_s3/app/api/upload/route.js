import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) {
      return Response.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    if (!process.env.AWS_BUCKET_NAME) {
      console.error("AWS_BUCKET_NAME environment variable is not set");
      return Response.json(
        { success: false, message: "Server configuration error" },
        { status: 500 },
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });
    await s3.send(command);
    return Response.json({
      success: true,
      message: "File uploaded successfully",
      fileName: fileName,
    });
  } catch (error) {
    console.error("Upload error: ", error);
    return Response.json(
      { success: false, message: "Upload Failed" },
      { status: 500 },
    );
  }
}
