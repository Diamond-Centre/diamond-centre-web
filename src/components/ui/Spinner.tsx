/**
 * Composant spinner de chargement
 */
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'small' | 'medium' | 'large' | string;
}

export default function Spinner({ size = 'medium', className, ...props }: SpinnerProps) {
  const sizes: Record<string, string> = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className={cn('inline-block', className)} {...props}>
      <div className={cn(
        'animate-spin rounded-full border-b-2 border-current',
        sizes[size]
      )} />
    </div>
  )
}