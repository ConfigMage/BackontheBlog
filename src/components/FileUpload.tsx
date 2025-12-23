"use client";

import { useState, useRef } from "react";

interface UploadedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export default function FileUpload({ onFilesChange, maxFiles = 5 }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    setError(null);

    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await response.json();
        newFiles.push({
          url: data.url,
          fileName: data.fileName,
          fileType: data.fileType,
          fileSize: data.fileSize,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesChange(allFiles);
    setIsUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-terminal-border text-terminal-muted rounded-md hover:border-terminal-accent hover:text-terminal-accent transition-colors text-sm"
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
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          {isUploading ? "Uploading..." : "Attach files"}
        </label>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
          disabled={isUploading || uploadedFiles.length >= maxFiles}
          className="sr-only"
        />
        <span className="text-xs text-terminal-muted">
          Max 4MB per file, {maxFiles} files total
        </span>
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 bg-terminal-bg border border-terminal-border rounded-md"
            >
              {isImage(file.fileType) ? (
                <img
                  src={file.url}
                  alt={file.fileName}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-terminal-surface rounded">
                  <svg
                    className="w-5 h-5 text-terminal-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-terminal-text truncate">{file.fileName}</p>
                <p className="text-xs text-terminal-muted">{formatFileSize(file.fileSize)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 text-terminal-muted hover:text-red-400 transition-colors"
                aria-label={`Remove ${file.fileName}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* Hidden inputs for form submission */}
              <input type="hidden" name="attachment_urls" value={file.url} />
              <input type="hidden" name="attachment_names" value={file.fileName} />
              <input type="hidden" name="attachment_types" value={file.fileType} />
              <input type="hidden" name="attachment_sizes" value={file.fileSize.toString()} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
