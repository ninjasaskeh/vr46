'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Package, Filter, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Material } from '@/lib/types';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { MaterialDialog } from '@/components/materials/material-dialog';
import { toast } from 'sonner';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, [searchTerm, selectedCategory, selectedStatus]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {
        limit: '50',
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      const response = await apiClient.get<{ data: Material[] }>('/api/materials', params);
      if (response.success && response.data) {
        setMaterials(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = () => {
    setEditingMaterial(null);
    setShowDialog(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setShowDialog(true);
  };

  const handleDeleteMaterial = async (material: Material) => {
    if (!confirm(`Are you sure you want to delete "${material.name}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/api/materials/${material.id}`);
      toast.success('Material deleted successfully!');
      fetchMaterials();
    } catch (error) {
      console.error('Failed to delete material:', error);
      toast.error('Failed to delete material');
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditingMaterial(null);
    fetchMaterials();
  };

  const handleRefresh = () => {
    toast.promise(fetchMaterials(), {
      loading: 'Refreshing materials...',
      success: 'Materials refreshed successfully!',
      error: 'Failed to refresh materials',
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    toast.info('Filters cleared');
  };

  const categories = [...new Set(materials.map(m => m.category))];
  const statuses = ['ACTIVE', 'LOW_STOCK', 'OUT_OF_STOCK', 'INACTIVE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Materials Management</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your inventory materials and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleRefresh} variant="outline" className="btn-animate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateMaterial} className="flex items-center gap-2 btn-animate">
            <Plus className="h-4 w-4" />
            Add Material
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
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

      {/* Materials Table */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Materials ({materials.length})
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
          ) : materials.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-muted-foreground">No materials found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or add a new material</p>
              <Button onClick={handleCreateMaterial} className="mt-4 btn-animate">
                <Plus className="h-4 w-4 mr-2" />
                Add First Material
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.category}</TableCell>
                    <TableCell>{material.supplier}</TableCell>
                    <TableCell>{material.stock} {material.unit}</TableCell>
                    <TableCell>{formatCurrency(material.unitPrice)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(material.status)}>
                        {material.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMaterial(material)}
                          className="btn-animate"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material)}
                          className="btn-animate text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Material Dialog */}
      <MaterialDialog
        open={showDialog}
        onClose={handleDialogClose}
        material={editingMaterial}
      />
    </div>
  );
}