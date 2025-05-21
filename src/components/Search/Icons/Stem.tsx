
import React from 'react';

const Stem = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 9.5c1.93 0 3.5-1.57 3.5-3.5S13.93 2.5 12 2.5 8.5 4.07 8.5 6s1.57 3.5 3.5 3.5Z" />
    <path d="M12 22c-4.5 0-8-1.34-8-3v7.73c.61-.6 2.54-1.17 4.9-1.5" />
    <path d="M20 13.8c-1.1-.1-2.4-.09-4 .27" />
    <path d="M8 10.2c1.1-.1 2.4-.09 4 .27" />
    <path d="M12 9.5V22" />
    <path d="m17 13-5 9" />
    <path d="m7 13 5 9" />
  </svg>
);

export default Stem;
