const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔧 Création de l\'administrateur...')
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@diamondcentre.com' }
    })

    if (existingAdmin) {
      console.log('✅ L\'admin existe déjà:', existingAdmin.email)
      
      // Mettre à jour le mot de passe
      const hashedPassword = await bcrypt.hash('admin123', 10)
      const updatedAdmin = await prisma.user.update({
        where: { id: existingAdmin.id },
        data: { 
          password: hashedPassword,
          name: 'Administrateur',
          role: 'admin'
        }
      })
      console.log('✅ Mot de passe mis à jour pour:', updatedAdmin.email)
      return
    }

    // Créer un nouvel admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@diamondcentre.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: 'admin'
      }
    })
    
    console.log('✅ Admin créé avec succès!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Mot de passe: admin123')
    console.log('👤 Rôle:', admin.role)
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()