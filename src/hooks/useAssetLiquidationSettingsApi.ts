import { useState, useEffect } from 'react';
import { AssetLiquidationSettings, AssetLiquidationSettingsCreateRequest, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useAssetLiquidationSettingsApi() {
  const [settings, setSettings] = useState<AssetLiquidationSettings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/liquidation-settings', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch liquidation settings');
      }

      const data: ApiResponse<AssetLiquidationSettings[]> = await response.json();
      if (data.success && data.data) {
        setSettings(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch liquidation settings');
      }
    } catch (error) {
      console.error('Error fetching liquidation settings:', error);
      toast({
        title: "Error",
        description: "Failed to load liquidation settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSetting = async (settingData: AssetLiquidationSettingsCreateRequest): Promise<AssetLiquidationSettings | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/liquidation-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create liquidation setting');
      }

      const data: ApiResponse<AssetLiquidationSettings> = await response.json();
      if (data.success && data.data) {
        setSettings(prev => [...prev, data.data!]);
        toast({
          title: "Success",
          description: "Liquidation setting created successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to create liquidation setting');
      }
    } catch (error) {
      console.error('Error creating liquidation setting:', error);
      toast({
        title: "Error",
        description: "Failed to create liquidation setting",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (settingData: AssetLiquidationSettings): Promise<AssetLiquidationSettings | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/liquidation-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(settingData),
      });

      if (!response.ok) {
        throw new Error('Failed to update liquidation setting');
      }

      const data: ApiResponse<AssetLiquidationSettings> = await response.json();
      if (data.success && data.data) {
        setSettings(prev => prev.map(setting => 
          setting.id === data.data!.id ? data.data! : setting
        ));
        toast({
          title: "Success",
          description: "Liquidation setting updated successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to update liquidation setting');
      }
    } catch (error) {
      console.error('Error updating liquidation setting:', error);
      toast({
        title: "Error",
        description: "Failed to update liquidation setting",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSetting = async (settingId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/liquidation-settings?id=${settingId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete liquidation setting');
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setSettings(prev => prev.filter(setting => setting.id !== settingId));
        toast({
          title: "Success",
          description: "Liquidation setting deleted successfully",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete liquidation setting');
      }
    } catch (error) {
      console.error('Error deleting liquidation setting:', error);
      toast({
        title: "Error",
        description: "Failed to delete liquidation setting",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    createSetting,
    updateSetting,
    deleteSetting,
    refetch: fetchSettings,
  };
}