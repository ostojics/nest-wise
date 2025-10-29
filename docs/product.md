# Product Overview

## Product Name and Purpose

**NestWise** is a comprehensive budgeting application designed specifically for couples and shared households who want to coordinate their finances effectively while maintaining privacy controls for individual transactions.

## Problem It Solves

Managing finances as a couple or shared household presents unique challenges:

- **Coordination Complexity**: Multiple people need to track income, expenses, and budgets across shared accounts
- **Visibility vs Privacy**: Need transparency for shared expenses while maintaining privacy for personal transactions
- **Budget Planning**: Difficulty setting and tracking category-based budgets for household expenses
- **Financial Insights**: Lack of clear reporting on spending patterns and net worth progression
- **Account Management**: Complex tracking of multiple accounts, balances, and inter-account transfers

NestWise solves these problems by providing a household-centric approach to financial management with both shared and private transaction capabilities.

## Target Users

- **Primary**: Couples managing shared finances together
- **Secondary**: Small households (roommates, family members) coordinating shared expenses
- **Use Cases**:
  - Married couples combining finances
  - Partners living together sharing expenses
  - Roommates tracking shared bills and expenses
  - Family members managing household budgets

## Key Features

### Core Financial Management

#### **Households**

- Shared context where all financial data is scoped
- Multiple users per household with invitation system
- Household-level currency settings and monthly budgets
- Policy-based authorization for sensitive operations

#### **Accounts**

- Track balances and movements per financial account
- Support for multiple account types (checking, savings, credit cards)
- Account ownership within household context
- Inter-account transfers with automatic balance updates

#### **Categories**

- Organize spending and income for analytics and budgeting
- Household-scoped categories for consistent organization
- Used for transaction classification and budget planning

#### **Transactions**

- Complete transaction management (create, read, update, delete)
- Advanced filtering by date ranges, accounts, categories, and transaction types
- Full-text search capabilities across transaction descriptions
- Sorting and pagination for large transaction sets
- AI-assisted transaction categorization

#### **Private Transactions**

- User-scoped transactions separate from shared household views
- Maintains privacy while participating in household finances
- Private transaction management with same filtering/search capabilities

### Budget Planning & Tracking

#### **Category Budgets**

- Monthly budget limits per category at household level
- Track spending against budget targets
- Visual progress indicators for budget adherence

### Member Management

#### **User Invitations**

- Invite partners/roommates to join household
- Role-aware operations via integrated policies module
- Secure invitation system with email-based workflow

#### **Authentication & Authorization**

- JWT-based authentication with secure cookie storage
- Setup flow for new households and users
- Current user profile management (`/v1/auth/me`)
- Login, logout, and session management

### Reporting & Analytics

#### **Financial Reports**

- Net worth trend analysis over time
- Spending analysis by accounts (household-scoped)
- Category-based spending breakdowns

## Primary User Flows

### 1. Initial Onboarding

1. **Setup Account**: Create first user account and household
2. **Account Setup**: Add initial financial accounts (checking, savings, etc.)
3. **Category Creation**: Set up initial spending and income categories
4. **Initial Budget**: Configure monthly budget targets

### 2. Partner Invitation

1. **Send Invitation**: Invite partner/roommate via email
2. **Account Creation**: Partner creates account and joins household
3. **Shared Access**: Both users can now manage household finances

### 3. Daily Financial Management

1. **Transaction Entry**: Add transactions manually or via import
2. **Categorization**: Assign categories (with AI assistance)
3. **Review & Reconcile**: Regular review of account balances and transactions
4. **Private Transactions**: Add personal transactions when needed

### 4. Budget Planning & Monitoring

1. **Set Monthly Budgets**: Configure spending limits by category
2. **Track Progress**: Monitor spending against budget targets
3. **Adjust Budgets**: Modify budget allocations based on spending patterns

### 5. Financial Analysis

1. **Review Reports**: Analyze net worth trends and spending patterns
2. **Account Analysis**: Review spending by different accounts
3. **Category Insights**: Understand spending distribution across categories

## Value Proposition

NestWise provides couples and shared households with:

- **Unified Financial View**: Complete picture of household finances across all accounts
- **Privacy Controls**: Balance transparency with personal privacy needs
- **Automated Insights**: AI-powered categorization and trend analysis
- **Budget Discipline**: Clear budget targets with progress tracking
- **Collaborative Management**: Multiple users managing finances together
- **Comprehensive Reporting**: Deep insights into spending patterns and financial health

This combination of shared visibility and private controls makes NestWise ideal for couples and households who want to coordinate their finances without sacrificing individual privacy or autonomy.
