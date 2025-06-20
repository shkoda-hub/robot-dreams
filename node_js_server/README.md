# Node js server
## Instruction to run server
1. Install dependencies
```
npm install
```
2. Start server. By default will start on 3001 port. To use another port provide env PORT
```
npm run start
```

## Description
This is simple users service. Supported methods: 
- GET /users - returns list of users
- GET /users/:id - returns user by id
- POST /users - creates new user
- PUT /users/:id - updates user
- DELETE /users/:id - deletes user

## Examples
1. Example request body to create new user:
   ```
   {
    "firstName": "User1",
    "lastName": "User1",
    "email": "some@gmail.com",
    "phone": "123123123"
   }
   ```
2. Example request body to update user:
   ```
   {
    "email": "some123@mail.com",
    "phone": "123123"
   }
   ```
