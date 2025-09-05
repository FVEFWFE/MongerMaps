import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    app: 'OK',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasNextAuth: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  };

  // Try to import Prisma to check if it's working
  try {
    const { PrismaClient } = await import('@prisma/client');
    checks.prisma = 'Module loaded';
  } catch (error) {
    checks.prisma = `Error: ${error.message}`;
  }

  return NextResponse.json(checks);
}