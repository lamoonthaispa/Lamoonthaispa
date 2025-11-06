"use client";
import React from 'react';
import Image from 'next/image';

interface MeditationIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function MeditationIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Meditation icon',
  onClick
}: MeditationIconProps) {
  return (
    <Image
      src="/icons/meditation.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}