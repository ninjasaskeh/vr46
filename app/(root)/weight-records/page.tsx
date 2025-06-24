'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Scale, Search, Filter, Truck, User, RefreshCw, Eye } from 'lucide-react';
import { WeightRecord } from '@/lib/types';
import { formatDate, formatWeight, getStatusColor } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export default function WeightRecordsPage() {
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchWeightRecords();
  }, [searchTerm, selectedStatus]);

  const fetchWeightRecords = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        limit: '50',
      };
      
      if (selectedStatus) params.status = selectedStatus;

      const response = await apiClient.get<{ data: WeightRecord[] }>('/api/weight-records', params);
      if (response.success && response.data) {
        setWeightRecords(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch weight records:', error);
      toast.error('Failed to fetch weight records');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast.promise(fetchWeightRecords(), {
      loading: 'Refreshing weight records...',
      success: 'Weight records refreshed successfully!',
      error: 'Failed to refresh weight records',
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    toast.info('Filters cleared');
  };

  const handleViewDetails = (record: WeightRecord) => {
    toast.info(`Viewing details for record: ${record.id}`);
    // Here you could open a modal or navigate to a detail page
  };

  const filteredRecords = weightRecords.filter(record =>
    record.material?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.operator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Weight Records</h1>
          <p className="text-gray-500 dark:text-gray-400">Monitor and manage weighing operations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" className="btn-animate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by material, vehicle, or operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="btn-animate"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weight Records Table */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Weight Records ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground">No weight records found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Gross Weight</TableHead>
                  <TableHead>Tare Weight</TableHead>
                  <TableHead>Net Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {record.material?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-gray-400" />
                        {record.vehicleNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-gray-400" />
                        {record.operator?.name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>{formatWeight(record.grossWeight)}</TableCell>
                    <TableCell>{formatWeight(record.tareWeight)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatWeight(record.netWeight)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(record.weighingDate || record.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(record)}
                        className="btn-animate"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}