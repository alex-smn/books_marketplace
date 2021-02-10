# books_marketplace

We have 3 users:
  - User 1 - buyer
  - User 2 - seller
  - User 3 - buyer and seller

Endpoints:
- POST /books/create
  - body: 
    { user: { token: "testToken2" }, bookName: "Book name" }
- POST /books/request
  - body: 
    { user: { token: "testToken1" }, book_id: 15 }
- PUT /requests/respond
  - body:
    { user: { token: "testToken2" }, request_id: 2, response_status: "approved" }
- GET /reports/my_books
  - body:
    { user: { token: "testToken2" } }
    
Not finished: 
  - /requests/respond endpoint - could use JOIN
  - no web page to actually get xlsx file in /reports/my_books
    - we can comment out getting user and hardcode id = 2, accessLevel = 3, then just send get request in browser to `http://localhost:3001/reports/my_books` and save file
    - file is being saved without extension, have to manually rename
