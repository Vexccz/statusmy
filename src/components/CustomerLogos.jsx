import { motion } from 'framer-motion'

const companies = [
  'Grab', 'Petronas', 'AirAsia', 'Maybank', 'CIMB', 'Axiata',
  'Carsome', 'Fave', 'StoreHub', 'Aerodyne', 'GoGet', 'Luno',
]

function LogoRow({ direction = 'left' }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
  
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={`flex gap-12 items-center ${animationClass}`}>
        {[...companies, ...companies].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-xl md:text-2xl font-bold text-text-muted/40 whitespace-nowrap hover:text-text-primary/60 transition-colors duration-200"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CustomerLogos() {
  return (
    <section className="relative py-[48px] md:py-[64px] overflow-hidden">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-caption uppercase tracking-widest text-text-muted mb-8"
        >
          Trusted by Malaysia's leading companies
        </motion.p>
      </div>
      <LogoRow direction="left" />
    </section>
  )
}
