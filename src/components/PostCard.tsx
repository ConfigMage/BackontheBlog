import Link from "next/link";
import type { Post } from "@/lib/db";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="bg-terminal-surface border border-terminal-border rounded-lg p-6 transition-colors hover:border-terminal-accent/50">
      <Link href={`/post/${post.id}`} className="block">
        <h2 className="text-xl font-semibold text-terminal-text mb-2 hover:text-terminal-accent transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-terminal-muted mb-4 line-clamp-2">
            {post.description}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-terminal-muted">
          <span className="font-mono">{post.author}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.created_at}>{date}</time>
        </div>
      </Link>
    </article>
  );
}
