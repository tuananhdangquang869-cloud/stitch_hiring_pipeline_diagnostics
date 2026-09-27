import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockCandidates } from '@/lib/mock-data';
import { Prisma } from '@prisma/client';
import { Candidate } from '@/lib/types';

// Health Index Calculation Formula based on Days In Stage vs Stage SLA threshold
export function calculateHealthIndex(daysInStage: number, stageName: string, status: string): number {
  if (status === 'HIRED') return 100;
  
  // Define stage SLA target days
  let targetSla = 7;
  const stageLower = stageName.toLowerCase();
  if (stageLower.includes('applied') || stageLower.includes('source')) targetSla = 3;
  else if (stageLower.includes('screen')) targetSla = 5;
  else if (stageLower.includes('tech') || stageLower.includes('interview') || stageLower.includes('challenge')) targetSla = 8;
  else if (stageLower.includes('offer')) targetSla = 4;

  const ratio = daysInStage / targetSla;

  let score: number;
  if (ratio <= 0.5) {
    score = 95 - Math.round(ratio * 10); // 90 - 95
  } else if (ratio <= 1.0) {
    score = 90 - Math.round((ratio - 0.5) * 30); // 75 - 90
  } else if (ratio <= 1.5) {
    score = 75 - Math.round((ratio - 1.0) * 40); // 55 - 75
  } else {
    score = Math.max(10, Math.round(55 - (ratio - 1.5) * 30)); // 10 - 55
  }

  if (status === 'DROPPED') {
    score = Math.min(score, 35);
  }

  return Math.min(100, Math.max(0, score));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const stage = searchParams.get('stage') || 'all';
    const jobId = searchParams.get('jobId');

    let candidatesList: Candidate[] = [];

    try {
      const whereClause: Record<string, any> = {};
      
      if (jobId) {
        whereClause.jobId = jobId;
      }

      if (stage !== 'all') {
        whereClause.currentStage = {
          contains: stage,
        };
      }

      if (query) {
        whereClause.OR = [
          { name: { contains: query } },
          { candidateId: { contains: query } },
          { email: { contains: query } },
          { role: { contains: query } },
        ];
      }

      const dbCandidates = await prisma.candidate.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      if (dbCandidates && dbCandidates.length > 0) {
        candidatesList = dbCandidates.map((c: any) => ({
          id: c.id,
          candidateId: c.candidateId,
          name: c.name,
          email: c.email,
          role: c.role,
          jobId: c.jobId,
          currentStage: c.currentStage,
          timeInStageDays: c.timeInStageDays,
          healthIndex: calculateHealthIndex(c.timeInStageDays, c.currentStage, c.status),
          assignedRecruiter: c.assignedRecruiter,
          status: c.status as 'ACTIVE' | 'DROPPED' | 'HIRED',
          dropReasonCode: c.dropReasonCode || undefined,
          dropReasonDetail: c.dropReasonDetail || undefined,
          companyOrigin: c.companyOrigin || undefined,
        }));
      }
    } catch (dbErr) {
      console.warn('Prisma query fallback to mock data:', dbErr);
    }

    // Fallback if database is empty or during initial startup
    if (candidatesList.length === 0) {
      let filtered: Candidate[] = [...mockCandidates];

      if (jobId) {
        filtered = filtered.filter((c: Candidate) => c.jobId === jobId);
      }

      if (query) {
        filtered = filtered.filter(
          (c: Candidate) =>
            c.name.toLowerCase().includes(query) ||
            c.candidateId.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query)
        );
      }

      if (stage !== 'all') {
        filtered = filtered.filter((c: Candidate) =>
          c.currentStage.toLowerCase().includes(stage.toLowerCase())
        );
      }

      candidatesList = filtered.map((c: Candidate) => ({
        ...c,
        healthIndex: calculateHealthIndex(c.timeInStageDays, c.currentStage, c.status),
      }));
    }

    return NextResponse.json({
      success: true,
      data: candidatesList,
      total: candidatesList.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { candidates, rawRows } = body;

    const itemsToInsert = candidates || rawRows || [];
    if (!Array.isArray(itemsToInsert) || itemsToInsert.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No candidate records provided' },
        { status: 400 }
      );
    }

    const inserted: Candidate[] = [];

    for (let i = 0; i < itemsToInsert.length; i++) {
      const item = itemsToInsert[i];
      const candCode =
        item.candidateId ||
        `IMP-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
      const name = item.name || item.candidateName || `Candidate ${i + 1}`;
      const email =
        item.email ||
        item.candidateEmail ||
        `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
      const role = item.role || item.position || 'Software Engineer';
      const currentStage = item.currentStage || item.stage || item.stageName || 'Screening';
      const daysInStage = Number(item.timeInStageDays || item.daysInStage || item.days || 2);
      const status = item.status || (item.dropReason ? 'DROPPED' : 'ACTIVE');
      const dropReasonCode = item.dropReasonCode || item.dropReason || null;
      const dropReasonDetail = item.dropReasonDetail || item.reasonDetail || null;
      const companyOrigin = item.companyOrigin || item.company || null;
      const jobId = item.jobId || 'req-142';
      const healthIndex = calculateHealthIndex(daysInStage, currentStage, status);

      try {
        const created = await prisma.candidate.create({
          data: {
            candidateId: candCode,
            name,
            email,
            role,
            jobId,
            currentStage,
            timeInStageDays: daysInStage,
            healthIndex,
            assignedRecruiter: item.assignedRecruiter || 'S. Miller',
            status,
            dropReasonCode,
            dropReasonDetail,
            companyOrigin,
          },
        });

        await prisma.stageEntry.create({
          data: {
            candidateId: created.id,
            candidateName: name,
            candidateEmail: email,
            candidateCode: candCode,
            role,
            jobId,
            stageName: currentStage,
            status,
            daysInStage,
            dropReason: dropReasonCode,
            dropReasonDetail,
            companyOrigin,
            assignedRecruiter: item.assignedRecruiter || 'S. Miller',
            healthIndex,
          },
        });

        inserted.push({
          id: created.id,
          candidateId: created.candidateId,
          name: created.name,
          email: created.email,
          role: created.role,
          jobId: created.jobId,
          currentStage: created.currentStage,
          timeInStageDays: created.timeInStageDays,
          healthIndex: created.healthIndex,
          assignedRecruiter: created.assignedRecruiter,
          status: created.status as 'ACTIVE' | 'DROPPED' | 'HIRED',
          dropReasonCode: created.dropReasonCode || undefined,
          dropReasonDetail: created.dropReasonDetail || undefined,
          companyOrigin: created.companyOrigin || undefined,
        });
      } catch (err) {
        console.error('Error inserting candidate row:', err);
        inserted.push({
          id: `cand-${Date.now()}-${i}`,
          candidateId: candCode,
          name,
          email,
          role,
          jobId,
          currentStage,
          timeInStageDays: daysInStage,
          healthIndex,
          assignedRecruiter: 'S. Miller',
          status,
          dropReasonCode,
          companyOrigin,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${inserted.length} candidate(s)`,
      count: inserted.length,
      data: inserted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import candidates' },
      { status: 500 }
    );
  }
}
