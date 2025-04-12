import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

const prisma = new PrismaClient();

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  
  const token = sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = verify(token, secret) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
} 