import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Sign in required.' },
        { status: 401 }
      );
    }

    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId parameter' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_game_saves')
      .select('*')
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      save: data?.save_data || null,
      updatedAt: data?.updated_at || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
