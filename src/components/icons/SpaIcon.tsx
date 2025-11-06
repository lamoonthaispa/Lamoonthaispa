"use client";
import React from 'react';
import Image from 'next/image';

interface SpaIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function SpaIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Spa icon',
  onClick
}: SpaIconProps) {
  return (
    <Image
      src="/icons/spa.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}