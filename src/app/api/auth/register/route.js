import { NextResponse } from 'next/server'
// import prisma from '@/lib/db' // DB disabled for local dev
// import bcrypt from 'bcryptjs' // JWT/DB disabled for local dev
// import jwt from 'jsonwebtoken' // JWT disabled for local dev
import { findMockUserByEmail, MOCK_TOKEN } from '@/lib/mockData'

export async function POST(request) {
  try {
    const { nom, prenom, email, telephone, sexe, password } = await request.json()

    if (!nom || !prenom || !email || !telephone || !sexe || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // const existingUser = await prisma.user.findUnique({
    //   where: { email },
    // })
    //
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: 'Un compte avec cet email existe déjà' },
    //     { status: 409 }
    //   )
    // }
    //
    // const hashedPassword = await bcrypt.hash(password, 10)
    //
    // const user = await prisma.user.create({
    //   data: {
    //     nom,
    //     prenom,
    //     email,
    //     telephone,
    //     sexe,
    //     password: hashedPassword,
    //     role: 'user',
    //   },
    // })
    //
    // const token = jwt.sign(
    //   { userId: user.id, email: user.email, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '7d' }
    // )

    if (findMockUserByEmail(email)) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 409 }
      )
    }

    const user = {
      id: `user-${Date.now()}`,
      nom,
      prenom,
      email,
      telephone,
      sexe,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      user,
      token: MOCK_TOKEN,
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur register:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription' },
      { status: 500 }
    )
  }
}
