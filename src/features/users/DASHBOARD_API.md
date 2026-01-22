# User Dashboard API Documentation

Complete CRUD operations for user dashboard with analytics, statistics, and customization features.

## Base URL

All dashboard endpoints are under: `/users/:userId/dashboard`

---

## Endpoints

### 1. Get Dashboard Overview

**GET** `/users/:userId/dashboard/overview`

Get a comprehensive overview of the user's dashboard including shops, devices, sessions, and roles.

**Query Parameters:**

- `period` (optional): `today`, `week`, `month`, `year`, `custom` (default: `month`)
- `startDate` (optional): ISO date string (required if period is `custom`)
- `endDate` (optional): ISO date string (required if period is `custom`)
- `shopId` (optional): Filter by specific shop ID
- `metric` (optional): Specific metric to focus on

**Example Request:**

```bash
GET /users/1/dashboard/overview?period=month
GET /users/1/dashboard/overview?period=custom&startDate=2026-01-01&endDate=2026-01-19
GET /users/1/dashboard/overview?shopId=5
```

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
  "overview": {
    "totalShops": 5,
    "activeShops": 4,
    "activeSessions": 3,
    "totalDevices": 2,
    "roles": [
      {
        "id": 1,
        "name": "USER"
      }
    ]
  },
  "shops": [
    {
      "id": 1,
      "name": "My Shop",
      "isActive": true,
      "createdAt": "2025-12-01T00:00:00.000Z"
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
  ],
  "period": {
    "startDate": "2025-12-19T00:00:00.000Z",
    "endDate": "2026-01-19T00:00:00.000Z",
    "period": "month"
  }
}
```

---

### 2. Get Dashboard Statistics

**GET** `/users/:userId/dashboard/statistics`

Get detailed statistics about shops, sessions, and account status for a specific period.

**Query Parameters:**
Same as overview endpoint

**Example Request:**

```bash
GET /users/1/dashboard/statistics?period=week
```

**Response:**

```json
{
  "period": {
    "startDate": "2026-01-12T00:00:00.000Z",
    "endDate": "2026-01-19T00:00:00.000Z",
    "period": "week"
  },
  "statistics": {
    "shops": {
      "total": 5,
      "active": 4,
      "inactive": 1,
      "new": 2
    },
    "sessions": {
      "total": 10,
      "active": 3,
      "revoked": 7
    },
    "account": {
      "isActive": true,
      "isVerifyEmail": true,
      "isVerifyPhone": false,
      "accountAge": "3 months"
    }
  }
}
```

---

### 3. Get Activity Timeline

**GET** `/users/:userId/dashboard/activity`

Get a timeline of recent activities including logins and shop creations.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example Request:**

```bash
GET /users/1/dashboard/activity?page=1&limit=10
```

**Response:**

```json
{
  "activities": [
    {
      "type": "login",
      "timestamp": "2026-01-19T10:30:00.000Z",
      "data": {
        "deviceId": "device-123",
        "isRevoked": false
      }
    },
    {
      "type": "shop_created",
      "timestamp": "2026-01-18T15:20:00.000Z",
      "data": {
        "shopId": 5,
        "shopName": "New Shop",
        "isActive": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

### 4. Get Shops Analytics

**GET** `/users/:userId/dashboard/shops`

Get detailed analytics about user's shops.

**Query Parameters:**

- `period` (optional): Time period filter
- `shopId` (optional): Filter by specific shop

**Example Request:**

```bash
GET /users/1/dashboard/shops
GET /users/1/dashboard/shops?shopId=5
```

**Response:**

```json
{
  "total": 5,
  "active": 4,
  "inactive": 1,
  "shops": [
    {
      "id": 1,
      "name": "My Shop",
      "isActive": true,
      "createdAt": "2025-10-15T00:00:00.000Z",
      "updatedAt": "2026-01-18T00:00:00.000Z",
      "daysSinceCreation": 96,
      "lastUpdated": 1
    }
  ]
}
```

---

### 5. Get Devices Analytics

**GET** `/users/:userId/dashboard/devices`

Get analytics about user's registered devices.

**Example Request:**

```bash
GET /users/1/dashboard/devices
```

**Response:**

```json
{
  "total": 3,
  "byType": {
    "ANDROID": 2,
    "IOS": 1
  },
  "devices": [
    {
      "id": "device-123",
      "deviceType": "ANDROID",
      "osVersion": "12",
      "appVersion": "1.0.0",
      "lastActiveAt": "2026-01-19T10:00:00.000Z",
      "createdAt": "2025-12-01T00:00:00.000Z",
      "daysSinceLastActive": 0,
      "daysSinceCreation": 49
    }
  ]
}
```

---

### 6. Get Sessions Analytics

**GET** `/users/:userId/dashboard/sessions`

Get detailed analytics about user sessions and tokens.

**Query Parameters:**
Same as overview endpoint

**Example Request:**

```bash
GET /users/1/dashboard/sessions?period=month
```

**Response:**

```json
{
  "total": 15,
  "active": 3,
  "expired": 8,
  "revoked": 4,
  "blacklisted": 0,
  "sessions": [
    {
      "id": 1,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "expiresAt": "2026-02-15T10:00:00.000Z",
      "isRevoked": false,
      "isBlacklisted": false,
      "deviceId": "device-123",
      "isExpired": false,
      "daysUntilExpiry": 27
    }
  ]
}
```

---

### 7. Get Summary Cards

**GET** `/users/:userId/dashboard/summary-cards`

Get summary card data for dashboard widgets.

**Example Request:**

```bash
GET /users/1/dashboard/summary-cards
```

**Response:**

```json
{
  "cards": [
    {
      "title": "Total Shops",
      "value": 5,
      "icon": "shop",
      "color": "blue",
      "trend": null
    },
    {
      "title": "Active Shops",
      "value": 4,
      "icon": "check",
      "color": "green",
      "percentage": 80
    },
    {
      "title": "Active Sessions",
      "value": 3,
      "icon": "session",
      "color": "purple",
      "trend": null
    },
    {
      "title": "Devices",
      "value": 2,
      "icon": "device",
      "color": "orange",
      "trend": null
    }
  ]
}
```

---

### 8. Get Profile Summary

**GET** `/users/:userId/dashboard/profile`

Get user profile summary including roles and permissions.

**Example Request:**

```bash
GET /users/1/dashboard/profile
```

**Response:**

```json
{
  "profile": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg",
    "dob": "1990-01-01T00:00:00.000Z",
    "phoneNumber": "+1234567890"
  },
  "status": {
    "isActive": true,
    "isVerifyEmail": true,
    "isVerifyPhone": false
  },
  "roles": [
    {
      "id": 1,
      "name": "USER",
      "description": "Standard user role"
    }
  ],
  "permissions": ["READ_PRODUCTS", "CREATE_ORDER", "VIEW_SHOPS"],
  "accountAge": "3 months",
  "memberSince": "2025-10-19T00:00:00.000Z"
}
```

---

### 9. Refresh Dashboard

**GET** `/users/:userId/dashboard/refresh`

Refresh all dashboard data and get a complete snapshot.

**Example Request:**

```bash
GET /users/1/dashboard/refresh
```

**Response:**

```json
{
  "overview": { ... },
  "statistics": { ... },
  "summaryCards": { ... },
  "refreshedAt": "2026-01-19T12:00:00.000Z"
}
```

---

## Query Parameter Details

### Period Filter Options

- `today`: Data from today only (00:00 to current time)
- `week`: Last 7 days
- `month`: Last 30 days
- `year`: Last 365 days
- `custom`: Custom date range (requires `startDate` and `endDate`)

### Date Formats

All dates should be in ISO 8601 format:

- `2026-01-19T10:30:00.000Z`
- `2026-01-19` (simplified)

---

## Common Response Fields

### Activity Types

- `login`: User logged in
- `shop_created`: New shop created
- `shop_updated`: Shop information updated
- `device_added`: New device registered

### Device Types (Enum)

- `ANDROID`
- `IOS`
- `WEB`

---

## Error Responses

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User with ID 123 not found",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid date range",
  "error": "Bad Request"
}
```

---

## Usage Examples

### Get Today's Overview

```bash
GET /users/1/dashboard/overview?period=today
```

### Get Last Week's Statistics

```bash
GET /users/1/dashboard/statistics?period=week
```

### Get Custom Date Range Analytics

```bash
GET /users/1/dashboard/shops?period=custom&startDate=2026-01-01&endDate=2026-01-15
```

### Get Recent Activities

```bash
GET /users/1/dashboard/activity?page=1&limit=20
```

### Filter by Specific Shop

```bash
GET /users/1/dashboard/overview?shopId=5
GET /users/1/dashboard/statistics?shopId=5
```

---

## Features

✅ **Comprehensive Analytics**: Track shops, sessions, devices, and activities
✅ **Flexible Filtering**: Filter by time period, shop, and custom date ranges
✅ **Pagination**: Activity timeline with pagination support
✅ **Real-time Data**: Get current statistics and metrics
✅ **Profile Integration**: Complete user profile with roles and permissions
✅ **Summary Cards**: Ready-to-use data for dashboard widgets
✅ **Time Calculations**: Automatic calculation of days, age, and expiry
✅ **Activity Timeline**: Track user actions and events
✅ **Device Analytics**: Monitor user devices and sessions
✅ **Shop Analytics**: Detailed shop performance metrics

---

## Notes

- All dates are returned in UTC timezone
- The dashboard automatically excludes revoked and blacklisted sessions from active counts
- Account age is calculated from the user's `createdAt` timestamp
- Device analytics includes last active time and creation date
- All endpoints require valid user authentication (implement based on your auth system)
