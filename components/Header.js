'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-soft-beige border-b border-gray-200">
      <div className="container mx-auto px-4">
        {/* Logo Bar */}
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-serif text-deep-maroon">NEERA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/products" 
              className="text-sm uppercase tracking-widest text-charcoal-gray hover:text-deep-maroon transition-colors"
            >
              All Sarees
            </Link>
            <Link 
              href="/categories/kota" 
              className="text-sm uppercase tracking-widest text-charcoal-gray hover:text-deep-maroon transition-colors"
            >
              Kota
            </Link>
            <Link 
              href="/categories/mangalgiri" 
              className="text-sm uppercase tracking-widest text-charcoal-gray hover:text-deep-maroon transition-colors"
            >
              Mangalgiri
            </Link>
            <Link 
              href="/story" 
              className="text-sm uppercase tracking-widest text-charcoal-gray hover:text-deep-maroon transition-colors"
            >
              Our Story
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-charcoal-gray hover:text-deep-maroon">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-charcoal-gray"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-soft-beige border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              href="/products" 
              className="text-lg font-serif text-deep-maroon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Sarees
            </Link>
            <Link 
              href="/categories/kota" 
              className="text-lg font-serif text-deep-maroon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kota
            </Link>
            <Link 
              href="/categories/mangalgiri" 
              className="text-lg font-serif text-deep-maroon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Mangalgiri
            </Link>
            <Link 
              href="/story" 
              className="text-lg font-serif text-deep-maroon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Story
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
