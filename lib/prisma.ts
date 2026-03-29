import { PrismaClient } from "@prisma/client";
import { prismaRuntimeDatabaseUrl } from "@/lib/db-url";
import { sanitizeServerEnv } from "@/lib/sanitize-env";

sanitizeServerEnv();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL?.trim();

const prismaOptions: ConstructorParameters<typeof PrismaClient>[0] = { log: ["error"] };
if (databaseUrl) {
  prismaOptions.datasources = {
    db: { url: prismaRuntimeDatabaseUrl(databaseUrl) }
  };
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient(prismaOptions);

// Vercel 서버리스에서도 웜 인스턴스마다 클라이언트 1개만 쓰도록 캐시
globalForPrisma.prisma = prisma;
