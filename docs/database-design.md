# Database Design

The project will use PostgreSQL.

## Main Tables

- users
- roles
- user_roles
- title_applications
- vehicles
- owners
- liens
- documents
- audit_logs
- notifications

## users

Stores user account information.

Fields:

- id
- first_name
- last_name
- email
- password_hash
- status
- created_at
- updated_at

## roles

Stores system roles.

Fields:

- id
- name

Role examples:

- ADMIN
- DEALER
- DMV_CLERK
- LENDER
- DEVELOPER

## title_applications

Stores title application workflow data.

Fields:

- id
- application_number
- dealer_id
- vehicle_id
- buyer_owner_id
- seller_owner_id
- status
- submitted_at
- reviewed_at
- created_at
- updated_at

Statuses:

- DRAFT
- SUBMITTED
- UNDER_REVIEW
- NEEDS_MORE_INFO
- APPROVED
- REJECTED
- TITLE_ISSUED

## vehicles

Stores vehicle data.

Fields:

- id
- vin
- year
- make
- model
- body_type
- color
- odometer
- created_at
- updated_at

## owners

Stores buyer and seller data.

Fields:

- id
- first_name
- last_name
- business_name
- address_line_1
- address_line_2
- city
- state
- zip_code
- phone
- email
- owner_type
- created_at
- updated_at

## liens

Stores lien records.

Fields:

- id
- title_application_id
- lender_id
- lienholder_name
- lien_amount
- status
- created_at
- released_at

## documents

Stores uploaded document metadata.

Fields:

- id
- title_application_id
- uploaded_by_user_id
- document_type
- original_file_name
- storage_key
- content_type
- file_size
- uploaded_at

## audit_logs

Stores system action history.

Fields:

- id
- title_application_id
- actor_user_id
- action
- old_value
- new_value
- description
- created_at

## notifications

Stores user notifications.

Fields:

- id
- recipient_user_id
- event_type
- title
- message
- read_status
- created_at
