// --- DB SEED DISABLED FOR LOCAL DEV (requires PostgreSQL + Prisma) ---
// Décommenter ce fichier et lancer `npm run db:seed` pour peupler la base.

/*
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Début du seeding...')

    console.log('🧹 Nettoyage des données existantes...')
    await prisma.ticket.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.adminLog.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Nettoyage terminé')

    console.log('👤 Création de l\'admin...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        nom: 'Admin',
        prenom: 'Dice',
        email: 'admin@dice.com',
        telephone: '0123456789',
        sexe: 'M',
        password: adminPassword,
        role: 'admin',
      },
    })
    console.log('✅ Admin créé:', admin.email)

    console.log('👤 Création d\'un utilisateur test...')
    const userPassword = await bcrypt.hash('user123', 10)
    const user = await prisma.user.create({
      data: {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'user@dice.com',
        telephone: '0987654321',
        sexe: 'M',
        password: userPassword,
        role: 'user',
      },
    })
    console.log('✅ Utilisateur test créé:', user.email)

    // ... reste du seeding (événements, tickets, notifications)

    console.log('🎉 Seeding terminé avec succès !')
    console.log('📧 admin@dice.com / admin123')
    console.log('📧 user@dice.com / user123')
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
*/

console.log('⚠️  Seed désactivé — mode local sans base de données.')
console.log('   Les données mock sont dans lib/mockData.js')
