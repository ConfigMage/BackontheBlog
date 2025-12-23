import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createReply, createAttachment } from "@/lib/db";
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

    const postId = formData.get("postId") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;

    if (!postId || !content?.trim() || !author) {
      return redirect(`/post/${postId}?error=1`);
    }

    // Create the reply
    const reply = await createReply(parseInt(postId), content.trim(), author);

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
        undefined,
        reply.id
      );
    }

    return redirect(`/post/${postId}`);
  } catch (error) {
    console.error("Reply creation error:", error);
    const formData = await request.formData().catch(() => null);
    const postId = formData?.get("postId") || "";
    return redirect(`/post/${postId}?error=1`);
  }
}
