import { PrismaClient } from "@prisma/client";
declare global {
    let prisma: PrismaClient | undefined;
}
declare const prisma: any;
export default prisma;
export * from "@prisma/client";
//# sourceMappingURL=prisma.d.ts.map