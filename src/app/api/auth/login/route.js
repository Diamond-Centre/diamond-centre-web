import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
// import bcrypt from 'bcryptjs' // JWT/DB disabled for local dev
// import jwt from 'jsonwebtoken' // JWT disabled for local dev
import { findMockUserByEmail, MOCK_TOKEN } from '@/lib/mockData'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // const user = await prisma.user.findUnique({
    //   where: { email },
    // })
    //
    // if (!user) {
    //   return NextResponse.json(
    //     { error: 'Identifiants invalides' },
    //     { status: 401 }
    //   )
    // }
    //
    // const isPasswordValid = await bcrypt.compare(password, user.password)
    //
    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: 'Identifiants invalides' },
    //     { status: 401 }
    //   )
    // }
    //
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' }
    // )

    const user = findMockUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // En mode local : accepter n'importe quel mot de passe pour les comptes mock
    // Comptes de test : admin@dice.com / user@dice.com (mot de passe libre)

    return NextResponse.json({
      user,
      token: MOCK_TOKEN,
    })
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
