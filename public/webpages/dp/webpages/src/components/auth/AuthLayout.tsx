import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <div className="relative hidden w-full flex-col justify-between bg-primary p-10 text-white lg:flex lg:w-1/2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
            <Building2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-xl font-semibold tracking-tight">Delight Pack Portal</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">B2B Client Portal</h2>
          <p className="max-w-md text-slate-300">
            Secure access to orders, invoices, and account management for verified business
            clients.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Delight Pack. All rights reserved.
        </p>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/10" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-500">
            <Building2 className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <Link to="/" className="text-lg font-semibold text-foreground">
            Delight Pack
          </Link>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
