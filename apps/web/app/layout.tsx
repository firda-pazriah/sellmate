import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/app-header";
import { Container } from "@/components/layout/container";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sellmate",
  description: "Seller Productivity Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <Container className="relative h-full pt-0">{children}</Container>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
