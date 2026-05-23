# API Contract Specification (Aligned with Backend)

> **Last Updated:** 2026-05-19
> **Backend Base URL:** `http://localhost:4000/api`
> This contract reflects the **actual backend implementation** and is the source of truth for frontend service development.

**Conventions:**
- **JSON** for all request/response bodies.
- **Dates**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Multilingual fields**: `{ "ar": string, "en": string }` (German is UI-only via frontend message files).
- **Auth Header**: `Authorization: Bearer <token>` for protected routes.
- **Response shape**: `{ success: boolean, message?: string, data: T }` for all endpoints.
- **Pagination**: `{ data: T[], meta: { total, page, limit, totalPages, hasNextPage, hasPrevPage } }`
- **Status enums**: UPPERCASE (e.g. `CONFIRMED`, not `Confirmed`).

---

## 1. Authentication (7 APIs)

### 1.1 Login ✅
- **POST** `/api/auth/login`
- **Request:**
```json
{ "identifier": "doctor@clinic.com", "password": "SecurePass123!" }
```
> `identifier` can be email OR phone number.
- **Response (200):**
```json
{
  "success": true,
  "auth": { "token": "eyJhbGciOi..." },
  "data": { "id": "uuid", "email": "doctor@clinic.com", "role": "DOCTOR", "clinicId": "uuid" }
}
```

### 1.2 Register ✅
- **POST** `/api/auth/signup`
- **Request:**
```json
{
  "name": { "ar": "د. أحمد", "en": "Dr. Ahmed" },
  "email": "doctor@clinic.com",
  "phone": "+201234567890",
  "password": "SecurePass123!",
  "specialization": "Dermatology",
  "licenseNumber": "MED-123456"
}
```

### 1.3 Logout ✅
- **POST** `/api/auth/logout` (Protected)

### 1.4 Update Profile ✅
- **PATCH** `/api/auth/update-profile` (Protected)

### 1.5 Change Password ✅
- **POST** `/api/auth/change-password` (Protected)

### 1.6 Get Users (Admin) ✅
- **GET** `/api/auth/users` (SUPER_ADMIN only)

### 1.7 Get Current User ❌ PENDING
- **GET** `/api/auth/me` (Protected)
- **Response (200):**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": {"ar":"..","en":".."}, "email": "...", "role": "DOCTOR", "clinicId": "uuid", "specialization": "..." }
}
```

---

## 2. Patients (8 APIs)

### 2.1 List Patients ❌ PENDING
- **GET** `/api/patients?page=1&limit=10&search=Ahmed`
- **Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": {"ar":"..","en":".."}, "phone": "+201...", "gender": "male", "dateOfBirth": "1990-01-01", "lastVisit": "2024-01-01T10:00:00Z" }
  ],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

### 2.2 Get Patient Details ❌ PENDING
- **GET** `/api/patients/:id`

### 2.3 Create Patient ✅
- **POST** `/api/patients`
- **Request:**
```json
{
  "name": { "ar": "محمد أحمد", "en": "Mohamed Ahmed" },
  "phone": "01099988877", "gender": "male", "dateOfBirth": "1990-05-15",
  "bloodType": "O+", "nationalId": "29005151234567", "address": "123 Main St, Cairo",
  "emergencyContact": { "name": "Ahmed", "phone": "01012345678", "relation": "Brother" }
}
```

### 2.4 Update Patient ❌ PENDING
- **PATCH** `/api/patients/:id`

### 2.5 Delete Patient ❌ PENDING
- **DELETE** `/api/patients/:id`

### 2.6 Get Patient History ❌ PENDING
- **GET** `/api/patients/:id/history`

### 2.7 Upload File ❌ PENDING
- **POST** `/api/patients/:id/files` — `FormData` with `file` + `type`

### 2.8 List Files ❌ PENDING
- **GET** `/api/patients/:id/files`

---

## 3. Appointments & Queue (17 APIs) ✅ COMPLETE

### Public Routes (No auth required)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 3.1 | POST | `/api/clinics/:clinicId/appointments/public-booking` | Patient books from website |
| 3.2 | GET | `/api/clinics/:clinicId/appointments/available-slots?doctorId=...&date=...` | Available slots |
| 3.3 | GET | `/api/clinics/:clinicId/appointments/next-slot?doctorId=...` | Next available slot |

### Staff Routes (Protected)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 3.4 | POST | `/api/clinics/:clinicId/appointments/online` | Staff creates online appointment |
| 3.5 | POST | `/api/clinics/:clinicId/appointments/walk-in` | Register walk-in patient |
| 3.6 | GET | `/api/clinics/:clinicId/appointments/queue?doctorId=...` | Smart queue |
| 3.7 | GET | `/api/clinics/:clinicId/appointments/statistics?date=...` | Daily statistics |

### Appointment Actions (Protected)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 3.8 | PATCH | `/api/appointments/:id/status` | Update status |
| 3.9 | POST | `/api/appointments/:id/check-in` | Check-in patient |
| 3.10 | POST | `/api/appointments/:id/start` | Start appointment |
| 3.11 | POST | `/api/appointments/:id/complete` | Complete appointment |
| 3.12 | POST | `/api/appointments/:id/cancel` | Cancel appointment |
| 3.13 | GET | `/api/appointments/:id/position` | Queue position |
| 3.14 | POST | `/api/appointments/process-no-shows` | Process no-shows (Admin) |

### List & Details (Protected)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 3.15 | GET | `/api/appointments?page=1&limit=20&status=CONFIRMED&clinicId=...` | List all |
| 3.16 | GET | `/api/appointments/:id` | Get appointment details |
| 3.17 | PUT | `/api/appointments/:id` | Reschedule |

**Status enum values:** `REQUESTED | CONFIRMED | ARRIVED | IN_PROGRESS | COMPLETED | CANCELLED | REJECTED | RESCHEDULED | NO_SHOW`

**Type enum values:** `ONLINE | WALK_IN`

> ⚠️ **Frontend adaptation**: Cancel uses `POST .../cancel` (not DELETE). Queue is at `/clinics/:clinicId/appointments/queue` (not `/queue`). Creation requires `clinicId` in URL path.

---

## 4. Doctor Settings & Schedule (8 APIs) ✅ COMPLETE

| # | Method | Endpoint |
|---|--------|----------|
| 4.1 | GET | `/api/doctors/:doctorId/settings` |
| 4.2 | PUT | `/api/doctors/:doctorId/settings` |
| 4.3 | DELETE | `/api/doctors/:doctorId/settings` (reset) |
| 4.4 | GET | `/api/clinics/:clinicId/doctors/:doctorId/schedule` |
| 4.5 | POST | `/api/clinics/:clinicId/doctors/:doctorId/schedule` |
| 4.6 | PUT | `/api/clinics/:clinicId/doctors/:doctorId/schedule/bulk` |
| 4.7 | PATCH | `/api/schedule/:scheduleId` |
| 4.8 | DELETE | `/api/schedule/:scheduleId` |

---

## 5. Visits (5 APIs)

| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 5.1 | POST | `/api/clinics/:clinicId/visits` | ✅ |
| 5.2 | GET | `/api/patients/:patientId/visits` | ✅ |
| 5.3 | GET | `/api/clinics/:clinicId/visits` | ❌ PENDING |
| 5.4 | GET | `/api/clinics/:clinicId/visits/:id` | ❌ PENDING |
| 5.5 | PATCH | `/api/clinics/:clinicId/visits/:id` | ❌ PENDING |

---

## 6. Medical Records (8 APIs)

| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 6.1 | POST | `/api/medical-records/:visitId` | ✅ |
| 6.2 | GET | `/api/patients/:id/medical-records?type=LAB_ORDER` | ❌ PENDING |
| 6.3 | POST | `/api/patients/:id/medical-records` | ❌ PENDING |
| 6.4 | GET | `/api/patients/:id/medical-records/:recordId` | ❌ PENDING |
| 6.5 | PATCH | `/api/medical-records/:recordId` | ❌ PENDING |
| 6.6 | DELETE | `/api/medical-records/:recordId` | ❌ PENDING |
| 6.7 | GET | `/api/patients/:id/history` | ❌ PENDING |
| 6.8 | GET | `/api/diagnoses/search?query=diabetes` | ❌ PENDING |

**RecordType enum:** `DIAGNOSIS | PRESCRIPTION | LAB_ORDER | RADIOLOGY_ORDER | PROCEDURE | VITAL_SIGNS | CLINICAL_NOTE | ATTACHMENT`

---

## 7. Clinics Management (14 APIs)

| # | Method | Endpoint | Status |
|---|--------|----------|--------|
| 7.1 | POST | `/api/clinics` | ✅ |
| 7.2 | GET | `/api/clinics` | ✅ |
| 7.3 | GET | `/api/clinics/:id` | ❌ PENDING |
| 7.4 | PUT | `/api/clinics/:id` | ❌ PENDING |
| 7.5 | DELETE | `/api/clinics/:id` | ❌ PENDING |
| 7.6 | POST | `/api/clinics/:id/assistants/create` | ✅ |
| 7.7 | GET | `/api/clinics/:id/assistants` | ✅ |
| 7.8 | DELETE | `/api/clinics/:id/assistants/:assistantId` | ✅ |
| 7.9 | GET | `/api/clinics/:id/staff` | ❌ PENDING |
| 7.10 | POST | `/api/clinics/:id/staff` | ❌ PENDING |
| 7.11 | PUT | `/api/clinics/:id/staff/:staffId` | ❌ PENDING |
| 7.12 | DELETE | `/api/clinics/:id/staff/:staffId` | ❌ PENDING |
| 7.13 | GET | `/api/clinics/:id/inventory` | ❌ PENDING |
| 7.14 | POST | `/api/clinics/:id/inventory` | ❌ PENDING |

---

## 8. Financials & Ledger (6 APIs) ❌ ALL PENDING

| # | Method | Endpoint |
|---|--------|----------|
| 8.1 | GET | `/api/ledger/entries?clinicId=...&startDate=...&endDate=...` |
| 8.2 | POST | `/api/ledger/entries` |
| 8.3 | PUT | `/api/ledger/entries/:id` |
| 8.4 | DELETE | `/api/ledger/entries/:id` |
| 8.5 | GET | `/api/ledger/categories?clinicId=...` |
| 8.6 | POST | `/api/ledger/categories` |

---

## 9. Settings & Services (4 APIs) ❌ ALL PENDING

| # | Method | Endpoint |
|---|--------|----------|
| 9.1 | GET | `/api/services?clinicId=...` |
| 9.2 | POST | `/api/services` |
| 9.3 | PUT | `/api/services/:id` |
| 9.4 | DELETE | `/api/services/:id` |

---

## 10. Notifications (3 APIs) ❌ ALL PENDING

| # | Method | Endpoint |
|---|--------|----------|
| 10.1 | GET | `/api/notifications` |
| 10.2 | PATCH | `/api/notifications/:id/read` |
| 10.3 | DELETE | `/api/notifications/:id` |
