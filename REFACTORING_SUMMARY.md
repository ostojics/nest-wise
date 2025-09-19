# Users Endpoints Refactoring Summary

## Overview

This implementation refactors the users endpoints to be household-scoped as specified in issue #54.

## Changes Made

### Backend Changes

#### New Endpoints

1. **GET /v1/households/{householdId}/users**
   - Retrieves all users in a specific household
   - Requires authentication
   - Validates that the requesting user belongs to the specified household

2. **POST /v1/households/{householdId}/invites**
   - Invites a user to a specific household
   - Requires authentication
   - Validates that the requesting user belongs to the specified household

3. **POST /v1/invites/accept** (moved from users controller)
   - Global endpoint for accepting invites
   - Does not require authentication (token-based)
   - Moved to separate InvitesController

#### Legacy Endpoints (Phase 1 Deprecation)

- **GET /v1/users** - marked as deprecated with headers
- **POST /v1/users/invites** - marked as deprecated with headers
- Deprecation headers include:
  - `Deprecation: true`
  - `Sunset: 2025-06-01`
  - `Link: <new-endpoint>; rel="successor-version"`

#### Implementation Details

- Created new `InvitesController` for global invite acceptance
- Updated `HouseholdsController` with new household-scoped endpoints
- Added proper authorization checks using current user's household ID
- Resolved circular dependency issues between modules using `forwardRef()`
- Updated Swagger documentation with proper parameter definitions

### Frontend Changes

#### API Client Updates

- Added `getHouseholdUsers(householdId)` function
- Added `inviteUserToHousehold(householdId, dto)` function
- Updated `acceptInvite()` to use new endpoint
- Maintained backward compatibility with legacy functions

#### Hooks Updates

- Added `useGetHouseholdUsers()` hook that automatically uses current user's household ID
- Added `useInviteUserToHousehold()` hook that automatically uses current user's household ID
- Updated existing components to use new household-scoped hooks

#### Component Updates

- Updated `UsersList` component to use `useGetHouseholdUsers()`
- Updated `InviteUserDialog` component to use `useInviteUserToHousehold()`
- Added proper query key structure for household-scoped caching

## Authorization Model

The new endpoints implement proper authorization:

- Users can only access users from their own household
- Users can only invite new users to their own household
- Authentication is enforced via the existing `AuthGuard`
- Current user's household ID is validated against the requested household ID

## Migration Strategy

**Phase 1 (Current):**

- New endpoints are available and functional
- Legacy endpoints remain active with deprecation headers
- Frontend uses new endpoints by default
- Backward compatibility maintained

**Phase 2 (Future):**

- Remove legacy endpoints after sunset date
- Update any remaining client code
- Clean up deprecated API functions

## Testing Status

- ✅ Backend builds successfully
- ✅ Frontend builds successfully
- ✅ ESLint passes
- ✅ Route definitions verified
- ✅ Module dependencies resolved
- ⚠️ Full integration testing requires database setup

## Files Modified

### Backend

- `apps/core-api/src/households/households.controller.ts` - Added new endpoints
- `apps/core-api/src/households/households.module.ts` - Added dependencies
- `apps/core-api/src/invites/invites.controller.ts` - New controller (created)
- `apps/core-api/src/invites/invites.module.ts` - New module (created)
- `apps/core-api/src/users/users.controller.ts` - Added deprecation headers
- `apps/core-api/src/users/users.module.ts` - Fixed circular dependency
- `apps/core-api/src/app.module.ts` - Added InvitesModule

### Frontend

- `apps/web/src/modules/api/users-api.ts` - Added new API functions
- `apps/web/src/modules/api/query-keys.ts` - Added household-scoped query keys
- `apps/web/src/modules/users/hooks/use-get-users.ts` - Added new hooks
- `apps/web/src/modules/users/hooks/use-invite-user.ts` - Added new hooks
- `apps/web/src/modules/users/components/users-list.tsx` - Updated to use new hooks
- `apps/web/src/modules/users/components/invite-user-dialog.tsx` - Updated to use new hooks

## API Documentation

The new endpoints are fully documented in Swagger with:

- Proper parameter definitions
- Response schemas
- Error codes
- Authentication requirements
- Examples

Access the Swagger documentation at `/swagger` when the API is running.
