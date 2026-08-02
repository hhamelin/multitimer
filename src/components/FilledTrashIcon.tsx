import React from 'react';

interface FilledTrashIconProps {
  size?: number;
  className?: string;
}

export const FilledTrashIcon: React.FC<FilledTrashIconProps> = ({
  size = 18,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <mask id="lucide-trash-slat-mask">
        <rect x="0" y="0" width="24" height="24" fill="#ffffff" stroke="none" />
        <line x1="10" y1="11" x2="10" y2="17" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="11" x2="14" y2="17" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      </mask>

      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        mask="url(#lucide-trash-slat-mask)"
      />
    </svg>
  );
};
