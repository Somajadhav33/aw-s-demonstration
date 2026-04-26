# S3 File Upload — Next.js + AWS S3

A full-stack file upload system built with Next.js and AWS S3. Upload, access, and delete files directly from your browser — files are stored securely in AWS S3.

---

## What This Project Does

- Upload any file (image, PDF, document) to AWS S3
- View all uploaded files in a clean UI
- Access files via secure presigned URLs (expires in 10 minutes)
- Delete files from S3 with confirmation

---

## How It Works

```
User selects file
      ↓
Frontend (page.js) sends file via FormData to Next.js API
      ↓
API Route (/api/upload) receives file and sends to AWS S3
      ↓
File stored in S3 Bucket
      ↓
Frontend fetches file list from /api/files
      ↓
User clicks Access → /api/file/[fileName] generates presigned URL
      ↓
File opens in browser for 10 minutes via presigned URL
```

---

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | Next.js 14, Tailwind CSS                          |
| Backend  | Next.js API Routes                                |
| Storage  | AWS S3                                            |
| AWS SDK  | @aws-sdk/client-s3, @aws-sdk/s3-request-presigner |

---

## Project Structure

```
s3-upload-practice/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.js        → handles file upload to S3
│   │   ├── files/
│   │   │   └── route.js        → lists all files in S3 bucket
│   │   ├── file/
│   │   │   └── [fileName]/
│   │   │       └── route.js    → generates presigned URL + handles delete
│   ├── page.js                 → frontend UI
│   └── layout.js
├── lib/
│   └── s3.js                   → AWS S3 client setup
├── .env.local                  → AWS credentials (never commit this!)
└── README.md
```

---

## Prerequisites

Before setting up this project you need:

1. Node.js installed on your machine
2. An AWS account (free tier works)
3. An S3 bucket created in AWS console
4. An IAM user with S3 access and access keys

---

## AWS Setup (Do This First)

### Step 1 — Create S3 Bucket

1. Login to AWS Console → search **S3**
2. Click **Create Bucket**
3. Enter bucket name — example: `yourname-s3-practice`
4. Select region — example: `eu-north-1` (Stockholm) or `ap-south-1` (Mumbai)
5. Uncheck **Block all public access** → acknowledge warning
6. Enable **Bucket Versioning**
7. Click **Create Bucket**

### Step 2 — Create IAM User

1. Search **IAM** in AWS Console
2. Click **Users** → **Create User**
3. Username: `s3-practice-user`
4. Click Next → **Attach policies directly**
5. Search and select **AmazonS3FullAccess**
6. Click **Create User**

### Step 3 — Generate Access Keys

1. Click on the user you just created
2. Go to **Security credentials** tab
3. Click **Create access key**
4. Select **Local code** → click Next
5. Click **Create access key**
6. **Download the CSV file** — save it safely!

> ⚠️ You will only see the secret key once. Save it before closing the page.

---

## Installation & Setup

### Step 1 — Clone or create the project

```bash
npx create-next-app@latest s3-upload-practice
cd s3-upload-practice
```

When prompted select:

- TypeScript → No
- ESLint → Yes
- Tailwind CSS → Yes
- src/ directory → No
- App Router → Yes
- Import alias → No

### Step 2 — Install AWS packages

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### Step 3 — Create .env.local file

Create a file named `.env.local` in the root of your project:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=your_bucket_region_here
AWS_BUCKET_NAME=your_bucket_name_here
```

> ⚠️ Replace values with your actual keys from the CSV file downloaded earlier.
> ⚠️ Make sure AWS_REGION matches the region you created your bucket in.

### Step 4 — Run the project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Routes

| Method | Route                  | What it does                     |
| ------ | ---------------------- | -------------------------------- |
| POST   | `/api/upload`          | Uploads file to S3               |
| GET    | `/api/files`           | Lists all files in bucket        |
| GET    | `/api/file/[fileName]` | Generates presigned URL (10 min) |
| DELETE | `/api/file/[fileName]` | Deletes file from S3             |

---

## Environment Variables

| Variable                | Description                            |
| ----------------------- | -------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Your IAM user access key               |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret key               |
| `AWS_REGION`            | Region where your S3 bucket is created |
| `AWS_BUCKET_NAME`       | Name of your S3 bucket                 |

---

## Common Errors & Fixes

### PermanentRedirect Error

```
PermanentRedirect: The bucket you are attempting to access must be
addressed using the specified endpoint.
```

**Fix:** Your `AWS_REGION` in `.env.local` doesn't match the actual region of your S3 bucket. Update it to match.

### Access Denied Error

**Fix:** Your IAM user doesn't have correct permissions. Make sure `AmazonS3FullAccess` policy is attached to your IAM user.

### Presigned URL Not Working After 10 Minutes

This is expected behavior. Presigned URLs expire after 600 seconds (10 minutes) for security. Request a new URL by clicking Access again.

---

## Key Concepts Used

**FormData** — Used to send files from frontend to API. JSON cannot handle binary file data so FormData is used instead.

**Presigned URL** — A temporary URL that gives time-limited access to a private S3 file without making the entire bucket public.

**Buffer** — Files are converted to buffer format before uploading to S3 because S3 expects binary data.

**IAM** — Identity and Access Management. Controls who can access your AWS resources and what they can do.

---

## Author

**Somnath Jadhav**  
Full Stack Developer
