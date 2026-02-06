import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { PrismaClient } from '../../../generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: +process.env.DATABASE_PORT!,
  connectTimeout: 60000,
  ssl: false,
  allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

export { prisma };
