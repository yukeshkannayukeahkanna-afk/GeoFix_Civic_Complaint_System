# 🧪 Multi-User Testing Guide: Centralized Complaints Database

This guide will help you verify that the centralized complaints database structure is working correctly, allowing admins to see complaints from all users.

---

## 🎯 Testing Objective

Verify that:
1. ✅ Complaints from multiple users are stored in a centralized database
2. ✅ Admin can view ALL complaints regardless of which account submitted them  
3. ✅ Users can only see their OWN complaints
4. ✅ Admin can update complaint status
5. ✅ Status updates are visible to the original submitter

---

## 📋 Prerequisites

Before testing:
- [ ] System is running (open `index.html` in browser or use `start-app.ps1`)
- [ ] You have access to at least 2 different Gmail accounts for testing
- [ ] Browser localStorage is enabled
- [ ] Browser console is open (F12) to view debug logs

---

## 🚀 Test Scenario 1: Multi-User Complaint Submission

### Step 1: Create User Account A

1. Open the application in your browser
2. Click **"Register"** or navigate to `register.html`
3. Register with:
   - **Email:** `user1@test.com` (or your first Gmail account)
   - **Name:** `Test User One`
   - **Password:** `password123`
   - **Role:** User (not admin)
4. After successful registration, you'll be redirected to login

### Step 2: Submit Complaint as User A

1. Log in as `user1@test.com`
2. Navigate to **"Submit Complaint"** page
3. Fill out the form:
   - **Category:** Pothole
   - **GPS Location:** Click "Get Location" (or allow geolocation)
   - **Photo:** Click "Start Camera" → "Capture Image" (or use existing image)
   - **Description:** "Large pothole on Main Street near intersection"
4. Click **"Submit Complaint"**
5. Verify success message appears
6. Navigate to **"My Dashboard"**
7. ✅ **Expected:** You should see 1 complaint listed

### Step 3: Check Browser Console (User A)

Open browser console (F12) and look for:
```
📥 Loading user complaints from CENTRALIZED database...
🔍 Total complaints in database: 1
👤 Filtering for user: user1@test.com
✅ User has 1 complaint(s)
```

This confirms the complaint was saved to the centralized database.

### Step 4: Log Out User A

1. Click profile menu or logout button
2. Verify you're redirected to login page

---

### Step 5: Create User Account B

1. Click **"Register"** again
2. Register with:
   - **Email:** `user2@test.com` (or your second Gmail account)
   - **Name:** `Test User Two`
   - **Password:** `password456`
   - **Role:** User (not admin)

### Step 6: Submit Complaint as User B

1. Log in as `user2@test.com`
2. Navigate to **"Submit Complaint"**
3. Fill out the form:
   - **Category:** Water Leakage
   - **GPS Location:** Click "Get Location"
   - **Photo:** Capture a new image
   - **Description:** "Broken water pipe flooding the sidewalk"
4. Click **"Submit Complaint"**
5. Navigate to **"My Dashboard"**
6. ✅ **Expected:** You should see **ONLY 1 complaint** (your own)
7. ❌ **Should NOT see:** User A's pothole complaint

### Step 7: Check Browser Console (User B)

```
📥 Loading user complaints from CENTRALIZED database...
🔍 Total complaints in database: 2
👤 Filtering for user: user2@test.com
✅ User has 1 complaint(s)
```

**Key Observation:** Total complaints = 2, but user sees only 1 (their own).

---

## 🔐 Test Scenario 2: Admin Can See All Complaints

### Step 8: Create Admin Account

1. Log out from User B
2. Register a new account:
   - **Email:** `admin@demo.com` (special admin email)
   - **Name:** `Admin User`
   - **Password:** `admin123`
   - **Role:** Admin

> **Note:** In the current demo, `admin@demo.com` is recognized as an admin account. For production, implement proper role-based authentication.

### Step 9: View All Complaints as Admin

1. Log in as `admin@demo.com`
2. You should be redirected to **Admin Dashboard** (not user dashboard)
3. ✅ **Expected:** Admin dashboard shows **ALL 2 complaints**:
   - Complaint from `user1@test.com` (Pothole)
   - Complaint from `user2@test.com` (Water Leakage)

### Step 10: Check Admin Console Logs

```
📥 Loading ALL complaints from CENTRALIZED database...
🔍 Data Source: localStorage['geofix_complaints']
✅ Loaded 2 complaints from ALL users
👥 Unique users: 2
```

**This confirms the centralized structure is working!**

### Step 11: Verify Complaint Details

In the admin dashboard table, verify you can see:
- **User ID/Email** column showing different users
- **Category** column showing different issue types
- **Status** showing "pending" for both
- **Submitted At** timestamps
- **Action buttons** to update status

---

## ⚙️ Test Scenario 3: Admin Updates Complaint Status

### Step 12: Update User A's Complaint

1. As admin, find User A's pothole complaint in the table
2. Click **"View Details"** or **"Update Status"**
3. Change status from "Pending" to "In Progress"
4. Add admin note: "Road crew dispatched to location"
5. Click **"Save"** or **"Update"**
6. ✅ **Expected:** Status updates immediately in the admin table

### Step 13: Verify Update as User A

1. Log out from admin account
2. Log in as `user1@test.com`
3. Navigate to **"My Dashboard"**
4. ✅ **Expected:** Complaint status now shows "In Progress"
5. ✅ **Expected:** Admin note is visible
6. ❌ **Should NOT see:** User B's water leakage complaint

### Step 14: Check Real-time Update Logs

If you keep both admin and user dashboards open in separate tabs:
1. Admin updates status in one tab
2. User dashboard should auto-refresh (within 5-10 seconds)
3. Console shows: "🔄 Complaints updated by admin - refreshing dashboard..."

---

## 📊 Test Scenario 4: Data Isolation Verification

### Step 15: Verify Data Isolation

Create a matrix to verify proper access control:

| Account | Can See User A Complaint? | Can See User B Complaint? | Total Visible |
|---------|---------------------------|---------------------------|---------------|
| User A  | ✅ Yes                    | ❌ No                     | 1             |
| User B  | ❌ No                     | ✅ Yes                    | 1             |
| Admin   | ✅ Yes                    | ✅ Yes                    | 2             |

### Step 16: Submit More Complaints

As User A, submit 2 more complaints (total: 3)
As User B, submit 1 more complaint (total: 2)

**Expected Results:**
- User A Dashboard: Shows 3 complaints
- User B Dashboard: Shows 2 complaints  
- Admin Dashboard: Shows **5 total complaints** from both users

---

## 🔍 Test Scenario 5: Database Structure Inspection

### Step 17: Inspect localStorage

1. Open browser console (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Navigate to **Local Storage** → Your domain
4. Find key `geofix_complaints`
5. Click to view value

✅ **Expected Structure:**
```json
[
  {
    "id": "CMP1708876543210",
    "userId": "user1@test.com",
    "userEmail": "user1@test.com",
    "userName": "Test User One",
    "category": "pothole",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "description": "Large pothole on Main Street",
    "status": "in-progress",
    "timestamp": "2024-02-24T12:00:00.000Z",
    ...
  },
  {
    "id": "CMP1708876789012",
    "userId": "user2@test.com",
    "userEmail": "user2@test.com",
    "userName": "Test User Two",
    "category": "water-leakage",
    ...
  }
]
```

### Step 18: Verify Required Fields

Check that EVERY complaint has:
- ✅ `userId`
- ✅ `userEmail`
- ✅ `category`
- ✅ `latitude`
- ✅ `longitude`
- ✅ `description`
- ✅ `imageURL` or `image`
- ✅ `timestamp`
- ✅ `status`

---

## 🧹 Test Scenario 6: Clean Up and Reset

### Step 19: Clear Test Data (Optional)

To start fresh:

1. Open browser console
2. Run: `localStorage.clear()`
3. Reload the page
4. All test data will be removed

Or manually:
1. Application → Local Storage
2. Right-click `geofix_complaints` → Delete
3. Right-click `geofix_user` → Delete

---

## ✅ Test Results Checklist

Mark each item as you verify it:

### Centralized Database
- [ ] Complaints are stored in `localStorage['geofix_complaints']` as a flat array
- [ ] Each complaint includes `userId` and `userEmail` fields
- [ ] Complaints from different users are in the same collection

### Admin Access
- [ ] Admin can log in and access admin dashboard
- [ ] Admin sees ALL complaints from ALL users
- [ ] Admin console shows "Loaded X complaints from ALL users"
- [ ] Admin can see userId/userEmail for each complaint
- [ ] Admin can update complaint status
- [ ] Admin can filter complaints by category/status

### User Access
- [ ] User can log in and access user dashboard
- [ ] User sees ONLY their own complaints
- [ ] User console shows "Filtering for user: [email]"
- [ ] User cannot see complaints from other users
- [ ] User sees real-time status updates from admin

### Data Integrity
- [ ] No duplicate complaints in database
- [ ] All required fields are present
- [ ] GPS coordinates are accurate
- [ ] Images are properly stored
- [ ] Timestamps are correct

### Real-time Updates
- [ ] Admin status changes reflect in user dashboard
- [ ] Auto-refresh works (5-10 second updates)
- [ ] Storage events trigger dashboard refreshes

---

## 🐛 Troubleshooting

### Issue: Admin Sees Only 0-1 Complaints

**Solutions:**
1. Check if demo data generation is disabled
2. Verify localhost key contains data: `localStorage.getItem('geofix_complaints')`
3. Clear cache and reload
4. Ensure you submitted complaints while logged in

### Issue: User Sees Complaints from Other Users

**Problem:** Filtering is not working correctly

**Check:**
1. Open `js/dashboard.js`
2. Verify line contains: `allComplaints.filter(c => c.userId === user.email)`
3. Check browser console for "Filtering for user: X"
4. Ensure `userId` field is correctly set during submission

### Issue: Real-time Updates Not Working

**Solutions:**
1. Ensure `storage` event listener is active
2. Check auto-refresh interval (should be 5-10 seconds)
3. Try manual refresh button
4. Open in two separate browser windows (not tabs) for testing

### Issue: Firebase Not Working

**Note:** Current implementation uses localStorage for demo. To enable Firebase:
1. Follow instructions in `HUGGINGFACE_SETUP.md`
2. Uncomment Firebase code in `js/firebase-config.js`
3. Update all `.js` files to use Firebase functions
4. Deploy Firestore security rules

---

## 📸 Expected Screenshots

### User Dashboard (user1@test.com)
```
╔═══════════════════════════════════════╗
║  My Complaints (Total: 3)             ║
╠═══════════════════════════════════════╣
║  🚧 Pothole - In Progress             ║
║  📍 Main Street                        ║
║  👤 user1@test.com                     ║
╠═══════════════════════════════════════╣
║  ... (2 more from same user)          ║
╚═══════════════════════════════════════╝
```

### Admin Dashboard
```
╔═══════════════════════════════════════════════════╗
║  All Complaints (Total: 5)                        ║
╠═══════════════════════════════════════════════════╣
║  🚧 Pothole | user1@test.com | In Progress        ║
║  💧 Water Leak | user2@test.com | Pending         ║
║  🗑️ Garbage | user1@test.com | Pending            ║
║  💡 Streetlight | user2@test.com | Resolved       ║
║  🚧 Pothole | user1@test.com | Pending            ║
╚═══════════════════════════════════════════════════╝
```

---

## 🎓 What You've Tested

After completing this guide, you've verified:

✅ **Centralized database structure** - All complaints in one collection  
✅ **Multi-account support** - Different users can submit independently  
✅ **Admin global access** - Admin sees all complaints  
✅ **User data isolation** - Users see only their own complaints  
✅ **Real-time updates** - Changes sync across dashboards  
✅ **Proper filtering** - Client-side userId filtering works correctly  
✅ **Data integrity** - All required fields are present and correct  

---

## 📚 Next Steps

1. **Production Testing:** Test with real Gmail accounts
2. **Firebase Migration:** Follow `HUGGINGFACE_SETUP.md` to enable Firebase
3. **Security Rules:** Deploy Firestore security rules from `DATABASE_STRUCTURE.md`
4. **Load Testing:** Submit 50+ complaints to test performance
5. **Mobile Testing:** Test on mobile devices with different accounts

---

## 🔗 Related Documentation

- [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md) - Detailed database architecture
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - General testing procedures
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) - Pre-launch checklist

---

**Testing Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

**Date Tested:** ________________

**Tested By:** ________________

**Result:** ⬜ Pass | ⬜ Fail | ⬜ Needs Review

**Notes:**
```
[Add any observations, issues, or recommendations here]
```
