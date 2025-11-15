/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Error Reporting Service
 *
 * Centralized error reporting abstraction for the application.
 * Abstracts PostHog usage behind a clean interface, making it easy to:
 * - Switch analytics providers
 * - Add multiple providers
 * - Disable tracking in certain environments
 * - Add consistent error metadata
 */

interface ErrorContext {
  feature?: string;
  operation?: string;
  userId?: string;
  [key: string]: any;
}

interface ErrorMetadata {
  timestamp?: string;
  userAgent?: string;
  url?: string;
  [key: string]: any;
}

/**
 * Reports an error to the error tracking system (PostHog)
 * @param error - The error object or message
 * @param context - Contextual information about where the error occurred
 * @param metadata - Additional metadata to attach to the error
 */
export async function reportError(
  error: Error | string,
  context?: ErrorContext,
  metadata?: ErrorMetadata,
): Promise<void> {
  try {
    // Dynamically import PostHog to avoid bundling if not needed
    const {default: posthog} = await import('posthog-js');

    // Ensure we have an error object
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    // Combine context and metadata
    const properties = {
      ...context,
      ...metadata,
      timestamp: metadata?.timestamp ?? new Date().toISOString(),
      userAgent: metadata?.userAgent ?? navigator.userAgent,
      url: metadata?.url ?? window.location.href,
    };

    // Report to PostHog
    posthog.captureException(errorObj, {
      context: {
        feature: context?.feature,
        operation: context?.operation,
      },
      ...properties,
    });
  } catch {
    // Fail silently to avoid breaking the app if error reporting fails
  }
}

/**
 * Reports a warning to the error tracking system
 * Similar to reportError but for non-critical issues
 * @param message - Warning message
 * @param context - Contextual information
 * @param metadata - Additional metadata
 */
export async function reportWarning(message: string, context?: ErrorContext, metadata?: ErrorMetadata): Promise<void> {
  try {
    const {default: posthog} = await import('posthog-js');

    posthog.capture('warning', {
      message,
      ...context,
      ...metadata,
      timestamp: metadata?.timestamp ?? new Date().toISOString(),
      url: metadata?.url ?? window.location.href,
    });
  } catch {
    // Fail silently to avoid breaking the app if error reporting fails
  }
}

/**
 * Reports a custom event to the analytics system
 * @param eventName - Name of the event
 * @param properties - Event properties
 */
export async function reportEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
  try {
    const {default: posthog} = await import('posthog-js');

    posthog.capture(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Fail silently to avoid breaking the app if error reporting fails
  }
}
