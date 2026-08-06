import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Pour charger les variables d'environnement

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  // Vous pouvez ajouter d'autres options ici si nécessaire
  // schema: './prisma/schema.prisma', // Par défaut
});