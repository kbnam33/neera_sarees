import './globals.css';
import '../src/index.css';
import Header from '../components/Header';
import dynamic from 'next/dynamic';
import { Lato } from 'next/font/google';

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
});

// Lazy load Footer since it's below the fold
const Footer = dynamic(() => import('../components/Footer'), {
  loading: () => <div className="h-64 bg-brand-dark"></div>,
});

export const metadata = {
  title: 'Neera Sarees – Cotton & Linen Sarees for Working Women | Shop Online India',
  description: "Shop Neera's handpicked collection of Mulmul cotton, linen, and Chettinad sarees designed for working women. Breathable, office-ready, and elegant. Free shipping across India.",
  keywords: ['cotton sarees for working women', 'linen sarees for office', 'mulmul cotton sarees', 'chettinad cotton sarees', 'office wear sarees', 'neera sarees', 'handloom sarees India'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Neera Sarees – Cotton & Linen Sarees for Working Women',
    description: 'Mulmul, Linen, and Chettinad sarees designed for the working woman. Breathable, elegant, office-ready. Free shipping across India.',
    url: 'https://neera.store',
    images: [{ url: 'https://neera.store/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neera Sarees – Cotton & Linen Sarees for Working Women',
    description: 'Shop Mulmul, Linen, Chettinad sarees for working women. Office-ready, breathable, free shipping.',
    images: ['https://neera.store/og-image.jpg'],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Neera Sarees',
  url: 'https://neera.store',
  logo: 'https://neera.store/logo.png',
  description: 'Neera Sarees specialises in cotton and linen sarees for working women – Mulmul, Chettinad, and Linen office wear sarees with free shipping across India.',
  sameAs: ['https://www.instagram.com/neeradrapes/'],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Neera Sarees',
  url: 'https://neera.store',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://neera.store/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

