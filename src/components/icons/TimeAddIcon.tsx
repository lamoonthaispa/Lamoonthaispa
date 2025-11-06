"use client";
import React from 'react';
import Image from 'next/image';

interface TimeAddIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function TimeAddIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Time add icon',
  onClick
}: TimeAddIconProps) {
  return (
    <Image
      src="/icons/time-add.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}

