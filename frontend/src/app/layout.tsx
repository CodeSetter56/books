import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import { getMe } from "@/lib/api/user";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ELib",
  description: "Browse and read books seamlessly",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  // Prefetch user session on server if a token exists
  if (token) {
    await queryClient.prefetchQuery({
      queryKey: ["me"],
      queryFn: getMe,
    });
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-text antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Toaster position="top-right" />
            <Navbar />
            <main className="grow flex flex-col">{children}</main>
            <Footer />
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
