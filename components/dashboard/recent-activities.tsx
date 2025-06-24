'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeightRecord } from '@/lib/types';
import { formatDate, formatWeight, getStatusColor } from '@/lib/utils';
import { Scale, Truck, User, Clock, TrendingUp } from 'lucide-react';

interface RecentActivitiesProps {
  weightRecords: WeightRecord[];
}

export function RecentActivities({ weightRecords }: RecentActivitiesProps) {
  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Recent Weighing Activities
          <Badge variant="secondary" className="ml-auto">
            {weightRecords.length} records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weightRecords.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No recent activities found</p>
            </div>
          ) : (
            weightRecords.map((record, index) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Scale className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{record.material?.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {record.vehicleNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {record.operator?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(record.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="font-semibold text-lg">{formatWeight(record.netWeight)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}