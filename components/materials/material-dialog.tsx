'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Material } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface MaterialDialogProps {
  open: boolean;
  onClose: () => void;
  material?: Material | null;
}

export function MaterialDialog({ open, onClose, material }: MaterialDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    supplier: '',
    unitPrice: 0,
    unit: '',
    stock: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        category: material.category,
        supplier: material.supplier,
        unitPrice: material.unitPrice,
        unit: material.unit,
        stock: material.stock,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        supplier: '',
        unitPrice: 0,
        unit: '',
        stock: 0,
      });
    }
  }, [material, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (material) {
        // Update existing material
        await apiClient.put(`/api/materials/${material.id}`, formData);
        toast.success('Material updated successfully!');
      } else {
        // Create new material
        await apiClient.post('/api/materials', formData);
        toast.success('Material created successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save material:', error);
      toast.error('Failed to save material. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      category: '',
      supplier: '',
      unitPrice: 0,
      unit: '',
      stock: 0,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {material ? 'Edit Material' : 'Add New Material'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter material name"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter category"
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier *</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Enter supplier name"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, ton, piece"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              step="0.01"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
              className="btn-animate"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="btn-animate"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {material ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                material ? 'Update Material' : 'Create Material'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}