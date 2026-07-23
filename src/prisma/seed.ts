// seed.js
const bcrypt = require('bcrypt')

const users = [
  {
    email: 'admin@diamondcentre.com',
    password: 'Admin123!',
    name: 'Admin Diamond Centre',
    role: 'admin'
  },
  {
    email: 'user@diamondcentre.com',
    password: 'User123!',
    name: 'User Test',
    role: 'user'
  }
]

async function seed() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    // Insérer dans la base de données
    console.log(`Creating ${user.role}: ${user.email}`)
  }
}

seed()