## Household Savings Trend API

### Overview

Returns household savings data for the last 12 calendar months, following the same pattern as the Net Worth Trend API. The household is inferred from the authenticated user.

- Base URL: `v1`
- Module: `savings`
- Content-Type: `application/json`

### Endpoint

- Method: `GET`
- Path: `/v1/savings/trend`
- Auth: `Bearer` token (JWT)

### Description

Returns an array of monthly savings points covering the last 12 months (including the current month), ordered chronologically from oldest to newest. Each point represents the recorded savings amount for that month for the user’s household. If no savings entry exists for a given month, `amount` is `null` and `hasData` is `false`.

### Request

- Query Parameters: none

### Response: 200 OK

Array of `SavingsTrendPoint` objects.

SavingsTrendPoint

- `month` (string): Full month name (e.g., "January").
- `monthShort` (string): Short month name (e.g., "Jan").
- `amount` (number | null): Saved amount for the month, or `null` if no data.
- `hasData` (boolean): Indicates whether the month has a recorded savings entry.

Example

```json
[
  {
    "month": "October",
    "monthShort": "Oct",
    "amount": 500.0,
    "hasData": true
  },
  {
    "month": "November",
    "monthShort": "Nov",
    "amount": null,
    "hasData": false
  },
  {
    "month": "December",
    "monthShort": "Dec",
    "amount": 750.0,
    "hasData": true
  }
]
```

### Errors

- 401 Unauthorized: Missing or invalid token
- 403 Forbidden: Authenticated but not permitted (if applicable per guard policies)
- 500 Internal Server Error: Unexpected error

### Notes

- Household is determined by the current authenticated user’s `householdId`; no household identifier is accepted via query.
- The 12-month window is computed relative to the current date and includes the current month.
- Ordering is ascending by month (oldest first).
- Months with no DB record in the range MUST still be included; set `amount` to `null` and `hasData` to `false` for those months (no zero-fill or imputation).
