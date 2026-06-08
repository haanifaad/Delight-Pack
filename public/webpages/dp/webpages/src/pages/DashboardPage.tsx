import { DashboardLayout } from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { RecentActivity } from '@/components/RecentActivity';
import { useSupportChat } from '@/components/SupportChatContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { Package, Truck, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ContactSupportButton() {
  const { open } = useSupportChat();
  return (
    <Button variant="outline" className="w-full" onClick={open}>
      Contact Support
    </Button>
  );
}

function getFirstName(displayName: string | null | undefined, email: string | null | undefined): string {
  if (displayName?.trim()) {
    return displayName.trim().split(/\s+/)[0] ?? displayName;
  }
  if (email) {
    return email.split('@')[0] ?? 'there';
  }
  return 'there';
}

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = getFirstName(user?.displayName, user?.email);

  return (
    <DashboardLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="bg-primary rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Here&apos;s what&apos;s happening with your depository account today. You have 3
              shipments arriving this week and 1 outstanding invoice requiring attention.
            </p>
          </div>
          <div className="relative z-10 flex shrink-0 gap-3">
            <Button variant="secondary" className="bg-card glass-card backdrop-blur-2xl/10 text-white hover:bg-card glass-card backdrop-blur-2xl/20 border-0">
              Download Report
            </Button>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2">
              New Transfer <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Active Orders"
            value="142"
            icon={<Package className="h-4 w-4" />}
            description="from last month"
            trend="up"
            trendValue="+12%"
          />
          <StatCard
            title="Pending Deliveries"
            value="18"
            icon={<Truck className="h-4 w-4" />}
            description="scheduled for next 7 days"
            trend="neutral"
            trendValue="Steady"
          />
          <StatCard
            title="Outstanding Balance"
            value="$24,500.00"
            icon={<DollarSign className="h-4 w-4" />}
            description="due in 14 days"
            trend="down"
            trendValue="-4%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentActivity />
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border bg-card glass-card backdrop-blur-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-between group">
                    View Fee Schedule
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-between group">
                    API Documentation
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-between group">
                    Compliance Certificates
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border bg-background p-6 shadow-sm">
              <h3 className="font-semibold text-foreground mb-2">Need Assistance?</h3>
              <p className="text-sm text-muted-foreground mb-4">Our dedicated B2B support team is available 24/7.</p>
              <ContactSupportButton />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
