'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeightRecord } from '@/lib/types';
import { formatDate, formatWeight, getStatusColor } from '@/lib/utils';
import { Scale, Truck, User } from 'lucide-react';

interface RecentActivitiesProps {
  weightRecords: WeightRecord[];
}

export function RecentActivities({ weightRecords }: RecentActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Recent Weighing Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weightRecords.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent activities found
            </p>
          ) : (
            weightRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
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
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatWeight(record.netWeight)}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(record.createdAt)}
                    </span>
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