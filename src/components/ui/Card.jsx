/**
 * Composant carte réutilisable
 * Variantes : default, hover, elevated
 */
import { cn } from '@/lib/utils'

export default function Card({ 
  children, 
  variant = 'default',
  className,
  onClick,
  ...props 
}) {
  const variants = {
    default: 'bg-white rounded-xl shadow-lg',
    hover: 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300',
    elevated: 'bg-white rounded-xl shadow-2xl',
    ghost: 'bg-transparent rounded-xl'
  }

  return (
    <div 
      className={cn(variants[variant], 'overflow-hidden', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}