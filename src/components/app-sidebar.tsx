'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ChevronsUpDown,
  Check,
  FileClock,
  LayoutGrid,
  Palette,
  PenLine,
  Bot,
  Wallet as WalletIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Workspace } from '@/modules/demo/types';

interface AppSidebarProps {
  workspaces: readonly Workspace[];
  activeWorkspace: Workspace;
  awaitingCount: number;
}

export function AppSidebar({ workspaces, activeWorkspace, awaitingCount }: AppSidebarProps) {
  const pathname = usePathname();
  const base = `/w/${activeWorkspace.id}`;

  const nav = [
    { href: base, label: 'Overview', icon: LayoutGrid, exact: true },
    { href: `${base}/approvals`, label: 'Approvals', icon: PenLine, count: awaitingCount },
    { href: `${base}/agents`, label: 'Agents', icon: Bot },
    { href: `${base}/wallets`, label: 'Wallets & rules', icon: WalletIcon },
    { href: `${base}/activity`, label: 'Activity', icon: FileClock },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-sidebar-border border-b p-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-sidebar-accent focus-visible:ring-sidebar-ring flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none">
            <span className="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-[5px] font-mono text-[13px] font-bold">
              AW
            </span>
            <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="block truncate text-[13px] leading-tight font-semibold">
                {activeWorkspace.name}
              </span>
              <span className="text-muted-foreground block truncate text-[11px] leading-tight">
                {activeWorkspace.subtitle}
              </span>
            </span>
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                render={<Link href={`/w/${workspace.id}`} />}
                className="flex items-center gap-2.5"
              >
                {workspace.kind === 'business' ? (
                  <Building2 className="size-4 shrink-0" />
                ) : (
                  <span className="grid size-4 shrink-0 place-items-center text-[11px]">◐</span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{workspace.name}</span>
                  <span className="text-muted-foreground block truncate text-[11px]">
                    {workspace.subtitle}
                  </span>
                </span>
                {workspace.id === activeWorkspace.id && <Check className="size-4 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      tooltip={item.label}
                    >
                      <item.icon className="size-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.count ? (
                        <span
                          className={cn(
                            'bg-pending text-primary-foreground grid min-w-5 place-items-center rounded-full px-1.5',
                            'font-mono text-[10px] font-bold tabular-nums',
                          )}
                        >
                          {item.count}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[10px] tracking-[0.16em] uppercase">
            Demo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href={`${base}/palette`} />}
                  isActive={pathname.startsWith(`${base}/palette`)}
                  tooltip="Palette"
                >
                  <Palette className="size-4" />
                  <span>Palette</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <p className="text-muted-foreground px-2 py-1 font-mono text-[10px] leading-relaxed tracking-wide group-data-[collapsible=icon]:hidden">
          Demonstration data.
          <br />
          No real money, no real accounts.
        </p>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
