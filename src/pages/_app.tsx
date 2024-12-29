import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getListFromString } from '../utils/functions';
import Layout from '../app/layout';

interface Props {
  params: { list?: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ searchParams }: Props) {
  let meta: Metadata = {};

  if (searchParams.list !== undefined) {
    const list = getListFromString(searchParams.list as string);

    if (Array.isArray(list)) {
      const title = 'FART - Fast Auto-Refresher Tool for dragcave.net';
      const description = `My dragons need FARTing! Help them here.`;
      meta = {
        title: title,
        description: description,
        openGraph: {
          siteName: 'FART',
          title: title,
          description: description,
          images: [
            {
              url: `https://dragcave.net/ogimage/${list[0].code}`,
            },
          ],
        },
      };
      return {
        title: meta.title,
        description: meta.description,
        openGraph: { ...meta.openGraph },
      };
    }
  }
}

/* 
export default function Page() {
  const FartPanel = dynamic(
    async () => await import('../components/FartPanel'),
    { ssr: false },
  );
  return <FartPanel />;
} */

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider
      session={session}
      basePath={process.env.NEXT_PUBLIC_BASE_URL}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
