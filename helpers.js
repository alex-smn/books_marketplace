const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'books',
    password: 'kofkof12',
    port: 5432,
})

const userRoles = { 'buyer': 0, 'seller': 1, 'buyerAndSeller': 2 }
const requestStatuses = {'pending': 'pending', 'approved': 'approved', 'declined': 'declined'}

const userWithToken = async (token) =>
    new Promise((resolve, reject) => {
        return pool.query('SELECT * FROM users WHERE token = $1', [token], (error, results) => {
            if (error) {
                reject(error)
            }
            if (results.rows.length > 1) {
                reject(new Error(`Found multiple users with token ${token}`))
            }
            let user = results.rows[0]
            return resolve(user)
        })
    })


module.exports = {
    userWithToken,
    userRoles,
    requestStatuses,
    pool
}
