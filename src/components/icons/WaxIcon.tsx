"use client";
import React from 'react';
import Image from 'next/image';

interface WaxIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function WaxIcon({ 
  width = 83, 
  height = 83, 
  className = '', 
  alt = 'Wax icon',
  onClick
}: WaxIconProps) {
  return (
    <Image
      src="/icons/wax.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}