/**
 * Composant bouton réutilisable
 * Variantes : primary, secondary, outline, glass
 * Tailles : small, medium, large
 */
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import Spinner from './Spinner'

const Button = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  // Styles par variante
  const variants = {
    primary: 'bg-dice-blue text-white hover:bg-dice-blue-dark focus:ring-dice-blue',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    glass: 'glass glass-hover text-white border border-white/20 hover:border-white/40',
    outline: 'bg-transparent border-2 border-dice-blue text-dice-blue hover:bg-dice-blue/10 focus:ring-dice-blue',
    outlineWhite: 'bg-transparent border-2 border-white text-white hover:bg-white/10 focus:ring-white',
  }

  // Styles par taille
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="small" className="mr-2" />
          Chargement...
        </>
      ) : children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button