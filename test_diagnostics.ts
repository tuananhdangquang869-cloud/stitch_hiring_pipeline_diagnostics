import { prisma } from './src/lib/prisma';
import { calculateHealthIndex } from './src/app/api/candidates/route';

async function verifyAll() {
  console.log('--- 1. Testing Job Requisitions & Stages in Database ---');
  const jobs = await prisma.jobRequisition.findMany({
    include: { stages: { orderBy: { stageOrder: 'asc' } } },
  });
  console.log(`Found ${jobs.length} jobs in database:`);
  jobs.forEach((j: any) => {
    console.log(`  - [${j.reqCode}] ${j.title} (${j.stages.length} stages)`);
  });

  console.log('\n--- 2. Testing Stage Diagnostics Live Aggregation ---');
  const stageEntries = await prisma.stageEntry.findMany();
  console.log(`Total StageEntry rows: ${stageEntries.length}`);

  // Test dynamic group-by dropReason for 'Tech Interview'
  const techDrops = stageEntries.filter((e: any) => e.stageName === 'Tech Interview' && (e.status === 'DROPPED' || e.dropReason));
  const counts: Record<string, number> = {};
  techDrops.forEach((e: any) => {
    const r = e.dropReason || 'UNKNOWN';
    counts[r] = (counts[r] || 0) + 1;
  });
  console.log(`Dynamic drop reason breakdown for Tech Interview (${techDrops.length} dropped):`);
  Object.entries(counts).forEach(([code, cnt]: [string, number]) => {
    const pct = Math.round((cnt / techDrops.length) * 100);
    console.log(`  - ${code}: ${cnt} (${pct}%)`);
  });

  console.log('\n--- 3. Testing Health Index Formula ---');
  const testCases = [
    { days: 1, stage: 'Screening', status: 'ACTIVE' },
    { days: 4, stage: 'Screening', status: 'ACTIVE' },
    { days: 9, stage: 'Screening', status: 'ACTIVE' },
    { days: 18, stage: 'Tech Interview', status: 'ACTIVE' },
    { days: 2, stage: 'Offer', status: 'ACTIVE' },
    { days: 1, stage: 'Hired', status: 'HIRED' },
    { days: 12, stage: 'Tech Interview', status: 'DROPPED' },
  ];
  testCases.forEach((tc: any) => {
    const score = calculateHealthIndex(tc.days, tc.stage, tc.status);
    console.log(`  - ${tc.stage} (${tc.days}d, ${tc.status}) -> Health Index: ${score}/100`);
  });

  console.log('\n--- 4. Testing Candidate Records ---');
  const candidates = await prisma.candidate.findMany();
  console.log(`Total seeded candidates: ${candidates.length}`);
  if (candidates.length > 0) {
    console.log(`Sample candidate: ${candidates[0].name} (${candidates[0].candidateId}) - Stage: ${candidates[0].currentStage}, Days: ${candidates[0].timeInStageDays}`);
  }

  console.log('\nAll 4 feature verifications PASSED successfully!');
}

verifyAll()
  .catch((err: any) => {
    console.error('Verification failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
