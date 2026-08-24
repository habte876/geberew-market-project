require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const sql = neon(process.env.DATABASE_URL)

async function main() {
    const result = await sql`SELECT NOW() as current_time`
    console.log('Connected! Server time is:', result[0].current_time)
}

main().catch((err) => {
   console.error('Connection failed:', err)
})