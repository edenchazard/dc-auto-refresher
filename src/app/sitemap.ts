import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://chazza.me' + process.env.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date(),
    },
  ];
}
