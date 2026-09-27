import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding hiring pipeline database...');

  // Clean up existing data
  await prisma.stageEntry.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.stageDropReason.deleteMany({});
  await prisma.stage.deleteMany({});
  await prisma.jobRequisition.deleteMany({});

  // 1. Create Job Requisitions
  const job1 = await prisma.jobRequisition.create({
    data: {
      id: 'req-142',
      reqCode: 'REQ-142',
      title: 'Sr. Backend Engineer',
      department: 'ENGINEERING',
      status: 'ACTIVE',
      hiringManager: 'Sarah Jenkins',
      targetDaysToFill: 30,
      totalApplicants: 845,
      conversionRate: 4.2,
      conversionTrend: '+4.2%',
      funnelHealth: 'Good',
      avgTimeToHireDays: 18.0,
      timeVsPrevTrend: -2.4,
      primaryBottleneck: 'Tech Interview',
      bottleneckDropRate: 42.0,
    },
  });

  const job2 = await prisma.jobRequisition.create({
    data: {
      id: 'req-89',
      reqCode: 'REQ-89',
      title: 'Product Manager',
      department: 'PRODUCT',
      status: 'ACTIVE',
      hiringManager: 'David Rossi',
      targetDaysToFill: 45,
      totalApplicants: 87,
      conversionRate: 3.1,
      conversionTrend: '-1.1%',
      funnelHealth: 'Needs Attention',
      avgTimeToHireDays: 32.0,
      timeVsPrevTrend: 5.2,
      primaryBottleneck: 'Initial Screen',
      bottleneckDropRate: 65.0,
    },
  });

  const job3 = await prisma.jobRequisition.create({
    data: {
      id: 'req-215',
      reqCode: 'REQ-215',
      title: 'UX Designer',
      department: 'DESIGN',
      status: 'ACTIVE',
      hiringManager: 'Elena Rostova',
      targetDaysToFill: 35,
      totalApplicants: 45,
      conversionRate: 5.8,
      conversionTrend: '0.0%',
      funnelHealth: 'Good',
      avgTimeToHireDays: 22.0,
      timeVsPrevTrend: -1.0,
      primaryBottleneck: 'Portfolio Review',
      bottleneckDropRate: 38.0,
    },
  });

  const job4 = await prisma.jobRequisition.create({
    data: {
      id: 'req-45',
      reqCode: 'REQ-45',
      title: 'DevOps Engineer',
      department: 'ENGINEERING',
      status: 'CLOSED',
      hiringManager: 'Sarah Jenkins',
      targetDaysToFill: 25,
      totalApplicants: 210,
      conversionRate: 6.4,
      conversionTrend: '+2.8%',
      funnelHealth: 'Good',
      avgTimeToHireDays: 16.0,
      timeVsPrevTrend: -3.5,
      primaryBottleneck: 'Offer Stage',
      bottleneckDropRate: 20.0,
    },
  });

  // 2. Create Stages for REQ-142
  const s142_1 = await prisma.stage.create({
    data: {
      id: 'stage-1',
      name: 'Applied',
      stageOrder: 1,
      jobRequisitionId: job1.id,
      targetDaysInStage: 3.0,
      avgDaysInStage: 2.1,
      volumeIn: 845,
      volumePassed: 535,
      volumeDropped: 310,
      dropRate: 36.7,
      isBottleneck: false,
    },
  });

  const s142_2 = await prisma.stage.create({
    data: {
      id: 'stage-2',
      name: 'Screened',
      stageOrder: 2,
      jobRequisitionId: job1.id,
      targetDaysInStage: 4.0,
      avgDaysInStage: 4.5,
      volumeIn: 535,
      volumePassed: 224,
      volumeDropped: 311,
      dropRate: 58.1,
      isBottleneck: false,
    },
  });

  const s142_3 = await prisma.stage.create({
    data: {
      id: 'stage-3',
      name: 'Tech Interview',
      stageOrder: 3,
      jobRequisitionId: job1.id,
      targetDaysInStage: 8.0,
      avgDaysInStage: 12.4,
      volumeIn: 224,
      volumePassed: 64,
      volumeDropped: 160,
      dropRate: 71.4,
      isBottleneck: true,
    },
  });

  const s142_4 = await prisma.stage.create({
    data: {
      id: 'stage-4',
      name: 'Offer',
      stageOrder: 4,
      jobRequisitionId: job1.id,
      targetDaysInStage: 5.0,
      avgDaysInStage: 3.2,
      volumeIn: 64,
      volumePassed: 35,
      volumeDropped: 29,
      dropRate: 45.3,
      isBottleneck: false,
    },
  });

  const s142_5 = await prisma.stage.create({
    data: {
      id: 'stage-5',
      name: 'Hired',
      stageOrder: 5,
      jobRequisitionId: job1.id,
      targetDaysInStage: 2.0,
      avgDaysInStage: 1.0,
      volumeIn: 35,
      volumePassed: 35,
      volumeDropped: 0,
      dropRate: 0.0,
      isBottleneck: false,
    },
  });

  // Stages for REQ-89
  const s89_1 = await prisma.stage.create({
    data: {
      id: 'stage-89-1',
      name: 'Applied',
      stageOrder: 1,
      jobRequisitionId: job2.id,
      targetDaysInStage: 3.0,
      avgDaysInStage: 3.5,
      volumeIn: 87,
      volumePassed: 42,
      volumeDropped: 45,
      dropRate: 51.7,
      isBottleneck: false,
    },
  });

  const s89_2 = await prisma.stage.create({
    data: {
      id: 'stage-89-2',
      name: 'Initial Screen',
      stageOrder: 2,
      jobRequisitionId: job2.id,
      targetDaysInStage: 5.0,
      avgDaysInStage: 9.8,
      volumeIn: 42,
      volumePassed: 18,
      volumeDropped: 24,
      dropRate: 57.1,
      isBottleneck: true,
    },
  });

  const s89_3 = await prisma.stage.create({
    data: {
      id: 'stage-89-3',
      name: 'Case Study',
      stageOrder: 3,
      jobRequisitionId: job2.id,
      targetDaysInStage: 7.0,
      avgDaysInStage: 11.2,
      volumeIn: 18,
      volumePassed: 8,
      volumeDropped: 10,
      dropRate: 55.5,
      isBottleneck: false,
    },
  });

  const s89_4 = await prisma.stage.create({
    data: {
      id: 'stage-89-4',
      name: 'Final Panel',
      stageOrder: 4,
      jobRequisitionId: job2.id,
      targetDaysInStage: 5.0,
      avgDaysInStage: 5.0,
      volumeIn: 8,
      volumePassed: 4,
      volumeDropped: 4,
      dropRate: 50.0,
      isBottleneck: false,
    },
  });

  const s89_5 = await prisma.stage.create({
    data: {
      id: 'stage-89-5',
      name: 'Hired',
      stageOrder: 5,
      jobRequisitionId: job2.id,
      targetDaysInStage: 2.0,
      avgDaysInStage: 1.0,
      volumeIn: 4,
      volumePassed: 4,
      volumeDropped: 0,
      dropRate: 0.0,
      isBottleneck: false,
    },
  });

  // Stages for REQ-215 (UX Designer)
  await prisma.stage.createMany({
    data: [
      { id: 'stage-215-1', name: 'Applied', stageOrder: 1, jobRequisitionId: job3.id, volumeIn: 45, volumePassed: 30, volumeDropped: 15, dropRate: 33.3, avgDaysInStage: 2.0, targetDaysInStage: 3.0, isBottleneck: false },
      { id: 'stage-215-2', name: 'Portfolio Review', stageOrder: 2, jobRequisitionId: job3.id, volumeIn: 30, volumePassed: 12, volumeDropped: 18, dropRate: 60.0, avgDaysInStage: 8.5, targetDaysInStage: 4.0, isBottleneck: true },
      { id: 'stage-215-3', name: 'Design Challenge', stageOrder: 3, jobRequisitionId: job3.id, volumeIn: 12, volumePassed: 6, volumeDropped: 6, dropRate: 50.0, avgDaysInStage: 6.0, targetDaysInStage: 5.0, isBottleneck: false },
      { id: 'stage-215-4', name: 'Offer', stageOrder: 4, jobRequisitionId: job3.id, volumeIn: 6, volumePassed: 3, volumeDropped: 3, dropRate: 50.0, avgDaysInStage: 3.0, targetDaysInStage: 4.0, isBottleneck: false },
      { id: 'stage-215-5', name: 'Hired', stageOrder: 5, jobRequisitionId: job3.id, volumeIn: 3, volumePassed: 3, volumeDropped: 0, dropRate: 0.0, avgDaysInStage: 1.0, targetDaysInStage: 2.0, isBottleneck: false },
    ],
  });

  // 3. Seed Candidates (30 realistic candidates)
  const candidateSeeds = [
    { candidateId: 'JD-8932', name: 'John Doe', email: 'john.doe@enterprise.com', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 2, healthIndex: 92, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'Stripe' },
    { candidateId: 'AS-4419', name: 'Alice Smith', email: 'alice.smith@devmail.io', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Screened', timeInStageDays: 9, healthIndex: 65, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Amazon' },
    { candidateId: 'BW-1022', name: 'Bob Wilson', email: 'bob.wilson@arch.org', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 18, healthIndex: 28, assignedRecruiter: 'L. Davis', status: 'ACTIVE', companyOrigin: 'Uber' },
    { candidateId: 'EM-7741', name: 'Elena Martinez', email: 'elena.m@cloudscale.net', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Offer', timeInStageDays: 1, healthIndex: 98, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'Google' },
    { candidateId: 'MK-5521', name: 'Michael King', email: 'm.king@datasystems.co', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Screened', timeInStageDays: 4, healthIndex: 88, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Netflix' },
    { candidateId: 'TC-3382', name: 'Tanya Cruz', email: 'tcruz@quantum.ai', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 14, healthIndex: 45, assignedRecruiter: 'L. Davis', status: 'ACTIVE', companyOrigin: 'Meta' },
    { candidateId: 'DL-9011', name: 'David Lee', email: 'david.l@fintech.io', role: 'Product Manager', jobId: 'req-89', currentStage: 'Case Study', timeInStageDays: 6, healthIndex: 78, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'Robinhood' },
    { candidateId: 'SP-6612', name: 'Sophia Park', email: 's.park@designhub.com', role: 'UX Designer', jobId: 'req-215', currentStage: 'Portfolio Review', timeInStageDays: 3, healthIndex: 94, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Figma' },
    { candidateId: 'MC-1102', name: 'Marcus Chen', email: 'm.chen@hypergrowth.io', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 12, healthIndex: 52, assignedRecruiter: 'S. Miller', status: 'DROPPED', dropReasonCode: 'ERR_TECH_GAP', dropReasonDetail: 'System Design gap', companyOrigin: 'ex-Stripe' },
    { candidateId: 'SL-8831', name: 'Sarah Lopez', email: 's.lopez@datatech.com', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 15, healthIndex: 40, assignedRecruiter: 'L. Davis', status: 'DROPPED', dropReasonCode: 'ERR_SALARY', dropReasonDetail: 'Expected $240k vs budget $210k', companyOrigin: 'Fintech Corp' },
    { candidateId: 'RN-9023', name: 'Rahul Nair', email: 'r.nair@cloudmesh.org', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 20, healthIndex: 20, assignedRecruiter: 'R. Chen', status: 'DROPPED', dropReasonCode: 'ERR_GHOSTED', dropReasonDetail: 'No show for panel session', companyOrigin: 'SaaS Inc' },
    { candidateId: 'KL-3301', name: 'Karen Liu', email: 'karen.l@scaleup.io', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 7, healthIndex: 72, assignedRecruiter: 'S. Miller', status: 'DROPPED', dropReasonCode: 'ERR_COMPETITOR', dropReasonDetail: 'Accepted competing offer from Datadog', companyOrigin: 'AdTech' },
    { candidateId: 'AJ-5590', name: 'Alexander Jones', email: 'a.jones@cybervault.com', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 11, healthIndex: 58, assignedRecruiter: 'L. Davis', status: 'DROPPED', dropReasonCode: 'ERR_TECH_GAP', dropReasonDetail: 'Live coding concurrency challenge failed', companyOrigin: 'Security Lab' },
    { candidateId: 'VT-4412', name: 'Victoria Thorne', email: 'v.thorne@biotech.ai', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 13, healthIndex: 48, assignedRecruiter: 'R. Chen', status: 'DROPPED', dropReasonCode: 'ERR_CULTURE', dropReasonDetail: 'Misalignment on async collaboration norms', companyOrigin: 'BioTech' },
    { candidateId: 'OB-7821', name: 'Omar Bennett', email: 'o.bennett@devtools.co', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Screened', timeInStageDays: 5, healthIndex: 82, assignedRecruiter: 'S. Miller', status: 'DROPPED', dropReasonCode: 'ERR_SALARY', dropReasonDetail: 'Compensation mismatch at initial screen', companyOrigin: 'DevTools' },
    { candidateId: 'NP-2290', name: 'Nadia Petrov', email: 'n.petrov@orbital.net', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Screened', timeInStageDays: 8, healthIndex: 68, assignedRecruiter: 'L. Davis', status: 'DROPPED', dropReasonCode: 'ERR_TECH_GAP', dropReasonDetail: 'Lack of distributed systems background', companyOrigin: 'Aerospace' },
    { candidateId: 'GW-6619', name: 'Gabriel Wright', email: 'g.wright@neuralnet.org', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Offer', timeInStageDays: 4, healthIndex: 85, assignedRecruiter: 'R. Chen', status: 'DROPPED', dropReasonCode: 'ERR_COMPETITOR', dropReasonDetail: 'Chose Series B startup equity package', companyOrigin: 'AI Lab' },
    { candidateId: 'CH-4091', name: 'Chloe Huang', email: 'c.huang@ecom.global', role: 'Product Manager', jobId: 'req-89', currentStage: 'Initial Screen', timeInStageDays: 10, healthIndex: 55, assignedRecruiter: 'S. Miller', status: 'DROPPED', dropReasonCode: 'ERR_TECH_GAP', dropReasonDetail: 'Needs deeper B2B SaaS experience', companyOrigin: 'E-commerce' },
    { candidateId: 'FA-1823', name: 'Faisal Ahmed', email: 'f.ahmed@fintech.me', role: 'Product Manager', jobId: 'req-89', currentStage: 'Initial Screen', timeInStageDays: 12, healthIndex: 45, assignedRecruiter: 'L. Davis', status: 'DROPPED', dropReasonCode: 'ERR_SALARY', dropReasonDetail: 'Target package out of tier bounds', companyOrigin: 'Payments Co' },
    { candidateId: 'ZL-7721', name: 'Zoe Larson', email: 'z.larson@designcraft.io', role: 'UX Designer', jobId: 'req-215', currentStage: 'Portfolio Review', timeInStageDays: 9, healthIndex: 60, assignedRecruiter: 'R. Chen', status: 'DROPPED', dropReasonCode: 'ERR_TECH_GAP', dropReasonDetail: 'Design system craftsmanship gap', companyOrigin: 'Agency' },
    { candidateId: 'DS-9912', name: 'Devon Scott', email: 'd.scott@cloudreach.io', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Hired', timeInStageDays: 1, healthIndex: 100, assignedRecruiter: 'S. Miller', status: 'HIRED', companyOrigin: 'Apple' },
    { candidateId: 'HR-3341', name: 'Hannah Reed', email: 'h.reed@datapipeline.org', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Applied', timeInStageDays: 1, healthIndex: 99, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Twitter' },
    { candidateId: 'KM-6652', name: 'Kevin Murphy', email: 'k.murphy@scalex.net', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Applied', timeInStageDays: 2, healthIndex: 95, assignedRecruiter: 'L. Davis', status: 'ACTIVE', companyOrigin: 'Snowflake' },
    { candidateId: 'LL-1209', name: 'Laura Lin', email: 'l.lin@innovate.co', role: 'Product Manager', jobId: 'req-89', currentStage: 'Final Panel', timeInStageDays: 3, healthIndex: 91, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'Lyft' },
    { candidateId: 'TW-8843', name: 'Trevor Walsh', email: 't.walsh@designlabs.io', role: 'UX Designer', jobId: 'req-215', currentStage: 'Design Challenge', timeInStageDays: 5, healthIndex: 82, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Airbnb' },
    { candidateId: 'EC-4491', name: 'Emma Collins', email: 'e.collins@backendhub.com', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Screened', timeInStageDays: 3, healthIndex: 90, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'DoorDash' },
    { candidateId: 'JG-7714', name: 'James Garcia', email: 'j.garcia@datastack.io', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Tech Interview', timeInStageDays: 16, healthIndex: 35, assignedRecruiter: 'L. Davis', status: 'ACTIVE', companyOrigin: 'Instacart' },
    { candidateId: 'MM-5510', name: 'Mia Morales', email: 'm.morales@cloudbase.com', role: 'Sr. Backend Engineer', jobId: 'req-142', currentStage: 'Offer', timeInStageDays: 2, healthIndex: 96, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Pinterest' },
    { candidateId: 'NR-8822', name: 'Noah Richardson', email: 'n.richardson@analytics.co', role: 'Product Manager', jobId: 'req-89', currentStage: 'Applied', timeInStageDays: 1, healthIndex: 98, assignedRecruiter: 'S. Miller', status: 'ACTIVE', companyOrigin: 'Stripe' },
    { candidateId: 'OL-6633', name: 'Olivia Lee', email: 'o.lee@creativestudio.io', role: 'UX Designer', jobId: 'req-215', currentStage: 'Offer', timeInStageDays: 2, healthIndex: 97, assignedRecruiter: 'R. Chen', status: 'ACTIVE', companyOrigin: 'Canva' },
  ];

  for (const c of candidateSeeds) {
    const createdCand = await prisma.candidate.create({
      data: {
        candidateId: c.candidateId,
        name: c.name,
        email: c.email,
        role: c.role,
        jobId: c.jobId,
        currentStage: c.currentStage,
        timeInStageDays: c.timeInStageDays,
        healthIndex: c.healthIndex,
        assignedRecruiter: c.assignedRecruiter,
        status: c.status,
        dropReasonCode: c.dropReasonCode,
        dropReasonDetail: c.dropReasonDetail,
        companyOrigin: c.companyOrigin,
      },
    });

    // Also create StageEntry rows for candidates to enable live aggregate diagnostics
    await prisma.stageEntry.create({
      data: {
        candidateId: createdCand.id,
        candidateName: c.name,
        candidateEmail: c.email,
        candidateCode: c.candidateId,
        role: c.role,
        jobId: c.jobId,
        stageName: c.currentStage,
        status: c.status,
        daysInStage: c.timeInStageDays,
        dropReason: c.dropReasonCode,
        dropReasonDetail: c.dropReasonDetail,
        companyOrigin: c.companyOrigin,
        assignedRecruiter: c.assignedRecruiter,
        healthIndex: c.healthIndex,
      },
    });
  }

  // 4. Create rich StageEntry rows for historical drop-offs at Tech Interview & Screened
  // to ensure real aggregation from StageEntry table
  const historicalDrops = [
    { candidateName: 'David Lee', email: 'david.lee@techcorp.io', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 14, dropReason: 'ERR_SALARY', dropReasonDetail: 'Salary Expectations Mismatch ($250k)', companyOrigin: 'Tech Corp' },
    { candidateName: 'Sarah Connor', email: 's.connor@startuphub.io', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 8, dropReason: 'ERR_TECH_GAP', dropReasonDetail: 'Failed System Architecture Round', companyOrigin: 'Startup Hub' },
    { candidateName: 'Michael Chang', email: 'm.chang@globalinc.com', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 18, dropReason: 'ERR_GHOSTED', dropReasonDetail: 'Ghosted / No Show for debrief', companyOrigin: 'Global Inc' },
    { candidateName: 'Alice Morgan', email: 'a.morgan@cloudworks.io', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 11, dropReason: 'ERR_TECH_GAP', dropReasonDetail: 'Data Structures & Algorithms benchmark', companyOrigin: 'CloudWorks' },
    { candidateName: 'Vikram Patel', email: 'v.patel@streamcorp.com', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 12, dropReason: 'ERR_COMPETITOR', dropReasonDetail: 'Accepted counter-offer from Google', companyOrigin: 'StreamCorp' },
    { candidateName: 'Hannah Abbott', email: 'h.abbott@scale.net', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 15, dropReason: 'ERR_TECH_GAP', dropReasonDetail: 'Concurrency & Go internals gap', companyOrigin: 'ScaleNet' },
    { candidateName: 'Brian Davies', email: 'b.davies@finbyte.io', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 9, dropReason: 'ERR_SALARY', dropReasonDetail: 'Total compensation cap exceeded', companyOrigin: 'FinByte' },
    { candidateName: 'Carlos Rivera', email: 'c.rivera@microtech.org', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_3.id, stageName: 'Tech Interview', status: 'DROPPED', daysInStage: 16, dropReason: 'ERR_CULTURE', dropReasonDetail: 'Cross-functional leadership alignment', companyOrigin: 'MicroTech' },
    // Historical drops for Screened stage
    { candidateName: 'Rachel Green', email: 'r.green@retail.io', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_2.id, stageName: 'Screened', status: 'DROPPED', daysInStage: 5, dropReason: 'ERR_SALARY', dropReasonDetail: 'Salary expectation above band', companyOrigin: 'Retail.io' },
    { candidateName: 'Ross Geller', email: 'r.geller@museumtech.org', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_2.id, stageName: 'Screened', status: 'DROPPED', daysInStage: 7, dropReason: 'ERR_TECH_GAP', dropReasonDetail: 'Skill gap in Kubernetes/Go', companyOrigin: 'MuseumTech' },
    { candidateName: 'Chandler Bing', email: 'c.bing@dataproc.com', role: 'Sr. Backend Engineer', jobId: 'req-142', stageId: s142_2.id, stageName: 'Screened', status: 'DROPPED', daysInStage: 6, dropReason: 'ERR_GHOSTED', dropReasonDetail: 'Unresponsive after initial contact', companyOrigin: 'DataProc' },
  ];

  for (const drop of historicalDrops) {
    await prisma.stageEntry.create({
      data: {
        candidateName: drop.candidateName,
        candidateEmail: drop.email,
        role: drop.role,
        jobId: drop.jobId,
        stageId: drop.stageId,
        stageName: drop.stageName,
        status: drop.status,
        daysInStage: drop.daysInStage,
        dropReason: drop.dropReason,
        dropReasonDetail: drop.dropReasonDetail,
        companyOrigin: drop.companyOrigin,
        assignedRecruiter: 'S. Miller',
        healthIndex: Math.max(10, 100 - drop.daysInStage * 5),
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
