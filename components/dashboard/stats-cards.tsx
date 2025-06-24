'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Scale, 
  Truck, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Bell,
  BarChart3
} from 'lucide-react';
import { DashboardStats } from '@/lib/types';
import { formatWeight } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Materials',
      value: stats.totalMaterials.toLocaleString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'Weight Records',
      value: stats.totalWeightRecords.toLocaleString(),
      icon: Scale,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'Suppliers',
      value: stats.totalSuppliers.toLocaleString(),
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: 'Today Records',
      value: stats.todayRecords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockMaterials.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
      borderColor: 'border-red-200 dark:border-red-800',
      badge: stats.lowStockMaterials > 0 ? 'warning' : null,
    },
    {
      title: 'Unread Notifications',
      value: stats.unreadNotifications.toLocaleString(),
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      badge: stats.unreadNotifications > 0 ? 'info' : null,
    },
    {
      title: 'Avg Weight',
      value: formatWeight(stats.avgWeight),
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`relative overflow-hidden card-hover ${card.bgColor} ${card.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20 shadow-sm`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{card.value}</div>
                {card.badge && (
                  <Badge 
                    variant={card.badge === 'warning' ? 'destructive' : 'secondary'}
                    className="text-xs animate-pulse"
                  >
                    {card.badge === 'warning' ? 'Alert' : 'New'}
                  </Badge>
                )}
              </div>
              <div className="mt-2">
                <div className="h-1 bg-white/30 dark:bg-black/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${card.color.replace('text-', 'bg-')} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min(100, (parseInt(card.value.replace(/,/g, '')) / 1000) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}