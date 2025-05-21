
import React from 'react';

const Wheelchair = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="14" cy="6" r="2" />
    <path d="M10 9h4l-4 7a4 4 0 0 0 4 4h4" />
    <path d="M7 9h2" />
    <path d="M17 6h2" />
    <path d="M11 6h-3a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h6" />
  </svg>
);

export default Wheelchair;
