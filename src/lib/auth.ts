import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
)

export interface JWTPayload {
  userId: number
  username: string
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// 密码验证
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 生成JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7天过期
    .sign(JWT_SECRET)
}

// 验证JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    // 验证payload包含必需的字段
    if (typeof payload.userId === 'number' && typeof payload.username === 'string') {
      return payload as unknown as JWTPayload
    }
    return null
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// 从请求中获取用户信息
export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  return verifyToken(token)
}
