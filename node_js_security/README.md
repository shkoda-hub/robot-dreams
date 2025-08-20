# JWT Auth

Firstly provide JWT_ACCESS_SECRET and JWT_REFRESH_SECRET envs

```bash
openssl rand -base64 64
```

To start service
```bash
npm run start:dev
```

There are two mocked users: 
1. Admin - first@mail.com | first123
2. User = second@mail.com | second123

{
  "email": "second@mail.com",
  "password": "second123"
}

{
  "email": "second@mail.com",
  "password": "second123"
}
