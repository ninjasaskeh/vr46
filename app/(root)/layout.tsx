import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardStats } from '@/lib/types';

async function getStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard/stats`, {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const stats = await getStats();

  return (
    <SidebarProvider>
      <AppSidebar 
        user={session.user} 
        stats={stats ? {
          unreadNotifications: stats.unreadNotifications,
          lowStockMaterials: stats.lowStockMaterials,
          todayRecords: stats.todayRecords,
        } : undefined}
      />
      <SidebarInset>
        <Header 
          user={session.user} 
          notificationCount={stats?.unreadNotifications || 0}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <main className="p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}