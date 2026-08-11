/**
 * Composant conteneur responsive
 */
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full' | string;
}

export default function Container({ 
  children, 
  className,
  maxWidth = '7xl',
  ...props 
}: ContainerProps) {
  const maxWidths: Record<string, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div 
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        maxWidths[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}