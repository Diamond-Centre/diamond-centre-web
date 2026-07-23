// scripts/test-login.js
const bcrypt = require('bcryptjs')

// Simuler le hash du mot de passe admin
async function testPassword() {
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)
  
  console.log('🔑 Mot de passe:', password)
  console.log('🔐 Hash généré:', hashedPassword)
  console.log('--------------------------------------------------')
  console.log('📝 Copiez ce hash dans la base de données:')
  console.log(hashedPassword)
  console.log('--------------------------------------------------')
  
  // Vérifier la comparaison
  const isValid = await bcrypt.compare(password, hashedPassword)
  console.log('✅ Vérification du hash:', isValid ? 'Valide ✅' : 'Invalide ❌')
}

testPassword()