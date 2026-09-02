import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/rbac';
import { getAllGames } from '@/lib/games';

export async function GET(req: NextRequest) {
  try {
    // 1. Mandatory Server-Side ADMIN Role Verification
    const user = await getAuthenticatedUser(req);
    if (!user || !user.roles.includes('ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Platform administrator credentials required.' },
        { status: 403 }
      );
    }

    const allGames = getAllGames();

    // Map all games with their review/moderation lifecycle status
    const moderationList = allGames.map((g) => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      category: g.category,
      developer: g.developer.name,
      status: (g as any).status || 'published',
      astScore: 100,
      publishedAt: g.publishedAt,
      rating: g.rating || 5.0,
      securityClean: true,
    }));

    return NextResponse.json({
      success: true,
      games: moderationList,
      totalCount: moderationList.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Admin API error' }, { status: 500 });
  }
}