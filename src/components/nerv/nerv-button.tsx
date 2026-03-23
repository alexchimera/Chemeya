import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'danger'
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function NervButton({ children, variant = 'default', href, type = 'button', onClick, className, disabled }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    default: 'border border-border text-text-secondary hover:bg-bg-hover hover:text-text-primary',
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-sm',
    danger: 'border border-red/30 text-red hover:bg-red-light',
  }
  const cls = `${base} ${variants[variant]} ${className || ''}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return <button type={type} onClick={onClick} className={cls} disabled={disabled}>{children}</button>
}
