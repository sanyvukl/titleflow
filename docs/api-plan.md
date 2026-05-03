# API Plan

Base URL:

```text
/api
```

---

## Auth Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive JWT | Public |
| GET | `/api/auth/me` | Get current logged-in user | Authenticated |

---

## User Endpoints

Admin-only endpoints for managing users.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/{id}` | Get user by ID | Admin |
| POST | `/api/users` | Create user | Admin |
| PUT | `/api/users/{id}` | Update user | Admin |
| PATCH | `/api/users/{id}/disable` | Disable user account | Admin |
| PATCH | `/api/users/{id}/enable` | Enable user account | Admin |

---

## Title Application Endpoints

Endpoints for creating and managing title applications.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/title-applications` | Get applications visible to current user | Authenticated |
| GET | `/api/title-applications/{id}` | Get application details | Authorized user |
| POST | `/api/title-applications` | Create draft application | Dealer |
| PUT | `/api/title-applications/{id}` | Update draft application | Dealer owner |
| DELETE | `/api/title-applications/{id}` | Delete draft application | Dealer owner/Admin |

---

## Title Application Workflow Endpoints

Endpoints that change application status.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/title-applications/{id}/submit` | Submit draft application | Dealer owner |
| POST | `/api/title-applications/{id}/start-review` | Mark application as under review | DMV Clerk |
| POST | `/api/title-applications/{id}/request-more-info` | Request more information | DMV Clerk |
| POST | `/api/title-applications/{id}/approve` | Approve application | DMV Clerk |
| POST | `/api/title-applications/{id}/reject` | Reject application | DMV Clerk |
| POST | `/api/title-applications/{id}/issue-title` | Mark title as issued | DMV Clerk/Admin |

---

## Vehicle Endpoints

Vehicle data is connected to a title application.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/vehicles/{id}` | Get vehicle details | Authorized user |
| POST | `/api/title-applications/{applicationId}/vehicle` | Add vehicle to application | Dealer owner |
| PUT | `/api/vehicles/{id}` | Update vehicle data | Dealer owner while draft |

---

## Owner Endpoints

Owner data is connected to a title application.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/title-applications/{applicationId}/buyer` | Add buyer owner information | Dealer owner |
| POST | `/api/title-applications/{applicationId}/seller` | Add seller owner information | Dealer owner |
| PUT | `/api/owners/{id}` | Update owner information | Dealer owner while draft |
| GET | `/api/owners/{id}` | Get owner information | Authorized user |

---

## Lien Endpoints

Endpoints for lender lien management.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/liens` | Get liens visible to current user | Lender/Admin |
| GET | `/api/liens/{id}` | Get lien details | Authorized lender/Admin |
| POST | `/api/title-applications/{applicationId}/liens` | Add lien to application | Lender |
| POST | `/api/liens/{id}/request-release` | Request lien release | Lender |
| POST | `/api/liens/{id}/release` | Release lien | Lender |

---

## Document Endpoints

Endpoints for secure document upload and access.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/title-applications/{applicationId}/documents` | Upload document | Dealer owner/Authorized user |
| GET | `/api/title-applications/{applicationId}/documents` | List application documents | Authorized user |
| GET | `/api/documents/{documentId}/download` | Download document | Authorized user |
| DELETE | `/api/documents/{documentId}` | Delete document | Dealer owner/Admin |

---

## Audit Log Endpoints

Audit logs are read-only.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/title-applications/{applicationId}/audit-logs` | Get audit logs for one application | Authorized user |
| GET | `/api/audit-logs` | Get all audit logs | Admin |

---

## Notification Endpoints

Endpoints for user notifications.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/notifications` | Get current user's notifications | Authenticated |
| PATCH | `/api/notifications/{id}/read` | Mark notification as read | Notification owner |
| PATCH | `/api/notifications/read-all` | Mark all notifications as read | Authenticated |

---

## Notes

- All protected endpoints require a valid JWT.
- Public endpoints are limited to authentication routes.
- Dealers can only manage their own applications.
- DMV clerks can review submitted applications.
- Lenders can only manage lien records they are authorized to access.
- Admins have system-level access.
- Audit logs are append-only and cannot be edited or deleted.