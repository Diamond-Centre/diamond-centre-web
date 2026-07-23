export const UserRoles = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
}

// Utilisateur admin par défaut
export const defaultAdmin = {
  id: 1,
  email: 'admin@diamondcentre.com',
  password: '$2a$10$hashedpassword123', // Admin123!
  name: 'Administrateur',
  role: UserRoles.ADMIN,
  created_at: new Date().toISOString()
}

export const mockUsers = [
  defaultAdmin,
  {
    id: 2,
    email: 'user@example.com',
    password: '$2a$10$hashedpassword456',
    name: 'Jean Dupont',
    role: UserRoles.USER,
    created_at: new Date().toISOString()
  }
]

export const UserModel = {
  findAll: () => mockUsers,
  findById: (id) => mockUsers.find(u => u.id === id),
  findByEmail: (email) => mockUsers.find(u => u.email === email),
  create: (data) => {
    const newUser = {
      id: mockUsers.length + 1,
      ...data,
      role: UserRoles.USER,
      created_at: new Date().toISOString()
    }
    mockUsers.push(newUser)
    return newUser
  }
}