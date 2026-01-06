# API Contract Specification

This document details the Request and Response shapes for the 54 required APIs to support the Clinic Management System.

**Conventions:**
*   **JSON** is used for all bodies.
*   **Date** strings are ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
*   **JSONB** fields (Multi-language text) are represented as `{ "ar": string, "en": string, "de": string }`.
*   **Auth Header**: `Authorization: Bearer <token>` required for protected routes.

---

## 1. Authentication (4 APIs)

### 1.1 Login
*   **POST** `/api/auth/login`
*   **Request:**
    ```json
    {
      "email": "doctor@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "usr_123",
        "name": "Dr. Nabil",
        "email": "doctor@example.com",
        "role": "Doctor",
        "avatarUrl": "..."
      }
    }
    ```

### 1.2 Register (Internal)
*   **POST** `/api/auth/register`
*   **Request:**
    ```json
    {
      "name": "Sarah Jones",
      "email": "sarah@example.com",
      "password": "password123",
      "role": "Assistant"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "User created successfully",
      "user": { "id": "usr_124", "email": "sarah@example.com" }
    }
    ```

### 1.3 Logout
*   **POST** `/api/auth/logout`
*   **Request:** `{}` (Optional refresh token if implemented)
*   **Response (200 OK):** `{ "message": "Logged out successfully" }`

### 1.4 Get Current User
*   **GET** `/api/auth/me`
*   **Response (200 OK):**
    ```json
    {
      "id": "usr_123",
      "name": "Dr. Nabil",
      "email": "doctor@example.com",
      "role": "Doctor",
      "specialty": "Cardiology"
    }
    ```

---

## 2. Patients Module (8 APIs)

### 2.1 List Patients
*   **GET** `/api/patients?page=1&limit=10&search=Ahmed`
*   **Response (200 OK):**
    ```json
    {
      "data": [
        {
          "id": "pat_1",
          "name": "Ahmed Ali",
          "phone": "+2010...",
          "lastVisit": "2024-01-01"
        }
      ],
      "meta": { "total": 100, "page": 1, "limit": 10 }
    }
    ```

### 2.2 Get Patient Details
*   **GET** `/api/patients/{id}`
*   **Response (200 OK):**
    ```json
    {
      "id": "pat_1",
      "name": "Ahmed Ali",
      "personalInfo": { "allergies": ["Penicillin"] },
      "cardiology": { "bloodPressure": "120/80" },
      "dentistry": { "treatmentPlans": [...] }
      // ... all other JSONB modules
    }
    ```

### 2.3 Create Patient
*   **POST** `/api/patients`
*   **Request:**
    ```json
    {
      "name": "New Patient",
      "dateOfBirth": "1990-01-01",
      "gender": "Male",
      "phone": "+20...",
      "personalInfo": { ... }
    }
    ```
*   **Response (201 Created):** `{ "id": "pat_new", ...patientData }`

### 2.4 Update Patient
*   **PUT** `/api/patients/{id}`
*   **Request:** (Partial fields allowed)
    ```json
    {
      "phone": "+2012...",
      "cardiology": { "notes": "Updated bp" }
    }
    ```
*   **Response (200 OK):** `{ "id": "pat_1", ...updatedData }`

### 2.5 Delete Patient
*   **DELETE** `/api/patients/{id}`
*   **Response (200 OK):** `{ "message": "Patient deleted" }`

### 2.6 Get Patient History Summary
*   **GET** `/api/patients/{id}/history`
*   **Response (200 OK):**
    ```json
    [
      { "date": "2024-01-01", "type": "Visit", "summary": "Routine Checkup" },
      { "date": "2023-12-01", "type": "Lab", "summary": "Blood Test" }
    ]
    ```

### 2.7 Upload File
*   **POST** `/api/patients/{id}/files`
*   **Request:** `FormData` with file field `file` and optional `type` (e.g., 'report', 'avatar').
*   **Response (201 Created):**
    ```json
    {
      "fileId": "file_123",
      "url": "/uploads/pat_1/report.pdf"
    }
    ```

### 2.8 List Files
*   **GET** `/api/patients/{id}/files`
*   **Response (200 OK):**
    ```json
    [
      { "id": "file_123", "name": "report.pdf", "url": "...", "type": "Lab Report", "date": "2024-01-01" }
    ]
    ```

---

## 3. Appointments & Queue (7 APIs)

### 3.1 List Appointments
*   **GET** `/api/appointments?date=2024-02-01&doctorId=doc_1`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": "apt_1",
        "patientName": "Ahmed",
        "dateTime": "2024-02-01T10:00:00Z",
        "status": "Scheduled",
        "visitType": "Consultation"
      }
    ]
    ```

### 3.2 Get Appointment
*   **GET** `/api/appointments/{id}`
*   **Response (200 OK):** `{ "id": "apt_1", ...appointmentData }`

### 3.3 Create Appointment
*   **POST** `/api/appointments`
*   **Request:**
    ```json
    {
      "patientId": "pat_1",
      "doctorId": "doc_1",
      "dateTime": "2024-02-05T14:00:00Z",
      "visitType": "Examination",
      "reason": "Stomach pain"
    }
    ```
*   **Response (201 Created):** `{ "id": "apt_new", ... }`

### 3.4 Update Status (Queue Mgmt)
*   **PATCH** `/api/appointments/{id}/status`
*   **Request:** `{ "status": "Arrived" }` (or "Completed", "No Show")
*   **Response (200 OK):** `{ "id": "apt_1", "status": "Arrived" }`

### 3.5 Reschedule Appointment
*   **PUT** `/api/appointments/{id}`
*   **Request:** `{ "dateTime": "2024-02-06T10:00:00Z" }`
*   **Response (200 OK):** `{ ...updatedAppointment }`

### 3.6 Cancel Appointment
*   **DELETE** `/api/appointments/{id}`
*   **Response (200 OK):** `{ "message": "Cancelled", "status": "Cancelled" }`

### 3.7 Get Queue
*   **GET** `/api/queue?doctorId=doc_1`
*   **Response (200 OK):**
    ```json
    [
      {
        "appointmentId": "apt_1",
        "patientName": "Ahmed",
        "status": "Arrived",
        "waitTime": "15 mins"
      }
    ]
    ```

---

## 4. Medical Records (8 APIs)

### 4.1 Get Lab Tests
*   **GET** `/api/patients/{id}/lab-tests`
*   **Response (200 OK):**
    ```json
    [
      { "id": "lab_1", "testName": "HbA1c", "result": "5.5", "date": "2024-01-01" }
    ]
    ```

### 4.2 Add Lab Test
*   **POST** `/api/patients/{id}/lab-tests`
*   **Request:**
    ```json
    {
      "testName": "CBC",
      "code": "57021-8",
      "result": "Normal",
      "unit": "",
      "reportFileId": "file_123"
    }
    ```
*   **Response (201 Created):** `{ "id": "lab_new", ... }`

### 4.3 Get Visit Notes
*   **GET** `/api/patients/{id}/visit-notes`
*   **Response (200 OK):** `[ { "id": "note_1", "date": "...", "notes": "..." } ]`

### 4.4 Add Visit Note
*   **POST** `/api/patients/{id}/visit-notes`
*   **Request:**
    ```json
    {
      "date": "2024-02-01",
      "notes": "Patient showing signs of recovery..."
    }
    ```
*   **Response (201 Created):** `{ "id": "note_new", ... }`

### 4.5 Update Visit Note
*   **PUT** `/api/patients/{id}/visit-notes/{noteId}`
*   **Request:** `{ "notes": "Updated note..." }`
*   **Response (200 OK):** `{ ...updatedNote }`

### 4.6 Get Prescriptions
*   **GET** `/api/patients/{id}/prescriptions`
*   **Response (200 OK):**
    ```json
    [
      { "id": "rx_1", "medications": ["Panadol"], "date": "..." }
    ]
    ```

### 4.7 Add Prescription
*   **POST** `/api/patients/{id}/prescriptions`
*   **Request:**
    ```json
    {
      "medications": [
        { "name": "Antibiotic", "dosage": "500mg", "frequency": "2x daily" }
      ],
      "notes": "Take after meals"
    }
    ```
*   **Response (201 Created):** `{ "id": "rx_new", ... }`

### 4.8 Search Diagnoses
*   **GET** `/api/diagnoses/search?query=diabetes`
*   **Response (200 OK):**
    ```json
    [
      { "code": "E11", "description": "Type 2 diabetes mellitus" }
    ]
    ```

---

## 5. Clinics Management (12 APIs)

### 5.1 List Clinics
*   **GET** `/api/clinics`
*   **Response:** `[ { "id": "cl_1", "name": { "en": "Heart Center", "ar": "..." }, ... } ]`

### 5.2 Get Clinic
*   **GET** `/api/clinics/{id}`
*   **Response:** Full clinic object with stats.

### 5.3 Create Clinic
*   **POST** `/api/clinics`
*   **Request:**
    ```json
    {
      "name": { "en": "New Clinic", "ar": "..." },
      "specialtyKey": "cardio",
      "address": { "en": "..." }
    }
    ```
*   **Response (201):** `{ "id": "cl_new", ... }`

### 5.4 Update Clinic
*   **PUT** `/api/clinics/{id}`
*   **Request:** `{ "status": "active", "openHours": "9-5" }`
*   **Response (200):** Updated clinic.

### 5.5 Delete Clinic
*   **DELETE** `/api/clinics/{id}`
*   **Response (200):** Success message.

### 5.6 Get Staff
*   **GET** `/api/clinics/{id}/staff`
*   **Response:** `[ { "id": "st_1", "name": {...}, "role": "Nurse" } ]`

### 5.7 Add Staff
*   **POST** `/api/clinics/{id}/staff`
*   **Request:**
    ```json
    {
      "name": { "en": "Nurse 1" },
      "role": { "en": "Head Nurse" },
      "roleType": "nurse",
      "salary": 5000
    }
    ```
*   **Response (201):** Staff object.

### 5.8 Update Staff
*   **PUT** `/api/clinics/{id}/staff/{staffId}`
*   **Request:** `{ "salary": 5500, "status": "on-duty" }`
*   **Response (200):** Updated staff.

### 5.9 Remove Staff
*   **DELETE** `/api/clinics/{id}/staff/{staffId}`
*   **Response (200):** Success message.

### 5.10 Get Inventory
*   **GET** `/api/clinics/{id}/inventory`
*   **Response:** `[ { "id": "inv_1", "item": "Gloves", "qty": 100 } ]`

### 5.11 Add Inventory Item
*   **POST** `/api/clinics/{id}/inventory`
*   **Request:**
    ```json
    {
      "itemName": { "en": "Masks" },
      "quantity": 500,
      "threshold": 50
    }
    ```
*   **Response (201):** Item object.

### 5.12 Update Inventory (Consume/Restock)
*   **PUT** `/api/clinics/{id}/inventory/{itemId}`
*   **Request:** `{ "quantity": 450, "consumedCount": 50 }`
*   **Response (200):** Updated item.

---

## 6. Financials & Ledger (6 APIs)

### 6.1 List Entries
*   **GET** `/api/ledger/entries?startDate=2024-01-01&endDate=2024-02-01`
*   **Response:** `[ { "id": "le_1", "amount": 100, "type": "income", ... } ]`

### 6.2 Add Entry
*   **POST** `/api/ledger/entries`
*   **Request:**
    ```json
    {
      "description": "Consultation",
      "amount": 200,
      "type": "income",
      "categoryId": "cat_1",
      "date": "2024-02-01"
    }
    ```
*   **Response (201):** Entry object.

### 6.3 Update Entry
*   **PUT** `/api/ledger/entries/{id}`
*   **Request:** `{ "amount": 250 }`
*   **Response (200):** Updated entry.

### 6.4 Delete Entry
*   **DELETE** `/api/ledger/entries/{id}`
*   **Response (200):** Success.

### 6.5 List Categories
*   **GET** `/api/ledger/categories`
*   **Response:** `[ { "id": "cat_1", "name": "Consultations", "type": "income" } ]`

### 6.6 Add Category
*   **POST** `/api/ledger/categories`
*   **Request:** `{ "name": "New Expense", "type": "expense" }`
*   **Response (201):** Category object.

---

## 7. Settings & Services (6 APIs)

### 7.1 List Services
*   **GET** `/api/services`
*   **Response:** `[ { "id": "srv_1", "name": "Exam", "price": 100 } ]`

### 7.2 Add Service
*   **POST** `/api/services`
*   **Request:** `{ "name": "X-Ray", "price": 200, "currency": "EGP" }`
*   **Response (201):** Service object.

### 7.3 Update Service
*   **PUT** `/api/services/{id}`
*   **Request:** `{ "price": 250 }`
*   **Response (200):** Updated service.

### 7.4 Delete Service
*   **DELETE** `/api/services/{id}`
*   **Response (200):** Success.

### 7.5 List Pricing Plans (Public)
*   **GET** `/api/plans`
*   **Response:** JSON array of available subscription plans.

### 7.6 Contact Us Form
*   **POST** `/api/contact`
*   **Request:** `{ "name": "...", "email": "...", "message": "..." }`
*   **Response (200):** `{ "message": "Received" }`

---

## 8. Notifications (3 APIs)

### 8.1 List Notifications
*   **GET** `/api/notifications`
*   **Response:** `[ { "id": 1, "message": "...", "read": false } ]`

### 8.2 Mark Read
*   **PATCH** `/api/notifications/{id}/read`
*   **Request:** `{ "read": true }`
*   **Response (200):** `{ "id": 1, "read": true }`

### 8.3 Delete Notification
*   **DELETE** `/api/notifications/{id}`
*   **Response (200):** Success.
