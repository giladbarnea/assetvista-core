import { useState, useEffect } from 'react';
import { FXRateData, FXRates, ApiResponse } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export function useFXRatesApi() {
  const [fxRates, setFxRates] = useState<FXRates>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFXRates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fx-rates', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch FX rates');
      }

      const data: ApiResponse<FXRateData[]> = await response.json();
      if (data.success && data.data) {
        const rates: FXRates = {};
        let mostRecentUpdate: Date | null = null;

        data.data.forEach((rate: FXRateData) => {
          rates[rate.currency as keyof FXRates] = {
            to_USD: rate.to_usd_rate,
            to_ILS: rate.to_ils_rate,
            last_updated: rate.last_updated,
          };

          const updateTime = new Date(rate.last_updated);
          if (!mostRecentUpdate || updateTime > mostRecentUpdate) {
            mostRecentUpdate = updateTime;
          }
        });

        setFxRates(rates);
        setLastUpdated(mostRecentUpdate);
      } else {
        throw new Error(data.error || 'Failed to fetch FX rates');
      }
    } catch (error) {
      console.error('Error fetching FX rates:', error);
      toast({
        title: "Error",
        description: "Failed to load FX rates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFXRates = async (rates: FXRateData[]): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fx-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(rates),
      });

      if (!response.ok) {
        throw new Error('Failed to update FX rates');
      }

      const data: ApiResponse<FXRateData[]> = await response.json();
      if (data.success && data.data) {
        const newRates: FXRates = {};
        let mostRecentUpdate: Date | null = null;

        data.data.forEach((rate: FXRateData) => {
          newRates[rate.currency as keyof FXRates] = {
            to_USD: rate.to_usd_rate,
            to_ILS: rate.to_ils_rate,
            last_updated: rate.last_updated,
          };

          const updateTime = new Date(rate.last_updated);
          if (!mostRecentUpdate || updateTime > mostRecentUpdate) {
            mostRecentUpdate = updateTime;
          }
        });

        setFxRates(newRates);
        setLastUpdated(mostRecentUpdate);
        
        toast({
          title: "Success",
          description: "FX rates updated successfully",
        });
        return true;
      } else {
        throw new Error(data.error || 'Failed to update FX rates');
      }
    } catch (error) {
      console.error('Error updating FX rates:', error);
      toast({
        title: "Error",
        description: "Failed to update FX rates",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestFXRates = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Fetch latest rates from a public API (example using exchangerate-api.com)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch latest FX rates');
      }

      const data = await response.json();
      const rates: FXRateData[] = [];

      // Convert to our format
      Object.entries(data.rates).forEach(([currency, rate]) => {
        if (['ILS', 'USD', 'CHF', 'EUR', 'CAD', 'HKD'].includes(currency)) {
          rates.push({
            currency,
            to_usd_rate: currency === 'USD' ? 1 : 1 / (rate as number),
            to_ils_rate: currency === 'ILS' ? 1 : (rate as number) / data.rates.ILS,
            last_updated: new Date().toISOString(),
            source: 'exchangerate-api.com',
            is_manual_override: false,
          });
        }
      });

      return await updateFXRates(rates);
    } catch (error) {
      console.error('Error fetching latest FX rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch latest FX rates",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFXRates();
  }, []);

  return {
    fxRates,
    lastUpdated,
    isLoading,
    updateFXRates,
    fetchLatestFXRates,
    refetch: fetchFXRates,
  };
}