// --- DB DISABLED FOR LOCAL DEV (no PostgreSQL required) ---
// Décommenter le bloc ci-dessous et commenter le stub pour utiliser Prisma.

// import { PrismaClient } from '@prisma/client'
//
// const globalForPrisma = globalThis
//
// export const prisma = globalForPrisma.prisma || new PrismaClient()
//
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
//
// export default prisma

export const prisma = null
export default prisma
