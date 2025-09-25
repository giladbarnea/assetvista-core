import { NextRequest, NextResponse } from 'next/server';
import { BlobStorage } from '@/lib/storage';
import { verifySession } from '@/api/auth/verify';
import { Asset, ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const assets = await BlobStorage.getAssets();
    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const assetData = await request.json();
    
    // Generate ID and timestamps
    const asset: Asset = {
      ...assetData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addAsset(asset);
    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to create asset' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const assetData = await request.json();
    
    if (!assetData.id) {
      return NextResponse.json({ success: false, error: 'Asset ID is required' }, { status: 400 });
    }

    // Update timestamp
    const asset: Asset = {
      ...assetData,
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addAsset(asset);
    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to update asset' }, { status: 500 });
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
    const assetId = searchParams.get('id');
    
    if (!assetId) {
      return NextResponse.json({ success: false, error: 'Asset ID is required' }, { status: 400 });
    }

    await BlobStorage.deleteAsset(assetId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete asset' }, { status: 500 });
  }
}