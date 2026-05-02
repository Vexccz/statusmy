import { useI18n } from '../context/I18nContext'

export default function LocaleSwitcher({ className = '' }) {
  const { locale, changeLocale } = useI18n()

  return (
    <button
      onClick={() => changeLocale(locale === 'en' ? 'ms' : 'en')}
      className={`px-3 py-2 rounded-lg bg-card border border-border text-caption font-medium text-text-secondary hover:text-text-primary hover:border-brand/30 transition-all ${className}`}
      aria-label="Switch language"
    >
      {locale === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
    </button>
  )
}
