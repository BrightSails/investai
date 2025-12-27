import { kv } from '@vercel/kv';

// ==================== 类型定义 ====================
export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  riskPreference: string;
  investmentAmount: number;
  investmentPeriod: string;
  investmentGoal: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  type: string;
  riskLevel: number;
  expectedReturn: number;
  investmentThreshold: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: number;
  userId: number;
  overallExpectedReturn: number;
  overallRiskLevel: number;
  matchScore: number;
  projectAllocations: Array<{
    projectId: number;
    projectName: string;
    allocationType: string;
    allocationRatio: number;
    expectedReturnContribution: number;
    riskWarning: string;
  }>;
  reasoning: string;
  createdAt: string;
}

// ==================== KV键名常量 ====================
const KEYS = {
  USERS: 'users:all',
  USER_BY_ID: (id: number) => `user:${id}`,
  USER_BY_USERNAME: (username: string) => `user:username:${username}`,
  
  PROFILES: 'profiles:all',
  PROFILE_BY_USER: (userId: number) => `profile:user:${userId}`,
  
  PROJECTS: 'projects:all',
  PROJECT_BY_ID: (id: number) => `project:${id}`,
  
  RECOMMENDATIONS: 'recommendations:all',
  RECOMMENDATIONS_BY_USER: (userId: number) => `recommendations:user:${userId}`,
  
  COUNTERS: {
    USER: 'counter:user',
    PROFILE: 'counter:profile',
    PROJECT: 'counter:project',
    RECOMMENDATION: 'counter:recommendation',
  }
};

// ==================== 辅助函数 ====================

// 生成自增ID
async function getNextId(counterKey: string): Promise<number> {
  const id = await kv.incr(counterKey);
  return id;
}

// ==================== 用户相关操作 ====================

export async function getUsers(): Promise<User[]> {
  const userIds = await kv.smembers(KEYS.USERS) as number[];
  if (!userIds || userIds.length === 0) return [];
  
  const users = await Promise.all(
    userIds.map(id => kv.get<User>(KEYS.USER_BY_ID(id)))
  );
  
  return users.filter(u => u !== null) as User[];
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const userId = await kv.get<number>(KEYS.USER_BY_USERNAME(username));
  if (!userId) return null;
  
  return await kv.get<User>(KEYS.USER_BY_ID(userId));
}

export async function findUserById(id: number): Promise<User | null> {
  return await kv.get<User>(KEYS.USER_BY_ID(id));
}

export async function createUser(username: string, password: string): Promise<User> {
  const id = await getNextId(KEYS.COUNTERS.USER);
  const now = new Date().toISOString();
  
  const newUser: User = {
    id,
    username,
    password,
    createdAt: now,
    updatedAt: now,
  };
  
  // 保存用户数据
  await kv.set(KEYS.USER_BY_ID(id), newUser);
  // 保存用户名索引
  await kv.set(KEYS.USER_BY_USERNAME(username), id);
  // 添加到用户集合
  await kv.sadd(KEYS.USERS, id);
  
  return newUser;
}

// ==================== 画像相关操作 ====================

export async function getProfiles(): Promise<UserProfile[]> {
  const profileIds = await kv.smembers(KEYS.PROFILES) as number[];
  if (!profileIds || profileIds.length === 0) return [];
  
  const profiles = await Promise.all(
    profileIds.map(id => kv.get<UserProfile>(`profile:${id}`))
  );
  
  return profiles.filter(p => p !== null) as UserProfile[];
}

export async function findProfileByUserId(userId: number): Promise<UserProfile | null> {
  return await kv.get<UserProfile>(KEYS.PROFILE_BY_USER(userId));
}

export async function upsertProfile(
  userId: number,
  data: Omit<UserProfile, 'id' | 'userId' | 'updatedAt'>
): Promise<UserProfile> {
  const existing = await findProfileByUserId(userId);
  const now = new Date().toISOString();
  
  if (existing) {
    // 更新现有画像
    const updated: UserProfile = {
      ...existing,
      ...data,
      updatedAt: now,
    };
    await kv.set(KEYS.PROFILE_BY_USER(userId), updated);
    await kv.set(`profile:${existing.id}`, updated);
    return updated;
  } else {
    // 创建新画像
    const id = await getNextId(KEYS.COUNTERS.PROFILE);
    const newProfile: UserProfile = {
      id,
      userId,
      ...data,
      updatedAt: now,
    };
    
    await kv.set(KEYS.PROFILE_BY_USER(userId), newProfile);
    await kv.set(`profile:${id}`, newProfile);
    await kv.sadd(KEYS.PROFILES, id);
    
    return newProfile;
  }
}

// ==================== 项目相关操作 ====================

export async function getProjects(): Promise<Project[]> {
  const projectIds = await kv.smembers(KEYS.PROJECTS) as number[];
  if (!projectIds || projectIds.length === 0) return [];
  
  const projects = await Promise.all(
    projectIds.map(id => kv.get<Project>(KEYS.PROJECT_BY_ID(id)))
  );
  
  return projects.filter(p => p !== null) as Project[];
}

export async function findProjectById(id: number): Promise<Project | null> {
  return await kv.get<Project>(KEYS.PROJECT_BY_ID(id));
}

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const id = await getNextId(KEYS.COUNTERS.PROJECT);
  const now = new Date().toISOString();
  
  const newProject: Project = {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  
  await kv.set(KEYS.PROJECT_BY_ID(id), newProject);
  await kv.sadd(KEYS.PROJECTS, id);
  
  return newProject;
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project | null> {
  const existing = await findProjectById(id);
  if (!existing) return null;
  
  const updated: Project = {
    ...existing,
    ...data,
    id: existing.id, // 确保ID不变
    createdAt: existing.createdAt, // 保留创建时间
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(KEYS.PROJECT_BY_ID(id), updated);
  return updated;
}

export async function deleteProject(id: number): Promise<boolean> {
  const existing = await findProjectById(id);
  if (!existing) return false;
  
  await kv.del(KEYS.PROJECT_BY_ID(id));
  await kv.srem(KEYS.PROJECTS, id);
  
  return true;
}

// ==================== 推荐记录相关操作 ====================

export async function getRecommendations(): Promise<Recommendation[]> {
  const recommendationIds = await kv.smembers(KEYS.RECOMMENDATIONS) as number[];
  if (!recommendationIds || recommendationIds.length === 0) return [];
  
  const recommendations = await Promise.all(
    recommendationIds.map(id => kv.get<Recommendation>(`recommendation:${id}`))
  );
  
  return recommendations.filter(r => r !== null) as Recommendation[];
}

export async function findRecommendationsByUserId(userId: number): Promise<Recommendation[]> {
  const recommendationIds = await kv.smembers(KEYS.RECOMMENDATIONS_BY_USER(userId)) as number[];
  if (!recommendationIds || recommendationIds.length === 0) return [];
  
  const recommendations = await Promise.all(
    recommendationIds.map(id => kv.get<Recommendation>(`recommendation:${id}`))
  );
  
  const validRecommendations = recommendations.filter(r => r !== null) as Recommendation[];
  
  // 按创建时间倒序排序
  return validRecommendations.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createRecommendation(
  userId: number,
  data: Omit<Recommendation, 'id' | 'userId' | 'createdAt'>
): Promise<Recommendation> {
  const id = await getNextId(KEYS.COUNTERS.RECOMMENDATION);
  const now = new Date().toISOString();
  
  const newRecommendation: Recommendation = {
    id,
    userId,
    ...data,
    createdAt: now,
  };
  
  await kv.set(`recommendation:${id}`, newRecommendation);
  await kv.sadd(KEYS.RECOMMENDATIONS, id);
  await kv.sadd(KEYS.RECOMMENDATIONS_BY_USER(userId), id);
  
  return newRecommendation;
}

// ==================== 数据迁移/初始化 ====================

export async function initializeKV(): Promise<void> {
  // 检查是否已初始化
  const initialized = await kv.get('initialized');
  if (initialized) return;
  
  // 初始化计数器（如果不存在）
  const userCount = await kv.get(KEYS.COUNTERS.USER);
  if (userCount === null) await kv.set(KEYS.COUNTERS.USER, 0);
  
  const profileCount = await kv.get(KEYS.COUNTERS.PROFILE);
  if (profileCount === null) await kv.set(KEYS.COUNTERS.PROFILE, 0);
  
  const projectCount = await kv.get(KEYS.COUNTERS.PROJECT);
  if (projectCount === null) await kv.set(KEYS.COUNTERS.PROJECT, 0);
  
  const recommendationCount = await kv.get(KEYS.COUNTERS.RECOMMENDATION);
  if (recommendationCount === null) await kv.set(KEYS.COUNTERS.RECOMMENDATION, 0);
  
  await kv.set('initialized', true);
}
