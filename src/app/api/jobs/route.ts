import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockJobs } from '@/lib/mock-data';

export async function GET() {
  try {
    let jobsList: any[] = [];
    try {
      jobsList = await prisma.jobRequisition.findMany({
        include: {
          stages: {
            orderBy: { stageOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      console.warn('Jobs API DB error, using fallback:', dbErr);
    }

    if (jobsList.length === 0) {
      jobsList = mockJobs;
    }

    return NextResponse.json({ success: true, data: jobsList });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, department, hiringManager, targetDaysToFill, stages: stageNames } = body;

    const reqCode = `REQ-${Math.floor(100 + Math.random() * 900)}`;
    const createdJob = await prisma.jobRequisition.create({
      data: {
        reqCode,
        title: title || 'New Position',
        department: department || 'ENGINEERING',
        status: 'ACTIVE',
        hiringManager: hiringManager || 'Sarah Jenkins',
        targetDaysToFill: Number(targetDaysToFill) || 30,
        totalApplicants: 0,
        conversionRate: 0.0,
        conversionTrend: '+0.0%',
        funnelHealth: 'Good',
        avgTimeToHireDays: 14.0,
        timeVsPrevTrend: 0.0,
        primaryBottleneck: stageNames?.[1] || 'Screening',
        bottleneckDropRate: 0.0,
      },
    });

    const defaultNames = stageNames && stageNames.length > 0
      ? stageNames
      : ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'];

    const createdStages = [];
    for (let i = 0; i < defaultNames.length; i++) {
      const stage = await prisma.stage.create({
        data: {
          name: defaultNames[i],
          stageOrder: i + 1,
          jobRequisitionId: createdJob.id,
          targetDaysInStage: 4.0,
          avgDaysInStage: 1.0,
          volumeIn: 0,
          volumePassed: 0,
          volumeDropped: 0,
          dropRate: 0.0,
          isBottleneck: i === 1,
        },
      });
      createdStages.push(stage);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...createdJob,
        stages: createdStages,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}
