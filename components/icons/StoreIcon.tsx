
import React from 'react';

export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M3 9.5l-2 13.5h22l-2-13.5H3z" />
        <path d="M3 5.5V4a2 2 0 012-2h14a2 2 0 012 2v1.5H3z" />
        <path d="M12 18H7" />
        <path d="M12 14h5" />
    </svg>
);
