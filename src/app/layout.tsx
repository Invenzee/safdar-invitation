import type { Metadata, Viewport } from "next";
import { montserrat, sunyshine } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are invited",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sunyshine.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden bg-black font-sans">{children}</body>
    </html>
  );
}
