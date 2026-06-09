// warmup.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const start = performance.now();
await prisma.$connect();
console.log("Connected in", (performance.now() - start).toFixed(2), "ms");

const startQuery = performance.now();
await prisma.user.findFirst();
console.log("Query took", (performance.now() - startQuery).toFixed(2), "ms");

await prisma.$disconnect();