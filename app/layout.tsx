// app/layout.tsx
import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Price Comparison",
  description: "Compare prices between Amazon and Flipkart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent">{children}</body>
    </html>
  );
}
