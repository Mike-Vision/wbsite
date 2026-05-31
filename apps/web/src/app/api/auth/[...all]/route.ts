/**
 * ⚠ ANYTHING PLATFORM — DO NOT REWRITE THIS FILE ⚠
 *
 * Shipped v2 better-auth catch-all. `toNextJsHandler(auth)` wires up every
 * better-auth endpoint (/sign-up/email, /sign-in/email, /get-session, ...).
 * Do not hand-roll your own routes for these paths; it will conflict with
 * this handler and break signup/signin/session lookup.
 */
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [
    { all: ['sign-in', 'email'] },
    { all: ['sign-up', 'email'] },
    { all: ['sign-out'] },
    { all: ['get-session'] },
    { all: ['forget-password'] },
    { all: ['reset-password'] },
    { all: ['change-password'] },
    { all: ['update-user'] },
    { all: ['delete-user'] },
    { all: ['link-social'] },
    { all: ['list-accounts'] },
    { all: ['callback', 'oauth2'] },
    { all: ['error'] },
    { all: ['revoke-sessions'] },
    { all: ['revoke-other-sessions'] },
    { all: ['update-email'] },
    { all: ['change-email'] },
    { all: ['verify-email'] },
  ];
}

let handlers: ReturnType<typeof toNextJsHandler>;

export async function GET(request: Request) {
  try {
    if (!handlers) handlers = toNextJsHandler(auth);
    return handlers.GET(request);
  } catch {
    return new Response('Auth unavailable', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!handlers) handlers = toNextJsHandler(auth);
    return handlers.POST(request);
  } catch {
    return new Response('Auth unavailable', { status: 500 });
  }
}
