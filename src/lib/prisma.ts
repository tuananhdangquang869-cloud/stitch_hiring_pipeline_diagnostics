let prismaClientInstance: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prismaClientInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaClientInstance;
} catch {
  // Graceful fallback for environments before prisma generate is run
  const createMockDelegate = () => ({
    findMany: async () => [],
    findUnique: async () => null,
    findFirst: async () => null,
    create: async ({ data }: any) => ({ id: `mock-${Date.now()}`, ...data }),
    update: async ({ data }: any) => ({ id: `mock-${Date.now()}`, ...data }),
    delete: async () => ({}),
    count: async () => 0,
  });

  prismaClientInstance = {
    jobRequisition: createMockDelegate(),
    stage: createMockDelegate(),
    stageDropReason: createMockDelegate(),
    candidate: createMockDelegate(),
    stageEntry: createMockDelegate(),
    $disconnect: async () => {},
  };
}

export const prisma = prismaClientInstance;
