// Import S3Client from AWS SDK
import { S3Client } from "@aws-sdk/client-s3";

// Create one S3 client instance and reuse it across all API routes
const s3 = new S3Client({
  // Which AWS region your bucket is in
  region: process.env.AWS_REGION,

  credentials: {
    // Your IAM user access key
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // Your IAM user secret key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Export so all API routes can use the same connection
export default s3;
