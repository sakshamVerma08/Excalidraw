// packages/db/src/index.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // Avoid creating multiple clients in dev HMR
  globalThis.__prisma = prisma;
}

export default prisma;
export { prisma, PrismaClient };
