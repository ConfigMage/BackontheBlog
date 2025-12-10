import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BackontheBlog - Code Snippet Sharing",
  description: "Share code snippets and technical knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col">
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <footer className="border-t border-terminal-border py-4 text-center" role="contentinfo">
            <span className="text-terminal-muted text-sm font-mono">Salem IT Guys</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
