import type { Metadata } from "next";
import { Toaster } from "sonner";
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
        <Toaster
          position="bottom-center"
          theme="dark"
          richColors
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "font-sans text-sm rounded-full px-6 py-3.5 flex items-center gap-3 shadow-lg border w-fit max-w-[calc(100vw-2.5rem)]",
              default:
                "bg-surface-container-low border-outline-variant text-on-surface",
              success: "bg-primary/10 border-primary/30 text-primary",
              error: "bg-error-container/95 border-error/40 text-on-error-container",
              title: "font-sans font-medium",
            },
          }}
        />
      </body>
    </html>
  );
}
