export interface SendInviteEmailPayload {
  email: string;
  householdName: string;
  householdId: string;
}

export interface SendPasswordResetEmailPayload {
  email: string;
  userId: string;
}

export interface SendEmailChangeConfirmationPayload {
  userId: string;
  newEmail: string;
  token: string;
}
