import { useState, useEffect } from 'react';
import { Asset, AssetCreateRequest, AssetUpdateRequest, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useAssetsApi() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/assets', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }

      const data: ApiResponse<Asset[]> = await response.json();
      if (data.success && data.data) {
        setAssets(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to load assets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAsset = async (assetData: AssetCreateRequest): Promise<Asset | null> => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assetData),
      });

      if (!response.ok) {
        throw new Error('Failed to create asset');
      }

      const data: ApiResponse<Asset> = await response.json();
      if (data.success && data.data) {
        setAssets(prev => [...prev, data.data!]);
        toast({
          title: "Success",
          description: "Asset created successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to create asset');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      toast({
        title: "Error",
        description: "Failed to create asset",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAsset = async (assetData: AssetUpdateRequest): Promise<Asset | null> => {
    try {
      const response = await fetch('/api/assets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assetData),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset');
      }

      const data: ApiResponse<Asset> = await response.json();
      if (data.success && data.data) {
        setAssets(prev => prev.map(asset => 
          asset.id === data.data!.id ? data.data! : asset
        ));
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to update asset');
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAsset = async (assetId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/assets?id=${assetId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
        toast({
          title: "Success",
          description: "Asset deleted successfully",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return {
    assets,
    isLoading,
    createAsset,
    updateAsset,
    deleteAsset,
    refetch: fetchAssets,
  };
}