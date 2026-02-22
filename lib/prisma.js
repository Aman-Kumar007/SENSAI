// lib/db.js or prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "development") {
  globalForPrisma.prisma = db;
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await db.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await db.$disconnect();
  process.exit(0);
});
