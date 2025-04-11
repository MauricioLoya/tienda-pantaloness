import { NextRequest, NextResponse } from 'next/server';
import { RegionRepository } from '@/modules/region/definitions';

export async function GET(request: NextRequest) {
  try {
    const regionRepository = new RegionRepository();
    const regions = await regionRepository.getAll();
    
    return NextResponse.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    );
  }
}