import { Metadata } from 'next';
import { getListFromString } from '../utils/functions';
import ClientFartPanel from '../components/ClientFartPanel';
interface Props {
  params: Promise<{ list?: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(props: Props) {
  const searchParams = await props.searchParams;
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

export default function Page() {
  return <ClientFartPanel />;
}
