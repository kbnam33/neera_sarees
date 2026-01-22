'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with React Router
const StoryPage = dynamic(() => import('../../src/StoryPage.jsx'), { ssr: false });

export default function Story() {
  return <StoryPage />;
}

