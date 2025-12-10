import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { createPost } from "@/lib/db";
import AuthorSelect from "@/components/AuthorSelect";

export const dynamic = "force-dynamic";

async function createPostAction(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  if (!title?.trim() || !content?.trim() || !author) {
    redirect("/new?error=1");
  }

  const post = await createPost(title.trim(), description?.trim() || "", content.trim(), author);
  redirect(`/post/${post.id}`);
}

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const params = await searchParams;
  const hasError = params.error === "1";

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

      <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-terminal-text mb-6">
          Create New Post
        </h1>

        {hasError && (
          <div
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-md"
            role="alert"
          >
            <p className="text-red-400 text-sm">
              Please fill in all required fields (title, content, and author).
            </p>
          </div>
        )}

        <form action={createPostAction} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-terminal-text mb-2"
            >
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={255}
              placeholder="Enter post title"
              className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-2 focus:border-terminal-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-terminal-text mb-2"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Brief description (optional)"
              className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-2 focus:border-terminal-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-terminal-text mb-2"
            >
              Author <span className="text-red-400">*</span>
            </label>
            <AuthorSelect name="author" required />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-terminal-text mb-2"
            >
              Content <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-terminal-muted mb-2">
              Supports Markdown. Use ```language for code blocks.
            </p>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              placeholder="Write your post content here...

Example code block:
```powershell
Get-Process | Where-Object { $_.CPU -gt 100 }
```"
              className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-3 focus:border-terminal-accent focus:outline-none font-mono text-sm resize-y"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-terminal-accent text-terminal-bg font-medium rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2 focus:ring-offset-terminal-surface"
            >
              Publish Post
            </button>
            <Link
              href="/"
              className="px-6 py-2 border border-terminal-border text-terminal-muted rounded-md hover:border-terminal-accent hover:text-terminal-accent transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
