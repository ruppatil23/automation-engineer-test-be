# API Notes — Key endpoints

This file summarizes the Register, Login, Create Shift, Clock In, Clock Out, and Delete Shift APIs implemented in the backend.

---

**Register API**
- Endpoint: `POST /user/register`
- Auth: none
- Request body (JSON):
  - `name` (string, required)
  - `email` (string, required, valid email)
  - `password` (string, required, strong password — min 8 chars, includes uppercase, lowercase, number, symbol)
- Success: `200` JSON { token, user: { id, name, email, role } }
- Errors: `400` (user exists or validation), other `500`

Notes:
- Service creates a user, hashes password, returns a JWT (3 days expiry).

---

**Login API**
- Endpoint: `POST /user/login`
- Auth: none
- Request body (JSON):
  - `email` (string, required)
  - `password` (string, required)
- Success: `200` JSON { token, user: { id, name, email, role } }
- Errors: `404` (user not found), `400` (invalid credentials), other `500`

Notes:
- Service validates credentials and returns JWT on success.

---

**Create Shift API**
- Endpoint: `POST /shifts`
- Auth: bearer token required (admin only)
- Request body (JSON):
  - `title` (string, required)
  - `role` (string, required)
  - `typeOfShift` (array of enum: `weekend|weekday|evening|morning|night`, min 1)
  - `user` (string, required, Mongo ObjectId of assigned user)
  - `startTime` (string, required, `HH:MM`)
  - `finishTime` (string, required, `HH:MM`)
  - `numOfShiftsPerDay` (number, optional, integer > 0, default 1)
  - `location` (object, required):
    - `name`, `address`, `postCode` (strings)
    - `cordinates` object: `longitude` (number -180..180), `latitude` (number -90..90)
  - `date` (string, required, ISO date-time, cannot be in the past)
- Success: `201` JSON { shift: { id, title, role, typeOfShift, startTime, finishTime, date, status, user, location, ... } }
- Errors: `400` (validation), `404` (user not found), `401`/`403` (auth/permissions), `500`

Notes:
- Admin-only. Service converts provided `date` and `HH:MM` to full datetimes and stores populated `user` and `location`.

---

**Clock In API**
- Endpoint: `PATCH /shifts/:id/clock-in`
- Auth: bearer token required (authenticated user)
- Path params:
  - `id` (string, required, shift ObjectId)
- Body: none required
- Success: `200` JSON { message: "Successfully clocked in", shift: { id, status, clockInTime } }
- Errors: `404` (shift not found), `403` (user not assigned), `400` (invalid shift status or too early/late to clock in), `409` where appropriate, `500`

Notes:
- Worker must be assigned to the shift. Shift must be `scheduled`. Clock-in time validated against shift start/allowed buffers. On success status set to `in_progress`.

---

**Clock Out API**
- Endpoint: `PATCH /shifts/:id/clock-out`
- Auth: bearer token required (authenticated user)
- Path params:
  - `id` (string, required, shift ObjectId)
- Body: none required
- Success: `200` JSON { message: "Successfully clocked out", shift: { id, status, clockOutTime } }
- Errors: `404` (shift not found), `403` (user not assigned), `400` (not in progress or too early to clock out), `500`

Notes:
- Worker must have previously clocked in (shift status `in_progress`). Clock-out validation enforces minimum time thresholds; on success status set to `completed`.

---

**Delete Shift API**
- Endpoint: `DELETE /shifts/:id`
- Auth: bearer token required (admin only)
- Path params:
  - `id` (string, required, shift ObjectId)
- Success: `200` JSON { message: "Shift deleted successfully" }
- Errors: `404` (shift not found), `401`/`403` (auth/permissions), `500`

Notes:
- Admin-only. Deletes the shift document.

---

References:
- Router definitions: src/routes/authentication.router.js, src/routes/shifts.router.js
- Controllers: src/controllers/authentication.controller.js, src/controllers/shifts.controller.js
- Services: src/services/authentication/index.js, src/services/shift/index.js
