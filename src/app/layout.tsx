import { Metadata } from 'next';
import pkg from '../../package.json';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import Header from '../components/Header';

const dumbPath = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN + dumbPath),
  manifest: `${dumbPath}/manifest.webmanifest`,
  robots: `${dumbPath}/robots.txt`,

  icons: {
    icon: {
      rel: 'icon',
      url: `${dumbPath}/logo192.png`,
    },
    apple: `${dumbPath}/apple-icon.png`,
  },

  applicationName: 'FART',
  title: 'FART - Fast Auto-Refresher Tool for dragcave.net',
  description: 'Hatch and grow your dragons faster.',
  keywords: ['FART', 'dragcave', 'dragcave.net', 'auto-refresher', 'ar'],
  creator: 'eden chazard',

  openGraph: {
    description: 'Hatch and grow your dragons faster.',
    title: 'FART - Fast Auto-Refresher Tool for dragcave.net',
    type: 'website',
  }
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen font-sans font-normal font-base">
          <div className="min-h-screen App rounded-lg shadow-lg bg-slate-900 max-w-2xl mx-auto text-white flex flex-col">
            <Header />
            <main className="flex-1 mt-1 p-0 flex flex-col gap-3 [&>section:not(#add-dragon)]:m-2 minsz:px-3">
              {children}
            </main>
            <footer className="text-center my-4">
              v{pkg.version} &copy; eden chazard
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

export const viewport = {
  colorScheme: 'light',
  themeColor: '#1e293b'
};
