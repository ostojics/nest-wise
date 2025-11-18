import {Module} from '@nestjs/common';
import {AuditLogEventHandler} from './audit-log.event-handler';

/**
 * Module for domain event handlers.
 *
 * Event handlers respond to domain events emitted by use cases.
 * They enable adding cross-cutting concerns (logging, analytics, notifications)
 * without modifying core business logic.
 *
 * To add a new event handler:
 * 1. Create a class decorated with @Injectable()
 * 2. Add methods decorated with @OnEvent('event.name')
 * 3. Register the handler in this module's providers
 */
@Module({
  providers: [
    AuditLogEventHandler,
    // Add more event handlers here as needed:
    // - AnalyticsEventHandler
    // - NotificationEventHandler
    // - BudgetAlertEventHandler
  ],
})
export class EventHandlersModule {}
