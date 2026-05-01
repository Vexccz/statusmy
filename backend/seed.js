import './config/db.js'
import User from './models/User.js'

const existing = User.findByEmail('zafran@demo.com')
if (existing) {
  console.log('User already exists:', existing.email)
  process.exit(0)
}

const user = await User.create({ name: 'Zafran', email: 'zafran@demo.com', password: 'demo1234' })
console.log('Created user:', user.email, user.id)
process.exit(0)
