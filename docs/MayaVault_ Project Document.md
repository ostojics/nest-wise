# **Personal Finance Application: Project Document**

## **1\. Introduction**

This document outlines the scope and vision for a modern, intelligent personal finance application designed for self-hosting. Moving beyond traditional spreadsheet-based tracking, this application aims to provide deeper insights, automate tedious tasks, and foster better financial habits through smart categorization, intuitive reporting, and a focus on user-centric design.

## **2\. Problems Being Solved**

The current manual Excel-based tracking, while functional, presents several pain points and limitations that this application will address:

- **Lack of Granular Insight:** Simple sum columns don't provide a clear picture of where money is _actually_ going across different spending categories. It's hard to identify areas for reduction without significant manual analysis.
- **Tedious Manual Categorization:** Manually tagging and grouping transactions is repetitive and prone to inconsistency, especially when dealing with daily entries. This friction can lead to abandonment.
- **Absence of Projections & Goal Tracking:** Excel struggles to dynamically project future financial states based on current trends or to clearly visualize progress towards specific financial goals (like saving for Bitcoin).
- **Mental Friction with Large Purchases:** Without a clear understanding of overall financial health and projections, significant purchases can induce unnecessary guilt or hesitation, even when financially sound.
- **Limited Collaboration:** Excel is not designed for seamless shared financial tracking with a partner, requiring cumbersome manual merging or separate spreadsheets.
- **Data Portability & Control:** While Excel files are portable, the desire for a structured, self-hosted solution emphasizes full data ownership and easy export/import.
- **Lack of Behavioral Nudges:** Traditional tools don't offer proactive feedback or insights to encourage better spending habits.

## **3\. Minimum Viable Product (MVP) Features**

The MVP will focus on delivering the core value proposition of intelligent transaction management and essential reporting, with the shared household feature built into the data model from the start.

### **3.1. User & Household Management**

- **User Registration & Authentication:** Secure login for individual users.
- **Household Creation:** Ability for a user to create a new financial household (e.g., "My Personal Finances").
- **User-to-Household Linking:** The creator of a household is automatically linked.
- **Adding Users to Household:** Functionality to invite/add other registered users (e.g., a partner) to an existing household. All users within a household have full read/write access to its financial data.

### **3.2. Intelligent Transaction Entry**

- **Manual Transaction Input:** A streamlined, mobile-first interface for quickly adding transactions. Fields will include:
  - **Description:** Free-form text input (e.g., "Coffee from Starbucks $5", "Groceries Mercator 45").
  - **Amount:** Numeric value.
  - **Transaction Date:** Defaults to current date, easily changeable.
  - **Account Selection:** Dropdown to select the financial account (e.g., "Checking," "Credit Card").
- **LLM-Powered Smart Categorization & Tagging:**
  - Upon description input, an integrated LLM will **propose a primary category** (e.g., "Dining Out," "Groceries," "Transport") and **suggest relevant tags** (e.g., "\#Coffee", "\#WorkExpense", "\#TreatYourself").
  - Users can accept the suggestions, choose from alternative suggestions, or manually select/create categories and tags.
  - The LLM will learn from user corrections over time, improving accuracy.
- **Account Management:**
  - Ability to add, edit, and view different financial accounts (Checking, Savings, Credit Card, Cash, etc.).
  - Manual input of initial and current balances for each account.

### **3.3. Core Reporting & Insights**

- **Dashboard Overview:**
  - **Current Month Summary:** Display "Total Spent," "Total Income" (once income is added, see future features), and "Net Balance" for the current month.
  - **Spending Breakdown:** A visual representation (e.g., pie chart) of spending distribution across the top categories for the current month.
- **Basic Transaction List:** A sortable and filterable list of all transactions within a selected period (e.g., current month, last 3 months).
- **Category-wise Spending:** View total spending for each category within a selected period.

### **3.4. Data Management**

- **CSV Import:** Functionality to import existing transaction data from Excel spreadsheets (CSV format). The LLM can assist in parsing imported descriptions for categorization.
- **CSV Export:** Ability to export all household financial data to a CSV file.

### **3.5. Technical Foundation**

- **Self-Hostable Architecture:** Designed for easy deployment via Docker.
- **Progressive Web App (PWA):** Responsive design for seamless use on desktop and mobile browsers, with "Add to Home Screen" functionality.
- **Relational Database:** PostgreSQL for robust data storage, with the shared household model implemented.
- **Frontend Framework:** React for a dynamic and interactive user interface.
- **LLM Integration:** Backend integration with the Gemini API for intelligent text processing.

## **4\. Expected Development Time (Estimate for a Single SWE)**

This is a rough estimate and can vary significantly based on experience, chosen technologies, and unforeseen challenges. It assumes a dedicated effort.

- **Phase 1: Core Infrastructure & User/Household Management (2-3 weeks)**
  - Database schema setup (Users, Households, User_Households, Accounts, Categories, Transactions, Tags).
  - Backend API for user registration, login, household creation/management.
  - Basic frontend for user authentication and household selection.
  - PWA setup (manifest, service worker for basic caching).
- **Phase 2: Manual Transaction Entry & Account Management (3-4 weeks)**
  - Frontend forms for adding transactions and managing accounts.
  - Backend logic for saving transactions and updating account balances.
  - Basic validation.
- **Phase 3: LLM Integration & Smart Categorization (4-6 weeks)**
  - Integration with Gemini API for text processing.
  - Developing the logic for LLM-suggested categories and tags.
  - Implementing user feedback loop for LLM (accept/reject/correct suggestions).
  - UI for displaying and managing categories and tags.
- **Phase 4: Core Reporting & Data Import/Export (3-4 weeks)**
  - Dashboard development (current month summary, spending breakdown).
  - Transaction list with sorting and filtering.
  - CSV import/export functionality, including LLM assistance for imported data.
- **Phase 5: Polish, Testing & Deployment (2-3 weeks)**
  - UI/UX refinements, ensuring mobile responsiveness and a smooth user experience.
  - Comprehensive testing (unit, integration, end-to-end).
  - Documentation for self-hosting.
  - Error handling and robust logging.

**Total Estimated MVP Development Time: 14-20 weeks (approx. 3.5 \- 5 months)**

### **Post-MVP Enhancements (Future Considerations)**

- **Income Tracking:** Dedicated features for logging income sources.
- **Budgeting:** Setting monthly budgets per category and tracking against them.
- **Financial Goals:** Specific goal tracking (e.g., "Save $X for Bitcoin by Y date").
- **Advanced Projections:** More sophisticated forecasting based on historical data.
- **Recurring Transactions:** Automation for subscriptions and regular bills.
- **Net Worth Tracking:** Visualizing assets vs. liabilities over time.
- **Behavioral Nudges:** More advanced LLM-driven personalized insights and suggestions.
- **Receipt Uploads:** Attaching images of receipts to transactions.
- **Advanced Reports:** Customizable reports with more filtering and visualization options.

This project offers a significant opportunity to build a truly valuable and intelligent tool that goes beyond what's currently available in the open-source self-hosted space.

## **6. Budgeting/Planning Feature (Initial)**

### 6.1. What it allows

- **Plan by category, per month**: Users assign a planned amount to each spending category for a selected month.
- **Track progress as you spend**: As expense transactions are recorded and categorized, the UI shows how much of the plan is consumed.
- **Month navigation**: Users switch months (past/current/future) to review or plan allocations. Each month is independent in this initial version.
- **Simple setup**: All categories are visible in the planning view so users can quickly fill planned amounts. Optional “copy previous month” can prefill future months later on.

### 6.2. Scope (MVP)

- **Independent months**: No rollover rules (no overspend/underspend carryover) in v1.
- **Expense focus**: “Spent” is derived only from expense transactions in that month. Income handling remains separate.

### 6.3. How it works (Developer view)

- **Data persistence**: Planned amounts are stored per `(household, category, month)` in the `category_budgets` table.
- **Record creation**: Budget rows are created/updated on demand when a user edits a planned amount (no pre-creation for every category/month).
- **Querying**: The primary filter is `month` (format `YYYY-MM`). The system returns persisted budget rows for that household and month. Any computed values (like spent/available) are derived from `transactions` and not stored.
- **Consistency**: A unique key enforces a single row per `(household, category, month)`.

### 6.4. Out of scope for v1 (future-ready)

- **Rollover rules** for overspend/underspend.
- **Auto-allocation rules** (e.g., recurring budgets, percentages).
- **Advanced summaries/insights** beyond basic progress.

This feature keeps the first iteration simple, familiar (YNAB-inspired), and focused on clear monthly planning while leaving room to add rollover logic and richer automation later.
