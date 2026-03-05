import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tietokantaohjelmointi',
  password: 'rcx492',
  port: 5433,
})

export default pool