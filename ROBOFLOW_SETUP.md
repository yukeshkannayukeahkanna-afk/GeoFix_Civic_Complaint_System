# 🤖 Roboflow AI Auto-Detection Setup Guide

## 📋 Overview

This guide shows you how to configure AI-powered **automatic category detection** for the GeoFix civic complaint system using Roboflow's YOLO API.

**New Feature:** When users capture an image, the AI automatically suggests the complaint category (Pothole, Garbage, Water Leakage, Streetlight, Others) with confidence score and visual bounding boxes!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Roboflow API Key

1. Go to [https://app.roboflow.com](https://app.roboflow.com)
2. Sign up or log in (free tier available)
3. Navigate to **Settings** → **Roboflow API**
4. Copy your **Private API Key** (starts with `rf_...`)

**Example:** `rf_1A2b3C4d5E6f7G8h9I0j`

### Step 2: Configure AI in GeoFix

Open `js/complaint.js` and find the AI Configuration section (around line 33):

**Before:**
```javascript
const AI_CONFIG = {
    ROBOFLOW_API_KEY: 'YOUR_ROBOFLOW_API_KEY',  // ← Replace this
    ROBOFLOW_MODEL_ID: 'civic-issues/2',
    CONFIDENCE_THRESHOLD: 0.40,
    ENABLED: true,
    SHOW_BOUNDING_BOX: true,
    AUTO_SUGGEST: true
};
```

**After:**
```javascript
const AI_CONFIG = {
    ROBOFLOW_API_KEY: 'rf_1A2b3C4d5E6f7G8h9I0j',  // ← Your actual API key
    ROBOFLOW_MODEL_ID: 'civic-issues/2',             // ← Or your model ID
    CONFIDENCE_THRESHOLD: 0.40,
    ENABLED: true,
    SHOW_BOUNDING_BOX: true,
    AUTO_SUGGEST: true
};
```

### Step 3: Test the Integration

1. Open `submit-complaint.html` in your browser
2. Click **"Start Camera"**
3. Point camera at a civic issue (pothole, garbage, etc.)
4. Click **"Capture Image"**
5. **AI will automatically analyze** and suggest a category
6. Click **"✓ Use AI Suggestion"** or select different category manually
7. Complete the form and submit

---

## 🎨 How It Works

### User Workflow

```
User clicks "Capture Image"
    ↓
Image captured from camera
    ↓
🤖 "AI analyzing image..."
    ↓
AI detects civic issue using YOLO
    ↓
✓ "AI Detected: Pothole (85% confident)"
    ↓
User clicks "Use AI Suggestion" button
    ↓
Category auto-filled in dropdown
    ↓
User submits complaint
```

### Visual Feedback

- **Green bounding box** drawn around detected object
- **Confidence percentage** displayed
- **Clickable suggestion button** to accept AI category
- **Manual override** still available

---

## 🔧 Model Options

### Option A: Use Existing Public Models (Recommended for Testing)

Browse [Roboflow Universe](https://universe.roboflow.com/) for civic-related models:

**Search for:**
- "garbage detection"
- "pothole detection"  
- "street damage detection"
- "infrastructure issues"

**How to use:**
1. Find a suitable model (e.g., `pothole-detector/3`)
2. Copy the Model ID from the model page
3. Update `AI_CONFIG.ROBOFLOW_MODEL_ID` in complaint.js

### Option B: Train Your Own Custom Model (Best Accuracy)

1. Create a new project in Roboflow
2. Upload 50-100+ images per category:
   - Potholes
   - Garbage piles
   - Water leaks/floods
   - Broken streetlights
3. Annotate images (draw boxes around issues)
4. Train YOLO model (auto-training available)
5. Deploy and get Model ID (format: `your-project/version`)
6. Update `AI_CONFIG.ROBOFLOW_MODEL_ID`

**Training Tips:**
- Use diverse images (different angles, lighting, weather)
- Include edge cases (small potholes, scattered garbage)
- Balance classes (similar number of images per category)

---

## 🧪 Testing & Demo Mode

### Test with Standalone Demo First

Before integrating with the main system, test with the demo page:

1. Open `roboflow-demo.html` in browser
2. Configure API key in the page (around line 263)
3. Test camera capture and detection
4. Verify bounding boxes and predictions
5. Check browser console (F12) for API responses

### Demo Mode (No API Key Needed)

If you haven't set up a Roboflow account yet, the system includes a **simulation mode**:

```javascript
const AI_CONFIG = {
    ROBOFLOW_API_KEY: 'YOUR_ROBOFLOW_API_KEY',  // ← Keep as is
    // ... other settings
};
```

**When API key is not configured:**
- System automatically uses simulated AI detection
- Randomly suggests categories for demo purposes
- Shows "[DEMO MODE]" in detection message
- Perfect for testing UI without API costs

**To enable real AI:**
- Replace `'YOUR_ROBOFLOW_API_KEY'` with actual key
- System automatically switches to real Roboflow API

---

## 📊 API Response Format

Roboflow returns JSON with this structure:

```json
{
  "time": 0.123,
  "image": {
    "width": 1920,
    "height": 1080
  },
  "predictions": [
    {
      "x": 500,
      "y": 300,
      "width": 200,
      "height": 150,
      "confidence": 0.92,
      "class": "garbage",
      "class_id": 0
    }
  ]
}
```

---

## 🔧 Configuration Options

### Confidence Threshold

Adjust `CONFIDENCE_THRESHOLD` to control detection sensitivity:

- **0.30** (30%): More detections, less accurate
- **0.50** (50%): Balanced (recommended)
- **0.70** (70%): Fewer detections, more accurate

### Category Mapping

Edit the category mapping in `complaint.js` (around line 272):

```javascript
const categoryMapping = {
    'pothole': ['pothole', 'hole', 'crack', 'road-damage'],
    'garbage': ['garbage', 'trash', 'waste', 'litter', 'debris'],
    'water-leakage': ['water', 'leak', 'leakage', 'puddle', 'flooding'],
    'streetlight': ['streetlight', 'lamp', 'light', 'broken-light'],
    'others': []
};
```

Add your model's class names to match your categories.

---

## ✨ Features Implemented

### ✅ Live Camera Access
- Uses MediaDevices API
- Requests environment-facing camera
- HD quality (1920x1080)

### ✅ Image Capture
- Captures frame from video stream
- Converts to Base64 JPEG
- Optimized compression (90% quality)

### ✅ Roboflow API Integration
- POST request to Roboflow endpoint
- Sends Base64 image data
- Handles API errors gracefully

### ✅ Result Display
- Shows detected class name
- Displays confidence percentage
- Draws bounding boxes on image
- Color-coded feedback (green = success, red = error)

### ✅ Category Validation
- Matches detected class with selected category
- Rejects mismatched images
- Prompts user to retake if needed

### ✅ Fallback Handling
- If Roboflow disabled: Uses Hugging Face
- If both fail: Uses smart simulation
- Never blocks user from submitting

---

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check your API key is correct
- Ensure no extra spaces
- Try regenerating key in Roboflow dashboard

### "Model Not Found" Error
- Verify MODEL_ID format: `project-name/version`
- Check model is deployed in Roboflow
- Ensure version number is correct

### "No Predictions" Result
- Lower confidence threshold
- Ensure image shows the actual issue clearly
- Check if your model is trained for that object class

### CORS Errors
- Roboflow API supports CORS by default
- If issues persist, check browser console
- Try different browser (Chrome recommended)

---

## 📝 Example Usage Flow

1. **User selects category**: "Garbage"
2. **User starts camera**: Live video preview appears
3. **User captures image**: Frame frozen and sent to API
4. **Roboflow detects**: `{"class": "garbage", "confidence": 0.89}`
5. **System validates**: "garbage" matches "Garbage" category ✓
6. **Result shown**: "AI detected: Garbage (89%)" with bounding box
7. **User submits**: Complaint saved with validated image

---

## 🔐 Security Notes

### API Key Safety
- **Never commit API keys to public repos**
- Consider using environment variables
- For production: Implement backend proxy

### Recommended Architecture

```
Frontend (Browser)
    ↓
Backend Server (Your API)
    ↓
Roboflow API
```

This way:
- API key stays on server
- No CORS issues
- Better security
- Usage monitoring

---

## 💡 Advanced Features

### Custom Bounding Box Colors

Edit `drawBoundingBox()` function:

```javascript
ctx.strokeStyle = '#10b981';  // Green
ctx.strokeStyle = '#ef4444';  // Red
ctx.strokeStyle = '#f59e0b';  // Orange
```

### Multiple Detections

The system handles multiple objects:
- Shows all predictions
- Draws all bounding boxes
- Uses highest confidence for validation

### Loading Indicators

Add loading spinner while detecting:

```javascript
cameraStatus.innerHTML = '<p>🔄 Detecting with AI... <span class="spinner"></span></p>';
```

---

## 📚 Resources

- [Roboflow Documentation](https://docs.roboflow.com/)
- [Roboflow API Reference](https://docs.roboflow.com/inference/hosted-api)
- [Roboflow Universe](https://universe.roboflow.com/)
- [Train YOLO Models](https://blog.roboflow.com/train-yolov8/)

---

## 🎯 Next Steps

1. **Test with `roboflow-demo.html`** - Verify API works
2. **Configure main system** - Update `complaint.js`
3. **Test full workflow** - Submit test complaint
4. **Deploy model** - Train custom civic issues model
5. **Optimize threshold** - Adjust confidence based on accuracy

---

## ✅ Checklist

- [ ] Roboflow account created
- [ ] API key obtained
- [ ] Model ID identified
- [ ] `roboflow-demo.html` tested successfully
- [ ] `complaint.js` configured
- [ ] Main system tested
- [ ] Category mappings updated
- [ ] Confidence threshold optimized
- [ ] Error handling tested
- [ ] Ready for production!

---

**Need help?** Check the browser console (F12) for detailed error messages and API responses.

**Good luck! 🚀**
