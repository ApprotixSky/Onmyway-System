import { db } from "./db";
import { users, serverStats, apiKeys, auditLogs, type User, type InsertUser, type ServerStat, type ApiKey, type AuditLog } from "@shared/schema";
import { eq, desc, limit } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Stats
  createStat(stat: Omit<ServerStat, "id" | "timestamp">): Promise<ServerStat>;
  getLatestStat(): Promise<ServerStat | undefined>;
  getStatHistory(limit: number): Promise<ServerStat[]>;

  // API Keys
  createApiKey(key: Omit<ApiKey, "id" | "createdAt">): Promise<ApiKey>;
  getApiKeys(userId: number): Promise<ApiKey[]>;
  deleteApiKey(id: number): Promise<void>;

  // Logs
  createLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog>;
  getLogs(limit: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createStat(stat: Omit<ServerStat, "id" | "timestamp">): Promise<ServerStat> {
    const [newStat] = await db.insert(serverStats).values(stat).returning();
    return newStat;
  }

  async getLatestStat(): Promise<ServerStat | undefined> {
    const [stat] = await db.select().from(serverStats).orderBy(desc(serverStats.timestamp)).limit(1);
    return stat;
  }

  async getStatHistory(limitCount: number): Promise<ServerStat[]> {
    return await db.select().from(serverStats).orderBy(desc(serverStats.timestamp)).limit(limitCount);
  }

  async createApiKey(key: Omit<ApiKey, "id" | "createdAt">): Promise<ApiKey> {
    const [newKey] = await db.insert(apiKeys).values(key).returning();
    return newKey;
  }

  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
  }

  async deleteApiKey(id: number): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  async createLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getLogs(limitCount: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limitCount);
  }
}

export const storage = new DatabaseStorage();
