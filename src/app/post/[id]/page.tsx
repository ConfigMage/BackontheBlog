import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { getPost, getReplies, getAttachmentsForPost } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AttachmentDisplay from "@/components/AttachmentDisplay";
import ReplyForm from "@/components/ReplyForm";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await getPost(postId);
  if (!post) {
    notFound();
  }

  const replies = await getReplies(postId);
  const { postAttachments, replyAttachments } = await getAttachmentsForPost(postId);
  const searchParamsValue = await searchParams;
  const hasError = searchParamsValue.error === "1";

  const postDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-terminal-muted hover:text-terminal-accent transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to feed
        </Link>
      </div>

      <article className="bg-terminal-surface border border-terminal-border rounded-lg p-6 mb-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-terminal-text mb-2">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-terminal-muted mb-4">{post.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-terminal-muted">
            <span className="font-mono text-terminal-accent">{post.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.created_at}>{postDate}</time>
          </div>
        </header>

        <div className="border-t border-terminal-border pt-6">
          <MarkdownRenderer content={post.content} />
          <AttachmentDisplay attachments={postAttachments} />
        </div>
      </article>

      <section aria-labelledby="replies-heading">
        <h2
          id="replies-heading"
          className="text-xl font-semibold text-terminal-text mb-4"
        >
          Replies ({replies.length})
        </h2>

        {replies.length > 0 && (
          <div className="space-y-4 mb-8">
            {replies.map((reply) => {
              const replyDate = new Date(reply.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );

              const attachments = replyAttachments.get(reply.id) || [];

              return (
                <div
                  key={reply.id}
                  className="bg-terminal-surface border border-terminal-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3 text-sm text-terminal-muted">
                    <span className="font-mono text-terminal-accent">
                      {reply.author}
                    </span>
                    <span aria-hidden="true">•</span>
                    <time dateTime={reply.created_at}>{replyDate}</time>
                  </div>
                  <div className="text-sm">
                    <MarkdownRenderer content={reply.content} />
                    <AttachmentDisplay attachments={attachments} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ReplyForm postId={post.id} hasError={hasError} />
      </section>
    </div>
  );
}
