import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "@/components/layout/AgeGate";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Lost and Found Wines — New Zealand",
  description:
    "Lost and Found is on a journey of discovery through the wines and regions of Aotearoa New Zealand. Explore Origin and Uncharted collections.",
  openGraph: {
    title: "Lost and Found Wines",
    description: "A journey of discovery through New Zealand wine.",
    url: "https://www.lostandfoundwine.co.nz",
    siteName: "Lost and Found Wines",
    locale: "en_NZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-brand-bg text-brand-text antialiased flex flex-col min-h-screen">
        <AgeGate />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
