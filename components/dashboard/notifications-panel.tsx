'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Notification } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import Link from 'next/link';

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get<Notification[]>('/api/notifications', {
        limit: '5',
        unreadOnly: 'true',
      });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    toast.promise(
      apiClient.patch('/api/notifications?action=markAllRead', {}),
      {
        loading: 'Marking all as read...',
        success: () => {
          setNotifications([]);
          return 'All notifications marked as read';
        },
        error: 'Failed to mark notifications as read',
      }
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'ERROR':
        return <X className="h-4 w-4 text-red-600" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'WARNING':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800';
      case 'ERROR':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-950 dark:to-pink-950 dark:border-red-800';
      case 'SUCCESS':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950 dark:to-emerald-950 dark:border-green-800';
      default:
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {notifications.length > 0 && (
              <Badge variant="destructive" className="ml-2 animate-pulse">
                {notifications.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="flex items-center gap-1 btn-animate"
              >
                <CheckCheck className="h-3 w-3" />
                Mark All Read
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="btn-animate">
              <Link href="/notifications">
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground">All caught up!</h3>
              <p className="text-sm text-muted-foreground">No new notifications</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} card-hover`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {notification.category}
                      </Badge>
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
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