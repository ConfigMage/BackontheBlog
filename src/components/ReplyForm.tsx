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

interface ReplyFormProps {
  postId: number;
  hasError: boolean;
}

export default function ReplyForm({ postId, hasError }: ReplyFormProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-lg p-6">
      <h3 className="text-lg font-medium text-terminal-text mb-4">
        Add a Reply
      </h3>

      {hasError && (
        <div
          className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-md"
          role="alert"
        >
          <p className="text-red-400 text-sm">
            Please fill in all required fields (content and author).
          </p>
        </div>
      )}

      <form action="/api/reply" method="POST" className="space-y-4">
        <input type="hidden" name="postId" value={postId} />

        <div>
          <label
            htmlFor="reply-author"
            className="block text-sm font-medium text-terminal-text mb-2"
          >
            Author <span className="text-red-400">*</span>
          </label>
          <AuthorSelect name="author" required />
        </div>

        <div>
          <label
            htmlFor="reply-content"
            className="block text-sm font-medium text-terminal-text mb-2"
          >
            Reply <span className="text-red-400">*</span>
          </label>
          <p className="text-xs text-terminal-muted mb-2">
            Supports Markdown. Use ```language for code blocks.
          </p>
          <textarea
            id="reply-content"
            name="content"
            required
            rows={6}
            placeholder="Write your reply..."
            className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-3 focus:border-terminal-accent focus:outline-none font-mono text-sm resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-terminal-text mb-2">
            Attachments
          </label>
          <FileUpload onFilesChange={setFiles} maxFiles={3} />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-terminal-accent text-black font-medium rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terminal-accent focus:ring-offset-2 focus:ring-offset-terminal-surface"
        >
          Post Reply
        </button>
      </form>
    </div>
  );
}
