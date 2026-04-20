# 🗄️ Centralized Database Structure

## Overview

The GeoVerified Civic Complaint System uses a **CENTRALIZED database structure** that allows administrators to view and manage complaints submitted by users from different Gmail/authenticated accounts.

---

## ✅ Database Design

### Collection: `complaints` (Global/Centralized)

All complaints are stored in a **single, global collection** accessible to all authenticated users with appropriate permissions.

**Path Structure:**
```
✓ CORRECT:   /complaints/{complaintID}
✗ INCORRECT: /users/{userUID}/complaints/{complaintID}
```

---

## 📋 Complaint Document Fields

Each complaint document contains the following fields:

| Field Name | Type | Description | Required |
|------------|------|-------------|----------|
| `id` | String | Unique complaint identifier (e.g., "CMP1708876543210") | ✓ |
| `userId` | String | Email/UID of the user who submitted the complaint | ✓ |
| `userEmail` | String | Email address of the submitter | ✓ |
| `userName` | String | Display name of the submitter | ✓ |
| `category` | String | Issue category (water-leakage, pothole, garbage, etc.) | ✓ |
| `latitude` | Number | GPS latitude coordinate | ✓ |
| `longitude` | Number | GPS longitude coordinate | ✓ |
| `location` | Object | Full location data (latitude, longitude, accuracy, timestamp) | ✓ |
| `description` | String | Detailed description of the issue | ✓ |
| `image` | String | Base64 encoded image data (for localStorage) | ✓ |
| `imageURL` | String | Image URL or data (Firebase compatible field name) | ✓ |
| `timestamp` | String/Timestamp | ISO 8601 timestamp of submission | ✓ |
| `status` | String | Current status (pending, in-progress, resolved, rejected) | ✓ |
| `priority` | String | Priority level (low, medium, high, critical) | ✓ |
| `submittedAt` | String | Human-readable submission date/time | ✓ |
| `reporters` | Array | List of all users who reported this issue (for clustering) | ○ |
| `reportersCount` | Number | Total number of reporters for this issue | ○ |
| `adminNote` | String | Admin's notes or comments | ○ |
| `updatedAt` | Timestamp | Last update timestamp | ○ |

**Legend:** ✓ = Required | ○ = Optional

---

## 🏗️ Implementation Details

### Current Implementation (localStorage)

**Storage Key:** `geofix_complaints`

**Data Structure:** Flat array of complaint objects

```javascript
[
  {
    id: "CMP1708876543210",
    userId: "user@example.com",
    userEmail: "user@example.com",
    userName: "John Doe",
    category: "pothole",
    latitude: 40.7128,
    longitude: -74.0060,
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 10.5,
      timestamp: "2024-02-24T12:00:00.000Z"
    },
    description: "Large pothole blocking traffic",
    image: "data:image/jpeg;base64,...",
    imageURL: "data:image/jpeg;base64,...",
    timestamp: "2024-02-24T12:00:00.000Z",
    status: "pending",
    priority: "high",
    submittedAt: "2/24/2024, 12:00:00 PM",
    reporters: [...],
    reportersCount: 1
  },
  // More complaints...
]
```

### Future Implementation (Firebase Firestore)

**Collection Path:** `/complaints`

**Document ID:** Auto-generated or custom (e.g., "CMP1708876543210")

```javascript
// Firebase Firestore structure
const complaint = {
  userId: user.uid,
  userEmail: user.email,
  userName: user.displayName,
  category: "pothole",
  latitude: 40.7128,
  longitude: -74.0060,
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    accuracy: 10.5
  },
  description: "Large pothole blocking traffic",
  imageUrl: "https://storage.googleapis.com/.../image.jpg",
  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  status: "pending",
  priority: "high"
};

// Save to centralized collection
await db.collection('complaints').add(complaint);
```

---

## 🔐 Access Control

### Admin Dashboard Access

**Behavior:** Admins can view **ALL complaints** from **ALL users**

**Implementation:**
```javascript
// Admin fetches ALL complaints
const allComplaints = JSON.parse(localStorage.getItem('geofix_complaints') || '[]');

// Or with Firebase:
const snapshot = await db.collection('complaints')
  .orderBy('timestamp', 'desc')
  .get();
```

**Features:**
- ✓ View complaints from any Gmail/authenticated account
- ✓ Update complaint status
- ✓ Filter by category, status, priority
- ✓ View analytics across all submissions
- ✓ Real-time updates

---

### User Dashboard Access

**Behavior:** Users can view **ONLY their own complaints**

**Implementation:**
```javascript
// User fetches all complaints and filters by userId
const allComplaints = JSON.parse(localStorage.getItem('geofix_complaints') || '[]');
const userComplaints = allComplaints.filter(c => c.userId === currentUser.email);

// Or with Firebase:
const snapshot = await db.collection('complaints')
  .where('userId', '==', user.uid)
  .orderBy('timestamp', 'desc')
  .get();
```

**Features:**
- ✓ Users see only complaints they submitted
- ✓ Real-time status updates from admin
- ✓ Cannot modify other users' complaints
- ✓ Data isolation between user accounts

---

## 🔒 Firestore Security Rules

When using Firebase Firestore, apply these security rules to ensure proper access control:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Complaints collection (CENTRALIZED)
    match /complaints/{complaintId} {
      
      // READ: All authenticated users can read all complaints
      // (User dashboard filters client-side by userId)
      allow read: if request.auth != null;
      
      // CREATE: Authenticated users can create complaints
      // Must set userId to their own UID
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      
      // UPDATE: Owner or admin can update
      allow update: if request.auth != null 
        && (resource.data.userId == request.auth.uid 
            || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      // DELETE: Only admins can delete
      allow delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## 📊 Data Flow Diagrams

### Complaint Submission Flow

```
User (Gmail Account A) → Submit Complaint
   ↓
[Validate Data]
   ↓
Save to: /complaints/{complaintID}
   ↓
Database Structure:
{
  userId: "userA@gmail.com",
  userEmail: "userA@gmail.com",
  // ... other fields
}
   ↓
✓ Admin can see this complaint
✓ User A can see this complaint
✗ User B cannot see this complaint (filtered client-side)
```

### Admin Dashboard Flow

```
Admin Login → Load ALL Complaints from /complaints
   ↓
No userId filter applied
   ↓
Display complaints from ALL users:
- user1@gmail.com (5 complaints)
- user2@gmail.com (3 complaints)
- user3@gmail.com (7 complaints)
   ↓
Admin can update status of ANY complaint
```

### User Dashboard Flow

```
User Login (userA@gmail.com)
   ↓
Load ALL Complaints from /complaints
   ↓
Filter: complaint.userId === "userA@gmail.com"
   ↓
Display ONLY complaints from userA@gmail.com
   ↓
User sees real-time updates when admin changes status
```

---

## 🚀 Benefits of Centralized Structure

### ✅ Advantages

1. **Admin Visibility**: Admins can view complaints from all users in one place
2. **Simplified Querying**: Single collection makes queries faster and simpler
3. **Real-time Updates**: Changes made by admin are immediately visible to users
4. **Scalability**: Easy to add features like global search, analytics, etc.
5. **Data Consistency**: One source of truth for all complaints
6. **Multi-account Support**: Users can switch accounts and still access their data

### ⚠️ Considerations

1. **Client-side Filtering**: User dashboards must filter by userId to ensure privacy
2. **Security Rules**: Must properly configure Firestore rules to prevent unauthorized access
3. **Data Size**: As complaints grow, pagination and indexing become important

---

## 🧪 Testing the Implementation

### Test Case 1: Multi-User Submission

1. **User A** (userA@gmail.com) submits a complaint
2. **User B** (userB@gmail.com) submits a complaint
3. **Admin** logs in and should see **BOTH** complaints
4. **User A** logs in and should see **ONLY** their complaint
5. **User B** logs in and should see **ONLY** their complaint

### Test Case 2: Admin Status Update

1. **Admin** changes status of User A's complaint to "in-progress"
2. **User A** refreshes dashboard and sees updated status
3. **User B** does not see User A's complaint at all

### Test Case 3: Cross-Account Validation

1. Log in as **User A** and submit 3 complaints
2. Log out and log in as **User B**
3. Verify User B cannot see User A's complaints
4. Log in as **Admin**
5. Verify admin sees all 3 complaints from User A + any from User B

---

## 📝 Migration Notes

If migrating from a user-specific structure to centralized:

### Old Structure (INCORRECT)
```
/users/{uid}/complaints/{complaintId}
```

### New Structure (CORRECT)
```
/complaints/{complaintId}
  - userId: {uid}
  - userEmail: {email}
  - ...
```

### Migration Steps

1. **Read** all complaints from `/users/{uid}/complaints/`
2. **Add** `userId` and `userEmail` fields to each complaint
3. **Write** to `/complaints/{complaintId}`
4. **Update** client code to fetch from `/complaints`
5. **Add** userId filtering in user dashboard
6. **Update** security rules
7. **Test** thoroughly with multiple accounts
8. **Delete** old user-specific collections (after verification)

---

## 🔧 Code Examples

### Submitting a Complaint

```javascript
// complaint.js - Centralized submission
const complaint = {
  id: 'CMP' + Date.now(),
  userId: user.email,
  userEmail: user.email,
  userName: user.name,
  category: category,
  latitude: locationData.latitude,
  longitude: locationData.longitude,
  description: description,
  imageURL: capturedImageData,
  timestamp: new Date().toISOString(),
  status: 'pending',
  priority: 'medium'
};

// Save to centralized collection
const complaints = JSON.parse(localStorage.getItem('geofix_complaints') || '[]');
complaints.push(complaint);
localStorage.setItem('geofix_complaints', JSON.stringify(complaints));
```

### Admin: Fetch All Complaints

```javascript
// admin.js - No userId filter
function loadAllComplaints() {
  const allComplaints = JSON.parse(localStorage.getItem('geofix_complaints') || '[]');
  // No filtering - admin sees everything
  return allComplaints;
}
```

### User: Fetch Own Complaints

```javascript
// dashboard.js - Filter by userId
function loadUserComplaints(userId) {
  const allComplaints = JSON.parse(localStorage.getItem('geofix_complaints') || '[]');
  const userComplaints = allComplaints.filter(c => c.userId === userId);
  return userComplaints;
}
```

---

## 📚 Related Documentation

- [Firebase Setup Guide](HUGGINGFACE_SETUP.md)
- [Testing Guide](TESTING_GUIDE.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)

---

## 🔄 Version History

- **v1.0** (Feb 2024): Initial centralized structure implementation
  - Added `userEmail` field to all complaints
  - Updated Firebase security rules
  - Added comprehensive documentation
  - Tested with multiple Gmail accounts

---

## 💡 Key Takeaways

1. ✅ **DO** store complaints in `/complaints/{complaintId}`
2. ✅ **DO** include `userId` and `userEmail` in each document
3. ✅ **DO** allow admins to read all complaints
4. ✅ **DO** filter by userId on client-side for user dashboards
5. ❌ **DON'T** store in `/users/{uid}/complaints/`
6. ❌ **DON'T** filter by userId on admin dashboard
7. ❌ **DON'T** forget to set proper security rules

---

**Questions or Issues?** Check the [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md)
