import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  intensity = 'medium',
  ...props 
}) => {
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    heavy: 'bg-white/20 backdrop-blur-lg border-white/30'
  };

  return (
    <motion.div
      className={clsx(
        'rounded-2xl border shadow-2xl',
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};