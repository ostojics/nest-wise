export interface SendInviteEmailPayload {
  email: string;
  householdName: string;
  householdId: string;
}

export interface SendPasswordResetEmailPayload {
  email: string;
  userId: string;
}
