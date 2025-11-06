"use client";
import React from 'react';
import Image from 'next/image';

interface SkincareIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function SkincareIcon({ 
  width = 84, 
  height = 106, 
  className = '', 
  alt = 'Skincare icon',
  onClick
}: SkincareIconProps) {
  return (
    <Image
      src="/icons/skincare.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}

