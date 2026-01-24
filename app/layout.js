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
  title: 'Neera Sarees - Authentic Indian Silk & Designer Sarees Online',
  description: 'Shop premium silk, cotton, and designer sarees. Authentic quality, 137+ styles, free shipping across India. Traditional elegance delivered.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

