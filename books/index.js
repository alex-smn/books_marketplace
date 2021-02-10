const { userWithToken, userRoles, pool } = require('../helpers')

async function createBook(request, response) {
    const { book_name: bookName, user: { token } } = request.body
    const user = await userWithToken(token)

    if (user) {
        const { id, accessLevel } = user
        if (accessLevel == userRoles.seller || accessLevel == userRoles.buyerAndSeller) {
            pool.query('INSERT INTO books (name, seller_id) VALUES ($1, $2) RETURNING id', [bookName, id], (error, results) => {
                if (error) {
                    throw error
                }
                response.status(201).json({ info: `Book added with ID: ${results.rows[0].id}` })
            })
        } else {
            response.status(403).json({ info: 'User has incorrect access level'})
        }
    } else {
        response.status(404).json({ info: 'User not found' })
    }
}

async function requestBook(request, response) {
    const { book_id: bookId, user: { token } } = request.body
    const user = await userWithToken(token)

    if (user) {
        const { id, accessLevel } = user
        if (accessLevel == userRoles.buyer || accessLevel == userRoles.buyerAndSeller) {
            pool.query('INSERT INTO requests (book_id, buyer_id, status) VALUES ($1, $2, $3) RETURNING id',
                [bookId, id, requestStatuses.pending],
                (error, results) => {
                    if (error) {
                        throw error
                    }
                    response.status(201).json({ info: `Request added with ID: ${results.rows[0].id} for book_id: ${bookId} from buyer: ${id}` })
                })
        } else {
            response.status(403).json({ info: 'User has incorrect access level'})
        }
    } else {
        response.status(404).json({ info: 'User not found' })
    }
}

module.exports = {
    createBook,
    requestBook
}
