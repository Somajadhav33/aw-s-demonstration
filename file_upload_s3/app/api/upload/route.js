// PutObjectCommand = AWS command to upload a file to S3
import { PutObjectCommand } from "@aws-sdk/client-s3";
// Import our S3 client we created in lib/s3.js
import s3 from "@/lib/s3";

// POST = this route only accepts POST requests
// This is called when user clicks "Upload" button
export async function POST(request) {
  try {
    // Step 1 — Open the FormData parcel box sent from frontend
    const formData = await request.formData();

    // Step 2 — Take the file out of the box using key "file"
    // This matches formData.append("file", file) in frontend
    const file = formData.get("file");

    // Step 3 — If no file was sent, return error immediately
    if (!file) {
      return Response.json(
        { success: false, message: "No file provided" },
        { status: 400 },
      );
    }

    // Step 4 — Convert file to buffer (binary format S3 understands)
    // arrayBuffer() = raw binary data of the file
    // Buffer.from() = converts it to Node.js buffer format
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Step 5 — Create unique filename to avoid overwriting
    // Date.now() adds timestamp — example: "1712345678-photo.jpg"
    const fileName = `${Date.now()}-${file.name}`;

    // Step 6 — Create the upload command with all details
    const command = new PutObjectCommand({
      // Which bucket to upload to
      Bucket: process.env.AWS_BUCKET_NAME,
      // What to name the file in S3
      Key: fileName,
      // The actual file content
      Body: buffer,
      // File type — example: "image/jpeg" or "application/pdf"
      ContentType: file.type,
    });

    // Step 7 — Send the command to AWS S3
    // This is where actual upload happens
    await s3.send(command);

    // Step 8 — Send success response back to frontend
    return Response.json({
      success: true,
      message: "File uploaded successfully",
      // Send back filename so frontend can use it
      fileName: fileName,
    });
  } catch (error) {
    // If anything goes wrong, log it and send error response
    console.error("Upload error:", error);
    return Response.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
