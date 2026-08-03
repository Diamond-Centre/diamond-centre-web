const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Connexion à la base de données réussie!')
    
    // Compter les utilisateurs
    const count = await prisma.user.count()
    console.log(`📊 Nombre d'utilisateurs dans la base: ${count}`)
    
    // Lister les utilisateurs
    const users = await prisma.user.findMany()
    if (users.length > 0) {
      console.log('\n👥 Utilisateurs existants:')
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`)
      })
    } else {
      console.log('\n❌ Aucun utilisateur trouvé!')
      console.log('👉 Exécutez: node scripts/create-admin.js')
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    console.log('\n💡 Solutions:')
    console.log('  1. Vérifiez que PostgreSQL est en cours d\'exécution')
    console.log('  2. Vérifiez le DATABASE_URL dans .env.local')
    console.log('  3. Créez la base de données: createdb diamond_centre')
  } finally {
    await prisma.$disconnect()
  }
}

main()