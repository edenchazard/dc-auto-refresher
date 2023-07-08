import dynamic from 'next/dynamic';
import { getListFromString } from './functions';

type Props = {
  params: { list?: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props) {
  let meta: any  = {};
  if (searchParams.list) {
    const list = getListFromString(searchParams.list as string);

    if (Array.isArray(list)) {
      meta = {
        title: 'FART - Fast Auto-Refresher Tool for dragcave.net',
        description: `My dragons need FARTing! Help them here.`,
        images: [{
          url:  `https://dragcave.net/ogimage/${list[0].code}`
        }]
      };
      return {
        title: meta.title,
        description: meta.description,
        openGraph: { ...meta },
      };
    }
  }
}

export default function Page(){
  const FartPanel = dynamic(() => import('../components/FartPanel'), { ssr: false });
  return <><FartPanel /></>
}
