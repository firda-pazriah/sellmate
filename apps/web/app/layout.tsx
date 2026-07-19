import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Container } from "@/components/ui/container";

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
          <SidebarInset className="flex h-screen flex-col overflow-hidden">
            <AppHeader />
            <Container className="flex-1 overflow-y-auto pb-0">
              {children}
            </Container>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
