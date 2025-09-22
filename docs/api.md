# API Design Guide

## API Design Conventions

NestWise follows RESTful API design principles with consistent filtering, sorting, and pagination patterns across all endpoints.

### Base URL and Versioning

- **Base URL**: `http://localhost:8080`
- **Versioning**: URI versioning with `/v1/` prefix
- **Documentation**: Interactive Swagger UI at `http://localhost:8080/swagger`

### Authentication

Most endpoints require authentication via JWT token stored in httpOnly cookie:

```http
Cookie: auth-token=<jwt-token>
```

Public endpoints (no authentication required):

- `POST /v1/auth/login`
- `POST /v1/auth/setup`
- `GET /v1/auth/me` (returns current user or 401 if not authenticated)

### Request/Response Format

#### Request Headers

```http
Content-Type: application/json
Cookie: auth-token=<jwt-token>
```

#### Response Format

All list endpoints return data with pagination metadata:

```json
{
  "data": [
    /* Array of resource objects */
  ],
  "meta": {
    "totalCount": 150,
    "pageSize": 20,
    "currentPage": 3,
    "totalPages": 8
  }
}
```

Single resource endpoints return the resource directly:

```json
{
  "id": "uuid",
  "name": "Resource Name"
  /* other fields */
}
```

### Filtering and Search

#### Simple Filtering

Use field names as query parameters for exact matches:

```http
GET /v1/households/123/transactions?type=expense&accountId=456
```

#### Advanced Operators

Append operator suffix to field names for advanced filtering:

- `_gt`: Greater than
- `_gte`: Greater than or equal
- `_lt`: Less than
- `_lte`: Less than or equal
- `_in`: In array (comma-separated)
- `_like`: Text search (case-insensitive)

```http
GET /v1/households/123/transactions?amount_gte=100&amount_lt=500
GET /v1/households/123/transactions?accountId_in=123,456,789
GET /v1/households/123/transactions?description_like=grocery
```

#### Date Range Filtering

Use `from` and `to` parameters for date ranges:

```http
GET /v1/households/123/transactions?from=2024-01-01&to=2024-01-31
```

### Sorting

Use the `sort` parameter with field names. Prefix with `-` for descending order:

```http
GET /v1/households/123/transactions?sort=-transactionDate,amount
```

Default sorting is applied per endpoint (usually by creation date or most relevant field).

### Pagination

Use `page` and `pageSize` parameters:

```http
GET /v1/households/123/transactions?page=2&pageSize=50
```

- Default `pageSize`: 20
- Maximum `pageSize`: 100
- `page` starts at 1

## Core API Endpoints

### Authentication

#### Setup New Household and User

```http
POST /v1/auth/setup
Content-Type: application/json

{
  "user": {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  },
  "household": {
    "name": "The Doe Family",
    "currencyCode": "USD"
  }
}
```

#### Login

```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Get Current User

```http
GET /v1/auth/me
```

#### Logout

```http
POST /v1/auth/logout
```

### Households

#### Get Household Details

```http
GET /v1/households/{householdId}
```

#### Update Household

```http
PUT /v1/households/{householdId}
Content-Type: application/json

{
  "name": "Updated Household Name",
  "monthlyBudget": 5500.00
}
```

#### Create Account (Household-scoped)

```http
POST /v1/households/{householdId}/accounts
Content-Type: application/json

{
  "name": "Joint Checking",
  "type": "checking",
  "initialBalance": 2500.00,
  "ownerId": "user-uuid"
}
```

#### Create Category (Household-scoped)

```http
POST /v1/households/{householdId}/categories
Content-Type: application/json

{
  "name": "Groceries",
  "type": "expense"
}
```

#### Transfer Funds Between Accounts

```http
POST /v1/households/{householdId}/accounts/transfer
Content-Type: application/json

{
  "fromAccountId": "account-uuid-1",
  "toAccountId": "account-uuid-2",
  "amount": 500.00,
  "description": "Monthly savings transfer"
}
```

#### Invite User to Household

```http
POST /v1/households/{householdId}/invites
Content-Type: application/json

{
  "email": "partner@example.com"
}
```

### Accounts

#### Get Account Details

```http
GET /v1/accounts/{accountId}
```

#### Update Account

```http
PUT /v1/accounts/{accountId}
Content-Type: application/json

{
  "name": "Updated Account Name",
  "type": "savings"
}
```

### Transactions

#### List Transactions with Filtering

```http
GET /v1/households/{householdId}/transactions?from=2024-01-01&to=2024-01-31&type=expense&sort=-transactionDate&page=1&pageSize=20
```

#### Create Transaction

```http
POST /v1/households/{householdId}/transactions
Content-Type: application/json

{
  "accountId": "account-uuid",
  "categoryId": "category-uuid",
  "description": "Whole Foods grocery shopping",
  "amount": 85.50,
  "type": "expense",
  "transactionDate": "2024-01-15"
}
```

#### Update Transaction

```http
PUT /v1/transactions/{transactionId}
Content-Type: application/json

{
  "description": "Updated description",
  "categoryId": "new-category-uuid",
  "amount": 92.00
}
```

#### Delete Transaction

```http
DELETE /v1/transactions/{transactionId}
```

#### AI-Assisted Transaction Categorization

```http
POST /v1/transactions/ai
Content-Type: application/json

{
  "description": "STARBUCKS COFFEE #123 SEATTLE WA",
  "amount": 4.75,
  "type": "expense"
}

Response:
{
  "suggestedCategory": "Food & Dining",
  "confidence": 0.92
}
```

### Private Transactions

#### List Private Transactions

```http
GET /v1/households/{householdId}/private-transactions?from=2024-01-01&sort=-transactionDate
```

#### Create Private Transaction

```http
POST /v1/households/{householdId}/private-transactions
Content-Type: application/json

{
  "accountId": "account-uuid",
  "description": "Personal shopping",
  "amount": 45.00,
  "type": "expense",
  "transactionDate": "2024-01-15"
}
```

### Category Budgets

#### List Category Budgets

```http
GET /v1/households/{householdId}/category-budgets?month=2024-01
```

#### Create/Update Category Budget

```http
POST /v1/households/{householdId}/category-budgets
Content-Type: application/json

{
  "categoryId": "category-uuid",
  "budgetAmount": 400.00,
  "month": "2024-01"
}
```

### Savings

#### Get Savings Trend

```http
GET /v1/households/{householdId}/savings?from=2024-01-01&to=2024-12-31
```

### Reports

#### Net Worth Trend

```http
GET /v1/households/{householdId}/reports/net-worth?from=2024-01-01&to=2024-12-31
```

#### Spending by Accounts

```http
GET /v1/households/{householdId}/reports/spending-by-accounts?from=2024-01-01&to=2024-01-31
```

### Users and Invites

#### List Household Members

```http
GET /v1/households/{householdId}/users
```

#### List Pending Invites

```http
GET /v1/invites
```

#### Accept Invite

```http
POST /v1/invites/{inviteId}/accept
Content-Type: application/json

{
  "user": {
    "username": "jane_doe",
    "email": "jane@example.com",
    "password": "securepassword123"
  }
}
```

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Validation errors, malformed requests
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflicts (e.g., duplicate email)
- **422 Unprocessable Entity**: Business logic validation errors
- **429 Too Many Requests**: Rate limiting
- **500 Internal Server Error**: Server errors

### Error Response Format

```json
{
  "statusCode": 400,
  "message": ["email must be a valid email", "password must be at least 8 characters"],
  "error": "Bad Request"
}
```

For validation errors, the `message` field contains an array of specific validation failures.

## Request Examples with cURL

### Authentication Flow

```bash
# Setup new household
curl -X POST http://localhost:8080/v1/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "securepassword123"
    },
    "household": {
      "name": "The Doe Family",
      "currencyCode": "USD"
    }
  }'

# Login (cookies are handled automatically by browser)
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Use authenticated endpoints
curl -X GET http://localhost:8080/v1/auth/me \
  -b cookies.txt
```

### Transaction Management

```bash
# List recent transactions
curl -X GET "http://localhost:8080/v1/households/123/transactions?from=2024-01-01&sort=-transactionDate&pageSize=10" \
  -b cookies.txt

# Create new transaction
curl -X POST http://localhost:8080/v1/households/123/transactions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "accountId": "account-uuid",
    "categoryId": "category-uuid",
    "description": "Grocery shopping",
    "amount": 85.50,
    "type": "expense",
    "transactionDate": "2024-01-15"
  }'
```

## Rate Limiting

API endpoints are protected by configurable rate limiting:

- **Default**: 100 requests per minute per IP
- **Headers**: Rate limit info included in response headers
- **429 Response**: When limit exceeded, includes `Retry-After` header

## CORS Configuration

- **Allowed Origin**: `http://localhost:5173` (development frontend)
- **Credentials**: Enabled for cookie-based authentication
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, and custom headers
