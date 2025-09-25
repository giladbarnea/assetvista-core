import { useState, useEffect } from 'react';
import { PortfolioSnapshot, PortfolioSnapshotCreateRequest, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function usePortfolioSnapshotsApi() {
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSnapshots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/snapshots', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch snapshots');
      }

      const data: ApiResponse<PortfolioSnapshot[]> = await response.json();
      if (data.success && data.data) {
        setSnapshots(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch snapshots');
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio snapshots",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSnapshot = async (snapshotData: PortfolioSnapshotCreateRequest): Promise<PortfolioSnapshot | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/snapshots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(snapshotData),
      });

      if (!response.ok) {
        throw new Error('Failed to create snapshot');
      }

      const data: ApiResponse<PortfolioSnapshot> = await response.json();
      if (data.success && data.data) {
        setSnapshots(prev => [...prev, data.data!]);
        toast({
          title: "Success",
          description: "Portfolio snapshot created successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to create snapshot');
      }
    } catch (error) {
      console.error('Error creating snapshot:', error);
      toast({
        title: "Error",
        description: "Failed to create portfolio snapshot",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSnapshot = async (snapshotData: PortfolioSnapshot): Promise<PortfolioSnapshot | null> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/snapshots', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(snapshotData),
      });

      if (!response.ok) {
        throw new Error('Failed to update snapshot');
      }

      const data: ApiResponse<PortfolioSnapshot> = await response.json();
      if (data.success && data.data) {
        setSnapshots(prev => prev.map(snapshot => 
          snapshot.id === data.data!.id ? data.data! : snapshot
        ));
        toast({
          title: "Success",
          description: "Portfolio snapshot updated successfully",
        });
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to update snapshot');
      }
    } catch (error) {
      console.error('Error updating snapshot:', error);
      toast({
        title: "Error",
        description: "Failed to update portfolio snapshot",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSnapshot = async (snapshotId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/snapshots?id=${snapshotId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete snapshot');
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setSnapshots(prev => prev.filter(snapshot => snapshot.id !== snapshotId));
        toast({
          title: "Success",
          description: "Portfolio snapshot deleted successfully",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete snapshot');
      }
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio snapshot",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshots();
  }, []);

  return {
    snapshots,
    isLoading,
    createSnapshot,
    updateSnapshot,
    deleteSnapshot,
    refetch: fetchSnapshots,
  };
}