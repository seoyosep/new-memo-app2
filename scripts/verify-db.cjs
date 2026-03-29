const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      ORDER BY finished_at
    `;
    console.log("=== _prisma_migrations ===");
    console.log(JSON.stringify(migrations, null, 2));

    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    console.log("\n=== public 테이블 ===");
    console.log(JSON.stringify(tables, null, 2));

    const userCount = await prisma.user.count();
    const memoCount = await prisma.memo.count();
    console.log("\n=== Prisma 모델 쿼리 ===");
    console.log(`User 행 수: ${userCount}, Memo 행 수: ${memoCount}`);
    console.log("\n결과: 스키마와 연결이 정상입니다.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
