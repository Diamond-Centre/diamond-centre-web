const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

// Charger les variables d'environnement
dotenv.config()

// Vérifier que DATABASE_URL est défini
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL n\'est pas défini dans .env.local')
  process.exit(1)
}

// Configuration de l'adaptateur PostgreSQL avec gestion d'erreur
let pool, adapter, prisma

try {
  // Créer le pool avec la chaîne de connexion
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  // Tester la connexion
  pool.connect((err, client, done) => {
    if (err) {
      console.error('❌ Erreur de connexion à PostgreSQL:', err.message)
      process.exit(1)
    }
    console.log('✅ Connexion à PostgreSQL réussie')
    done()
  })

  adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation de Prisma:', error.message)
  process.exit(1)
}

async function main() {
  console.log('🌱 Début du seeding...')

  try {
    // Vérifier la connexion
    await prisma.$connect()
    console.log('✅ Connexion à Prisma réussie')

    // Nettoyer la base de données avec gestion d'erreur
    try {
      await prisma.$executeRaw`TRUNCATE TABLE "Promotion" RESTART IDENTITY CASCADE`
      await prisma.$executeRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE`
      await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`
      console.log('✅ Base de données nettoyée')
    } catch (error) {
      console.log('⚠️  Les tables n\'existent pas encore, création en cours...')
    }

    // Créer l'admin
    const adminPassword = await bcrypt.hash('Admin123!', 10)
    
    let admin
    try {
      admin = await prisma.user.create({
        data: {
          nom: 'Admin',
          prenom: 'Admin',
          email: 'admin@diamondcentre.com',
          password: adminPassword,
          telephone: '0123456789',
          sexe: 'M',
          role: 'admin'
        }
      })
      console.log('✅ Admin créé:', admin.email)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('⚠️  L\'admin existe déjà, mise à jour en cours...')
        admin = await prisma.user.update({
          where: { email: 'admin@diamondcentre.com' },
          data: {
            password: adminPassword,
            role: 'admin'
          }
        })
        console.log('✅ Admin mis à jour:', admin.email)
      } else {
        throw error
      }
    }

    console.log('   Identifiants: admin@diamondcentre.com / Admin123!')

    // Vérifier si des événements existent déjà
    const existingEvents = await prisma.event.count()
    if (existingEvents > 0) {
      console.log(`⚠️  ${existingEvents} événements existent déjà`)
    }

    // Créer des événements de test
    const eventsData = [
      {
        title: 'Conférence IA',
        description: 'Une conférence sur l\'intelligence artificielle et ses applications.',
        price: 5000,
        currency: 'XAF',
        start_date: new Date('2026-10-10T09:00:00Z'),
        end_date: new Date('2026-10-10T17:00:00Z'),
        location: 'Yaoundé, Cameroun',
        category: 'conference',
        capacity: 200,
        available_tickets: 200,
        image_url: '/images/events/conference-ia.jpg',
        status: 'published'
      },
      {
        title: 'Séminaire Leadership',
        description: 'Développez vos compétences en leadership et en gestion d\'équipe.',
        price: 7500,
        currency: 'XAF',
        start_date: new Date('2026-11-15T09:00:00Z'),
        end_date: new Date('2026-11-16T17:00:00Z'),
        location: 'Douala, Cameroun',
        category: 'seminaire',
        capacity: 100,
        available_tickets: 100,
        image_url: '/images/events/seminaire-leadership.jpg',
        status: 'published'
      },
      {
        title: 'Atelier JavaScript Avancé',
        description: 'Maîtrisez les concepts avancés de JavaScript.',
        price: 3500,
        currency: 'XAF',
        start_date: new Date('2026-12-05T10:00:00Z'),
        end_date: new Date('2026-12-05T16:00:00Z'),
        location: 'Abidjan, Côte d\'Ivoire',
        category: 'atelier',
        capacity: 50,
        available_tickets: 50,
        image_url: '/images/events/workshop-js.jpg',
        status: 'draft'
      }
    ]

    let createdCount = 0
    for (const eventData of eventsData) {
      try {
        const event = await prisma.event.create({
          data: eventData
        })
        console.log(`✅ Événement créé: ${event.title} (${event.status})`)
        createdCount++
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️  L'événement "${eventData.title}" existe déjà`)
        } else {
          console.error(`❌ Erreur création événement "${eventData.title}":`, error.message)
        }
      }
    }

    console.log('')
    console.log('🎉 Seeding terminé avec succès!')
    console.log('📊 Résumé:')
    console.log(`  - ${createdCount} nouveaux événements créés`)
    console.log('  - 1 admin configuré')
    console.log('')
    console.log('🔑 Identifiants de connexion:')
    console.log('  Admin: admin@diamondcentre.com / Admin123!')
    console.log('')
    console.log('💡 Pour créer un compte utilisateur:')
    console.log('  - Aller sur http://localhost:3000/auth/register')

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error)
    console.error('Détails:', error.message)
    if (error.code) {
      console.error('Code d\'erreur Prisma:', error.code)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    if (pool) {
      await pool.end()
    }
  }
}

main()