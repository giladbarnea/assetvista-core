import { NextRequest, NextResponse } from 'next/server';
import { BlobStorage } from '@/lib/storage';
import { verifySession } from '@/api/auth/verify';
import { FXRateData, ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const fxRates = await BlobStorage.getFXRates();
    return NextResponse.json({ success: true, data: fxRates });
  } catch (error) {
    console.error('Error fetching FX rates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch FX rates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const fxRatesData = await request.json();
    
    // Update timestamp for all rates
    const updatedFxRates: FXRateData[] = fxRatesData.map((rate: FXRateData) => ({
      ...rate,
      last_updated: new Date().toISOString(),
    }));

    await BlobStorage.updateFXRates(updatedFxRates);
    return NextResponse.json({ success: true, data: updatedFxRates });
  } catch (error) {
    console.error('Error updating FX rates:', error);
    return NextResponse.json({ success: false, error: 'Failed to update FX rates' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const fxRatesData = await request.json();
    
    // Update timestamp for all rates
    const updatedFxRates: FXRateData[] = fxRatesData.map((rate: FXRateData) => ({
      ...rate,
      last_updated: new Date().toISOString(),
    }));

    await BlobStorage.updateFXRates(updatedFxRates);
    return NextResponse.json({ success: true, data: updatedFxRates });
  } catch (error) {
    console.error('Error updating FX rates:', error);
    return NextResponse.json({ success: false, error: 'Failed to update FX rates' }, { status: 500 });
  }
}