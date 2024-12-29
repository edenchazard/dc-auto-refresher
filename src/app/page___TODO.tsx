import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getListFromString } from '../utils/functions';
interface Props {
  params: { list?: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function Page() {
  const FartPanel = dynamic(
    async () => await import('../components/FartPanel'),
    { ssr: false },
  );
  return <FartPanel />;
}
