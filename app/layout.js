import './globals.css';
import '../src/index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Neera Sarees - Authentic Indian Silk & Designer Sarees Online',
  description: 'Shop premium silk, cotton, and designer sarees. Authentic quality, 137+ styles, free shipping across India. Traditional elegance delivered.',
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

