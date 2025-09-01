import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { env } from "@/config/env";
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // log the backend URL to verify it's being read correctly
  console.info(`Backend URL: ${env.NEXT_PUBLIC_BACKEND_URL}`);

  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex flex-col flex-grow p-5 bg-amber-50">{children}</main>
        <Footer />
      </body>
    </html>
  );
}