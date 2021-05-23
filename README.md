# Authentication server
JWT authentication API.

```console
$ npm i  #install dependancies
$ brew services start mongodb-community  #start mongodb
$ touch .env #create .env file defining JWT_SECRET_KEY
$ npm run dev  #host local server
```

## `GET` /api/auth/{user}
Protected route that returns information about the user logged in.

Response 
```json
{
    "_id": "abc123",
    "username": "janedoe"
} 
```

## `POST` /api/auth/signup
Creates a user with a unique email and username. If successful, returns an access and refresh token.

Body 
```json
{
    "username": "janedoe",
    "email": "janedoe@aim.com",
    "password": "pw123"
} 
```
Response 
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiX2lkIjoiNjBhODUwMGNiNjM1ODMyOWU1YWNjODI3IiwidXNlcm5hbWUiOiJqYW5lZG9lIiwiaWF0IjoxNjIxNjQzMjc2LCJleHAiOjE2MjE2NDQxNzYsImF1ZCI6ImF1ZGllbmNlIiwiaXNzIjoiaXNzdWVyIiwic3ViIjoiNjBhODUwMGNiNjM1ODMyOWU1YWNjODI3In0.YxcFjBdywMMznSsIPo6FQtuxn2UxQwbX6Q4XFw_V01s",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaCIsIl9pZCI6IjYwYTg1MDBjYjYzNTgzMjllNWFjYzgyNyIsInVzZXJuYW1lIjoiamFuZWRvZSIsImtleSI6IiQyYSQxMiR2WVkzTTkxZy9tYjV0VXlOR0ZwQUN1bzNTdzF4eWlJellJSEJLbTU1R3BGZDdXZGNrcXFTRyIsImlhdCI6MTYyMTY0MzI3NywiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIiLCJzdWIiOiI2MGE4NTAwY2I2MzU4MzI5ZTVhY2M4MjcifQ.UlQpVGuwV4m3dDNK1smYJW56P3pHPFP40lE1vZfgQyg"
} 
```

## `POST` /api/auth/login
Given a valid email and password, returns an access and refresh token.

Body 
```json
{
    "email": "janedoe@aim.com",
    "password": "pw123"
} 
```
Response 
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwiX2lkIjoiNjBhODUwMGNiNjM1ODMyOWU1YWNjODI3IiwidXNlcm5hbWUiOiJqYW5lZG9lIiwiaWF0IjoxNjIxNjQzNDc5LCJleHAiOjE2MjE2NDQzNzksImF1ZCI6ImF1ZGllbmNlIiwiaXNzIjoiaXNzdWVyIiwic3ViIjoiNjBhODUwMGNiNjM1ODMyOWU1YWNjODI3In0._FmeobsUEe1mMm7Bu60yQw_dHXi76MgY_nHyMKs7cfE",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaCIsIl9pZCI6IjYwYTg1MDBjYjYzNTgzMjllNWFjYzgyNyIsInVzZXJuYW1lIjoiamFuZWRvZSIsImtleSI6IiQyYSQxMiRJQW0uWWFnR2h3WGlSR2F6RjlTbEd1L1Voa0RwTFUzYXJRNkNwS21qTzlzRE05RWkxeFNyTyIsImlhdCI6MTYyMTY0MzQ3OSwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIiLCJzdWIiOiI2MGE4NTAwY2I2MzU4MzI5ZTVhY2M4MjcifQ.aVhU4_LKXKczPw9ORde6ELFqi7PKDnuf8ZORe76vG04",
    "userobj": {
        "_id": "60a8500cb6358329e5acc827",
        "username": "janedoe"
    }
} 
```

## `POST` /api/auth/forgot
Given a valid email address, updates the user with a reset code and sends an email with a reset link.

Body 
```json
{
    "email": "janedoe@aim.com"
} 
```
Response 
```json
{
    "message": "Email sent to reset your password."
}
```

## `POST` /api/auth/reset
Resets a user's password when given the correct reset code.

Body 
```json
{
    "resetCode": "8UIOtQWwkY",
    "newPassword": "newpw123"
}
```
Response 
```json
{
    "message": "Password reset."
}
```

## `POST` /api/auth/refresh_token
Generates a JWT access token from a valid Refresh token.

Body 
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVmcmVzaCIsIl9pZCI6IjYwYTg1MDBjYjYzNTgzMjllNWFjYzgyNyIsInVzZXJuYW1lIjoiamFuZWRvZSIsImtleSI6IiQyYSQxMiRaemRqRkVhMm1GdXVqaEIuSGJrUW1PekJ1LjZPQU13M3U5WjFVeEQ4MjlxZUtGSmZlSk4uZSIsImlhdCI6MTYyMTY0MzgzOSwiYXVkIjoiYXVkaWVuY2UiLCJpc3MiOiJpc3N1ZXIiLCJzdWIiOiI2MGE4NTAwY2I2MzU4MzI5ZTVhY2M4MjcifQ.TEp-Dh0ppFDAi3jKBAGuNN5anBEm3uVZZJVl9FQnQqI"
}
```
Response 
```json
{
    "message": "Password reset."
}
```
