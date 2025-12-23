import { Attachment } from "@/lib/db";

interface AttachmentDisplayProps {
  attachments: Attachment[];
}

export default function AttachmentDisplay({ attachments }: AttachmentDisplayProps) {
  if (attachments.length === 0) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (fileType: string) => fileType.startsWith("image/");

  const images = attachments.filter((a) => isImage(a.file_type));
  const files = attachments.filter((a) => !isImage(a.file_type));

  return (
    <div className="mt-4 space-y-3">
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={attachment.file_url}
                alt={attachment.file_name}
                className="max-w-xs max-h-48 rounded border border-terminal-border hover:border-terminal-accent transition-colors"
              />
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((attachment) => (
            <a
              key={attachment.id}
              href={attachment.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 bg-terminal-bg border border-terminal-border rounded hover:border-terminal-accent transition-colors group"
            >
              <svg
                className="w-4 h-4 text-terminal-muted group-hover:text-terminal-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <span className="text-sm text-terminal-text group-hover:text-terminal-accent truncate">
                {attachment.file_name}
              </span>
              <span className="text-xs text-terminal-muted">
                ({formatFileSize(attachment.file_size)})
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
