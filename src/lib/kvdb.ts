import { sql } from '@vercel/postgres'

// ==================== 类型定义 ====================
export interface User {
  id: number
  username: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: number
  userId: number
  riskPreference: string
  investmentAmount: number
  investmentPeriod: string
  investmentGoal: string
  updatedAt: string
}

export interface Project {
  id: number
  name: string
  type: string
  riskLevel: number
  expectedReturn: number
  investmentThreshold: number
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface Recommendation {
  id: number
  userId: number
  overallExpectedReturn: number
  overallRiskLevel: number
  matchScore: number
  projectAllocations: Array<{
    projectId: number
    projectName: string
    allocationType: string
    allocationRatio: number
    expectedReturnContribution: number
    riskWarning: string
  }>
  reasoning: string
  createdAt: string
}

// ==================== Postgres 初始化 ====================

let initPromise: Promise<void> | null = null
let initialized = false

async function ensureTables(): Promise<void> {
  if (initialized) return
  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`

    await sql`CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      risk_preference TEXT NOT NULL,
      investment_amount DOUBLE PRECISION NOT NULL,
      investment_period TEXT NOT NULL,
      investment_goal TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`

    await sql`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      risk_level INTEGER NOT NULL,
      expected_return DOUBLE PRECISION NOT NULL,
      investment_threshold DOUBLE PRECISION NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`

    await sql`CREATE TABLE IF NOT EXISTS recommendations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      overall_expected_return DOUBLE PRECISION NOT NULL,
      overall_risk_level DOUBLE PRECISION NOT NULL,
      match_score DOUBLE PRECISION NOT NULL,
      project_allocations JSONB NOT NULL,
      reasoning TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`
    initialized = true
  })().finally(() => {
    initPromise = null
  })

  return initPromise
}

// ==================== 行映射工具 ====================

type DateLike = Date | string

const toIsoString = (value: DateLike): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString()

const parseNumber = (value: unknown): number =>
  typeof value === 'number' ? value : Number(value)

const parseAllocations = (value: unknown) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch (error) {
      console.error('解析 projectAllocations 失败:', error)
      return []
    }
  }
  return value as Recommendation['projectAllocations']
}

type UserRow = {
  id: number
  username: string
  password: string
  created_at: DateLike
  updated_at: DateLike
}

type UserProfileRow = {
  id: number
  user_id: number
  risk_preference: string
  investment_amount: number | string
  investment_period: string
  investment_goal: string
  updated_at: DateLike
}

type ProjectRow = {
  id: number
  name: string
  type: string
  risk_level: number | string
  expected_return: number | string
  investment_threshold: number | string
  description: string | null
  created_at: DateLike
  updated_at: DateLike
}

type RecommendationRow = {
  id: number
  user_id: number
  overall_expected_return: number | string
  overall_risk_level: number | string
  match_score: number | string
  project_allocations: unknown
  reasoning: string
  created_at: DateLike
}

const mapUser = (row: UserRow): User => ({
  id: row.id,
  username: row.username,
  password: row.password,
  createdAt: toIsoString(row.created_at),
  updatedAt: toIsoString(row.updated_at),
})

const mapProfile = (row: UserProfileRow): UserProfile => ({
  id: row.id,
  userId: row.user_id,
  riskPreference: row.risk_preference,
  investmentAmount: parseNumber(row.investment_amount),
  investmentPeriod: row.investment_period,
  investmentGoal: row.investment_goal,
  updatedAt: toIsoString(row.updated_at),
})

const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  name: row.name,
  type: row.type,
  riskLevel: parseNumber(row.risk_level),
  expectedReturn: parseNumber(row.expected_return),
  investmentThreshold: parseNumber(row.investment_threshold),
  description: row.description,
  createdAt: toIsoString(row.created_at),
  updatedAt: toIsoString(row.updated_at),
})

const mapRecommendation = (row: RecommendationRow): Recommendation => ({
  id: row.id,
  userId: row.user_id,
  overallExpectedReturn: parseNumber(row.overall_expected_return),
  overallRiskLevel: parseNumber(row.overall_risk_level),
  matchScore: parseNumber(row.match_score),
  projectAllocations: parseAllocations(row.project_allocations),
  reasoning: row.reasoning,
  createdAt: toIsoString(row.created_at),
})

// ==================== 用户相关操作 ====================

export async function getUsers(): Promise<User[]> {
  await ensureTables()
  const { rows } = await sql<UserRow>`SELECT * FROM users ORDER BY id ASC;`
  return rows.map(mapUser)
}

export async function findUserByUsername(username: string): Promise<User | null> {
  await ensureTables()
  const { rows } = await sql<UserRow>`SELECT * FROM users WHERE username = ${username} LIMIT 1;`
  if (rows.length === 0) return null
  return mapUser(rows[0])
}

export async function findUserById(id: number): Promise<User | null> {
  await ensureTables()
  const { rows } = await sql<UserRow>`SELECT * FROM users WHERE id = ${id} LIMIT 1;`
  if (rows.length === 0) return null
  return mapUser(rows[0])
}

export async function createUser(username: string, password: string): Promise<User> {
  await ensureTables()
  const { rows } = await sql<UserRow>`
    INSERT INTO users (username, password)
    VALUES (${username}, ${password})
    RETURNING *;
  `
  return mapUser(rows[0])
}

// ==================== 画像相关操作 ====================

export async function getProfiles(): Promise<UserProfile[]> {
  await ensureTables()
  const { rows } = await sql<UserProfileRow>`SELECT * FROM user_profiles ORDER BY user_id ASC;`
  return rows.map(mapProfile)
}

export async function findProfileByUserId(userId: number): Promise<UserProfile | null> {
  await ensureTables()
  const { rows } = await sql<UserProfileRow>`SELECT * FROM user_profiles WHERE user_id = ${userId} LIMIT 1;`
  if (rows.length === 0) return null
  return mapProfile(rows[0])
}

export async function upsertProfile(
  userId: number,
  data: Omit<UserProfile, 'id' | 'userId' | 'updatedAt'>
): Promise<UserProfile> {
  await ensureTables()
  const { rows } = await sql<UserProfileRow>`
    INSERT INTO user_profiles (user_id, risk_preference, investment_amount, investment_period, investment_goal)
    VALUES (${userId}, ${data.riskPreference}, ${data.investmentAmount}, ${data.investmentPeriod}, ${data.investmentGoal})
    ON CONFLICT (user_id) DO UPDATE SET
      risk_preference = EXCLUDED.risk_preference,
      investment_amount = EXCLUDED.investment_amount,
      investment_period = EXCLUDED.investment_period,
      investment_goal = EXCLUDED.investment_goal,
      updated_at = NOW()
    RETURNING *;
  `
  return mapProfile(rows[0])
}

// ==================== 项目相关操作 ====================

export async function getProjects(): Promise<Project[]> {
  await ensureTables()
  const { rows } = await sql<ProjectRow>`SELECT * FROM projects ORDER BY created_at DESC;`
  return rows.map(mapProject)
}

export async function findProjectById(id: number): Promise<Project | null> {
  await ensureTables()
  const { rows } = await sql<ProjectRow>`SELECT * FROM projects WHERE id = ${id} LIMIT 1;`
  if (rows.length === 0) return null
  return mapProject(rows[0])
}

export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Project> {
  await ensureTables()
  const { rows } = await sql<ProjectRow>`
    INSERT INTO projects (name, type, risk_level, expected_return, investment_threshold, description)
    VALUES (
      ${data.name},
      ${data.type},
      ${data.riskLevel},
      ${data.expectedReturn},
      ${data.investmentThreshold},
      ${data.description ?? null}
    )
    RETURNING *;
  `
  return mapProject(rows[0])
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
  await ensureTables()
  const existing = await findProjectById(id)
  if (!existing) return null

  const merged: Project = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  const { rows } = await sql<ProjectRow>`
    UPDATE projects
    SET
      name = ${merged.name},
      type = ${merged.type},
      risk_level = ${merged.riskLevel},
      expected_return = ${merged.expectedReturn},
      investment_threshold = ${merged.investmentThreshold},
      description = ${merged.description ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `

  return rows.length ? mapProject(rows[0]) : null
}

export async function deleteProject(id: number): Promise<boolean> {
  await ensureTables()
  const { rows } = await sql<{ id: number }>`DELETE FROM projects WHERE id = ${id} RETURNING id;`
  return rows.length > 0
}

// ==================== 推荐记录相关操作 ====================

export async function getRecommendations(): Promise<Recommendation[]> {
  await ensureTables()
  const { rows } = await sql<RecommendationRow>`SELECT * FROM recommendations ORDER BY created_at DESC;`
  return rows.map(mapRecommendation)
}

export async function findRecommendationsByUserId(userId: number): Promise<Recommendation[]> {
  await ensureTables()
  const { rows } = await sql<RecommendationRow>`
    SELECT * FROM recommendations
    WHERE user_id = ${userId}
    ORDER BY created_at DESC;
  `
  return rows.map(mapRecommendation)
}

export async function createRecommendation(
  userId: number,
  data: Omit<Recommendation, 'id' | 'userId' | 'createdAt'>
): Promise<Recommendation> {
  await ensureTables()
  const allocations = JSON.stringify(data.projectAllocations || [])
  const { rows } = await sql<RecommendationRow>`
    INSERT INTO recommendations (
      user_id,
      overall_expected_return,
      overall_risk_level,
      match_score,
      project_allocations,
      reasoning
    )
    VALUES (
      ${userId},
      ${data.overallExpectedReturn},
      ${data.overallRiskLevel},
      ${data.matchScore},
      ${allocations}::jsonb,
      ${data.reasoning}
    )
    RETURNING *;
  `
  return mapRecommendation(rows[0])
}

// ==================== 初始化占位（兼容原逻辑） ====================

export async function initializeKV(): Promise<void> {
  await ensureTables()
}
