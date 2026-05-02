export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
  return num.toString()
}
