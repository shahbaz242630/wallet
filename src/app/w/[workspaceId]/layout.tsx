import { notFound } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { FreezeSwitch } from '@/components/freeze-switch';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getTotals, getWorkspace, listWorkspaces } from '@/modules/demo/queries';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const totals = getTotals(workspaceId);

  return (
    <SidebarProvider>
      <AppSidebar
        workspaces={listWorkspaces()}
        activeWorkspace={workspace}
        awaitingCount={totals.awaitingCount}
      />
      <SidebarInset className="bg-background min-w-0">
        <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground truncate font-mono text-[11px] tracking-[0.16em] uppercase">
              Agent Wallet
            </p>
          </div>
          <FreezeSwitch />
          <ThemeSwitcher />
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
