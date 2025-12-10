"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      if (query.trim()) {
        router.push(`/?q=${encodeURIComponent(query.trim())}`);
      } else {
        router.push("/");
      }
    });
  };

  const handleClear = () => {
    setQuery("");
    startTransition(() => {
      router.push("/");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="w-full bg-terminal-bg border border-terminal-border text-terminal-text rounded-md pl-10 pr-4 py-2 focus:border-terminal-accent focus:outline-none"
          aria-label="Search posts"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-terminal-accent text-terminal-bg font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "..." : "Search"}
      </button>
      {searchParams.get("q") && (
        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 border border-terminal-border text-terminal-muted rounded-md hover:border-terminal-accent hover:text-terminal-accent transition-colors"
        >
          Clear
        </button>
      )}
    </form>
  );
}
