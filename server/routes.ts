import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, isAuthenticated, registerAuthRoutes } from "./replit_integrations/auth";
import { randomBytes } from "crypto";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth FIRST (before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Stats Routes (Simulated for "Real Server" feel)
  app.get(api.stats.current.path, isAuthenticated, async (req, res) => {
    // In a real app we'd use 'os' module, but let's simulate realistic fluctuations
    const memTotal = os.totalmem();
    const memFree = os.freemem();
    const memUsage = Math.round(((memTotal - memFree) / memTotal) * 100);
    
    // Simulate CPU load (random walk)
    const lastStat = await storage.getLatestStat();
    let cpu = (lastStat?.cpu || 10) + (Math.random() * 10 - 5);
    cpu = Math.max(0, Math.min(100, cpu));

    const stat = await storage.createStat({
      cpu: Math.round(cpu),
      memory: memUsage,
      disk: 45, // Fixed for demo
      networkUp: Math.round(Math.random() * 500), // Kbps
      networkDown: Math.round(Math.random() * 2000), // Kbps
      uptime: Math.round(os.uptime()),
    });

    res.json(stat);
  });

  app.get(api.stats.history.path, isAuthenticated, async (req, res) => {
    const history = await storage.getStatHistory(50);
    res.json(history.map(h => ({
      ...h,
      timestamp: h.timestamp ? h.timestamp.toISOString() : new Date().toISOString()
    })));
  });

  // Files Routes (Sandbox Access)
  app.get(api.files.list.path, isAuthenticated, async (req, res) => {
    try {
      // Validate path to prevent escaping sandbox (basic check)
      const requestedPath = (req.query.path as string) || ".";
      const safePath = path.normalize(requestedPath).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.resolve(process.cwd(), safePath);

      if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ message: "Access denied: Outside sandbox" });
      }

      const files = await fs.promises.readdir(fullPath, { withFileTypes: true });
      const fileList = await Promise.all(files.map(async (f) => {
        const stats = await fs.promises.stat(path.join(fullPath, f.name));
        return {
          name: f.name,
          path: path.relative(process.cwd(), path.join(fullPath, f.name)),
          isDirectory: f.isDirectory(),
          size: stats.size,
          lastModified: stats.mtime.toISOString(),
          permissions: 'drwxr-xr-x', // Mock permissions for now
        };
      }));

      res.json(fileList);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.get(api.files.read.path, isAuthenticated, async (req, res) => {
    try {
      const requestedPath = req.query.path as string;
      if (!requestedPath) return res.status(400).json({ message: "Path required" });

      const safePath = path.normalize(requestedPath).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.resolve(process.cwd(), safePath);

      if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Read only text files approx
      const stats = await fs.promises.stat(fullPath);
      if (stats.size > 1024 * 1024) return res.status(400).json({ message: "File too large" });

      const content = await fs.promises.readFile(fullPath, 'utf-8');
      res.json({ content });
    } catch (err: any) {
      res.status(404).json({ message: "File not found" });
    }
  });

  // API Keys
  app.get(api.keys.list.path, isAuthenticated, async (req, res) => {
    const keys = await storage.getApiKeys((req.user as any).id);
    res.json(keys.map(k => ({ ...k, createdAt: k.createdAt ? k.createdAt.toISOString() : null })));
  });

  app.post(api.keys.create.path, isAuthenticated, async (req, res) => {
    const { label } = req.body;
    const key = `sk_live_${randomBytes(24).toString('hex')}`;
    const newKey = await storage.createApiKey({
      userId: (req.user as any).id,
      key,
      label,
    });
    res.status(201).json(newKey);
  });

  app.delete(api.keys.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteApiKey(Number(req.params.id));
    res.status(204).send();
  });

  // Logs
  app.get(api.logs.list.path, isAuthenticated, async (req, res) => {
    const logs = await storage.getLogs(100);
    res.json(logs.map(l => ({ ...l, timestamp: l.timestamp ? l.timestamp.toISOString() : null })));
  });


  // SEED DATA
  // Check if users exist, if not create them
  const superUser = await storage.getUserByUsername("mukegile");
  if (!superUser) {
    console.log("Seeding super owner...");
    const hashedPassword = await hashPassword("mukeluaje");
    await storage.createUser({
      username: "mukegile",
      password: hashedPassword,
      role: "super_owner",
      isActive: true,
    });
  }

  const adminUser = await storage.getUserByUsername("admin");
  if (!adminUser) {
    console.log("Seeding admin...");
    const hashedPassword = await hashPassword("admin");
    await storage.createUser({
      username: "admin",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
  }

  return httpServer;
}
