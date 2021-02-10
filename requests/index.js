const { userWithToken, userRoles, pool } = require('../helpers')

async function respondToRequest(request, response) {
    const { request_id: requestId, response_status: status, user: { token } } = request.body

    const user = await userWithToken(token)

    if (user) {
        const { id, accessLevel } = user
        if (accessLevel == userRoles.seller || accessLevel == userRoles.buyerAndSeller) {
            pool.query('SELECT * FROM requests WHERE id = $1', [requestId], (error, results) => {
                if (error) {
                    throw error
                }
                // TODO: do we need to handle error with non-unique id?
                const request = results.rows[0]

                if (request) {
                    const { book_id: bookId } = request
                    pool.query('SELECT * FROM books WHERE id = $1', [bookId], (error, results) => {
                        if (error) {
                            throw error
                        }
                        const { seller_id: bookSellerId } = results.rows[0]
                        if (bookSellerId === id) {
                            pool.query(
                                'UPDATE requests SET status = $1 WHERE id = $2',
                                [status, requestId],
                                (error, results) => {
                                    if (error) {
                                        throw error
                                    }
                                    response.status(200).send(`Request modified with ID: ${requestId}, set status: ${status}`)
                                }
                            )
                        } else {
                            response.status(403).json({ info: 'Trying to modify request for another user\'s book'})
                        }
                    })
                } else {
                    response.status(404).json({ info: 'Request was not found' })
                }
            })
        } else {
            response.status(403).json({ info: 'User has incorrect access level'})
        }
    } else {
        response.status(404).json({ info: 'User not found' })
    }
}

module.exports = {
    respondToRequest
}
