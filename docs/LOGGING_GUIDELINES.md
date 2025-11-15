# Logging Guidelines

## Overview

This document outlines the logging strategy for the NestWise backend application. We use Pino for structured logging with support for correlation IDs and proper log levels.

## Log Levels

Use the following log levels appropriately:

- **error**: Application errors that require immediate attention (e.g., database connection failures, unhandled exceptions)
- **warn**: Warning conditions that should be reviewed but don't prevent normal operation (e.g., deprecated API usage, fallback mechanisms triggered)
- **info**: General informational messages about application flow (e.g., server started, jobs enqueued, key business operations)
- **debug**: Detailed debugging information useful during development (e.g., variable values, intermediate calculations)
- **trace**: Very detailed trace information (rarely used in production)

## Structured Logging

Always use structured logging with meaningful fields:

```typescript
// ✅ Good
this.logger.info('Transaction created', {
  transactionId: transaction.id,
  accountId: transaction.accountId,
  amount: transaction.amount,
  type: transaction.type,
});

// ❌ Bad
this.logger.info(`Transaction ${transaction.id} created for account ${transaction.accountId}`);
```

## Security - Never Log Secrets

**CRITICAL**: Never log sensitive information:

- API keys (OPENAI_API_KEY, RESEND_API_KEY, etc.)
- Passwords or password hashes
- JWT tokens
- Personal identifiable information (PII) unless necessary and approved
- Credit card numbers or financial credentials

```typescript
// ❌ NEVER do this
this.logger.debug('OpenAI request', {apiKey: config.openaiApiKey});

// ✅ Do this instead
this.logger.debug('OpenAI request', {model: 'gpt-4o-mini'});
```

## Correlation IDs (Request IDs)

Every HTTP request should have a correlation ID that flows through all related log messages. This is automatically added by the logging interceptor.

```typescript
// The logger automatically includes requestId when available
this.logger.info('Processing transaction', {
  transactionId: '123',
  // requestId is automatically added by the interceptor
});
```

## Standard Fields

Include these standard fields when applicable:

- `userId`: User ID performing the action
- `householdId`: Household context
- `feature`: Feature/module name (e.g., 'transactions', 'accounts')
- `operation`: Specific operation being performed
- `duration`: Time taken for operations (in milliseconds)
- `error`: Error object (for error logs)

## Error Logging

When logging errors, include the full error object and context:

```typescript
try {
  // ... operation
} catch (error) {
  this.logger.error('Failed to create transaction', {
    error,
    transactionData: {...transactionData, accountId: 'xxx'}, // Sanitize if needed
    feature: 'transactions',
  });
  throw error;
}
```

## Performance Logging

For performance-sensitive operations, log duration:

```typescript
const startTime = Date.now();
// ... operation
const duration = Date.now() - startTime;
this.logger.info('Operation completed', {
  operation: 'bulk-import',
  recordCount: records.length,
  duration,
});
```

## What NOT to Log

- Secrets and credentials
- Full request/response bodies (unless debugging specific issues in dev)
- Excessive logs in tight loops (use sampling or aggregate)
- User passwords or tokens
- Internal system details that could expose security vulnerabilities

## Best Practices

1. **Be concise**: Log messages should be clear and to the point
2. **Be consistent**: Use similar log messages for similar operations
3. **Use appropriate levels**: Don't use `error` for warnings or `info` for debug messages
4. **Include context**: Provide enough information to understand what happened without the code
5. **Think about querying**: Structure logs so they can be easily searched and filtered
6. **Review regularly**: Periodically review logs to ensure they're useful and not excessive
