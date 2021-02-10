const { userWithToken, userRoles, requestStatuses, pool } = require('../helpers')
const XLSX = require('xlsx')

async function getXLSXReport(request, response) {
    const { token } = request.body.user
    const user = await userWithToken(token)
    if (user) {
        const { id, accessLevel } = user
        if (accessLevel == userRoles.seller || accessLevel == userRoles.buyerAndSeller) {

            const booksToBuyers = await new Promise((resolve, reject) => {
                pool.query('SELECT b.name as bookName, r.buyer_id as buyer FROM books b INNER JOIN requests r ON b.id = r.book_id AND r.status = $1 WHERE b.seller_id = $2', [requestStatuses.approved, id], (error, results) => {
                    if (error) {
                        reject(error)
                    }
                    return resolve(results.rows)
                })
            })

            const bookToRequestersMap = {}

            booksToBuyers.forEach( entry => {
                const { bookname, buyer } = entry
                if (!bookToRequestersMap[bookname]) {
                    bookToRequestersMap[bookname] = [buyer]
                } else {
                    bookToRequestersMap[bookname].push(buyer)
                }

            })

            const data = [['Book name', 'Users requested']];
            for (const [bookName, requesters] of Object.entries(bookToRequestersMap)) {
                const newArray = [bookName]
                newArray.push(...requesters)
                data.push(...[newArray])
            }

            console.log({data})

            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

            const buffer = XLSX.write(wb, { type:'buffer', bookType: "xlsx" });

            response.status(200).send(buffer);
        } else {
            response.status(403).json({ info: 'User has incorrect access level'})
        }
    } else {
        response.status(404).json({ info: 'User not found' })
    }
}

module.exports = {
    getXLSXReport
}
