"use client";
import React from 'react';
import Image from 'next/image';

interface RelaxingProcedureIconProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

export default function RelaxingProcedureIcon({ 
  width = 82, 
  height = 82, 
  className = '', 
  alt = 'Relaxing procedure icon',
  onClick
}: RelaxingProcedureIconProps) {
  return (
    <Image
      src="/icons/relaxing-procedure.svg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      onClick={onClick}
    />
  );
}