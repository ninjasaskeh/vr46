'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { WeightRecord, Material, DashboardStats } from '@/lib/types';
import { formatWeight, formatCurrency, formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [statsResponse, recordsResponse, materialsResponse] = await Promise.all([
        apiClient.get<DashboardStats>('/api/dashboard/stats'),
        apiClient.get<WeightRecord[]>('/api/weight-records', { limit: '100' }),
        apiClient.get<Material[]>('/api/materials', { limit: '100' }),
      ]);

      if (statsResponse.success) setStats(statsResponse.data!);
      if (recordsResponse.success) setWeightRecords(recordsResponse.data!);
      if (materialsResponse.success) setMaterials(materialsResponse.data!);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // This would generate and download a PDF report
    console.log('Generating report...');
  };

  const lowStockMaterials = materials.filter(m => m.status === 'LOW_STOCK' || m.status === 'OUT_OF_STOCK');
  const completedRecords = weightRecords.filter(r => r.status === 'COMPLETED');
  const totalWeight = completedRecords.reduce((sum, record) => sum + record.netWeight, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive insights and data analysis</p>
        </div>
        <Button onClick={generateReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date Range Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={fetchReportData}>Apply Filter</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalMaterials || 0}</div>
                <p className="text-xs text-muted-foreground">Active inventory items</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Weight Processed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatWeight(totalWeight)}</div>
                <p className="text-xs text-muted-foreground">Completed operations</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.todayRecords || 0}</div>
                <p className="text-xs text-muted-foreground">Weighing operations today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.lowStockMaterials || 0}</div>
                <p className="text-xs text-muted-foreground">Items need attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Top Materials by Weight</h4>
                    <div className="space-y-2">
                      {completedRecords
                        .reduce((acc, record) => {
                          const materialName = record.material?.name || 'Unknown';
                          acc[materialName] = (acc[materialName] || 0) + record.netWeight;
                          return acc;
                        }, {} as Record<string, number>)
                        && Object.entries(
                          completedRecords.reduce((acc, record) => {
                            const materialName = record.material?.name || 'Unknown';
                            acc[materialName] = (acc[materialName] || 0) + record.netWeight;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([material, weight]) => (
                          <div key={material} className="flex justify-between">
                            <span>{material}</span>
                            <span className="font-medium">{formatWeight(weight)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Operation Status</h4>
                    <div className="space-y-2">
                      {['COMPLETED', 'PENDING', 'IN_PROGRESS', 'CANCELLED'].map(status => {
                        const count = weightRecords.filter(r => r.status === status).length;
                        return (
                          <div key={status} className="flex justify-between">
                            <span>{status.replace('_', ' ')}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Material Inventory Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Stock Levels</h4>
                    <div className="space-y-2">
                      {materials.slice(0, 10).map(material => (
                        <div key={material.id} className="flex justify-between items-center">
                          <span className="truncate">{material.name}</span>
                          <div className="flex items-center gap-2">
                            <span>{material.stock} {material.unit}</span>
                            <Badge className={material.status === 'LOW_STOCK' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                              {material.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Value Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Inventory Value</span>
                        <span className="font-medium">
                          {formatCurrency(materials.reduce((sum, m) => sum + (m.stock * m.unitPrice), 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Unit Price</span>
                        <span className="font-medium">
                          {formatCurrency(materials.reduce((sum, m) => sum + m.unitPrice, 0) / materials.length)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Categories</span>
                        <span className="font-medium">
                          {new Set(materials.map(m => m.category)).size}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operations Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Daily Operations</h4>
                    <div className="text-2xl font-bold">{completedRecords.length}</div>
                    <p className="text-sm text-muted-foreground">Completed weighing operations</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Average Weight</h4>
                    <div className="text-2xl font-bold">
                      {formatWeight(stats?.avgWeight || 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Per operation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Efficiency Rate</h4>
                    <div className="text-2xl font-bold">
                      {((completedRecords.length / weightRecords.length) * 100).toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Completion rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                System Alerts & Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockMaterials.length > 0 ? (
                  <div>
                    <h4 className="font-semibold mb-2 text-orange-600">Low Stock Materials</h4>
                    <div className="space-y-2">
                      {lowStockMaterials.map(material => (
                        <div key={material.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                          <div>
                            <span className="font-medium">{material.name}</span>
                            <p className="text-sm text-gray-600">{material.category}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-orange-600 font-medium">
                              {material.stock} {material.unit}
                            </span>
                            <Badge className="ml-2 bg-orange-100 text-orange-800">
                              {material.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-green-600 mb-2">
                      <TrendingUp className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600">All Systems Normal</h3>
                    <p className="text-gray-500">No critical alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}