import type { Metadata } from "next";
import "@fontsource/libre-caslon-text/400.css";
import "@fontsource/libre-caslon-text/400-italic.css";
import "@fontsource/libre-caslon-text/700.css";
import "@fontsource-variable/hanken-grotesk/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxem — Speak Confidently, In Any Moment",
  description:
    "AI-powered feedback that helps you speak clearly, confidently and with impact in any situation. Practice interviews, debates, and everyday conversations with Voxem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-surface text-on-surface antialiased selection:bg-primary selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
