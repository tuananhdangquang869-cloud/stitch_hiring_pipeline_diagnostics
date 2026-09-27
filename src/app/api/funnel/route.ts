import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockJobs, mockStagesByJob } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId') || 'req-142';

    let job: any = null;
    let stages: any[] = [];

    try {
      job = await prisma.jobRequisition.findUnique({
        where: { id: jobId },
        include: {
          stages: {
            orderBy: { stageOrder: 'asc' },
          },
        },
      });

      if (job) {
        stages = job.stages;
      }
    } catch (dbErr) {
      console.warn('Funnel API DB query error, using fallback:', dbErr);
    }

    if (!job) {
      job = mockJobs.find((j) => j.id === jobId) || mockJobs[0];
      stages = mockStagesByJob[jobId] || mockStagesByJob['req-142'] || [];
    }

    return NextResponse.json({
      success: true,
      data: {
        job,
        stages,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch funnel data' },
      { status: 500 }
    );
  }
}
