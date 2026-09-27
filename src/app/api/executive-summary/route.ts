import { NextResponse } from 'next/server';
import { mockExecutiveSummary } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockExecutiveSummary,
  });
}
