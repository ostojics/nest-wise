# **Personal Finance Application: Technical Data Model Document**

## **1\. Introduction**

This document describes the relational database schema for the Personal Finance Application. The design focuses on robust data integrity, flexibility for individual and shared household finances, and efficient querying for reporting and insights. PostgreSQL is the recommended relational database management system (RDBMS) for its reliability, feature set, and strong support for data types like UUID and DECIMAL.

## **2\. Overall Database Strategy**

- **Relational Model:** Data is organized into tables with defined relationships to ensure consistency and minimize redundancy.

- **UUIDs for Primary Keys:** Universally Unique Identifiers (UUID) are used for primary keys across all tables. This offers several benefits:

- Prevents ID collisions in distributed or merged systems (though less critical for a single self-hosted instance, it's good practice).

- Hides sequential IDs from users, improving privacy.

- Simplifies data merging if ever needed in a more complex scenario.

- DECIMAL for Monetary **Values:** All monetary amounts are stored using the DECIMAL (or NUMERIC) data type with appropriate precision and scale (e.g., DECIMAL(18, 2)). This is crucial to avoid floating-point inaccuracies inherent with FLOAT or REAL types when dealing with currency.

- **Timestamp Tracking:** created_at and updated_at columns are included in most tables to track record lifecycle, useful for auditing and debugging.

- **Foreign Key Constraints:** Relationships between tables are enforced using foreign keys, ensuring referential integrity and preventing orphaned records. ON DELETE CASCADE is used where appropriate to automatically clean up dependent records when a parent record is deleted (e.g., deleting a household deletes all its associated accounts, transactions, etc.).

## **3\. Database Schema Details**

### **3.1. users Table**

- **Purpose:** Stores individual user authentication and profile information. Each user must belong to exactly one household. This table uses traditional email and password authentication for simplified self-hosting.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :------------ | :----------------------- | :---------------------------------------------------- | :------------------------------------------- |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the user. |

| household_id | UUID | NOT NULL, REFERENCES households(id) ON DELETE CASCADE | Foreign key linking to the households table. |

| username | VARCHAR(50) | UNIQUE, NOT NULL | Unique username for login. |

| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address. |

| password_hash | VARCHAR(255) | NOT NULL | Hashed password for secure authentication. |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the user record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

### **3.2. households Table**

- **Purpose:** Represents a shared financial entity or group (e.g., a couple, a family, or a single individual's financial unit). All financial data (accounts, transactions, categories, tags) are associated with a specific household.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :------------ | :----------------------- | :------------------------------------- | :------------------------------------------------------------------------------------ |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the household. |

| name | VARCHAR(255) | NOT NULL | A user-friendly name for the household (e.g., "John & Jane's Finances"). |

| currency_code | CHAR(3) | NOT NULL, DEFAULT 'USD' | ISO 4217 currency code (e.g., 'USD', 'EUR', 'RSD') for all accounts in the household. |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the household record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

### **3.3. accounts Table**

- **Purpose:** Stores information about financial accounts (e.g., checking, savings, credit cards, cash). Each account belongs to a specific user but is visible and usable by all members of the user's household.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :-------------- | :----------------------- | :----------------------------------------------- | :---------------------------------------------------------------------------------- |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the account. |

| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Foreign key linking to the users table (account owner). |

| name | VARCHAR(255) | NOT NULL | Name of the account (e.g., "Main Checking", "Joint Savings"). |

| type | VARCHAR(50) | NOT NULL | Type of account (e.g., 'checking', 'savings', 'credit_card', 'investment', 'cash'). |

| initial_balance | DECIMAL(18, 2\) | NOT NULL, DEFAULT 0.00 | The starting balance of the account. |

| current_balance | DECIMAL(18, 2\) | NOT NULL, DEFAULT 0.00 | The current balance of the account. This can be updated on transaction entry. |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the account record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

### **3.4. categories Table**

- **Purpose:** Defines transaction categories. Categories are specific to a household, allowing for customized categorization schemes.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :-------------------------- | :----------------------- | :---------------------------------------------------- | :----------------------------------------------------- |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the category. |

| household_id | UUID | NOT NULL, REFERENCES households(id) ON DELETE CASCADE | Foreign key linking to the households table. |

| name | VARCHAR(100) | NOT NULL | Name of the category (e.g., 'Groceries', 'Utilities'). |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the category record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

| UNIQUE (household_id, name) | | | Ensures category names are unique within a household. |

### **3.5. transactions Table**

- **Purpose:** The core ledger, storing individual financial transactions (income, expenses, transfers). Each transaction belongs to a specific household and account.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :--------------------- | :----------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------- |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the transaction. |

| household_id | UUID | NOT NULL, REFERENCES households(id) ON DELETE CASCADE | Foreign key linking to the households table. |

| account_id | UUID | NOT NULL, REFERENCES accounts(id) ON DELETE CASCADE | Foreign key linking to the accounts table where the transaction occurred. |

| category_id | UUID | REFERENCES categories(id) ON DELETE SET NULL | Foreign key linking to the categories table. Can be NULL if not yet categorized. |

| amount | DECIMAL(18, 2\) | NOT NULL | The monetary amount of the transaction, input by the user |

| type | VARCHAR(20) | NOT NULL | Type of transaction ('income', 'expense').

| description | TEXT | | Raw, user-inputted description (e.g., "Coffee from Starbucks"). |

| is_reconciled | BOOLEAN | DEFAULT FALSE | Flag to indicate if the transaction has been reconciled with a bank statement. |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the transaction record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

### **3.6. tags Table (Optional but Recommended)**

- **Purpose:** Stores customizable tags for transactions, providing a flexible way to label transactions beyond categories. Tags are specific to a household.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :-------------------------- | :----------------------- | :---------------------------------------------------- | :---------------------------------------------------------- |

| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for the tag. |

| household_id | UUID | NOT NULL, REFERENCES households(id) ON DELETE CASCADE | Foreign key linking to the households table. |

| name | VARCHAR(50) | NOT NULL | Name of the tag (e.g., '\#WorkExpense', '\#TreatYourself'). |

| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp when the tag record was created. |

| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Timestamp of the last update to the record. |

| UNIQUE (household_id, name) | | | Ensures tag names are unique within a household. |

### **3.7. transaction_tags Table (Join Table)**

- **Purpose:** Establishes the many-to-many relationship between transactions and tags, allowing a single transaction to have multiple tags.

- **Columns:**

| Column Name | Data Type | Constraints | Description |

| :----------------------------------- | :-------- | :------------------------------------------------------ | :------------------------------------------------------------ |

| transaction_id | UUID | NOT NULL, REFERENCES transactions(id) ON DELETE CASCADE | Foreign key linking to the transactions table. |

| tag_id | UUID | NOT NULL, REFERENCES tags(id) ON DELETE CASCADE | Foreign key linking to the tags table. |

| PRIMARY KEY (transaction_id, tag_id) | | | Composite primary key to ensure unique transaction-tag pairs. |

### **3.8. category_budgets Table**

- **Purpose:** Stores planned amounts per category per month for a given household. Enables month-by-month spending plans. Computed values like monthly "spent" and "available" are derived from `transactions` at query time and are not persisted here.

- **Columns:**

| Column Name    | Data Type                | Constraints                                           | Description                                          |
| :------------- | :----------------------- | :---------------------------------------------------- | :--------------------------------------------------- |
| id             | UUID                     | PRIMARY KEY, DEFAULT gen_random_uuid()                | Unique identifier for the category budget row.       |
| household_id   | UUID                     | NOT NULL, REFERENCES households(id) ON DELETE CASCADE | Household that owns this budget entry.               |
| category_id    | UUID                     | NOT NULL, REFERENCES categories(id) ON DELETE CASCADE | Category this planned amount applies to.             |
| month          | VARCHAR(7)               | NOT NULL                                              | Month identifier in the format 'YYYY-MM'.            |
| planned_amount | DECIMAL(18, 2)           | NOT NULL                                              | Planned allocation for the given category and month. |
| created_at     | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                                         | Timestamp when the budget row was created.           |
| updated_at     | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                                         | Timestamp when the budget row was last updated.      |

- **Indexes & Constraints:**
  - UNIQUE (household_id, category_id, month)
  - INDEX (household_id, month)

## **4\. Relationships Overview**

- **One-to-Many:**

- households to users (one household can have many users)

- users to accounts (one user can own many accounts)

- households to categories (one household has many categories)

- households to transactions (one household has many transactions)

- households to tags (one household has many tags)

- accounts to transactions (one account has many transactions)

- categories to transactions (one category has many transactions)

- **Many-to-Many:**

- transactions and tags (via transaction_tags join table)

This data model provides a solid, extensible foundation for your personal finance application, supporting both individual and shared financial management needs, with a clear path for email and password authentication.

## **5\. Access Control and Permissions**

The permission model is intentionally simple: all users within a household have full read/write access to all household data. This includes:

- **Full Access:** Users can view, create, edit, and delete all transactions, accounts, categories, and tags within their household

- **Account Visibility:** While accounts are owned by specific users, all household members can view and use any account for transactions

- **No Role-Based Permissions:** There are no admin/member distinctions - all household members have equal access

- **Household Isolation:** Users can only access data from their own household

This design prioritizes simplicity and trust within household relationships over complex permission systems.

## **6. Budgeting/Planning Feature**

### 6.1. Overview

- Users assign planned amounts per category for a specific month.
- Planning data is stored in `category_budgets`; each row represents a single `(household, category, month)` plan.
- Computed values like monthly "spent" per category and "available" (`planned - spent`) are derived from `transactions` and are not stored in `category_budgets`.
- v1 treats months independently (no rollover). Each month starts fresh.

### 6.2. Month Semantics

- `month` uses the format 'YYYY-MM'.
- The month maps to an inclusive date range from the first to the last day of the calendar month for reporting/aggregation.

### 6.3. Record Creation Strategy

- Rows in `category_budgets` are created via upsert when a user assigns a planned amount for a given `(category, month)`.
- No pre-creation of rows for every category/month. If there is no plan for a category in a month, there is no row.
- Future months use the same flow: navigate to a future month and assign values to create those rows.
- Optional future enhancement: a server-side "clone month" action can bulk-create target month rows from a source month.

### 6.4. Querying Budgets

- Primary filter is `month`. Access is implicitly scoped by the authenticated user's `household_id`.
- Responses focus on persisted `category_budgets` rows (records that exist) without computed fields or summary meta in v1.

### 6.5. Integrity and Indexing

- UNIQUE `(household_id, category_id, month)` ensures a single plan per category/month/household.
- INDEX `(household_id, month)` supports fast retrieval of a household's plans for a month.

### 6.6. Zero Values & Deletion

- Implementations may delete a row when `planned_amount` becomes zero to keep the table sparse, or keep zero-value rows for history; both are supported by the schema.
