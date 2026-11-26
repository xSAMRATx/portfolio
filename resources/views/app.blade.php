<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>{{ $metaTitle }}</title>
    <meta name="description" content="{{ $metaDescription }}" />
    <meta name="author" content="{{ $metaName }}" />
    @if ($noIndex)
      <meta name="robots" content="noindex, nofollow" />
    @else
      <link rel="canonical" href="{{ $canonical }}" />
    @endif

    {{-- Social previews (Open Graph + Twitter) --}}
    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="{{ $metaName }}" />
    <meta property="og:title" content="{{ $metaTitle }}" />
    <meta property="og:description" content="{{ $metaDescription }}" />
    <meta property="og:url" content="{{ $canonical }}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="{{ $metaTitle }}" />
    <meta name="twitter:description" content="{{ $metaDescription }}" />

    <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0b1020" media="(prefers-color-scheme: dark)" />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    {{-- Apply the saved (or system) theme before the first paint, so there is no light/dark flash. --}}
    <script>
      (function () {
        try {
          var saved = localStorage.getItem('portfolio_theme');
          var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', dark);
        } catch (e) {}
      })();
    </script>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.tsx'])
  </head>
  <body>
    <noscript>
      <p>{{ $metaTitle }} — please enable JavaScript to view this site.</p>
    </noscript>
    <div id="root"></div>
  </body>
</html>
