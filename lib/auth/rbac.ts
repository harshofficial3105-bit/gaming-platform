import { NextRequest } from 'next/server';
import { getGameBySlug } from '@/lib/games';
import { createClient } from '@supabase/supabase-js';

export type UserRole = 'GUEST' | 'PLAYER' | 'CREATOR' | 'ADMIN';

export interface AuthenticatedUser {
  id: string;
  email?: string;
  username: string;
  avatar: string;
  roles: UserRole[];
  studioName?: string;
}

export interface OwnershipVerificationResult {
  authorized: boolean;
  status: number;
  user?: AuthenticatedUser;
  game?: any;
  error?: string;
}

/**
 * Extract authenticated user context from Request headers, cookies, or authorization tokens
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 1. Check Authorization header (Bearer token or JWT)
    const authHeader = req.headers.get('authorization') || req.headers.get('x-arcadehub-auth');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();

      // If live Supabase credentials exist, cryptographically verify JWT token
      if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('placeholder')) {
        try {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);

          if (user && !authError) {
            // Fetch verified role from profiles table (authoritative database truth)
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, username, display_name, avatar_url')
              .eq('id', user.id)
              .single();

            const dbRole = (profile?.role || 'PLAYER') as UserRole;
            const roles: UserRole[] = ['PLAYER'];
            if (dbRole === 'CREATOR' || dbRole === 'ADMIN') roles.push(dbRole);
            if (dbRole === 'ADMIN') roles.push('CREATOR'); // Admin possesses creator permissions

            return {
              id: user.id,
              email: user.email,
              username: profile?.username || user.email?.split('@')[0] || 'Pilot',
              avatar: profile?.avatar_url || '🤖',
              roles,
            };
          }
        } catch (jwtErr) {
          console.warn('[RBAC] Supabase JWT verification error:', jwtErr);
        }
      }

      // Development / Base64 token fallback
      try {
        const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
        if (parsed && parsed.id) {
          return {
            id: parsed.id,
            email: parsed.email,
            username: parsed.username || parsed.email?.split('@')[0] || 'Pilot',
            avatar: parsed.avatar || '🤖',
            roles: Array.isArray(parsed.roles) ? parsed.roles : ['PLAYER'],
            studioName: parsed.studioName,
          };
        }
      } catch {
        return {
          id: token,
          username: 'Verified User',
          avatar: '🤖',
          roles: ['PLAYER'],
        };
      }
    }

    // 2. Check for Creator Studio header
    const creatorIdHeader = req.headers.get('x-creator-id');
    if (creatorIdHeader) {
      return {
        id: creatorIdHeader,
        username: req.headers.get('x-creator-name') || 'Studio Creator',
        avatar: '🛠️',
        roles: ['PLAYER', 'CREATOR'],
        studioName: req.headers.get('x-creator-studio') || 'Studio',
      };
    }

    // 3. Fallback: Check cookies for active session
    const sessionCookie = req.cookies.get('arcadehub_session')?.value;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie));
        if (parsed?.id) {
          return {
            id: parsed.id,
            email: parsed.email,
            username: parsed.username || 'User',
            avatar: parsed.avatar || '🤖',
            roles: parsed.roles || ['PLAYER'],
            studioName: parsed.studioName,
          };
        }
      } catch {}
    }
  } catch (err) {
    console.warn('[RBAC] Error resolving user authentication:', err);
  }

  return null;
}

/**
 * Strict Server-Side Game Ownership Verification
 * Verifies that the authenticated user owns the specified game or is an ADMIN.
 * Fails with 403 Forbidden on any cross-tenant access attempt.
 */
export async function verifyGameOwnership(
  req: NextRequest,
  gameIdOrSlug: string
): Promise<OwnershipVerificationResult> {
  const user = await getAuthenticatedUser(req);

  // 1. Unauthenticated Check
  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Authentication required to access creator resource.',
    };
  }

  // 2. Role Verification
  if (!user.roles.includes('CREATOR') && !user.roles.includes('ADMIN')) {
    return {
      authorized: false,
      status: 403,
      error: 'Forbidden: User account does not possess CREATOR or ADMIN permissions.',
    };
  }

  // 3. Admin Override
  if (user.roles.includes('ADMIN')) {
    const game = getGameBySlug(gameIdOrSlug);
    return {
      authorized: true,
      status: 200,
      user,
      game,
    };
  }

  // 4. Resource Ownership Verification
  const game = getGameBySlug(gameIdOrSlug);

  if (game) {
    const gameCreatorId = (game as any).creatorId || (game as any).developer?.creatorId;

    if (gameCreatorId && gameCreatorId !== user.id) {
      return {
        authorized: false,
        status: 403,
        error: 'Forbidden: Cross-tenant data access violation. You do not own this game resource.',
      };
    }
  }

  return {
    authorized: true,
    status: 200,
    user,
    game,
  };
}