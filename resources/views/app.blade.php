<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Md. Abdul Aziz Samrat — Software Engineer, PHP & Laravel Developer" />
    <title>Md. Abdul Aziz Samrat | Software Engineer</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.tsx'])
  </head>
  <body class="bg-slate-950 text-slate-200 antialiased">
    <div id="root"></div>
  </body>
</html>
