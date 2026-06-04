import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  LifeBuoy,
  Menu,
  Bell,
  Search,
  Building2,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SupportChatProvider, useSupportChat } from '@/components/SupportChatContext';
import { SupportChatWidget } from '@/components/SupportChatWidget';
import { useAuth } from '@/src/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', to: '/', icon: LayoutDashboard, end: true },
  { name: 'Active Orders', to: '/orders', icon: ShoppingCart, end: false },
  { name: 'Invoice History', to: '/invoices', icon: FileText, end: false },
  { name: 'Support', to: null, icon: LifeBuoy, end: false },
];

function getInitials(displayName: string | null | undefined, email: string | null | undefined): string {
  if (displayName?.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName ?? user?.email ?? 'Account';
  const initials = getInitials(user?.displayName, user?.email);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <SupportChatProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent onNavigate={() => setSidebarOpen(false)} onSignOut={handleSignOut} />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
          <SidebarContent onSignOut={handleSignOut} />
        </div>

        <div className="lg:pl-72 flex flex-col flex-1 w-full">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="-m-2.5 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>

            <div className="h-6 w-px bg-slate-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <Search
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm bg-transparent outline-none"
                  placeholder="Search orders, invoices, or help articles..."
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <Button variant="ghost" size="icon" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </Button>

                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

                <div className="flex items-center gap-x-3">
                  <Avatar className="h-8 w-8 object-cover">
                    {user?.photoURL && <AvatarImage src={user.photoURL} alt="" />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex lg:flex-col lg:items-end">
                    <span className="text-sm font-medium leading-6 text-slate-900 max-w-[140px] truncate">
                      {displayName}
                    </span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <LogOut className="h-3 w-3" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1">{children}</main>
        </div>

        <SupportChatWidget />
      </div>
    </SupportChatProvider>
  );
}

function SidebarContent({
  onNavigate,
  onSignOut,
}: {
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const { open: openSupportChat } = useSupportChat();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4 ring-1 ring-white/10 h-full w-full">
      <div className="flex h-16 shrink-0 items-center text-white gap-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-indigo-500">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">Nexus Depository</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  {item.name === 'Support' ? (
                    <button
                      type="button"
                      onClick={() => {
                        openSupportChat();
                        onNavigate?.();
                      }}
                      className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </button>
                  ) : (
                    <NavLink
                      to={item.to!}
                      end={item.end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium',
                          isActive
                            ? 'bg-slate-800 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800',
                        )
                      }
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto space-y-3">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-sm font-medium text-white">Account Status: Active</h3>
              <p className="mt-1 text-xs text-slate-400">Next billing date: Oct 1, 2026</p>
              <Button
                variant="outline"
                className="w-full mt-3 bg-transparent border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Manage Billing
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 lg:hidden"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
