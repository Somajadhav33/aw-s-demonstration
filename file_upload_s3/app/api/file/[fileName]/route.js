import s3 from "@/lib/s3";
// GetObjectCommand = AWS command to get a specific file from S3
// DeleteObjectCommand = AWS command to delete a file from S3
import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
// getSignedUrl = generates temporary presigned URL for the file
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// GET = accepts GET requests
// [fileName] in folder name = dynamic route
// Example: /api/file/photo.jpg → params.fileName = "photo.jpg"
export async function GET(request, { params }) {
  try {
    const { fileName } = await params;
    // Step 1 — Create command to get specific file from S3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      // Which file to get — comes from URL parameter
      Key: fileName,
    });

    // Step 2 — Generate presigned URL
    // expiresIn: 600 = URL expires after 600 seconds = 10 minutes
    // After 10 minutes the URL stops working automatically
    const url = await getSignedUrl(s3, command, { expiresIn: 600 });

    // Step 3 — Send the temporary URL back to frontend
    // Frontend will open this URL in new tab
    return Response.json({ success: true, url });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return Response.json(
      { success: false, message: "Could not generate URL" },
      { status: 500 },
    );
  }
}

// DELETE = accepts DELETE requests
// [fileName] = dynamic route same as presigned URL route
export async function DELETE(request, { params }) {
  try {
    const { fileName } = await params;

    // Step 1 — Create command to delete specific file
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      // Which file to delete — comes from URL parameter
      Key: fileName,
    });

    // Step 2 — Send delete command to AWS
    // File is permanently deleted from S3 after this
    await s3.send(command);

    // Step 3 — Send success response
    return Response.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json(
      { success: false, message: "Delete failed" },
      { status: 500 },
    );
  }
}
