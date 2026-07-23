const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@diamondcentre.com' }
    })

    if (!admin) {
      console.log('❌ Admin non trouvé!')
      return
    }

    console.log('✅ Admin trouvé:')
    console.log('📧 Email:', admin.email)
    console.log('📛 Nom:', admin.name)
    console.log('🔑 Rôle:', admin.role)
    console.log('🔐 Hash du mot de passe:', admin.password.substring(0, 30) + '...')
    
    // Vérifier que le mot de passe est correct
    const isValid = await bcrypt.compare('admin123', admin.password)
    console.log('✅ Vérification du mot de passe:', isValid ? 'Valide ✅' : 'Invalide ❌')
    
    if (!isValid) {
      console.log('\n⚠️ Le mot de passe est invalide! Mise à jour...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.update({
        where: { id: admin.id },
        data: { password: hashedPassword }
      })
      console.log('✅ Mot de passe mis à jour!')
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()