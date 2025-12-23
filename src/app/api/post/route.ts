import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createPost, createAttachment } from "@/lib/db";
import { redirect } from "next/navigation";

export async function POST(request: NextRequest) {
  // Check authentication
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("backontheblog_auth");

  if (!authCookie || authCookie.value !== "authenticated") {
    return redirect("/login");
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;

    if (!title?.trim() || !content?.trim() || !author) {
      return redirect("/new?error=1");
    }

    // Create the post
    const post = await createPost(
      title.trim(),
      description?.trim() || "",
      content.trim(),
      author
    );

    // Handle attachments
    const attachmentUrls = formData.getAll("attachment_urls") as string[];
    const attachmentNames = formData.getAll("attachment_names") as string[];
    const attachmentTypes = formData.getAll("attachment_types") as string[];
    const attachmentSizes = formData.getAll("attachment_sizes") as string[];

    for (let i = 0; i < attachmentUrls.length; i++) {
      await createAttachment(
        attachmentNames[i],
        attachmentUrls[i],
        attachmentTypes[i],
        parseInt(attachmentSizes[i]),
        post.id
      );
    }

    return redirect(`/post/${post.id}`);
  } catch (error) {
    console.error("Post creation error:", error);
    return redirect("/new?error=1");
  }
}
