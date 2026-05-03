# Project Overview

## Project Name

TitleFlow: Secure Digital Vehicle Title & Lien Processing System

## Problem

Paper-based vehicle title processing is slow, difficult to track, and error-prone. TitleFlow solves a simplified version of this problem by creating a secure digital workflow for title applications, lien management, document uploads, audit logs, and notifications.

## Main Users

### Dealer

Creates and submits title applications.

### DMV Clerk

Reviews submitted applications and approves, rejects, or requests more information.

### Lender

Adds, manages, and releases liens.

### Admin

Manages users, roles, and system-level records.

## Main Workflow

1. Dealer creates draft title application.
2. Dealer enters vehicle and owner information.
3. Dealer uploads documents.
4. Dealer submits the application.
5. DMV clerk reviews the application.
6. DMV clerk approves, rejects, or requests more information.
7. Lender manages lien records.
8. System records audit logs and notifications.

## MVP Scope

The first working version will include:

- User login
- Role-based access
- Title application CRUD
- Vehicle information
- Owner information
- Application status workflow
- PostgreSQL database
- Basic React dashboard

## Out of Scope for MVP

These will be added later:

- AWS deployment
- RabbitMQ notifications
- S3 file storage
- Full CI/CD
- Advanced admin tools