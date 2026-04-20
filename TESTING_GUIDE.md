# 🧪 Quick Testing Guide: Crowd-Validated Issue Grouping

## How to Test the New Feature

### Prerequisites
1. Start the application: `python start-server.py` or open `index.html`
2. Create/login with a user account
3. Have GPS location enabled in browser

---

## 🎯 Test Case 1: Create Initial Complaint (New Cluster)

**Objective:** Create a new issue cluster

**Steps:**
1. Navigate to **Submit Complaint** page
2. Click **"Start Camera"** and capture a photo (or skip)
3. Click **"Get GPS Location"** (allow location access)
4. Select category: **"Pothole"**
5. Enter description: **"Large pothole on Main Street"**
6. Click **"Submit Complaint"**

**Expected Result:**
- ✅ Success message: "Complaint submitted successfully!"
- ✅ Redirected to dashboard
- ✅ Complaint shows with status "Pending"
- ✅ **No cluster badge** (only 1 reporter)

---

## 🎯 Test Case 2: Add Duplicate Report (Same User)

**Objective:** Test duplicate detection and grouping

**Steps:**
1. Stay logged in as **same user**
2. Go back to **Submit Complaint** page
3. Capture another photo (or skip)
4. Click **"Get GPS Location"** (should be very close to previous)
5. Select **same category**: "Pothole"
6. Enter different description: **"Same pothole is getting worse"**
7. Click **"Submit Complaint"**

**Expected Result:**
- ✅ Success message: **"This issue is already reported by 1 citizen! You have been added as a supporter."**
- ✅ Button text changes to: **"✓ Added as Supporter"**
- ✅ Redirected to dashboard after 3 seconds
- ✅ Complaint now shows **cluster badge**: `👥 2 Citizens`
- ✅ Blue info banner: **"Reported by 2 citizens"**
- ✅ Click **"▼ View All Reports"** to expand and see both reports

---

## 🎯 Test Case 3: Add Support from Different User

**Objective:** Test multi-user clustering

**Steps:**
1. **Logout** current user
2. **Register/Login** with different user account
3. Go to **Submit Complaint** page
4. Capture photo and get GPS location **(must be within 50 meters of original)**
5. Select **same category**: "Pothole"
6. Enter description: **"Dangerous pothole needs urgent fix"**
7. Click **"Submit Complaint"**

**Expected Result:**
- ✅ Success message: **"This issue is already reported by 2 citizens!..."**
- ✅ Added as 3rd reporter
- ✅ Dashboard (if you had access to view) shows **`👥 3 Citizens`**
- ✅ Reporter count incremented to 3

---

## 🎯 Test Case 4: View Cluster Details (User Dashboard)

**Objective:** Test expandable reporter list

**Steps:**
1. Login as **any user who reported** the clustered issue
2. Navigate to **Dashboard**
3. Find the complaint with cluster badge
4. Click **"▼ View All Reports"** button

**Expected Result:**
- ✅ List expands showing all 3 reports
- ✅ Each report shows:
  - Report number (#1, #2, #3)
  - Reporter name
  - Timestamp
  - Evidence photo (clickable)
  - Individual description
- ✅ Click toggle again to collapse (▲ icon)
- ✅ Click any photo to open full-size modal

---

## 🎯 Test Case 5: Admin View of Cluster

**Objective:** Test admin cluster display

**Steps:**
1. **Logout** and login as **admin** (admin@geofix.com / admin123)
2. Navigate to **Admin Dashboard**
3. Find the clustered complaint in table

**Expected Result (Table View):**
- ✅ ID column shows: `CMP...` **`👥 3`** (cluster badge)
- ✅ User column shows: `[First Reporter Name] +2` (indicator)
- ✅ All other columns show normal data

**Expected Result (Detail Modal):**
1. Click **"👁️ View"** button on the complaint
2. Modal opens with:
   - ✅ **Blue header**: "👥 Clustered Issue - 3 Citizens Reporting"
   - ✅ Primary complaint image
   - ✅ **"All Reports (3 total)"** section
   - ✅ Scrollable list with all 3 reports
   - ✅ Each report in alternating colors
   - ✅ Photos are clickable to open in new tab

---

## 🎯 Test Case 6: Different Category (No Grouping)

**Objective:** Verify category matching is required

**Steps:**
1. As any user, submit new complaint
2. Get GPS location **(same location as pothole)**
3. Select **different category**: "Garbage"
4. Submit complaint

**Expected Result:**
- ✅ **Creates NEW complaint** (no duplicate detected)
- ✅ Shows as separate issue
- ✅ No cluster badge
- ✅ **Reason:** Different category prevents grouping

---

## 🎯 Test Case 7: Distance Too Far (No Grouping)

**Objective:** Verify 50-meter threshold

**Steps:**
1. Submit new complaint
2. **Manually change GPS** location to be > 50 meters away
   - If original: (12.9716, 77.5946)
   - New location: (12.9720, 77.5950) - approx 60m away
3. Select **same category**: "Pothole"
4. Submit complaint

**Expected Result:**
- ✅ **Creates NEW complaint** (no duplicate detected)
- ✅ **Reason:** Distance > 50m threshold

**Note:** Manually changing GPS is tricky in browser. Easier to physically move 50+ meters away or use browser dev tools to mock location.

---

## 🎯 Test Case 8: Priority Auto-Adjustment

**Objective:** Test automatic priority increase

**Steps:**
1. Create initial pothole complaint (priority = "high" by default)
2. Add 2 more reporters (count = 3)
   - Priority stays "high"
3. Add 2 more reporters (count = 5)
   - **Priority auto-upgraded to "high"** (if wasn't already)
4. Add 5 more reporters (count = 10)
   - **Priority auto-upgraded to "critical"**

**Expected Result:**
- ✅ Admin dashboard shows:
  - Priority column updates automatically
  - Higher reporter count = higher priority
- ✅ Priority thresholds:
  - 3+ reporters → minimum "medium"
  - 5+ reporters → "high"
  - 10+ reporters → "critical"

---

## 🎯 Test Case 9: Resolved Issue (No New Grouping)

**Objective:** Verify resolved complaints are skipped

**Steps:**
1. As admin, mark the pothole cluster as **RESOLVED**
2. Logout, login as regular user
3. Submit new complaint at **same location**, **same category**

**Expected Result:**
- ✅ **Creates NEW complaint** (not added to resolved cluster)
- ✅ **Reason:** Resolved/rejected issues are excluded from duplicate search
- ✅ Shows as fresh complaint with reporter count = 1

---

## 🎯 Test Case 10: Image Gallery

**Objective:** Test evidence photo viewing

**Steps:**
1. View clustered complaint in dashboard
2. Expand reporter list
3. Click on any reporter's image

**Expected Result:**
- ✅ Full-screen modal opens
- ✅ Image displayed at maximum size
- ✅ Dark background (90% opacity black)
- ✅ Click anywhere to close modal

---

## 📊 Visual Checklist

### User Dashboard
- [ ] Cluster badge visible on image (`👥 X Citizens`)
- [ ] Blue info banner shows reporter count
- [ ] Toggle button says "▼ View All Reports"
- [ ] Reporter list expands/collapses smoothly
- [ ] Each report shows number, name, time, photo, description
- [ ] Photos are clickable and open in modal

### Admin Dashboard (Table)
- [ ] ID column shows cluster badge (`👥 X`)
- [ ] User column shows indicator (`+X`)
- [ ] Standard status, category, location columns visible

### Admin Dashboard (Modal)
- [ ] Blue cluster header displays
- [ ] "All Reports (X total)" section exists
- [ ] Scrollable list with alternating row colors
- [ ] Each photo clickable (opens in new tab)
- [ ] Action buttons still work (Accept/Reject/Resolve)

---

## 🐛 Common Issues & Solutions

### Issue: GPS not accurate enough
**Problem:** Location varies by 10-20m each time  
**Solution:** Wait outdoors for better GPS signal, or increase threshold to 75-100m in code

### Issue: Not detecting duplicate
**Problem:** Submitted same category nearby but created new complaint  
**Solution:** 
- Check GPS coordinates difference
- Verify category is exactly the same
- Check if original was already resolved/rejected

### Issue: Cluster badge not showing
**Problem:** 2+ reporters but no badge visible  
**Solution:**
- Refresh page (hard refresh: Ctrl+F5)
- Check browser console for errors
- Verify `reportersCount` field exists in localStorage data

### Issue: Reporter list not expanding
**Problem:** Click toggle button but nothing happens  
**Solution:**
- Check browser console for JavaScript errors
- Ensure `toggleReporters()` function is defined in dashboard.js
- Verify element ID matches (`reporters-list-${complaint.id}`)

---

## 🧪 Advanced Testing (Developer)

### Test Distance Calculation
**Open browser console and run:**
```javascript
// Test Haversine formula (paste in console on submit-complaint.html page)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Test with sample coordinates
calculateDistance(12.9716, 77.5946, 12.9718, 77.5945); 
// Should return ~35 meters
```

### Test Duplicate Detection
**In console:**
```javascript
// View all complaints
const complaints = JSON.parse(localStorage.getItem('geofix_complaints'));
console.log('Total complaints:', complaints.length);

// View clustered complaints
const clustered = complaints.filter(c => c.reportersCount > 1);
console.log('Clustered issues:', clustered.length);
console.log(clustered);

// View specific cluster details
const cluster = complaints.find(c => c.reportersCount > 1);
if (cluster) {
    console.log('Cluster ID:', cluster.id);
    console.log('Reporter count:', cluster.reportersCount);
    console.log('Reporters:', cluster.reporters);
}
```

---

## ✅ Success Criteria

All features working correctly if:
- ✅ Duplicate detection triggers within 50m + same category
- ✅ Cluster badge displays with correct count
- ✅ Reporter list expands/collapses smoothly
- ✅ All photos visible and clickable
- ✅ Admin sees blue cluster header
- ✅ Priority auto-adjusts based on reporter count
- ✅ Success messages show correct citizen count
- ✅ No JavaScript errors in console
- ✅ Mobile responsive (test on phone)

---

## 📱 Mobile Testing

**Test on actual mobile device or browser dev tools:**
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Test all scenarios above
5. Verify:
   - Touch interactions work
   - Cluster badges visible and sized correctly
   - Reporter list scrollable
   - Images load properly
   - GPS location works on mobile

---

## 🎉 Testing Complete!

Once all test cases pass, the crowd-validated issue grouping system is **fully operational** and ready for real-world use.

**Happy Testing! 🚀**
