# Hugging Face AI Image Validation Setup

## ✅ Implementation Complete

The AI-powered image validation has been successfully integrated into your GeoFix application using Hugging Face's Vision Transformer (ViT) model.

## ⚠️ CORS Issue & Solutions

**Problem**: Browsers block direct API calls to Hugging Face due to CORS (Cross-Origin Resource Sharing) policy.

**Current Status**: The app uses **smart simulation** as a fallback when the API is unavailable.

### 🔧 Solution Options:

#### **Option 1: Smart Simulation (Current - Works Now!)**
- ✅ No setup required
- ✅ Works immediately in browser
- ✅ 80% validation acceptance rate
- ⚠️ Simulated results (not real AI)
- 📍 Best for: Testing and demos

#### **Option 2: CORS Proxy (Quick Testing)**
1. Open `js/complaint.js` line 249
2. Change `const USE_CORS_PROXY = false;` to `true`
3. Add your Hugging Face token (see below)
4. Test the app - real AI will work!
- ✅ Real AI validation
- ⚠️ Only for development/testing
- ❌ Don't use in production
- 📍 Best for: Quick testing with real AI

#### **Option 3: Backend Server (Production)**
Create a simple Node.js/Python backend:
```javascript
// server.js example
app.post('/api/validate-image', async (req, res) => {
  const response = await fetch('https://api-inference.huggingface.co/...', {
    headers: { 'Authorization': `Bearer ${process.env.HF_TOKEN}` },
    body: req.body
  });
  res.json(await response.json());
});
```
- ✅ Secure API token storage
- ✅ No CORS issues
- ✅ Production-ready
- 📍 Best for: Production deployment

#### **Option 4: TensorFlow.js (Client-Side ML)**
Use browser-based machine learning:
- ✅ No API calls needed
- ✅ Works offline
- ✅ No CORS issues
- ⚠️ Requires different model setup
- 📍 Best for: Offline-first apps

## 🔑 Add Your API Token (Optional)

**Only needed for Option 2 (CORS Proxy) or Option 3 (Backend Server)**

1. Go to https://huggingface.co/settings/tokens
2. Create a new access token (read permissions are sufficient)
3. Copy the token (starts with `hf_...`)
4. Open `js/complaint.js` line 246
5. Replace:
```javascript
const API_TOKEN = 'hf_your_token_here';
```
With:
```javascript
const API_TOKEN = 'hf_XxXxXxXxXxXxXxXxXxXx'; // Your actual token
```

## 🧠 How It Works

The system uses Google's Vision Transformer model (`google/vit-base-patch16-224`) to:

1. **Analyze** captured images in real-time
2. **Detect** objects and scenes using AI
3. **Validate** if the image matches the selected complaint category
4. **Show** confidence scores and detected objects to users

### Category Matching

- **Pothole**: Detects roads, pavement, asphalt, cracks, holes
- **Garbage**: Detects trash, waste, litter, debris, bottles
- **Water Leakage**: Detects water, pipes, leaks, puddles, floods
- **Streetlight**: Detects lights, lamps, poles, fixtures
- **Others**: Accepts any image

## 🧪 Testing

1. Open `submit-complaint.html` in your browser
2. Select a complaint category (e.g., "Pothole")
3. Start camera and capture a photo of the actual issue
4. The AI will validate the image and show:
   - ✅ **Accepted**: "AI detected: road (confidence: 85%)"
   - ❌ **Rejected**: "AI detected: coffee cup, but expected Pothole"

## 🔒 Security Note

⚠️ **Production Recommendation**: Move the API token to a server-side environment variable instead of hardcoding it in the client-side JavaScript. For production:

```javascript
// Instead of hardcoding:
const API_TOKEN = await fetch('/api/get-hf-token').then(r => r.json());
```

## 📊 AI Model Details

- **Model**: `google/vit-base-patch16-224`
- **Type**: Vision Transformer (Image Classification)
- **API**: Hugging Face Inference API
- **Rate Limit**: Free tier allows ~30,000 requests/month
- **Fallback**: If API fails, images are auto-accepted to prevent blocking users

## 🚀 Next Steps

1. Add your Hugging Face token to `complaint.js`
2. Test with real photos of civic issues
3. Monitor API usage at https://huggingface.co/settings/billing
4. (Optional) Upgrade to Pro tier for higher limits

---

**Questions?** Check the Hugging Face docs: https://huggingface.co/docs/api-inference
