import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"]
  });

// Vercel 서버리스에서도 웜 인스턴스마다 클라이언트 1개만 쓰도록 캐시
globalForPrisma.prisma = prisma;
