import { createContext, useContext, useState } from 'react'

const translations = {
  en: {
    nav: { product: 'Product', pricing: 'Pricing', docs: 'Docs', status: 'Status', about: 'About', changelog: 'Changelog' },
    hero: { badge: 'Now with multi-region monitoring', title1: 'Know when it\'s down.', title2: 'Before your users do.', subtitle: 'StatusMy monitors your websites, APIs, and services 24/7. Get instant alerts when something goes wrong and beautiful status pages your customers will love.', cta: 'Start Monitoring Free', docs: 'View Documentation' },
    stats: { monitors: 'Monitors', uptime: 'Uptime SLA', countries: 'Countries' },
    dashboard: { title: 'Dashboard', monitors: 'Monitors', up: 'Up', down: 'Down', avgResponse: 'Avg Response', addMonitor: 'Add Monitor', incidents: 'Incidents', alerts: 'Alerts', reports: 'Reports', settings: 'Settings' },
    common: { signIn: 'Sign In', signUp: 'Sign Up', startFree: 'Start Free', loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', back: 'Back' },
  },
  ms: {
    nav: { product: 'Produk', pricing: 'Harga', docs: 'Dokumentasi', status: 'Status', about: 'Tentang', changelog: 'Log Perubahan' },
    hero: { badge: 'Kini dengan pemantauan pelbagai wilayah', title1: 'Tahu bila ia down.', title2: 'Sebelum pengguna anda tahu.', subtitle: 'StatusMy memantau laman web, API, dan perkhidmatan anda 24/7. Dapatkan amaran segera apabila sesuatu tidak kena dan halaman status yang cantik untuk pelanggan anda.', cta: 'Mula Pantau Percuma', docs: 'Lihat Dokumentasi' },
    stats: { monitors: 'Pemantau', uptime: 'SLA Uptime', countries: 'Negara' },
    dashboard: { title: 'Papan Pemuka', monitors: 'Pemantau', up: 'Aktif', down: 'Tidak Aktif', avgResponse: 'Purata Respons', addMonitor: 'Tambah Pemantau', incidents: 'Insiden', alerts: 'Amaran', reports: 'Laporan', settings: 'Tetapan' },
    common: { signIn: 'Log Masuk', signUp: 'Daftar', startFree: 'Mula Percuma', loading: 'Memuatkan...', save: 'Simpan', cancel: 'Batal', delete: 'Padam', edit: 'Sunting', back: 'Kembali' },
  },
}

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('statusmy-locale') || 'en'
  })

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[locale]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  const changeLocale = (newLocale) => {
    setLocale(newLocale)
    localStorage.setItem('statusmy-locale', newLocale)
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, locales: Object.keys(translations) }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
