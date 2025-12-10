"use client";

interface AuthorSelectProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
}

const AUTHORS = ["ConfigMage", "DarkForestMushroom"] as const;

export default function AuthorSelect({ name, required = false, defaultValue }: AuthorSelectProps) {
  return (
    <select
      name={name}
      required={required}
      defaultValue={defaultValue || ""}
      className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md px-4 py-2 focus:border-terminal-accent focus:outline-none"
      aria-label="Select author"
    >
      <option value="" disabled>
        Select author...
      </option>
      {AUTHORS.map((author) => (
        <option key={author} value={author}>
          {author}
        </option>
      ))}
    </select>
  );
}
