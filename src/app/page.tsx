import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { getPosts } from "@/lib/db";
import PostCard from "@/components/PostCard";
import SearchBar from "@/components/SearchBar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function SearchBarWrapper() {
  return (
    <Suspense fallback={<div className="h-10 bg-terminal-surface rounded-md animate-pulse" />}>
      <SearchBar />
    </Suspense>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const params = await searchParams;
  const searchQuery = params.q || "";
  const posts = await getPosts(searchQuery);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-terminal-text mb-2">
          BackontheBlog
        </h1>
        <p className="text-terminal-muted">
          Code snippets and technical notes
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBarWrapper />
        </div>
        <Link
          href="/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-terminal-accent text-terminal-bg font-medium rounded-md hover:opacity-90 transition-opacity"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Post
        </Link>
      </div>

      {searchQuery && (
        <p className="text-terminal-muted mb-4">
          Showing results for &quot;{searchQuery}&quot;
        </p>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-terminal-muted">
            {searchQuery
              ? "No posts found matching your search."
              : "No posts yet. Create the first one!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
