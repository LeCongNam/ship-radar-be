# User API Documentation

## Endpoints

### 1. Create User

**POST** `/users`

Creates a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer",
  "avatar": "https://example.com/avatar.jpg",
  "dob": "1990-01-01",
  "phoneNumber": "+1234567890",
  "isActive": true,
  "isVerifyEmail": false,
  "isVerifyPhone": false
}
```

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer",
  "avatar": "https://example.com/avatar.jpg",
  "dob": "1990-01-01T00:00:00.000Z",
  "phoneNumber": "+1234567890",
  "isVerifyEmail": false,
  "isVerifyPhone": false,
  "isActive": true,
  "createdAt": "2026-01-19T00:00:00.000Z",
  "updatedAt": "2026-01-19T00:00:00.000Z"
}
```

### 2. Get All Users (with pagination and filters)

**GET** `/users?page=1&limit=10&isActive=true&search=john`

Retrieves a paginated list of users with optional filters.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isActive` (optional): Filter by active status (true/false)
- `search` (optional): Search by email, username, firstName, or lastName

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "roles": [
        {
          "role": {
            "id": 1,
            "name": "USER"
          }
        }
      ]
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 3. Get User by ID

**GET** `/users/:id`

Retrieves a specific user by their ID, including their roles, permissions, and shops.

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software developer",
  "avatar": "https://example.com/avatar.jpg",
  "dob": "1990-01-01T00:00:00.000Z",
  "phoneNumber": "+1234567890",
  "isVerifyEmail": true,
  "isVerifyPhone": false,
  "isActive": true,
  "roles": [
    {
      "role": {
        "id": 1,
        "name": "USER",
        "permissions": [
          {
            "id": 1,
            "permission": "READ_PRODUCTS"
          }
        ]
      }
    }
  ],
  "shops": [
    {
      "id": 1,
      "name": "My Shop"
    }
  ]
}
```

### 4. Get User Dashboard

**GET** `/users/:id/dashboard`

Retrieves dashboard information for a specific user including statistics and related data.

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  },
  "statistics": {
    "totalShops": 3,
    "activeShops": 2,
    "activeSessions": 2,
    "totalDevices": 3
  },
  "shops": [
    {
      "id": 1,
      "name": "Shop 1",
      "isActive": true
    }
  ],
  "devices": [
    {
      "id": "device-123",
      "deviceType": "ANDROID",
      "osVersion": "12",
      "appVersion": "1.0.0",
      "lastActiveAt": "2026-01-19T10:00:00.000Z"
    }
  ]
}
```

### 5. Update User

**PATCH** `/users/:id`

Updates user information (excluding password, email, and username).

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "bio": "Updated bio",
  "avatar": "https://example.com/new-avatar.jpg",
  "phoneNumber": "+9876543210",
  "isActive": true
}
```

**Response:** Updated user object (without password)

### 6. Update Password

**PUT** `/users/:id/password`

Updates a user's password.

**Request Body:**

```json
{
  "password": "newPassword123"
}
```

**Response:** Success message

### 7. Toggle User Active Status

**PATCH** `/users/:id/toggle-active`

Toggles the active status of a user (active/inactive).

**Response:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "isActive": false
}
```

### 8. Delete User

**DELETE** `/users/:id`

Deletes a user by their ID.

**Response:** Deleted user object

## Validation Rules

### CreateUserDto

- `email`: Required, must be a valid email
- `username`: Required, minimum 3 characters, unique
- `password`: Required, minimum 6 characters
- `firstName`: Optional string
- `lastName`: Optional string
- `bio`: Optional string
- `avatar`: Optional string (URL)
- `dob`: Optional date string (ISO format)
- `phoneNumber`: Optional string, unique
- `isActive`: Optional boolean
- `isVerifyEmail`: Optional boolean
- `isVerifyPhone`: Optional boolean

### UpdateUserDto

All fields optional (except password, email, username which are excluded):

- `firstName`: Optional string
- `lastName`: Optional string
- `bio`: Optional string
- `avatar`: Optional string
- `dob`: Optional date string
- `phoneNumber`: Optional string
- `isActive`: Optional boolean
- `isVerifyEmail`: Optional boolean
- `isVerifyPhone`: Optional boolean

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User with ID 123 not found",
  "error": "Not Found"
}
```
