import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Image Tool Workspace",
  description: "AI image generation and editing workspace",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
