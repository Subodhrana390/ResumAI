
"use client";

import React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Home, FilePlus, BotMessageSquare, Settings, LogOut, Menu, Loader, ScanSearch, FileText, Linkedin, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  { href: '/resumes', label: 'My Resumes', icon: Home },
  { href: '/resumes/editor/new', label: 'New Resume', icon: FilePlus },
  { href: '/ats-checker', label: 'ATS Checker', icon: ScanSearch },
];

const proNavItems = [
    { href: '/cover-letter', label: 'Cover Letter AI', icon: FileText },
    { href: '/linkedin-optimizer', label: 'LinkedIn Optimizer', icon: Linkedin },
    { href: '/career-counselor', label: 'Career Counselor', icon: MessageCircle },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderNavGroup = (items: typeof navItems, isMobile = false) => (
      items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== '/resumes' && pathname.startsWith(item.href))}
              tooltip={isMobile ? undefined : item.label}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))
  );

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="p-4">
            <Link href="/resumes" className="flex items-center gap-2 font-bold text-lg font-headline">
              <BotMessageSquare className="h-7 w-7 text-primary" />
              <span className="group-data-[collapsible=icon]:hidden">ResumAI</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2 flex-grow flex flex-col">
            <SidebarMenu className="flex-grow">
              {renderNavGroup(navItems)}
              <Separator className="my-2" />
              {renderNavGroup(proNavItems)}
            </SidebarMenu>
            <SidebarMenu className="mt-auto">
                {renderNavGroup(bottomNavItems)}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto">
             <Separator className="my-2 group-data-[collapsible=icon]:hidden"/>
             <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt={user.displayName || "User Avatar"} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium">{user.displayName || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
             </div>
            <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center mt-2" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden ml-2">Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="md:hidden">
               <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0 w-72">
                  <SidebarHeader className="p-4 border-b">
                     <Link href="/resumes" className="flex items-center gap-2 font-bold text-lg font-headline">
                        <BotMessageSquare className="h-7 w-7 text-primary" />
                        <span>ResumAI</span>
                      </Link>
                  </SidebarHeader>
                  <SidebarContent className="p-4 flex-grow">
                     <SidebarMenu>
                      {renderNavGroup(navItems, true)}
                      <Separator className="my-2" />
                      {renderNavGroup(proNavItems, true)}
                      <Separator className="my-2" />
                      {renderNavGroup(bottomNavItems, true)}
                     </SidebarMenu>
                  </SidebarContent>
                   <SidebarFooter className="p-4 border-t mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10">
                              <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt={user.displayName || "User Avatar"} data-ai-hint="user avatar" />
                              <AvatarFallback>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="text-sm font-medium">{user.displayName || 'User'}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Logout</span>
                      </Button>
                  </SidebarFooter>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:block">
              {/* Placeholder for breadcrumbs or page title */}
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
