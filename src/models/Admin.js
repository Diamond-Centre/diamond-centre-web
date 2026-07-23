/**
 * Modèle Admin
 */
import bcrypt from 'bcryptjs'

const adminCredentials = {
  email: process.env.ADMIN_EMAIL || 'admin@diamondcentre.com',
  password: process.env.ADMIN_PASSWORD || 'Admin2026!'
}

let adminUser = null

export const AdminModel = {
  init: () => {
    if (!adminUser) {
      const salt = bcrypt.genSaltSync(10)
      adminUser = {
        id: 'admin-1',
        email: adminCredentials.email,
        password: bcrypt.hashSync(adminCredentials.password, salt),
        name: 'Administrateur',
        role: 'admin',
        createdAt: new Date()
      }
    }
    return adminUser
  },

  findByEmail: (email) => {
    AdminModel.init()
    if (email === adminUser.email) {
      return { ...adminUser }
    }
    return null
  },

  validatePassword: (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword)
  },

  getAdmin: () => {
    AdminModel.init()
    const { password, ...admin } = adminUser
    return admin
  }
}

// Initialisation
AdminModel.init()