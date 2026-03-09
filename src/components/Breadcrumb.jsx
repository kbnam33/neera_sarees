import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Navigation Component
 * Provides hierarchical navigation with semantic HTML and ARIA attributes
 * 
 * @param {Array} items - Array of breadcrumb items: [{ name, path }]
 */
const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-8 font-sans text-xs tracking-widest text-gray-500">
      <ol className="flex items-center flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link 
                    to={item.path} 
                    className="hover:text-black transition-colors"
                  >
                    {item.name}
                  </Link>
                  <span className="mx-2" aria-hidden="true">/</span>
                </>
              ) : (
                <span className="text-charcoal-gray" aria-current="page">
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
