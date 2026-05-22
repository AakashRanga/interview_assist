import React from 'react';
interface Props {
  className?: string;
  color?: string;
}
/**
 * Virtusa 4-point sparkle star logo
 */
export function VirtusaLogo({
  className = 'w-6 h-6',
  color = '#02f576'
}: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      
      <path
        d="M50 0 C 50 35, 65 50, 100 50 C 65 50, 50 65, 50 100 C 50 65, 35 50, 0 50 C 35 50, 50 35, 50 0 Z"
        fill={color} />
      
    </svg>);

}