'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const [printTypes, setPrintTypes] = useState([]);

  // Fetch print types on component mount
  useEffect(() => {
    async function fetchPrintTypes() {
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select('print_type');

        if (!error && products) {
          // Get unique print types
          const uniquePrints = [...new Set(
            products
              .map(p => p.print_type)
              .filter(pt => pt && pt !== '')
          )].sort();
          
          setPrintTypes(uniquePrints);
        }
      } catch (err) {
        console.error('Error fetching print types:', err);
      }
    }

    fetchPrintTypes();
  }, []);

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
            
            {/* Search by Print Dropdown */}
            <div className="relative">
              <button
                className="text-sm uppercase tracking-widest text-charcoal-gray hover:text-deep-maroon transition-colors flex items-center gap-1"
                onClick={() => setIsPrintDropdownOpen(!isPrintDropdownOpen)}
                onBlur={() => setTimeout(() => setIsPrintDropdownOpen(false), 200)}
              >
                By Print
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isPrintDropdownOpen && printTypes.length > 0 && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  {printTypes.map((printType) => {
                    const slug = printType.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <Link
                        key={printType}
                        href={`/prints/${slug}`}
                        className="block px-4 py-2 text-sm text-charcoal-gray hover:bg-soft-beige hover:text-deep-maroon transition-colors"
                        onClick={() => setIsPrintDropdownOpen(false)}
                      >
                        {printType}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            
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
            
            {/* Mobile Print Types */}
            {printTypes.length > 0 && (
              <div className="pl-4 space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">By Print:</p>
                {printTypes.map((printType) => {
                  const slug = printType.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={printType}
                      href={`/prints/${slug}`}
                      className="block text-base font-serif text-deep-maroon"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {printType}
                    </Link>
                  );
                })}
              </div>
            )}
            
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
