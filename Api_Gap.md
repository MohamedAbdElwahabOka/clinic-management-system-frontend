# 🔍 API Gap Analysis: Frontend ↔ Backend

## Executive Summary

After analyzing both codebases — the **backend** (Express/Prisma, ~41 APIs implemented) and the **frontend** (Next.js, 12 app pages with service layers) — there are **critical incompatibilities** between what the frontend expects (per `API_CONTRACT.md`) and what the backend actually provides (per `API_TESTING_GUIDE.md` + route files).

> [!CAUTION]
> The frontend's `API_CONTRACT.md` was written **independently** from the backend and describes a **different API surface** with different URL patterns, field names, and response shapes. The two must be reconciled.

---

## 📊 Overall Status

| Module | Backend APIs (Actual) | Frontend Contract APIs | Alignment | Gap Type |
|--------|----------------------|----------------------|-----------|----------|
| **Authentication** | 6 ✅ | 4 planned | 🟡 Partial | Shape mismatch |
| **Patients** | 2 (create, get-visits) | 8 planned | 🔴 Major | 6 missing backend APIs |
| **Appointments** | 17 ✅ | 7 planned | 🔴 Major | URL + shape mismatch |
| **Medical Records** | 1 (create) | 8 planned | 🔴 Major | 7 missing backend APIs |
| **Clinics** | 5 (create, list, assistants) | 12 planned | 🔴 Major | 7 missing + shape mismatch |
| **Visits** | 2 (create, patient-visits) | 0 in contract | 🟡 Partial | Not in FE contract |
| **Doctor Settings** | 8 ✅ | 0 in contract | 🟡 Partial | Not in FE contract |
| **Financials/Ledger** | 0 | 6 planned | 🔴 Missing | Entire module missing |
| **Services/Settings** | 0 | 6 planned | 🔴 Missing | Entire module missing |
| **Notifications** | 0 | 3 planned | 🔴 Missing | Entire module missing |

---

## 🚨 Critical Incompatibilities Found

### 1. Authentication — Shape Mismatch

| Aspect | Frontend Expects | Backend Provides |
|--------|-----------------|-----------------|
| **Login URL** | `POST /api/auth/login` | `POST /api/auth/login` ✅ |
| **Login field** | `{ email, password }` | `{ identifier, password }` ❌ |
| **Login response** | `{ token, user: { id, name, role } }` | `{ success, auth: { token }, data: { id, email, role } }` ❌ |
| **Register URL** | `POST /api/auth/register` | `POST /api/auth/signup` ❌ |
| **Register fields** | `{ name: string, role }` | `{ name: { ar, en }, specialization, licenseNumber }` ❌ |
| **Get Current User** | `GET /api/auth/me` | ❌ **Not implemented** |

> [!IMPORTANT]
> The frontend `auth.ts` (NextAuth) already adapts to the backend's actual response shape (`identifier`, `auth.token`, `data.id`). But `API_CONTRACT.md` documents a **different** contract. The contract must be updated to match reality.

### 2. Appointments — Major URL & Shape Mismatch

| Aspect | Frontend Contract | Backend Actual |
|--------|------------------|---------------|
| **List** | `GET /api/appointments?date=...` | `GET /api/appointments?page=...&status=...` ✅ |
| **Create** | `POST /api/appointments` | `POST /api/clinics/:clinicId/appointments/online` or `/public-booking` ❌ |
| **Update status** | `PATCH /api/appointments/:id/status` | `PATCH /api/appointments/:id/status` ✅ |
| **Cancel** | `DELETE /api/appointments/:id` | `POST /api/appointments/:id/cancel` ❌ |
| **Reschedule** | `PUT /api/appointments/:id` | `PUT /api/appointments/:id` ✅ |
| **Queue** | `GET /api/queue?doctorId=...` | `GET /api/clinics/:clinicId/appointments/queue` ❌ |
| **Status values** | `Scheduled, Confirmed, Arrived...` | `REQUESTED, CONFIRMED, ARRIVED...` (UPPERCASE) ❌ |
| **Type field** | `visitType: "Examination"` | `type: "ONLINE" \| "WALK_IN"` ❌ |
| **Missing in FE contract** | — | `public-booking`, `available-slots`, `next-slot`, `walk-in`, `check-in`, `start`, `complete`, `statistics`, `position`, `process-no-shows` |

> [!WARNING]
> The frontend `appointments.service.ts` uses `/appointments` (no clinicId prefix), but the backend requires `/clinics/:clinicId/appointments/...` for most creation/queue endpoints. The frontend service also uses `DELETE` for cancel, but backend uses `POST .../cancel`.

### 3. Patients — Shape Mismatch

| Aspect | Frontend Type | Backend Prisma Schema |
|--------|--------------|----------------------|
| **name** | `string` | `Json { ar, en }` ❌ |
| **gender** | `"Male" \| "Female"` | `"male" \| "female"` (lowercase) ❌ |
| **phone field** | `contactPhone` | `phone` ❌ |
| **email field** | `contactEmail` | ❌ Not in schema |
| **Medical JSONB** | `personalInfo, cardiology, dentistry...` (20+ specialty objects) | ❌ Not in schema — uses `MedicalRecord` model instead |

> [!CAUTION]
> The frontend has a monolithic `Patient` type with 20+ specialty-specific JSONB fields embedded directly on the patient. The backend stores medical data in a **separate `MedicalRecord` model** with `type` enum and `dataPayload` JSON. These are fundamentally different architectures.

### 4. Clinics — Shape Mismatch

| Aspect | Frontend Type | Backend Prisma Schema |
|--------|--------------|----------------------|
| **name** | `LocalizedText { ar, en, de }` | `Json { ar, en }` (no `de`) ❌ |
| **staff** | Embedded `StaffMember[]` on Clinic | ❌ No Staff model exists |
| **inventory** | Embedded `InventoryItem[]` on Clinic | ❌ No Inventory model exists |
| **stats** | `ClinicStats` object | ❌ Not computed |
| **amenities** | `Amenity[]` | ❌ Not in schema |
| **Assistants URL** | `GET /api/clinics/:id/staff` | `GET /api/clinics/:id/assistants` ❌ |

### 5. Financials/Ledger — Entirely Missing

The frontend has:
- Full types: `LedgerEntry`, `LedgerCategory`, `LedgerEntryType`
- A dedicated `/financials/ledger` page
- `ServicePrice` type

The backend has: **Nothing**. No Prisma models, no routes, no controllers.

### 6. Notifications — Entirely Missing

The frontend has:
- Full types: `Notification`, `NotificationType`
- A dedicated `/notifications` page
- Expected endpoints in `API_CONTRACT.md`

The backend has: **Nothing**. No Prisma models, no routes.

---

## 📋 Complete API Inventory

### ✅ Backend Implemented (41 APIs)

| # | Module | Method | Endpoint | Has FE Consumer? |
|---|--------|--------|----------|-----------------|
| 1 | Auth | POST | `/api/auth/signup` | ❌ No FE page |
| 2 | Auth | POST | `/api/auth/login` | ✅ via NextAuth |
| 3 | Auth | POST | `/api/auth/logout` | ✅ via NextAuth |
| 4 | Auth | GET | `/api/auth/users` | ❌ No FE page |
| 5 | Auth | PATCH | `/api/auth/update-profile` | ⚠️ Account page exists |
| 6 | Auth | POST | `/api/auth/change-password` | ⚠️ Account page exists |
| 7 | Clinics | POST | `/api/clinics` | ⚠️ Shape mismatch |
| 8 | Clinics | GET | `/api/clinics` | ⚠️ Shape mismatch |
| 9 | Clinics | POST | `/api/clinics/:id/assistants/create` | ❌ |
| 10 | Clinics | DELETE | `/api/clinics/:id/assistants/:id` | ❌ |
| 11 | Clinics | GET | `/api/clinics/:id/assistants` | ❌ |
| 12 | Patients | POST | `/api/patients` | ⚠️ Shape mismatch |
| 13 | Patients | GET | `/api/patients/:id/visits` | ❌ No service call |
| 14-30 | Appointments | 17 APIs | Various | ⚠️ Major mismatches |
| 31-38 | Doctor Settings | 8 APIs | Various | ❌ No FE service |
| 39 | Visits | POST | `/api/clinics/:id/visits` | ❌ |
| 40 | Visits | GET | (via patients/:id/visits) | ❌ |
| 41 | Medical Records | POST | `/api/medical-records/:visitId` | ❌ |

### ❌ Missing from Backend (needed by Frontend)

| # | Module | Method | Endpoint | Frontend Need |
|---|--------|--------|----------|--------------|
| 1 | Auth | GET | `/api/auth/me` | Critical — profile loading |
| 2 | Patients | GET | `/api/patients` | Critical — patient list page |
| 3 | Patients | GET | `/api/patients/:id` | Critical — patient detail page |
| 4 | Patients | PUT | `/api/patients/:id` | High — edit patient |
| 5 | Patients | DELETE | `/api/patients/:id` | Medium — delete patient |
| 6 | Patients | GET | `/api/patients/:id/history` | Medium — history tab |
| 7 | Patients | POST | `/api/patients/:id/files` | Medium — file upload |
| 8 | Patients | GET | `/api/patients/:id/files` | Medium — file list |
| 9 | Clinics | GET | `/api/clinics/:id` | High — clinic detail |
| 10 | Clinics | PUT | `/api/clinics/:id` | High — edit clinic |
| 11 | Clinics | DELETE | `/api/clinics/:id` | Medium |
| 12 | Clinics | GET | `/api/clinics/:id/staff` | High — staff tab |
| 13 | Clinics | POST | `/api/clinics/:id/staff` | High — add staff |
| 14 | Clinics | PUT | `/api/clinics/:id/staff/:id` | Medium |
| 15 | Clinics | DELETE | `/api/clinics/:id/staff/:id` | Medium |
| 16 | Clinics | GET | `/api/clinics/:id/inventory` | Medium |
| 17 | Clinics | POST | `/api/clinics/:id/inventory` | Medium |
| 18 | Clinics | PUT | `/api/clinics/:id/inventory/:id` | Medium |
| 19 | Medical | GET | `/api/patients/:id/lab-tests` | High — records page |
| 20 | Medical | POST | `/api/patients/:id/lab-tests` | High |
| 21 | Medical | GET | `/api/patients/:id/visit-notes` | High |
| 22 | Medical | POST | `/api/patients/:id/visit-notes` | High |
| 23 | Medical | PUT | `/api/patients/:id/visit-notes/:id` | Medium |
| 24 | Medical | GET | `/api/patients/:id/prescriptions` | High |
| 25 | Medical | POST | `/api/patients/:id/prescriptions` | High |
| 26 | Medical | GET | `/api/diagnoses/search` | Medium |
| 27 | Visits | GET | `/api/visits` | Medium |
| 28 | Visits | GET | `/api/visits/:id` | Medium |
| 29 | Visits | PATCH | `/api/visits/:id/sign` | Medium |
| 30 | Ledger | GET | `/api/ledger/entries` | High — financials page |
| 31 | Ledger | POST | `/api/ledger/entries` | High |
| 32 | Ledger | PUT | `/api/ledger/entries/:id` | Medium |
| 33 | Ledger | DELETE | `/api/ledger/entries/:id` | Medium |
| 34 | Ledger | GET | `/api/ledger/categories` | High |
| 35 | Ledger | POST | `/api/ledger/categories` | Medium |
| 36 | Services | GET | `/api/services` | Medium |
| 37 | Services | POST | `/api/services` | Medium |
| 38 | Services | PUT | `/api/services/:id` | Low |
| 39 | Services | DELETE | `/api/services/:id` | Low |
| 40 | Notifications | GET | `/api/notifications` | High — notifications page |
| 41 | Notifications | PATCH | `/api/notifications/:id/read` | High |
| 42 | Notifications | DELETE | `/api/notifications/:id` | Medium |

---

## 🎯 Key Decisions Required

### Decision 1: Patient Data Architecture
- **Option A**: Keep backend's `MedicalRecord` model approach (records per visit, typed by `RecordType`)
- **Option B**: Add JSONB specialty fields to Patient model (match frontend types)
- **Recommendation**: **Option A** — The backend's normalized approach is better for a medical system. The frontend types should be refactored to consume `MedicalRecord[]` instead.

### Decision 2: Multilingual Support
- **Frontend**: Uses `{ ar, en, de }` (3 languages)
- **Backend**: Uses `{ ar, en }` (2 languages)
- **Recommendation**: Backend should add `de` support to JSON fields, or frontend should drop German from medical data (keep only for UI translations).

### Decision 3: Appointment Status Values
- **Frontend**: PascalCase (`"Scheduled"`, `"Confirmed"`)
- **Backend**: UPPERCASE enum (`"REQUESTED"`, `"CONFIRMED"`)
- **Recommendation**: Frontend should adapt to backend's UPPERCASE values since they're in the database schema.

### Decision 4: Clinic-scoped vs Global Endpoints
- **Backend**: Most endpoints are clinic-scoped (`/clinics/:clinicId/appointments/...`)
- **Frontend services**: Call global endpoints (`/appointments/...`)
- **Recommendation**: Frontend services must include `clinicId` parameter; store it in session/context.
