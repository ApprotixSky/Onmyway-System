import { z } from "zod";
import { insertApiKeySchema, insertUserSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string(), role: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/user",
      responses: {
        200: z.object({ id: z.number(), username: z.string(), role: z.string() }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  stats: {
    current: {
      method: "GET" as const,
      path: "/api/stats/current",
      responses: {
        200: z.object({
          cpu: z.number(),
          memory: z.number(),
          disk: z.number(),
          networkUp: z.number(),
          networkDown: z.number(),
          uptime: z.number(),
        }),
      },
    },
    history: {
      method: "GET" as const,
      path: "/api/stats/history",
      responses: {
        200: z.array(
          z.object({
            timestamp: z.string(),
            cpu: z.number(),
            memory: z.number(),
            disk: z.number(),
          })
        ),
      },
    },
  },
  files: {
    list: {
      method: "GET" as const,
      path: "/api/files/list",
      input: z.object({ path: z.string().optional() }),
      responses: {
        200: z.array(
          z.object({
            name: z.string(),
            path: z.string(),
            isDirectory: z.boolean(),
            size: z.number(),
            lastModified: z.string(),
            permissions: z.string(),
          })
        ),
        400: errorSchemas.validation,
      },
    },
    read: {
      method: "GET" as const,
      path: "/api/files/read",
      input: z.object({ path: z.string() }),
      responses: {
        200: z.object({ content: z.string() }),
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  keys: {
    list: {
      method: "GET" as const,
      path: "/api/keys",
      responses: {
        200: z.array(z.object({ id: z.number(), label: z.string(), key: z.string(), createdAt: z.string().nullable() })),
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/keys",
      input: insertApiKeySchema.pick({ label: true }),
      responses: {
        201: z.object({ id: z.number(), label: z.string(), key: z.string() }),
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/keys/:id",
      responses: {
        204: z.void(),
      },
    },
  },
  logs: {
    list: {
      method: "GET" as const,
      path: "/api/logs",
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            userId: z.number().nullable(),
            action: z.string(),
            details: z.string().nullable(),
            timestamp: z.string().nullable(),
          })
        ),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
