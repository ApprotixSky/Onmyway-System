import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // super_owner, admin, user
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serverStats = pgTable("server_stats", {
  id: serial("id").primaryKey(),
  cpu: integer("cpu").notNull(), // percentage
  memory: integer("memory").notNull(), // percentage
  disk: integer("disk").notNull(), // percentage
  networkUp: integer("network_up").notNull(), // Kbps
  networkDown: integer("network_down").notNull(), // Kbps
  uptime: integer("uptime").notNull(), // seconds
  timestamp: timestamp("timestamp").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Nullable for system events
  action: text("action").notNull(),
  details: text("details"),
  ip: text("ip"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true, key: true }); // Key generated server-side
export const insertLogSchema = createInsertSchema(auditLogs).omit({ id: true, timestamp: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ServerStat = typeof serverStats.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

// File System Types (Not in DB, but shared)
export interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  lastModified: string;
  permissions: string;
}
