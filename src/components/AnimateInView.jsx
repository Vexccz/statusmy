import { motion, useReducedMotion } from 'framer-motion'

/**
 * Wrapper component that animates children into view on scroll.
 * Respects prefers-reduced-motion.
 */
export default function AnimateInView({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  y = 30,
  once = true,
  margin = '-80px',
  as = 'div',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] || motion.div

  if (prefersReducedMotion) {
    const Tag = as
    return <Tag className={className} {...props}>{children}</Tag>
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Container that staggers its children's animations.
 */
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.08,
  once = true,
  margin = '-50px',
  as = 'div',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] || motion.div

  if (prefersReducedMotion) {
    const Tag = as
    return <Tag className={className} {...props}>{children}</Tag>
  }

  return (
    <Component
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}

/**
 * Child item for StaggerContainer.
 */
export function StaggerItem({
  children,
  className = '',
  y = 30,
  duration = 0.5,
  as = 'div',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const Component = motion[as] || motion.div

  if (prefersReducedMotion) {
    const Tag = as
    return <Tag className={className} {...props}>{children}</Tag>
  }

  return (
    <Component
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  )
}
