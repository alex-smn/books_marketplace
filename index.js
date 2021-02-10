const express = require('express')
const bodyParser = require('body-parser')
const { createBook, requestBook } = require('./books')
const { respondToRequest } = require('./requests')
const { getXLSXReport } = require('./reports')
const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.post('/books/create', createBook)

app.post('/books/request', requestBook)

app.put('/requests/respond', respondToRequest)

app.get('/reports/my_books', getXLSXReport)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

