import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ERPProvider } from "@/context/ERPContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bhagyalaxmi ERP - Luxury Wedding Venue Operating System",
  description: "The premier operating system for Bhagyalaxmi Lawns & Banquet Hall, Bhingar, Ahilyanagar, India. Managing bookings, CRM, operations, financial accounting, backup utilities, and analytics in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ivory-soft font-sans text-charcoal-dark antialiased selection:bg-purple-royal/20 selection:text-purple-dark">
        <ERPProvider>
          {children}
        </ERPProvider>
      </body>
    </html>
  );
}
