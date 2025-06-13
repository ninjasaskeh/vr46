'use client';

import { useEffect, useState } from 'react';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivities } from '@/components/dashboard/recent-activities';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { useDashboardStats, useRecentWeightRecords } from '@/hooks/use-realtime-data';
import { DashboardStats, WeightRecord } from '@/lib/types';

export default function DashboardPage() {
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: recentRecords, loading: recordsLoading } = useRecentWeightRecords();

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-1">
          {recordsLoading ? (
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <RecentActivities weightRecords={recentRecords?.data || []} />
          )}
        </div>

        {/* Notifications Panel */}
        <div className="lg:col-span-1">
          <NotificationsPanel />
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-700">Real-time Updates Active</span>
        </div>
      </div>
    </div>
  );
}