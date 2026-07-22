import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { Container } from "@/components/ui/container";

// Sidebar/header chrome for every authenticated page. Kept out of the
// root layout so the login page (outside this route group) renders
// without it — an unauthenticated visitor shouldn't see the app's
// internal navigation at all, not just have it disabled.
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col overflow-hidden">
        <AppHeader />
        <Container className="flex-1 overflow-y-auto pb-0">
          {children}
        </Container>
      </SidebarInset>
    </SidebarProvider>
  );
}
