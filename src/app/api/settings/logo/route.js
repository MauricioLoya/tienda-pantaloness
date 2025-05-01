// app/api/settings/logo/route.js
import { SettingsRepository } from '@/modules/settings/definitions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const settingsRepository = new SettingsRepository();
    const logoUrl = await settingsRepository.get('logoUrl');

    return NextResponse.json({ logoUrl });
  } catch (error) {
    console.error('Error fetching logo URL:', error);
    return NextResponse.json({ error: 'Failed to fetch logo URL' }, { status: 500 });
  }
}
