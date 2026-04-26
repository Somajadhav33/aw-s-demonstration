// ListObjectsV2Command = AWS command to get list of all files in bucket
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from "@/lib/s3";

// GET = this route only accepts GET requests
// Called when page loads to show all existing files
export async function GET() {
  try {
    // Step 1 — Create command to list all files in bucket
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    // Step 2 — Send command to AWS and get response
    // data.Contents = array of all files in the bucket
    const data = await s3.send(command);

    // Step 3 — Format the response to only send what frontend needs
    // data.Contents could be undefined if bucket is empty so use ?.
    const files =
      data.Contents?.map((file) => ({
        // File name/path in S3
        name: file.Key,
        // File size in bytes
        size: file.Size,
        // When file was last modified
        lastModified: file.LastModified,
      })) || []; // If no files return empty array

    // Step 4 — Send formatted files list to frontend
    return Response.json({ success: true, files });
  } catch (error) {
    console.error("List files error:", error);
    return Response.json(
      { success: false, message: "Could not fetch files" },
      { status: 500 },
    );
  }
}
