import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Documents
  "application/pdf",
  "text/plain",
  "text/markdown",
  // Code files
  "text/javascript",
  "text/typescript",
  "application/json",
  "text/css",
  "text/html",
  "text/xml",
  "application/xml",
  // Archives
  "application/zip",
  "application/x-tar",
  "application/gzip",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  // Check authentication
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("backontheblog_auth");

  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4MB." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type) && !file.name.match(/\.(ts|tsx|js|jsx|py|rb|go|rs|java|cpp|c|h|hpp|cs|php|sh|bash|zsh|ps1|psm1|yml|yaml|toml|ini|conf|cfg|env|sql|md|mdx)$/i)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
