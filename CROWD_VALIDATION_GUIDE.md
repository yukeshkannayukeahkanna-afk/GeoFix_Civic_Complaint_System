# 👥 Crowd-Validated Issue Grouping System

## Overview

The GeoVerified Civic Complaint System now features **intelligent duplicate detection** and **crowd-validated issue grouping**. This prevents duplicate complaints and empowers citizens to validate and support issues reported by others in their community.

---

## 🎯 Key Features

### 1. **Automatic Duplicate Detection**
- Uses **Haversine formula** for precise GPS distance calculation
- Matches complaints with:
  - ✅ Same category
  - ✅ Within **50 meters** proximity
  - ✅ Not resolved/rejected status

### 2. **Issue Clustering**
- Multiple reports of the same issue are grouped into **one issue cluster**
- Each cluster contains:
  - Primary complaint ID
  - Category and location
  - Status and priority
  - **All reporters** and their evidence
  - Total reporter count

### 3. **Crowd Validation**
- When citizens report the same issue, they become **supporters**
- More supporters = **higher priority**
  - 3+ reporters → Medium priority (if not already higher)
  - 5+ reporters → High priority
  - 10+ reporters → Critical priority

---

## 🔄 How It Works

### For Citizens (Complaint Submission)

**Scenario 1: New Unique Issue**
1. Citizen submits a complaint with photo, GPS, category, and description
2. System checks for similar existing complaints (same category + within 50m)
3. No match found → Creates **new issue cluster**
4. Complaint is saved and displayed on dashboard

**Scenario 2: Duplicate Issue Found**
1. Citizen submits a complaint
2. System finds existing complaint with same category within 50 meters
3. Shows message: *"This issue is already reported by X citizens. You have been added as a supporter."*
4. Adds citizen as a **new reporter** to the existing cluster
5. Increments reporter count
6. May increase priority based on total reporters
7. Redirects to dashboard showing the clustered issue

---

## 📊 Data Structure

### Issue Cluster Object
```javascript
{
  id: "CMP1234567890",           // Unique cluster ID
  category: "pothole",            // Issue category
  location: {                     // GPS coordinates
    latitude: 12.9716,
    longitude: 77.5946,
    accuracy: 15
  },
  timestamp: "2026-02-21T...",    // First report timestamp
  status: "pending",              // Current status
  priority: "high",               // Auto-adjusted by reporter count
  
  // Cluster-specific data
  reporters: [                    // Array of all reports
    {
      reportId: "RPT1234567890_1",
      userId: "john@example.com",
      userName: "John Doe",
      image: "data:image/...",    // Evidence photo
      description: "...",         // User description
      timestamp: "2026-02-21T..."
    },
    {
      reportId: "RPT1234567891_2",
      userId: "jane@example.com",
      userName: "Jane Smith",
      image: "data:image/...",
      description: "...",
      timestamp: "2026-02-21T..."
    }
  ],
  reportersCount: 2               // Total number of reporters
}
```

---

## 🎨 User Interface

### User Dashboard

**Clustered Issue Display:**
- **Badge on image**: `👥 X Citizens` - Shows number of reporters
- **Cluster info section**: Blue gradient banner with citizen count
- **Expandable reporter list**: Click "View All Reports" to see:
  - Each reporter's name and timestamp
  - Individual evidence photos (clickable to enlarge)
  - Individual descriptions
  - Report number (#1, #2, #3, etc.)

### Admin Dashboard

**Table View:**
- **Complaint ID column**: Shows cluster badge `👥 X` for grouped issues
- **User column**: Shows primary reporter + indicator `+X` for additional supporters
- **All standard columns** remain the same

**Detail Modal:**
- **Cluster header**: Blue banner stating "Clustered Issue - X Citizens Reporting"
- **All Reports section**: Scrollable list showing:
  - Each reporter's information
  - Individual evidence photos
  - Individual descriptions
  - Timestamp of each report
  - Visual alternating row colors for readability

---

## 📍 Distance Calculation (Haversine Formula)

The system uses the **Haversine formula** to calculate the great-circle distance between two GPS points:

```javascript
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

    return R * c; // Distance in meters
}
```

**Example:**
- Complaint A: Pothole at (12.9716, 77.5946)
- Complaint B: Pothole at (12.9720, 77.5948)
- Distance: ~45 meters ✅ **Within threshold → Grouped**

---

## 🚦 Priority Auto-Adjustment

| Reporter Count | Priority Level | Badge Color |
|----------------|----------------|-------------|
| 1-2 reporters  | Original priority | - |
| 3-4 reporters  | Medium (min)   | Yellow |
| 5-9 reporters  | High           | Orange |
| 10+ reporters  | **Critical**   | Red |

---

## 🛠️ Technical Implementation

### Files Modified

1. **`js/complaint.js`**
   - `calculateDistance()` - Haversine formula implementation
   - `findDuplicateComplaint()` - Search for matching complaints
   - `createIssueCluster()` - Initialize new cluster
   - `addReporterToCluster()` - Add supporter to existing cluster
   - Modified `handleSubmit()` - Check for duplicates before creating complaint

2. **`js/dashboard.js`**
   - Updated `createComplaintCard()` - Display cluster badges and reporter lists
   - `toggleReporters()` - Expand/collapse reporter details
   - `viewImage()` - Modal image viewer for evidence photos

3. **`js/admin.js`**
   - Updated `createTableRow()` - Show cluster indicators in table
   - Updated `viewComplaintDetails()` - Display all reporters in modal

4. **`css/style.css`**
   - `.cluster-badge` - Badge on complaint image
   - `.cluster-info` - Blue info banner
   - `.reporters-list` - Expandable reporter list
   - `.reporter-item` - Individual reporter card
   - `.cluster-badge-small` - Admin table badge
   - `.cluster-indicator` - User count indicator

---

## 📱 User Experience Flow

### Submitting a Duplicate Complaint

1. **User captures photo** of a pothole at GPS location (12.9716, 77.5946)
2. **Selects category**: "Pothole"
3. **Writes description**: "Large pothole causing damage"
4. **Clicks Submit**
5. **System checks**: Finds existing pothole complaint at (12.9718, 77.5945) - 35m away
6. **System shows**: *"This issue is already reported by 3 citizens. You have been added as a supporter. Together, we can get this issue resolved faster! 👥"*
7. **User added** as 4th reporter to existing cluster
8. **Priority upgraded** to High (4 reporters reached threshold)
9. **User redirected** to dashboard showing the clustered issue with 4 reporters

### Viewing Clustered Issue (User Dashboard)

1. User sees complaint card with **badge**: `👥 4 Citizens`
2. Blue banner shows: *"Reported by 4 citizens"*
3. Click **"View All Reports"** button
4. Expandable section shows:
   - **Report #1**: John Doe, timestamp, photo, description
   - **Report #2**: Jane Smith, timestamp, photo, description
   - **Report #3**: Bob Johnson, timestamp, photo, description
   - **Report #4**: User's own report, timestamp, photo, description
5. Can click any photo to view full-size

### Admin Review of Clustered Issue

1. Admin sees table row with:
   - ID column: `CMP123456` **👥 4**
   - User column: `John Doe +3`
2. Clicks **"View"** button
3. Modal shows:
   - **Blue header**: "👥 Clustered Issue - 4 Citizens Reporting"
   - Primary complaint image and details
   - **"All Reports (4 total)"** section with scrollable list
   - Each report shows full evidence and description
4. Admin can see community validation → **Higher confidence** in issue severity
5. Takes action (Accept/Reject/Resolve) affecting all reporters

---

## 🧠 Smart Behaviors

### Backward Compatibility
- Existing complaints without `reporters` array are **auto-converted** on first duplicate match
- Converts single complaint to cluster format:
  ```javascript
  reporters: [{
    reportId: "RPT..._1",
    userId: complaint.userId,
    userName: complaint.userName,
    image: complaint.image,
    description: complaint.description,
    timestamp: complaint.timestamp
  }]
  ```

### Active Complaints Only
- Duplicate detection **only checks** complaints with status:
  - ✅ `pending`
  - ✅ `in-progress`
- Skips:
  - ❌ `resolved`
  - ❌ `rejected`
- **Reason**: No point in grouping with issues already fixed/closed

### Description Annotation
- When 2nd reporter is added:
  - Description updated to: `[CLUSTERED ISSUE - 2 citizens reporting] Original description...`
- When more reporters are added:
  - Count updated: `[CLUSTERED ISSUE - X citizens reporting] Original description...`

---

## ⚙️ Configuration

### Adjustable Parameters

**Distance Threshold** (in `js/complaint.js`):
```javascript
const duplicateComplaint = findDuplicateComplaint(
    category,
    locationData.latitude,
    locationData.longitude,
    50 // 👈 Change this value (in meters)
);
```

**Recommendations:**
- **Urban areas**: 30-50 meters (buildings are close)
- **Suburban areas**: 50-100 meters (wider spacing)
- **Rural areas**: 100-200 meters (sparse infrastructure)

**Priority Thresholds** (in `js/complaint.js` → `addReporterToCluster()`):
```javascript
if (complaint.reportersCount >= 10) {
    complaint.priority = 'critical';  // 👈 Adjust threshold
} else if (complaint.reportersCount >= 5) {
    complaint.priority = 'high';      // 👈 Adjust threshold
} else if (complaint.reportersCount >= 3) {
    complaint.priority = 'medium';    // 👈 Adjust threshold
}
```

---

## 🎯 Benefits

### For Citizens
✅ **Know you're not alone** - See others reporting the same issue  
✅ **Collective voice** - Strength in numbers increases priority  
✅ **Avoid duplicates** - Don't waste time re-reporting known issues  
✅ **Track progress** - See all evidence and community support  

### For Administrators
✅ **Reduce clutter** - No duplicate entries in system  
✅ **Identify hotspots** - Issues with many reporters need urgent attention  
✅ **Community validation** - Multiple reporters = confirmed severity  
✅ **Better resource allocation** - Prioritize high-reporter-count issues  
✅ **Evidence aggregation** - Multiple photos provide better context  

### For Civic Management
✅ **Data intelligence** - Understand which issues affect most citizens  
✅ **Efficient resolution** - Solve one clustered issue = satisfy multiple citizens  
✅ **Transparency** - Citizens see others care about same problems  
✅ **Accountability** - High reporter counts create urgency  

---

## 🔒 Data Integrity

### Storage Events
- When a new reporter is added, system triggers `storage` event
- All open dashboard/admin tabs **auto-refresh** to show updated data
- Prevents data conflicts when multiple users/admins are active

### Validation
- Reporter count always matches `reporters.length`
- Each report has unique `reportId`
- Timestamps preserved for audit trail

---

## 📈 Future Enhancements

Potential improvements:
- [ ] **Real-time notifications** when someone supports your issue
- [ ] **Voting system** for severity within cluster
- [ ] **Map view** showing clustered issues as pins with size based on reporter count
- [ ] **Auto-tagging** frequently reported areas as "hotspots"
- [ ] **Clustering radius** based on category (larger for water leaks, smaller for potholes)
- [ ] **Reporter anonymity options** for sensitive issues
- [ ] **Merge/split clusters** manually by admin if needed

---

## 🚀 Getting Started

The crowd-validated grouping system is **automatically enabled** in your GeoFix application. No configuration needed!

1. **Submit complaints normally** through the complaint form
2. **System automatically detects** duplicates based on GPS + category
3. **View clustered issues** with reporter badges in dashboard
4. **Admins see cluster info** in table and detail modals

---

## 💡 Best Practices

### For Citizens
- **Be specific** in descriptions even if issue is already reported
- **Upload clear photos** - each new photo adds evidence
- **Check nearby** before assuming it's a duplicate (50m is small!)

### For Administrators
- **Review all reporters** before taking action
- **Use combined evidence** from all photos for better assessment
- **Communicate resolution** affects all reporters simultaneously
- **Consider reporter count** when prioritizing workload

---

## 📞 Support

If you encounter issues with the clustering system:
1. Check browser console for error messages
2. Verify GPS accuracy is good (< 50m)
3. Ensure localStorage has sufficient space
4. Test with sample data to confirm functionality

---

**Built with ❤️ for smarter civic governance**
