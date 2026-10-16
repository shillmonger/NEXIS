import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirect_uri = searchParams.get('redirect_uri') || process.env.DISCORD_CALLBACK_URL!;

  const discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    redirect_uri,
    response_type: 'code',
    scope: 'identify email',
  });

  return NextResponse.redirect(`${discordAuthUrl}?${params.toString()}`);
}
