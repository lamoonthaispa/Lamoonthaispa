"use client";
import React from 'react';
import Image from 'next/image';

interface LeafIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function LeafIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Leaf icon',
  onClick
}: LeafIconProps) {
  return (
    <Image
      src="/icons/leaf.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}
