import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. Sign in required for cloud saving.' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 });
    }

    const body = await req.json();
    const { gameId, saveData, version = '1.0' } = body;

    if (!gameId || !saveData || typeof saveData !== 'object') {
      return NextResponse.json({ error: 'Invalid save payload' }, { status: 400 });
    }

    // Fetch existing cloud save to enforce monotonic high score
    const { data: existing } = await supabase
      .from('user_game_saves')
      .select('save_data')
      .eq('user_id', user.id)
      .eq('game_id', gameId)
      .single();

    const existingHigh = typeof existing?.save_data?.highScore === 'number' ? existing.save_data.highScore : 0;
    const incomingHigh = typeof saveData.highScore === 'number' ? saveData.highScore : 0;
    const mergedHighScore = Math.max(existingHigh, incomingHigh);

    const mergedSaveData = {
      ...(existing?.save_data || {}),
      ...saveData,
      highScore: mergedHighScore,
    };

    // Upsert cloud save
    const { data, error } = await supabase
      .from('user_game_saves')
      .upsert(
        {
          user_id: user.id,
          game_id: gameId,
          save_data: mergedSaveData,
          version,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,game_id' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, save: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
