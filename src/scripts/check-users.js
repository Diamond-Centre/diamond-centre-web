// scripts/check-users.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('📊 Utilisateurs dans la base de données:')
    console.log('--------------------------------------------------')
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé!')
      console.log('👉 Exécutez: node scripts/create-admin.js')
    } else {
      users.forEach(user => {
        console.log(`👤 ID: ${user.id}`)
        console.log(`📧 Email: ${user.email}`)
        console.log(`📛 Nom: ${user.name}`)
        console.log(`🔑 Rôle: ${user.role}`)
        console.log(`🔐 Mot de passe hashé: ${user.password.substring(0, 20)}...`)
        console.log('--------------------------------------------------')
      })
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()