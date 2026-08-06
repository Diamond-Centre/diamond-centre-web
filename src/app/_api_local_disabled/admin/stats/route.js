import { NextResponse } from 'next/server'

// Données mockées pour le développement
// À remplacer par les vraies données du backend
const mockStats = {
  totalEvents: 24,
  totalUsers: 156,
  totalRevenue: 1250000,
  totalTickets: 342,
  eventsByMonth: [
    { month: 'Jan', count: 3 },
    { month: 'Fév', count: 5 },
    { month: 'Mar', count: 2 },
    { month: 'Avr', count: 4 },
    { month: 'Mai', count: 6 },
    { month: 'Jun', count: 4 },
    { month: 'Jul', count: 8 },
    { month: 'Aou', count: 10 },
    { month: 'Sep', count: 7 },
    { month: 'Oct', count: 9 },
    { month: 'Nov', count: 5 },
    { month: 'Déc', count: 3 }
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 85000 },
    { month: 'Fév', revenue: 120000 },
    { month: 'Mar', revenue: 95000 },
    { month: 'Avr', revenue: 150000 },
    { month: 'Mai', revenue: 180000 },
    { month: 'Jun', revenue: 110000 },
    { month: 'Jul', revenue: 200000 },
    { month: 'Aou', revenue: 250000 },
    { month: 'Sep', revenue: 180000 },
    { month: 'Oct', revenue: 220000 },
    { month: 'Nov', revenue: 160000 },
    { month: 'Déc', revenue: 210000 }
  ],
  categories: [
    { name: 'Conférence', count: 12, percentage: 50 },
    { name: 'Séminaire', count: 6, percentage: 25 },
    { name: 'Formation', count: 4, percentage: 17 },
    { name: 'Atelier', count: 2, percentage: 8 }
  ],
  usersByMonth: [
    { month: 'Jan', count: 12 },
    { month: 'Fév', count: 18 },
    { month: 'Mar', count: 15 },
    { month: 'Avr', count: 22 },
    { month: 'Mai', count: 28 },
    { month: 'Jun', count: 20 },
    { month: 'Jul', count: 35 },
    { month: 'Aou', count: 42 },
    { month: 'Sep', count: 30 },
    { month: 'Oct', count: 38 },
    { month: 'Nov', count: 25 },
    { month: 'Déc', count: 18 }
  ]
}

export async function GET(request) {
  // Vérifier le token d'authentification
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401 }
    )
  }

  // Récupérer les vraies données du backend
  try {
    // À remplacer par les vraies appels API
    // const response = await fetch(`${API_URL}/stats`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // })
    // const data = await response.json()
    
    return NextResponse.json(mockStats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des statistiques' },
      { status: 500 }
    )
  }
}