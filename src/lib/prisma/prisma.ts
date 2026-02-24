import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { readReplicas } from '@prisma/extension-read-replicas';
import { PrismaClient } from '../../../generated/prisma/client';

// Create main client with adapter
const mainAdapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  connectTimeout: 60000,
  ssl: false,
  allowPublicKeyRetrieval: true,
});

const mainClient = new PrismaClient({ adapter: mainAdapter });

// Create replica client with adapter
const replicaAdapter = new PrismaPg({
  connectionString: process.env.REPLICA_URL!,
  connectTimeout: 60000,
  ssl: false,
  allowPublicKeyRetrieval: true,
});

const replicaClient = new PrismaClient({ adapter: replicaAdapter });

// Extend main client with read replicas
const prisma = mainClient.$extends(readReplicas({ replicas: [replicaClient] }));

export { prisma };

