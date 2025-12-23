"use client";

import { useState } from "react";
import AuthorSelect from "./AuthorSelect";
import FileUpload from "./FileUpload";

interface UploadedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface NewPostFormProps {
  hasError: boolean;
}

export default function NewPostForm({ hasError }: NewPostFormProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <>
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

      <form action="/api/post" method="POST" className="space-y-6">
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

        <div>
          <label className="block text-sm font-medium text-terminal-text mb-2">
            Attachments
          </label>
          <FileUpload onFilesChange={setFiles} />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-terminal-accent text-black font-medium rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2 focus:ring-offset-terminal-surface"
          >
            Publish Post
          </button>
          <a
            href="/"
            className="px-6 py-2 border border-terminal-border text-terminal-muted rounded-md hover:border-terminal-accent hover:text-terminal-accent transition-colors inline-block text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </>
  );
}
