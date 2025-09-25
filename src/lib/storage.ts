import { put, del, list } from '@vercel/blob';
import { Asset, PortfolioSnapshot, FXRateData, AssetLiquidationSettings } from '@/types/api';

// Storage keys
const STORAGE_KEYS = {
  ASSETS: 'portfolio/assets.json',
  SNAPSHOTS: 'portfolio/snapshots.json',
  FX_RATES: 'portfolio/fx-rates.json',
  LIQUIDATION_SETTINGS: 'portfolio/liquidation-settings.json',
} as const;

// Generic storage operations
export class BlobStorage {
  private static async getData<T>(key: string): Promise<T | null> {
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${key}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${key}:`, error);
      return null;
    }
  }

  private static async setData<T>(key: string, data: T): Promise<void> {
    try {
      const blob = await put(key, JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false,
      });
      console.log(`Data saved to blob storage: ${blob.url}`);
    } catch (error) {
      console.error(`Error saving data to ${key}:`, error);
      throw error;
    }
  }

  private static async deleteData(key: string): Promise<void> {
    try {
      await del(key);
    } catch (error) {
      console.error(`Error deleting data from ${key}:`, error);
      throw error;
    }
  }

  // Asset operations
  static async getAssets(): Promise<Asset[]> {
    const assets = await this.getData<Asset[]>(STORAGE_KEYS.ASSETS);
    return assets || [];
  }

  static async saveAssets(assets: Asset[]): Promise<void> {
    await this.setData(STORAGE_KEYS.ASSETS, assets);
  }

  static async addAsset(asset: Asset): Promise<void> {
    const assets = await this.getAssets();
    const existingIndex = assets.findIndex(a => a.id === asset.id);
    
    if (existingIndex >= 0) {
      assets[existingIndex] = asset;
    } else {
      assets.push(asset);
    }
    
    await this.saveAssets(assets);
  }

  static async deleteAsset(assetId: string): Promise<void> {
    const assets = await this.getAssets();
    const filteredAssets = assets.filter(a => a.id !== assetId);
    await this.saveAssets(filteredAssets);
  }

  // Portfolio Snapshot operations
  static async getSnapshots(): Promise<PortfolioSnapshot[]> {
    const snapshots = await this.getData<PortfolioSnapshot[]>(STORAGE_KEYS.SNAPSHOTS);
    return snapshots || [];
  }

  static async saveSnapshots(snapshots: PortfolioSnapshot[]): Promise<void> {
    await this.setData(STORAGE_KEYS.SNAPSHOTS, snapshots);
  }

  static async addSnapshot(snapshot: PortfolioSnapshot): Promise<void> {
    const snapshots = await this.getSnapshots();
    const existingIndex = snapshots.findIndex(s => s.id === snapshot.id);
    
    if (existingIndex >= 0) {
      snapshots[existingIndex] = snapshot;
    } else {
      snapshots.push(snapshot);
    }
    
    await this.saveSnapshots(snapshots);
  }

  static async deleteSnapshot(snapshotId: string): Promise<void> {
    const snapshots = await this.getSnapshots();
    const filteredSnapshots = snapshots.filter(s => s.id !== snapshotId);
    await this.saveSnapshots(filteredSnapshots);
  }

  // FX Rates operations
  static async getFXRates(): Promise<FXRateData[]> {
    const fxRates = await this.getData<FXRateData[]>(STORAGE_KEYS.FX_RATES);
    return fxRates || [];
  }

  static async saveFXRates(fxRates: FXRateData[]): Promise<void> {
    await this.setData(STORAGE_KEYS.FX_RATES, fxRates);
  }

  static async updateFXRates(fxRates: FXRateData[]): Promise<void> {
    await this.saveFXRates(fxRates);
  }

  // Asset Liquidation Settings operations
  static async getLiquidationSettings(): Promise<AssetLiquidationSettings[]> {
    const settings = await this.getData<AssetLiquidationSettings[]>(STORAGE_KEYS.LIQUIDATION_SETTINGS);
    return settings || [];
  }

  static async saveLiquidationSettings(settings: AssetLiquidationSettings[]): Promise<void> {
    await this.setData(STORAGE_KEYS.LIQUIDATION_SETTINGS, settings);
  }

  static async addLiquidationSetting(setting: AssetLiquidationSettings): Promise<void> {
    const settings = await this.getLiquidationSettings();
    const existingIndex = settings.findIndex(s => s.id === setting.id);
    
    if (existingIndex >= 0) {
      settings[existingIndex] = setting;
    } else {
      settings.push(setting);
    }
    
    await this.saveLiquidationSettings(settings);
  }

  static async deleteLiquidationSetting(settingId: string): Promise<void> {
    const settings = await this.getLiquidationSettings();
    const filteredSettings = settings.filter(s => s.id !== settingId);
    await this.saveLiquidationSettings(filteredSettings);
  }
}