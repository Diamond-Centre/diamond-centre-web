import { prisma } from '@/lib/db'

export const PromotionModel = {
  // Récupérer toutes les promotions
  findAll: async () => {
    return await prisma.promotion.findMany({
      include: {
        event: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  },

  // Récupérer les promotions d'un événement
  findByEvent: async (eventId) => {
    return await prisma.promotion.findMany({
      where: { event_id: parseInt(eventId) },
      orderBy: {
        created_at: 'desc'
      }
    })
  },

  // Créer une promotion
  create: async (data) => {
    return await prisma.promotion.create({
      data: {
        ...data,
        prix_promo: data.price * (1 - (data.pourcentage || 0) / 100)
      }
    })
  },

  // Mettre à jour une promotion
  update: async (id, data) => {
    return await prisma.promotion.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        prix_promo: data.price * (1 - (data.pourcentage || 0) / 100)
      }
    })
  },

  // Supprimer une promotion
  delete: async (id) => {
    return await prisma.promotion.delete({
      where: { id: parseInt(id) }
    })
  }
}