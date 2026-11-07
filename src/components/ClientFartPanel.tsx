'use client';

import dynamic from 'next/dynamic';

const FartPanel = dynamic(() => import('./FartPanel'), { ssr: false });

export default function ClientFartPanel() {
  return <FartPanel />;
}
