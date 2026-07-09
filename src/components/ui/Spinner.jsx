/**
 * Composant spinner de chargement
 */
import { cn } from '@/lib/utils'

export default function Spinner({ size = 'medium', className }) {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  return (
    <div className={cn('inline-block', className)}>
      <div className={cn(
        'animate-spin rounded-full border-b-2 border-current',
        sizes[size]
      )} />
    </div>
  )
}