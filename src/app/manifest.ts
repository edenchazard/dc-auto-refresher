import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: 'FART',
    name: 'FART - Fast Auto-Refresher Tool',
    description:
      "Auto-refreshing tool for dragcave.net that rapidly increases your dragon's views.",
    icons: [
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: '/logo192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/logo512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    start_url: '/',
    display: 'standalone',
    theme_color: '#1e293b',
    background_color: '#15202b',
  };
}
