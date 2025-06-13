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
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Weight Records',
      value: stats.totalWeightRecords.toLocaleString(),
      icon: Scale,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Suppliers',
      value: stats.totalSuppliers.toLocaleString(),
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Today Records',
      value: stats.todayRecords.toLocaleString(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockMaterials.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      badge: stats.lowStockMaterials > 0 ? 'warning' : null,
    },
    {
      title: 'Unread Notifications',
      value: stats.unreadNotifications.toLocaleString(),
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      badge: stats.unreadNotifications > 0 ? 'info' : null,
    },
    {
      title: 'Avg Weight',
      value: formatWeight(stats.avgWeight),
      icon: BarChart3,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{card.value}</div>
                {card.badge && (
                  <Badge 
                    variant={card.badge === 'warning' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {card.badge === 'warning' ? 'Alert' : 'New'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}