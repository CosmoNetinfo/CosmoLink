import { ImageResponse } from '@vercel/og';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url')
    .eq('username', username)
    .single();

  if (!profile) {
    return new Response('User not found', { status: 404 });
  }

  const displayName = profile.display_name || profile.username;
  const bio = profile.bio
    ? profile.bio.length > 120
      ? profile.bio.substring(0, 117) + '...'
      : profile.bio
    : null;
  const initial = displayName[0]?.toUpperCase() || '?';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0015 0%, #050508 40%, #001a1f 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Purple glow top-left */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Cyan glow bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Stars effect */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '180px',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            boxShadow: '120px 40px 0 rgba(255,255,255,0.3), 300px 120px 0 rgba(255,255,255,0.4), 80px 200px 0 rgba(255,255,255,0.2), 450px 80px 0 rgba(255,255,255,0.5), 200px 350px 0 rgba(255,255,255,0.3), 500px 250px 0 rgba(255,255,255,0.2), 50px 400px 0 rgba(255,255,255,0.35)',
            display: 'flex',
          }}
        />

        {/* Content card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            borderRadius: '24px',
            background: 'rgba(22,22,34,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            maxWidth: '700px',
          }}
        >
          {/* Avatar */}
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              width={96}
              height={96}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #8b5cf6',
                boxShadow: '0 0 30px rgba(139,92,246,0.4)',
              }}
            />
          ) : (
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                border: '3px solid #8b5cf6',
                boxShadow: '0 0 30px rgba(139,92,246,0.4)',
              }}
            >
              {initial}
            </div>
          )}

          {/* Display name */}
          <div
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#fcfcfd',
              marginTop: '20px',
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            {displayName}
          </div>

          {/* Username */}
          <div
            style={{
              fontSize: '18px',
              color: 'rgba(175,175,182,0.8)',
              marginTop: '4px',
              display: 'flex',
            }}
          >
            @{profile.username}
          </div>

          {/* Bio */}
          {bio && (
            <div
              style={{
                fontSize: '16px',
                color: 'rgba(175,175,182,0.65)',
                marginTop: '16px',
                textAlign: 'center',
                maxWidth: '500px',
                lineHeight: '1.5',
                display: 'flex',
              }}
            >
              {bio}
            </div>
          )}
        </div>

        {/* CosmoLink branding footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              display: 'flex',
            }}
          >
            <span style={{ color: '#8b5cf6' }}>Cosmo</span>
            <span style={{ color: '#06b6d4' }}>Link</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
