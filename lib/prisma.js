// lib/db.js or prisma.js
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// ✅ FIX 1: cache ONLY in development (was reversed)
if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = db;
}

// ❌ FIX 2: remove process handlers in production (safe guard)
if (process.env.NODE_ENV === "development") {
  process.on("SIGINT", async () => {
    await db.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await db.$disconnect();
    process.exit(0);
  });
}