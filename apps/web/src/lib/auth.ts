/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 better-auth configuration. The hooks.before middleware (backfills
 * `name` from email), bearer() plugin (mobile Authorization: Bearer flow), and
 * trustedOrigins list are ALL load-bearing. A prior AI removed the name
 * backfill and broke every signup with [body.name] validation errors. DO NOT
 * simplify this config without understanding why each piece is present.
 *
 *   Safe:   add user fields to `user.additionalFields`, tune session options.
 *   Unsafe: removing hooks.before, the bearer plugin, or trustedOrigins;
 *           changing cookie attributes (sameSite:'none' is required for
 *           mobile iframes); changing the database pool.
 */
import { Pool, neonConfig } from '@neondatabase/serverless';
import { betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { bearer } from 'better-auth/plugins';
import ws from 'ws';

let _auth: ReturnType<typeof betterAuth> | null = null;

function initAuth() {
  if (_auth) return _auth;

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const trustedOrigins = [
    process.env.BETTER_AUTH_URL,
    process.env.EXPO_PUBLIC_PROXY_BASE_URL,
    process.env.NEXT_PUBLIC_CREATE_BASE_URL,
    process.env.NEXT_PUBLIC_CREATE_HOST
      ? `https://${process.env.NEXT_PUBLIC_CREATE_HOST}`
      : null,
  ].filter((v): v is string => Boolean(v));

  _auth = betterAuth({
    database: pool,
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/sign-up/email') return;
        const body = ctx.body as { email?: unknown; name?: unknown } | undefined;
        if (!body || typeof body.email !== 'string') return;
        if (typeof body.name === 'string' && body.name.trim().length > 0) return;
        const derived = body.email.split('@')[0];
        body.name = derived && derived.length > 0 ? derived : 'User';
      }),
    },
    advanced: {
      cookiePrefix: 'better-auth',
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        httpOnly: true,
        path: '/',
      },
      cookies: {
        sessionToken: {
          attributes: {
            sameSite: 'none',
            secure: true,
          },
        },
      },
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    user: {
      additionalFields: {
        image: {
          type: 'string',
          required: false,
        },
      },
    },
    plugins: [bearer()],
  });

  return _auth;
}

export const auth = new Proxy<ReturnType<typeof betterAuth>>(
  {} as ReturnType<typeof betterAuth>,
  { get: (_, prop) => initAuth()[prop as keyof ReturnType<typeof betterAuth>] },
);

export type Session = ReturnType<typeof betterAuth>['$Infer']['Session'];
