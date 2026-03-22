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
  const base = 'inline-flex items-center justify-center px-4 py-1.5 text-[11px] uppercase tracking-[0.1em] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    default: 'border border-cyan text-lime hover:bg-cyan/10 hover:shadow-[0_0_6px_rgba(0,212,170,0.2)]',
    primary: 'bg-lime text-bg-void hover:bg-lime/90 hover:shadow-[0_0_8px_rgba(170,238,34,0.25)]',
    danger: 'border border-red text-red hover:bg-red/10 hover:shadow-[0_0_6px_rgba(212,42,42,0.2)]',
  }
  const cls = `${base} ${variants[variant]} ${className || ''}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return <button type={type} onClick={onClick} className={cls} disabled={disabled}>{children}</button>
}
