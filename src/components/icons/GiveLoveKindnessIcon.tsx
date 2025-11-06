"use client";
import React from 'react';
import Image from 'next/image';

interface GiveLoveKindnessIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function GiveLoveKindnessIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Give love kindness icon',
  onClick
}: GiveLoveKindnessIconProps) {
  return (
    <Image
      src="/icons/give-love-kindness.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}

