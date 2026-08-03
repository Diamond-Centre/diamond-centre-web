/**
 * Script pour créer un compte admin
 * Exécuter: node scripts/create-admin.js
 */
const fetch = require('node-fetch')

const API_URL = 'http://localhost:3001/api'

async function createAdmin() {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@diamondcentre.com',
        password: 'Admin123!',
        name: 'Administrateur Diamond Centre',
        role: 'admin'
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Admin créé avec succès !')
      console.log('📧 Email:', data.email)
      console.log('🔑 Rôle:', data.role)
      console.log('\n🔐 Connectez-vous avec:')
      console.log('   Email: admin@diamondcentre.com')
      console.log('   Mot de passe: Admin123!')
    } else {
      const error = await response.json()
      console.error('❌ Erreur:', error.message)
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
  }
}

createAdmin()