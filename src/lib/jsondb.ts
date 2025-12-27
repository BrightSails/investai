import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const PROFILES_FILE = path.join(DB_DIR, 'profiles.json');
const PROJECTS_FILE = path.join(DB_DIR, 'projects.json');
const RECOMMENDATIONS_FILE = path.join(DB_DIR, 'recommendations.json');

// 确保数据目录和文件存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(PROFILES_FILE)) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(PROJECTS_FILE)) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(RECOMMENDATIONS_FILE)) {
  fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify([], null, 2));
}

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

// 读取用户数据
export function getUsers(): User[] {
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 保存用户数据
export function saveUsers(users: User[]): void {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 根据用户名查找用户
export function findUserByUsername(username: string): User | undefined {
  const users = getUsers();
  return users.find(u => u.username === username);
}

// 根据ID查找用户
export function findUserById(id: number): User | undefined {
  const users = getUsers();
  return users.find(u => u.id === id);
}

// 创建用户
export function createUser(username: string, password: string): User {
  const users = getUsers();
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

// 读取画像数据
export function getProfiles(): UserProfile[] {
  const data = fs.readFileSync(PROFILES_FILE, 'utf-8');
  return JSON.parse(data);
}

// 保存画像数据
export function saveProfiles(profiles: UserProfile[]): void {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

// 根据用户ID查找画像
export function findProfileByUserId(userId: number): UserProfile | undefined {
  const profiles = getProfiles();
  return profiles.find(p => p.userId === userId);
}

// 创建或更新画像
export function upsertProfile(userId: number, data: Omit<UserProfile, 'id' | 'userId' | 'updatedAt'>): UserProfile {
  const profiles = getProfiles();
  const existingIndex = profiles.findIndex(p => p.userId === userId);
  
  if (existingIndex >= 0) {
    // 更新
    profiles[existingIndex] = {
      ...profiles[existingIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveProfiles(profiles);
    return profiles[existingIndex];
  } else {
    // 创建
    const newProfile: UserProfile = {
      id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1,
      userId,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    profiles.push(newProfile);
    saveProfiles(profiles);
    return newProfile;
  }
}

// 读取项目数据
export function getProjects(): Project[] {
  const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 保存项目数据
export function saveProjects(projects: Project[]): void {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// 读取推荐记录
export function getRecommendations(): Recommendation[] {
  const data = fs.readFileSync(RECOMMENDATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// 保存推荐记录
export function saveRecommendations(recommendations: Recommendation[]): void {
  fs.writeFileSync(RECOMMENDATIONS_FILE, JSON.stringify(recommendations, null, 2));
}

// 根据用户ID查找推荐记录
export function findRecommendationsByUserId(userId: number): Recommendation[] {
  const recommendations = getRecommendations();
  return recommendations.filter(r => r.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// 创建推荐记录
export function createRecommendation(
  userId: number,
  data: Omit<Recommendation, 'id' | 'userId' | 'createdAt'>
): Recommendation {
  const recommendations = getRecommendations();
  const newRecommendation: Recommendation = {
    id: recommendations.length > 0 ? Math.max(...recommendations.map(r => r.id)) + 1 : 1,
    userId,
    ...data,
    createdAt: new Date().toISOString(),
  };
  recommendations.push(newRecommendation);
  saveRecommendations(recommendations);
  return newRecommendation;
}
