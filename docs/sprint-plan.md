# Sprint Plan

TitleFlow will be built in focused sprints. Each sprint should produce one working piece of the project and teach one major software engineering skill.

---

## Sprint 0: Project Setup and Planning

### Goal

Create the project foundation before writing application code.

### Build

- GitHub repository
- Main project folder
- `backend` folder
- `frontend` folder
- `docs` folder
- README
- project overview document
- database design document
- API plan document

### Learn

- Project organization
- Git basics
- README writing
- Planning before coding

### Definition of Done

- Repository exists
- IntelliJ opens the full project workspace
- `README.md` exists
- `docs/project-overview.md` exists
- `docs/database-design.md` exists
- `docs/api-plan.md` exists
- `backend/` folder exists
- `frontend/` folder exists
- First commit is pushed to GitHub

---

## Sprint 1: Backend Foundation

### Goal

Create the Spring Boot backend and connect it to PostgreSQL.

### Build

- Spring Boot project inside `backend/`
- Java 21 setup
- PostgreSQL connection
- basic health endpoint
- base package structure
- `User` entity
- `Role` entity
- repositories

### Learn

- Java 21
- Spring Boot
- Maven
- PostgreSQL
- JPA/Hibernate
- repository pattern
- application configuration

### Definition of Done

- Backend runs locally
- PostgreSQL runs locally
- Backend connects to PostgreSQL
- `/api/health` returns a response
- `users` and `roles` tables are created
- Code is committed

---

## Sprint 2: Authentication and Security

### Goal

Add user registration, login, JWT authentication, and role-based access control.

### Build

- register endpoint
- login endpoint
- password hashing with BCrypt
- JWT generation
- JWT validation filter
- protected endpoints
- role-based endpoint example

### Learn

- Spring Security
- authentication
- authorization
- JWT
- BCrypt
- `401 Unauthorized` vs `403 Forbidden`

### Definition of Done

- User can register
- Password is hashed in the database
- User can log in
- Login returns JWT
- Protected endpoints require token
- Wrong role gets blocked

---

## Sprint 3: Title Application MVP

### Goal

Build the main dealer title application workflow.

### Build

- `TitleApplication` entity
- `Vehicle` entity
- `Owner` entity
- application status enum
- create draft application
- edit draft application
- submit application
- get applications for current user

### Learn

- REST APIs
- DTOs
- service layer
- validation
- entity relationships
- workflow states

### Definition of Done

- Dealer can create draft application
- Dealer can edit draft application
- Dealer can submit application
- Submitted application cannot be edited like a draft
- Dealer only sees their own applications
- Data saves correctly in PostgreSQL

---

## Sprint 4: DMV Review Workflow

### Goal

Allow DMV clerks to review submitted title applications.

### Build

- list submitted applications
- start review action
- approve action
- reject action
- request more information action
- status transition validation

### Learn

- business rules
- role-based workflow
- custom exceptions
- service-layer validation
- HTTP status codes

### Definition of Done

- DMV clerk can view submitted applications
- DMV clerk can start review
- DMV clerk can approve applications
- DMV clerk can reject applications
- DMV clerk can request more information
- Dealer cannot approve or reject applications
- Invalid status transitions are blocked

---

## Sprint 5: Audit Logging

### Goal

Record important system actions.

### Build

- `AuditLog` entity
- audit repository
- audit service
- application audit log endpoint
- automatic audit records for major actions

### Learn

- traceability
- audit logging
- append-only records
- service composition
- security logging

### Definition of Done

- Application creation creates audit log
- Application submission creates audit log
- Status changes create audit logs
- Audit logs include actor, action, timestamp, and description
- Users cannot edit or delete audit logs

---

## Sprint 6: Secure Document Upload

### Goal

Allow users to upload and access application documents safely.

### Build

- `Document` entity
- `DocumentType` enum
- storage service interface
- local storage implementation
- upload endpoint
- document list endpoint
- download endpoint
- file validation

### Learn

- multipart file upload
- file type validation
- file size validation
- secure storage design
- document metadata
- access control

### Definition of Done

- Allowed files can be uploaded
- Invalid file types are rejected
- File metadata is saved in PostgreSQL
- Documents are linked to applications
- Unauthorized users cannot access documents
- Upload action creates audit log

---

## Sprint 7: Lien Management

### Goal

Allow lenders to manage lien records.

### Build

- `Lien` entity
- `LienStatus` enum
- lien repository
- lien service
- add lien endpoint
- request release endpoint
- release lien endpoint
- view liens endpoint

### Learn

- relational modeling
- financial workflow logic
- role-specific permissions
- state transitions
- validation

### Definition of Done

- Lender can add lien
- Lender can request lien release
- Lender can release lien
- Lien status changes are validated
- Lien actions create audit logs
- Unauthorized users are blocked

---

## Sprint 8: React Frontend Foundation

### Goal

Create the frontend shell and connect login to the backend.

### Build

- React app
- TypeScript setup
- Material UI setup
- React Router setup
- Axios client
- login page
- protected route component
- role-based redirect

### Learn

- React
- TypeScript
- Material UI
- routing
- Axios
- frontend authentication state

### Definition of Done

- Frontend runs locally
- User can log in from frontend
- JWT is stored
- Protected routes require login
- User is redirected based on role

---

## Sprint 9: Frontend Application Workflow

### Goal

Build the dealer-facing application workflow.

### Build

- dealer dashboard
- application list page
- create application form
- application detail page
- submit application button
- status badge
- loading states
- error states

### Learn

- forms
- tables
- reusable components
- frontend API calls
- loading and error handling
- role-based UI

### Definition of Done

- Dealer can create application from UI
- Dealer can submit application from UI
- Dealer can view application status
- Errors display clearly
- Main dealer workflow works end-to-end

---

## Sprint 10: DMV, Documents, and Liens UI

### Goal

Add the remaining important frontend workflows.

### Build

- DMV review page
- approve/reject/request info buttons
- document upload component
- document list
- audit log table
- lien management page

### Learn

- complex page state
- role-based UI rendering
- confirmation dialogs
- file upload from frontend
- workflow UI design

### Definition of Done

- DMV clerk can review applications from UI
- Documents can be uploaded from UI
- Audit logs display in UI
- Lender can manage liens from UI

---

## Sprint 11: RabbitMQ Notifications

### Goal

Add async event processing and notifications.

### Build

- RabbitMQ Docker service
- event model
- event publisher
- event consumer
- notification records
- notification endpoint
- notification UI

### Learn

- RabbitMQ
- message queues
- producer/consumer pattern
- async communication
- event-driven architecture

### Definition of Done

- RabbitMQ runs locally
- Backend publishes events
- Consumer receives events
- Notifications are created from events
- Frontend displays notifications

---

## Sprint 12: Testing

### Goal

Add tests for important backend and frontend workflows.

### Build

- backend service tests
- backend controller tests
- frontend component tests
- protected route tests

### Learn

- JUnit
- Mockito
- Spring Boot Test
- MockMvc
- React Testing Library

### Definition of Done

- Auth service has tests
- Title application workflow has tests
- Invalid status transitions are tested
- Role permissions are tested
- Frontend login page has tests
- Protected routes have tests

---

## Sprint 13: Docker Compose Local Environment

### Goal

Run the full app locally with Docker Compose.

### Build

- backend Dockerfile
- frontend Dockerfile
- PostgreSQL Docker service
- RabbitMQ Docker service
- full `docker-compose.yml`
- environment variables
- persistent volumes

### Learn

- Docker
- Docker Compose
- container networking
- environment variables
- production-like local setup

### Definition of Done

- `docker compose up` starts the system
- Frontend talks to backend
- Backend talks to PostgreSQL
- Backend talks to RabbitMQ
- Documents upload locally

---

## Sprint 14: CI/CD Basics

### Goal

Use GitHub Actions to automatically test and validate the app.

### Build

- backend GitHub Actions workflow
- frontend GitHub Actions workflow
- pull request checks
- build validation

### Learn

- GitHub Actions
- CI basics
- automated testing
- build pipelines

### Definition of Done

- Backend tests run automatically
- Frontend tests/build run automatically
- Workflow runs on push or pull request
- Failed tests fail the workflow

---

## Sprint 15: AWS Storage and Database

### Goal

Move document storage and database to AWS.

### Build

- S3 bucket
- `S3StorageService`
- production storage profile
- RDS PostgreSQL database
- production database configuration

### Learn

- AWS S3
- IAM permissions
- AWS RDS
- security groups
- Spring profiles
- environment variables

### Definition of Done

- Files upload to S3 in production profile
- Local file storage still works locally
- Backend connects to RDS
- Application data saves to RDS

---

## Sprint 16: AWS Deployment

### Goal

Deploy the backend and frontend.

### Build

- backend Docker image
- ECR repository
- ECS Fargate service
- CloudWatch logs
- frontend deployment with AWS Amplify

### Learn

- ECR
- ECS Fargate
- CloudWatch
- production deployment
- production environment variables

### Definition of Done

- Backend is deployed
- Frontend is deployed
- Frontend calls backend
- Login works in production
- Main workflow works online

---

## Final Rule

Build the local working system first.

Do not start with AWS, RabbitMQ, or a fancy frontend before the core backend workflow works.