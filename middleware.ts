import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/',
    '/movie/:path*',
    '/show/:path*',
  ],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let url = request.nextUrl.clone();

  // @ts-expect-error
  const watchlistPattern = new URLPattern({
    pathname: '/:type(movie|show)/:slug',
    search: 'wl=1',
  });
  const watchlistResult = watchlistPattern.exec(url);
  const watchlistGroups = watchlistResult?.pathname?.groups;
    
  if (watchlistGroups != null) {
    const slug = watchlistGroups.slug;
    
    if (slug) {
      return NextResponse.redirect(
        `https://app.plex.tv/desktop#!/provider/tv.plex.provider.metadata/details?key=${encodeURIComponent(
          '/library/metadata/' + slug
        )}&wl=1`
      );
    }
  }

  return NextResponse.next();
}