## Category Budgets Planning - MVP Spec

### Overview

- Month-by-month planning of household spending per category.
- Plans exist independently of transactions; actuals (currentAmount) are derived from EXPENSE transactions for the selected month.
- Income transactions are uncategorized (categoryId = null) and do not affect category budgets.

### Scope and Behavior

1. Month navigation
   - Previous months: read-only (no edits). Users can view plannedAmount and currentAmount.
   - Current month: editable.
   - Future months: editable.

2. Auto-create missing rows
   - For any household/month, if a category has no `category_budgets` row, it is auto-created with plannedAmount = 0 when listing (or upon first edit).
   - New categories appear automatically across all months with plannedAmount = 0 until edited.

3. Overplanning rule (cap by current household balance)
   - Household available balance = sum of all `accounts.current_balance` for the household at request time.
   - Validation on edit/upsert: sum of ALL category budget plannedAmount across the household (all months) must not exceed the household available balance.
   - If an edit would exceed the cap, the server rejects the request (HTTP 400). No denormalized counters; compute in a transaction.

4. Reflection of spending
   - `currentAmount` for a category and month is calculated as the sum of EXPENSE transactions with `transaction_date` within that month and matching `category_id`.
   - Income does not affect category budgets (categoryId is null for income).

### Data Model (existing)

- `category_budgets (id, household_id, category_id, month, planned_amount, created_at, updated_at)`
  - Unique: (household_id, category_id, month)
- `transactions (… type, amount, transaction_date, category_id nullable, …)`
- `accounts (… current_balance …)`

### API

- GET `v1/category-budgets?month=YYYY-MM`
  - Returns one item per household category for the requested month.
  - Auto-creates missing rows with plannedAmount = 0.
  - Response item fields:
    - id, householdId, categoryId, month, plannedAmount, createdAt, updatedAt
    - category: { name }
    - currentAmount: number (derived EXPENSE sum for that month)

- PATCH `v1/category-budgets/:id`
  - Body: `{ plannedAmount: number >= 0 }`
  - Validations:
    - Previous months are rejected (read-only).
    - Overplanning rule: sum of ALL plannedAmount across the household (all months) after this change must be ≤ household available balance (sum of current account balances). Reject if exceeded.

### Validation/Computation Details

- Month parsing uses `YYYY-MM`. Month range = first to last day of the month (inclusive).
- `currentAmount` counts only EXPENSE transactions; TRANSFERs are excluded (if added later). Income has `categoryId = null` by policy.
- Overplanning check implementation sketch (server):
  1. Begin transaction.
  2. Read current household sum of `accounts.current_balance`.
  3. Read total planned across all `category_budgets` for the household.
  4. Compute delta = newPlanned − oldPlanned for the target row.
  5. If totalPlanned + delta > householdBalance, abort with 400.
  6. Save update.

### UI Notes

- Stacked card list with month selector (no table UI).
- Show plannedAmount (editable where allowed) and currentAmount (read-only).
- Disable inputs for previous months (read-only state with label).
- Show an error/toast when overplanning rule blocks an edit.

- Layout and interactions
  - Header: a month selector with previous/next controls and a dropdown to pick a specific month.
  - Below the header: a vertical list of cards, one per category budget:
    - Card header: Category name, primary value shows Planned amount.
    - Card action: Edit button for current/future months; shows read-only label for past months.
    - Inline edit: numeric input for Planned amount with Save/Cancel buttons (UI only here; server validations apply on save).
    - Card content stats:
      - Planned (original plannedAmount)
      - Spent (currentAmount)
      - Available (planned − spent), turns destructive color when negative
      - Progress bar visualizing spent vs planned with percentage label
  - List footer/summary displays totals (Total Planned, Total Spent, Remaining) with negative remaining styled as destructive.

### Out of Scope (MVP)

- Rollover rules and “To Assign” pool.
- Goals (target by date/amount).
- Denormalized/cached totals.
