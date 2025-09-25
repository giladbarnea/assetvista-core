import { NextRequest, NextResponse } from 'next/server';
import { BlobStorage } from '@/lib/storage';
import { verifySession } from '@/api/auth/verify';
import { AssetLiquidationSettings, ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await BlobStorage.getLiquidationSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching liquidation settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch liquidation settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settingData = await request.json();
    
    // Generate ID and timestamps
    const setting: AssetLiquidationSettings = {
      ...settingData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addLiquidationSetting(setting);
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error('Error creating liquidation setting:', error);
    return NextResponse.json({ success: false, error: 'Failed to create liquidation setting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const settingData = await request.json();
    
    if (!settingData.id) {
      return NextResponse.json({ success: false, error: 'Setting ID is required' }, { status: 400 });
    }

    // Update timestamp
    const setting: AssetLiquidationSettings = {
      ...settingData,
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addLiquidationSetting(setting);
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error('Error updating liquidation setting:', error);
    return NextResponse.json({ success: false, error: 'Failed to update liquidation setting' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const settingId = searchParams.get('id');
    
    if (!settingId) {
      return NextResponse.json({ success: false, error: 'Setting ID is required' }, { status: 400 });
    }

    await BlobStorage.deleteLiquidationSetting(settingId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting liquidation setting:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete liquidation setting' }, { status: 500 });
  }
}