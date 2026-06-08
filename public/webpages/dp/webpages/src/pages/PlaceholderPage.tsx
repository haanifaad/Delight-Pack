import { DashboardLayout } from '@/components/DashboardLayout';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-500">{description}</p>
      </div>
    </DashboardLayout>
  );
}
