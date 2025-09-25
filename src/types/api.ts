// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Authentication types
export interface LoginRequest {
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface SessionResponse {
  authenticated: boolean;
}

// Asset types (matching existing portfolio types)
export interface Asset {
  id: string;
  name: string;
  class: AssetClass;
  sub_class: SubClass;
  ISIN?: string;
  account_entity: AccountEntity;
  account_bank: AccountBank;
  beneficiary: Beneficiary;
  origin_currency: Currency;
  quantity: number;
  price?: number;
  factor?: number;
  maturity_date?: string;
  ytw?: number;
  pe_company_value?: number;
  pe_holding_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface AssetCreateRequest {
  name: string;
  class: AssetClass;
  sub_class: SubClass;
  ISIN?: string;
  account_entity: AccountEntity;
  account_bank: AccountBank;
  beneficiary: Beneficiary;
  origin_currency: Currency;
  quantity: number;
  price?: number;
  factor?: number;
  maturity_date?: string;
  ytw?: number;
  pe_company_value?: number;
  pe_holding_percentage?: number;
}

export interface AssetUpdateRequest extends Partial<AssetCreateRequest> {
  id: string;
}

// Portfolio Snapshot types
export interface PortfolioSnapshot {
  id: string;
  name: string;
  description?: string;
  snapshot_date: string;
  assets: Asset[];
  fx_rates: FXRates;
  total_value_usd?: number;
  private_equity_value_usd?: number;
  liquid_fixed_income_value_usd?: number;
  real_estate_value_usd?: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioSnapshotCreateRequest {
  name: string;
  description?: string;
  snapshot_date?: string;
  assets: Asset[];
  fx_rates: FXRates;
}

// FX Rates types
export interface FXRates {
  [key: string]: {
    to_USD: number;
    to_ILS: number;
    last_updated: string;
  };
}

export interface FXRateData {
  currency: string;
  to_usd_rate: number;
  to_ils_rate: number;
  last_updated: string;
  source: string;
  is_manual_override: boolean;
}

// Asset Liquidation Settings types
export interface AssetLiquidationSettings {
  id: string;
  asset_name: string;
  liquidation_year: string;
  created_at: string;
  updated_at: string;
}

export interface AssetLiquidationSettingsCreateRequest {
  asset_name: string;
  liquidation_year: string;
}

// Enums (matching existing types)
export type AssetClass = 'Public Equity' | 'Private Equity' | 'Fixed Income' | 'Real Estate' | 'Cash' | 'Commodities & more';
export type SubClass = 'Equity' | 'Bond' | 'Cash' | 'Real Estate' | 'Commodities' | 'Other';
export type AccountEntity = 'Personal' | 'Company' | 'Trust' | 'Other';
export type AccountBank = 'Bank A' | 'Bank B' | 'Bank C' | 'Other';
export type Beneficiary = 'Self' | 'Spouse' | 'Children' | 'Other';
export type Currency = 'ILS' | 'USD' | 'CHF' | 'EUR' | 'CAD' | 'HKD';