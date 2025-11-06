"use client";
import React from 'react';
import Image from 'next/image';

interface WaterDropIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function WaterDropIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Water drop icon',
  onClick
}: WaterDropIconProps) {
  return (
    <Image
      src="/icons/water-drop.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}