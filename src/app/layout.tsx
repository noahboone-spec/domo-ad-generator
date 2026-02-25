import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domo Ad Banner Generator",
  description: "Generate Domo ad banners with dynamic theming and KG messaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
