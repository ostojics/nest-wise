/**
 * Email payload for sending invite emails
 */
export interface SendInviteEmailRequest {
  to: string;
  householdName: string;
  inviteToken: string;
  webAppUrl: string;
}

/**
 * Email payload for sending password reset emails
 */
export interface SendPasswordResetEmailRequest {
  to: string;
  resetToken: string;
  webAppUrl: string;
}

/**
 * Email payload for sending email change confirmation
 */
export interface SendEmailChangeConfirmationRequest {
  to: string;
  confirmationToken: string;
  webAppUrl: string;
}

/**
 * Email payload for sending help emails
 */
export interface SendHelpEmailRequest {
  userEmail: string;
  userId?: string;
  message: string;
  supportEmail: string;
}

/**
 * Dependency injection token for IEmailProvider
 */
export const EMAIL_PROVIDER = Symbol('IEmailProvider');

/**
 * Interface for Email provider abstraction
 * Allows swapping email providers (Resend, SendGrid, AWS SES, etc.) without changing business logic
 */
export interface IEmailProvider {
  /**
   * Send an invite email to join a household
   */
  sendInviteEmail(request: SendInviteEmailRequest): Promise<void>;

  /**
   * Send a password reset email
   */
  sendPasswordResetEmail(request: SendPasswordResetEmailRequest): Promise<void>;

  /**
   * Send an email change confirmation
   */
  sendEmailChangeConfirmation(request: SendEmailChangeConfirmationRequest): Promise<void>;

  /**
   * Send a help/support email
   */
  sendHelpEmail(request: SendHelpEmailRequest): Promise<void>;
}
