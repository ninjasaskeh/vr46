'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { useDashboardStats, useRecentWeightRecords } from '@/hooks/use-realtime-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  Database,
  Wifi,
  RefreshCw,
  Package,
  Scale,
  Truck,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useDashboardStats();
  const { data: recentRecords, loading: recordsLoading, refetch: refetchRecords } = useRecentWeightRecords();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    toast.promise(
      Promise.all([refetchStats(), refetchRecords()]),
      {
        loading: 'Refreshing dashboard data...',
        success: 'Dashboard updated successfully!',
        error: 'Failed to refresh dashboard data',
      }
    );
    setLastUpdate(new Date());
  };

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your IoT weighing management system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Loading Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>

        {/* Loading Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to your IoT weighing management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString('id-ID')}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="btn-animate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 dark:border-green-800 card-hover">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              System Status: All Systems Operational
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              IoT devices connected, database online, real-time monitoring active
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-green-700 dark:text-green-300">
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>IoT Online</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>DB Connected</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Real-time Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities - Takes 2 columns */}
        <div className="lg:col-span-2">
          {recordsLoading ? (
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          ) : (
            <RecentActivities weightRecords={recentRecords?.data || []} />
          )}
        </div>

        {/* Notifications Panel - Takes 1 column */}
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 btn-animate card-hover" asChild>
              <Link href="/materials">
                <Package className="h-6 w-6" />
                <span>Add Material</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 btn-animate card-hover" asChild>
              <Link href="/weight-records">
                <Scale className="h-6 w-6" />
                <span>View Records</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 btn-animate card-hover" asChild>
              <Link href="/suppliers">
                <Truck className="h-6 w-6" />
                <span>Manage Suppliers</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 btn-animate card-hover" asChild>
              <Link href="/reports">
                <BarChart3 className="h-6 w-6" />
                <span>Generate Report</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800 shadow-lg">
          <CardContent className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              Real-time Updates Active
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}