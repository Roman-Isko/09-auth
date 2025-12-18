import { NextResponse } from 'next/server';

const EXTERNAL = 'https://notehub-api.goit.study';

function copySetCookie(from: Response, to: NextResponse) {
  const cookies = from.headers.getSetCookie?.() ?? from.headers.get('set-cookie');
  if (!cookies) return;
  if (Array.isArray(cookies)) {
    for (const c of cookies) to.headers.append('Set-Cookie', c);
  } else {
    to.headers.set('Set-Cookie', cookies);
  }
}

export async function proxyJson(
  req: Request,
  path: string,
  init: RequestInit = {}
) {
  const url = EXTERNAL + path;
  const upstream = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init.headers || {}),
      // важливо: передати куки наверх, щоб аутентифіковані запити працювали
      cookie: req.headers.get('cookie') || '',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  const hasBody = upstream.status !== 204 && upstream.headers.get('content-type')?.includes('application/json');
  const data = hasBody ? await upstream.json().catch(() => undefined) : undefined;

  // Повертаємо відповідь і пробрасываемо Set-Cookie вниз до клієнта
  const res = NextResponse.json(data ?? null, { status: upstream.status });
  copySetCookie(upstream, res);
  return res;
}
