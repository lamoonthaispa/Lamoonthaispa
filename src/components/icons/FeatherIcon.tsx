"use client";
import React from 'react';
import Image from 'next/image';

interface FeatherIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function FeatherIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Feather icon',
  onClick
}: FeatherIconProps) {
  return (
    <Image
      src="/icons/feather.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}

