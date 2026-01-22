import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-serif text-lg mb-4">NEERA SAREES</h3>
            <p className="text-sm">
              Handwoven sarees crafted with tradition and elegance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-lotus-gold transition-colors">All Sarees</Link></li>
              <li><Link href="/story" className="hover:text-lotus-gold transition-colors">Our Story</Link></li>
              <li><Link href="/contact-us" className="hover:text-lotus-gold transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shipping-policy" className="hover:text-lotus-gold transition-colors">Shipping Policy</Link></li>
              <li><Link href="/refund-and-exchange-policy" className="hover:text-lotus-gold transition-colors">Refund & Exchange</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-lotus-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-lotus-gold transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h4>
            <p className="text-sm">
              Email: hello@neerasarees.com<br />
              Phone: +91 XXX XXX XXXX
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Neera Sarees. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
