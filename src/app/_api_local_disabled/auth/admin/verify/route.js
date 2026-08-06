import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-here'

export async function GET() {
  try {
    const token = cookies().get('admin_token')?.value
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Token manquant'
      }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      
      if (decoded.role === 'admin') {
        return NextResponse.json({ 
          authenticated: true,
          user: {
            email: decoded.email,
            role: decoded.role
          }
        })
      }

      return NextResponse.json({ 
        authenticated: false,
        message: 'Rôle non autorisé'
      }, { status: 403 })
    } catch (jwtError) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Token invalide'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return NextResponse.json({ 
      authenticated: false,
      message: 'Erreur serveur'
    }, { status: 500 })
  }
}