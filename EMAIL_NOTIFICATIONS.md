# Email Notifications - Complete List

This document lists all the places where emails are sent in the Haven Rental Platform.

## 📧 Email Service Configuration

**File:** `backend/src/services/emailService.ts`

**SMTP Settings (from `.env`):**
- `SMTP_HOST`: smtp-relay.brevo.com
- `SMTP_PORT`: 587
- `SMTP_USER`: 9c69d0001@smtp-brevo.com
- `SMTP_PASS`: 1ZOncVN3h9RgYLDq
- `EMAIL_FROM`: lohinreddy@gmail.com

---

## ✅ Email Notifications Currently Implemented

### 1. **New Property Listing** → All Tenants
**Trigger:** When an owner creates a new property  
**File:** `backend/src/controllers/propertyController.ts` (line 213)  
**Function:** `notifyTenantsNewProperty()`  
**Recipients:** All users with role = 'tenant'  
**Subject:** "New Property Alert!"  
**Status:** ✅ Working

---

### 2. **New Booking Request** → Property Owner
**Trigger:** When a tenant submits a booking request  
**File:** `backend/src/controllers/bookingController.ts` (line 87)  
**Function:** `notifyOwnerPropertyRequest()`  
**Recipients:** Property owner  
**Subject:** "New Property Request Received"  
**Status:** ✅ Working

---

### 3. **Booking Approved** → Tenant
**Trigger:** When owner/admin approves a booking request  
**File:** `backend/src/controllers/bookingController.ts` (line 240-248)  
**Function:** `notifyTenantBookingApproved()`  
**Recipients:** Tenant who made the booking  
**Subject:** "🎉 Your Booking Request Has Been Approved!"  
**Status:** ✅ **JUST ADDED** - Now working!

**Email Includes:**
- Property details (title, location, rent)
- Owner name
- Owner's notes (if provided)
- Link to tenant dashboard

---

### 4. **Booking Rejected** → Tenant
**Trigger:** When owner/admin rejects a booking request  
**File:** `backend/src/controllers/bookingController.ts` (line 250-258)  
**Function:** `notifyTenantBookingRejected()`  
**Recipients:** Tenant who made the booking  
**Subject:** "Booking Request Update"  
**Status:** ✅ **JUST ADDED** - Now working!

**Email Includes:**
- Property details
- Owner name
- Owner's notes (if provided)
- Link to browse more properties

---

## 🔍 How to Test Email Notifications

### Test 1: New Property Listing
1. Login as owner: `srivathsathotamsetty@gmail.com`
2. Create a new property
3. Check email inbox of: `sreevastha7@gmail.com` (tenant)

### Test 2: Booking Request
1. Login as tenant: `sreevastha7@gmail.com`
2. Submit a booking request for any property
3. Check email inbox of property owner

### Test 3: Booking Approval
1. Login as owner/admin
2. Approve a pending booking
3. Check email inbox of the tenant who made the request

### Test 4: Booking Rejection
1. Login as owner/admin
2. Reject a pending booking
3. Check email inbox of the tenant who made the request

---

## 🐛 Troubleshooting

### Emails Not Sending?

1. **Check Backend Console Logs:**
   - Look for "Message sent: %s" (success)
   - Look for "Error sending email:" (failure)

2. **Verify `.env` Configuration:**
   ```env
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=9c69d0001@smtp-brevo.com
   SMTP_PASS=1ZOncVN3h9RgYLDq
   EMAIL_FROM=lohinreddy@gmail.com
   ```

3. **Check Email Service Logs:**
   - The `sendEmail()` function logs errors but doesn't throw
   - Check backend console for email errors

4. **Verify User Emails in Database:**
   - Make sure users have valid email addresses
   - Check: `SELECT email FROM users WHERE role = 'tenant'`

5. **Test SMTP Connection:**
   - You can create a test script to verify SMTP credentials
   - Check `backend/src/scripts/test-email.ts` if it exists

---

## 📝 Notes

- All email functions are **non-blocking** (they don't throw errors)
- Email failures are logged but don't break the API response
- Emails are sent asynchronously (not awaited in most cases)
- HTML emails are styled with inline CSS for maximum compatibility

---

## 🚀 Future Email Notifications (Not Yet Implemented)

- Booking cancellation notification
- Payment reminders
- Lease renewal reminders
- Maintenance request notifications
- Rating/review notifications

