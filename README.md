# 🌍 GeoFix - Geo-Verified Civic Complaint System

A modern, responsive civic-tech web application that allows citizens to report civic issues using **live GPS location** and **live camera capture**, preventing fake complaints and improving transparency.

## 🎯 Purpose

GeoFix helps citizens report civic issues (potholes, garbage, water leakage, streetlight issues) with verified location and photo evidence, while providing administrators with tools to manage and track complaint resolution.

## ✨ Features

### For Citizens
- ✅ **Live GPS Verification** - Automatic location capture using Geolocation API
- 📸 **Live Camera Capture** - Real-time photo capture (gallery uploads disabled)
- 🕒 **Automatic Timestamps** - Every complaint is timestamped automatically
- 📊 **Complaint Tracking** - Track your complaints from submission to resolution
- 🗺️ **Map Integration** - View complaint locations on interactive maps
- 🔔 **Status Updates** - Get status updates (Pending, In Progress, Resolved, Rejected)

### For Administrators
- 📋 **Complaint Management** - View and manage all submitted complaints
- ⚙️ **Status Control** - Approve, reject, or change complaint status
- 📈 **Analytics Dashboard** - View statistics and trends
  - Total complaints
  - Status breakdown
  - Most reported issues
  - Most affected areas
- 🗺️ **Map View** - Visualize all complaints on an interactive map
- 🔍 **Search & Filter** - Filter by status, category, or search by keywords

## 🚀 Quick Start

### Running Locally

1. **Clone or Download** the project
2. **Open with a Local Server**:
   - Using VS Code Live Server:
     - Install the "Live Server" extension
     - Right-click on `index.html` and select "Open with Live Server"
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
   - Using Node.js:
     ```bash
     npx http-server
     ```
3. **Access the Application**:
   - Open your browser and navigate to `http://localhost:8000`

### Demo Credentials

**User Account:**
- Email: `user@demo.com`
- Password: `pass123`

**Admin Account:**
- Email: `admin@demo.com`
- Password: `admin123`

## 📁 Project Structure

```
civic-issue-resolution/
├── index.html                 # Home page
├── login.html                 # Login page
├── register.html              # Registration page
├── submit-complaint.html      # Submit complaint page
├── dashboard.html             # User dashboard
├── admin-dashboard.html       # Admin dashboard
├── css/
│   └── style.css             # Main stylesheet
├── js/
│   ├── auth.js               # Authentication logic
│   ├── complaint.js          # Complaint submission logic
│   ├── dashboard.js          # User dashboard logic
│   ├── admin.js              # Admin dashboard logic
│   └── firebase-config.js    # Firebase configuration (optional)
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Client-side logic

### APIs Used
- **Geolocation API** - Live GPS coordinate capture
- **MediaDevices API** - Live camera access
- **OpenStreetMap** - Map visualization

### Storage (Current Demo)
- **LocalStorage** - Client-side data persistence for demo

### Backend (Optional)
- **Firebase** - For production deployment
  - Authentication
  - Firestore Database
  - Cloud Storage

## 📱 Pages Overview

### 1. Home Page (`index.html`)
- Project introduction
- Feature highlights
- Call-to-action buttons
- Problem & solution explanation

### 2. Authentication (`login.html`, `register.html`)
- User login and registration
- Form validation
- Error handling
- Demo credentials for testing

### 3. Submit Complaint (`submit-complaint.html`)
- **Live Camera Section** - Capture real-time photos
- **GPS Section** - Automatic location detection
- **Category Selection** - Choose issue type
- **Description** - Detailed issue description
- **Timestamp** - Auto-generated submission time

### 4. User Dashboard (`dashboard.html`)
- View all submitted complaints
- Filter by status and category
- Complaint statistics
- View location on map
- Track complaint status

### 5. Admin Dashboard (`admin-dashboard.html`)
- Manage all complaints
- Change complaint status
- View analytics and statistics
- Map view of all complaints
- Search and filter functionality

## 🔐 Security Features

- ✅ Camera and location permissions required
- ✅ No gallery image uploads (live capture only)
- ✅ No manual location entry (GPS verification only)
- ✅ Automatic timestamp attachment
- ✅ User authentication for complaint tracking

## 📊 Complaint Categories

1. 🕳️ **Pothole** (High Priority)
2. 🗑️ **Garbage** (Medium Priority)
3. 💧 **Water Leakage** (High Priority)
4. 💡 **Streetlight Issue** (Medium Priority)
5. 📋 **Others** (Low Priority)

## 🎨 Design Features

- Modern, clean UI design
- Soft shadows and rounded corners
- Mobile-first responsive layout
- Civic-tech color palette (Blue/Green/White)
- Icon-based category representation
- Status badges with color coding

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 💻 Desktop (1920px and above)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 768px)

## 🚀 Deploying to Production (Firebase)

### Step 1: Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Enable Cloud Storage

### Step 2: Configure Firebase

1. Open `js/firebase-config.js`
2. Uncomment the Firebase configuration code
3. Replace placeholders with your Firebase config:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

### Step 3: Add Firebase Scripts

Add these scripts to your HTML files (before closing `</body>` tag):

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"></script>
<script src="js/firebase-config.js"></script>
```

### Step 4: Deploy

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy to Firebase Hosting
firebase deploy
```

## 🧪 Testing the Application

### Test Camera Functionality
1. Navigate to Submit Complaint page
2. Click "Start Camera"
3. Allow camera permission when prompted
4. Click "Capture Image" to take a photo
5. Review the captured image

### Test GPS Functionality
1. On Submit Complaint page
2. Click "Get Live Location"
3. Allow location permission when prompted
4. Verify coordinates are displayed
5. Check map preview appears

### Test Complaint Submission
1. Capture both image and location
2. Select a category
3. Enter description (minimum 10 characters)
4. Click "Submit Complaint"
5. Verify success message and redirect to dashboard

### Test Dashboard
1. Login as user (`user@demo.com` / `pass123`)
2. View your submitted complaints
3. Test filters (status, category)
4. Click "View on Map" to see location
5. Check statistics are accurate

### Test Admin Dashboard
1. Login as admin (`admin@demo.com` / `admin123`)
2. View all complaints from all users
3. Change complaint status
4. View analytics
5. Switch to map view

## 🎯 Use Cases

### For Hackathons
- Demonstrates full-stack skills
- Real-world problem solving
- Modern UI/UX design
- API integration (GPS, Camera)
- Data management

### For Learning
- JavaScript DOM manipulation
- Browser APIs (Geolocation, MediaDevices)
- LocalStorage usage
- Responsive CSS Grid/Flexbox
- Form validation

### For Portfolio
- Complete project with multiple features
- Clean, professional code
- Comprehensive documentation
- Production-ready design

## 🔧 Customization

### Change Color Scheme

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #2563eb;      /* Change primary color */
    --secondary-color: #10b981;    /* Change secondary color */
    --accent-color: #3b82f6;       /* Change accent color */
}
```

### Add New Complaint Categories

1. Update the select dropdown in `submit-complaint.html`
2. Add icon mapping in `dashboard.js` and `admin.js`
3. Update priority calculation in `complaint.js`

### Modify Map Provider

Change OpenStreetMap to Google Maps or other providers by updating the map URLs in:
- `complaint.js` - `showMapPreview()` function
- `dashboard.js` - `viewOnMap()` function
- `admin.js` - `loadMapView()` function

## 📝 Future Enhancements

- [ ] Duplicate complaint detection (within 50 meters)
- [ ] Email notifications
- [ ] SMS alerts for status updates
- [ ] Real-time chat with administrators
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Complaint export (PDF, CSV)
- [ ] Advanced analytics with charts
- [ ] Mobile app version (React Native)
- [ ] Offline support with Service Workers

## 🐛 Troubleshooting

### Camera Not Working
- Ensure HTTPS connection (required for camera access)
- Check browser permissions
- Try different browser (Chrome/Firefox recommended)

### GPS Not Working
- Allow location permission when prompted
- Ensure location services are enabled on device
- Check browser permissions
- Try refreshing the page

### Data Not Persisting
- Check browser LocalStorage is enabled
- Clear cache if data appears corrupted
- Don't use incognito mode (LocalStorage may be disabled)

## 📄 License

This project is open source and available for educational and hackathon purposes.

## 👨‍💻 Support & Contact

For questions, issues, or contributions:
- Create an issue on GitHub
- Submit a pull request
- Contact project maintainer

## 🙏 Acknowledgments

- OpenStreetMap for map integration
- Font Awesome for icons (in future versions)
- Firebase for backend infrastructure option

---

**Built with ❤️ for better communities**

*GeoFix - Making civic reporting transparent and verified*
