"use client";
import React from 'react';
import Image from 'next/image';

interface MakeUpBrushesIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function MakeUpBrushesIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Make up brushes icon',
  onClick
}: MakeUpBrushesIconProps) {
  return (
    <Image
      src="/icons/make-up-brushes-for-blush-and-lipstick.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}

