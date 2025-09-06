
import React from 'react';

export const PlugIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M12 22v-5"></path>
        <path d="M9 8V2"></path>
        <path d="M15 8V2"></path>
        <path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"></path>
        <path d="M6 8H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"></path>
        <path d="M18 17h-5a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h5"></path>
    </svg>
);
