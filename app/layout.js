import './globals.css';
import '../src/index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Neera Sarees - Handwoven Sarees',
  description: 'Discover elegant handwoven sarees crafted with tradition and quality.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

