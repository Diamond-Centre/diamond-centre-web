const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🌱 Début du seeding...')

    // Supprimer les données existantes (optionnel)
    console.log('🧹 Nettoyage des données existantes...')
    await prisma.ticket.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.adminLog.deleteMany()
    await prisma.event.deleteMany()
    await prisma.user.deleteMany()
    console.log('✅ Nettoyage terminé')

    // Créer un admin
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

    // Créer un utilisateur test
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

    // Créer des événements de test
    console.log('📅 Création des événements...')
    const eventsData = [
      {
        title: 'Atelier React Avancé',
        description: 'Maîtrisez les concepts avancés de React pour créer des applications performantes avec des hooks personnalisés, le context API et le lazy loading.',
        type: 'atelier',
        price: 149.99,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        duration: 8,
        location: 'Paris, France',
        instructor: 'Jean Dupont',
        totalSeats: 20,
        availableSeats: 20,
        image: '/images/events/react-workshop.jpg',
        status: 'upcoming',
      },
      {
        title: 'Conférence IA & Machine Learning',
        description: 'Découvrez les dernières avancées en intelligence artificielle et machine learning, avec des cas pratiques et des démonstrations en direct.',
        type: 'conference',
        price: 299.99,
        promotion: true,
        originalPrice: 399.99,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        duration: 6,
        location: 'Lyon, France',
        instructor: 'Marie Martin',
        totalSeats: 50,
        availableSeats: 50,
        image: '/images/events/ai-conference.jpg',
        status: 'upcoming',
      },
      {
        title: 'Séminaire DevOps et Cloud',
        description: 'Apprenez à déployer et gérer vos applications avec les outils DevOps modernes : Docker, Kubernetes, CI/CD, et monitoring.',
        type: 'seminaire',
        price: 199.99,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        duration: 12,
        location: 'Bordeaux, France',
        instructor: 'Pierre Dubois',
        totalSeats: 30,
        availableSeats: 30,
        image: '/images/events/devops-seminar.jpg',
        status: 'upcoming',
      },
      {
        title: 'Atelier Next.js & TypeScript',
        description: 'Développez des applications modernes avec Next.js 14 et TypeScript, en utilisant le App Router et les Server Components.',
        type: 'atelier',
        price: 179.99,
        promotion: true,
        originalPrice: 229.99,
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        duration: 10,
        location: 'Toulouse, France',
        instructor: 'Sophie Leroy',
        totalSeats: 25,
        availableSeats: 25,
        image: '/images/events/nextjs-workshop.jpg',
        status: 'upcoming',
      },
      {
        title: 'Conférence Web Performance',
        description: 'Optimisez la performance de vos applications web avec les dernières techniques et outils d\'analyse.',
        type: 'conference',
        price: 249.99,
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        duration: 4,
        location: 'Paris, France',
        instructor: 'Thomas Richard',
        totalSeats: 40,
        availableSeats: 40,
        image: '/images/events/performance-conference.jpg',
        status: 'upcoming',
      },
      {
        title: 'Séminaire Architecture Microservices',
        description: 'Concevez et implémentez des architectures microservices robustes avec Spring Boot, Docker et Kubernetes.',
        type: 'seminaire',
        price: 349.99,
        date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
        duration: 16,
        location: 'Lyon, France',
        instructor: 'Michel Dupuis',
        totalSeats: 35,
        availableSeats: 35,
        image: '/images/events/microservices-seminar.jpg',
        status: 'upcoming',
      },
    ]

    for (const eventData of eventsData) {
      const event = await prisma.event.create({
        data: eventData,
      })
      console.log('✅ Événement créé:', event.title)
    }

    // Créer des tickets pour l'utilisateur test
    console.log('🎫 Création de tickets test...')
    const events = await prisma.event.findMany()
    if (events.length > 0) {
      const ticketCodes = [
        '12345678',
        '87654321',
        '11223344',
        '55667788',
      ]
      
      for (let i = 0; i < Math.min(3, events.length); i++) {
        const event = events[i]
        const statuses = ['pending', 'validated', 'paid']
        const status = statuses[i % statuses.length]
        
        await prisma.ticket.create({
          data: {
            code: ticketCodes[i % ticketCodes.length],
            userId: user.id,
            eventId: event.id,
            status: status,
            pricePaid: event.price * 0.9, // 10% de réduction
            datePurchase: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
          },
        })
        console.log(`✅ Ticket créé pour ${event.title} (${status})`)
      }
    }

    // Créer des notifications
    console.log('🔔 Création de notifications...')
    const notifications = [
      {
        userId: user.id,
        type: 'new_event',
        title: 'Nouvelle formation disponible',
        message: 'Atelier React Avancé - Réservez dès maintenant !',
        eventId: events[0]?.id || null,
      },
      {
        userId: user.id,
        type: 'update_event',
        title: 'Mise à jour de formation',
        message: 'La formation "DevOps et Cloud" a été mise à jour.',
        eventId: events[2]?.id || null,
      },
      {
        userId: user.id,
        type: 'reminder',
        title: 'Rappel de formation',
        message: 'Votre formation "IA & Machine Learning" commence dans 3 jours.',
        eventId: events[1]?.id || null,
      },
    ]

    for (const notif of notifications) {
      await prisma.notification.create({
        data: notif,
      })
    }
    console.log('✅ Notifications créées')

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