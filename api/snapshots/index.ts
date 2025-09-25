import { NextRequest, NextResponse } from 'next/server';
import { BlobStorage } from '@/lib/storage';
import { verifySession } from '@/api/auth/verify';
import { PortfolioSnapshot, ApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const snapshots = await BlobStorage.getSnapshots();
    return NextResponse.json({ success: true, data: snapshots });
  } catch (error) {
    console.error('Error fetching snapshots:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch snapshots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const snapshotData = await request.json();
    
    // Generate ID and timestamps
    const snapshot: PortfolioSnapshot = {
      ...snapshotData,
      id: crypto.randomUUID(),
      snapshot_date: snapshotData.snapshot_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addSnapshot(snapshot);
    return NextResponse.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to create snapshot' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const isAuthenticated = await verifySession(request);
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const snapshotData = await request.json();
    
    if (!snapshotData.id) {
      return NextResponse.json({ success: false, error: 'Snapshot ID is required' }, { status: 400 });
    }

    // Update timestamp
    const snapshot: PortfolioSnapshot = {
      ...snapshotData,
      updated_at: new Date().toISOString(),
    };

    await BlobStorage.addSnapshot(snapshot);
    return NextResponse.json({ success: true, data: snapshot });
  } catch (error) {
    console.error('Error updating snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to update snapshot' }, { status: 500 });
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
    const snapshotId = searchParams.get('id');
    
    if (!snapshotId) {
      return NextResponse.json({ success: false, error: 'Snapshot ID is required' }, { status: 400 });
    }

    await BlobStorage.deleteSnapshot(snapshotId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete snapshot' }, { status: 500 });
  }
}