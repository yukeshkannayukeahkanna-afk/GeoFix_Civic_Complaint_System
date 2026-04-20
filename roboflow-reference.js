/* ================================================
   ROBOFLOW QUICK REFERENCE - Copy & Paste Code
   ================================================ */

// ========== 1. CONFIGURATION (Add to top of complaint.js) ==========

const ROBOFLOW_CONFIG = {
    API_KEY: 'YOUR_ROBOFLOW_API_KEY',      // Get from app.roboflow.com
    MODEL_ID: 'civic-issues/1',             // Format: project-name/version
    CONFIDENCE_THRESHOLD: 0.40,             // 40% minimum confidence
    ENABLED: true                           // Set to false to disable
};


// ========== 2. ROBOFLOW DETECTION FUNCTION ==========

async function validateWithRoboflow(imageData, category) {
    try {
        console.log('🤖 Using Roboflow YOLO API for detection...');
        
        // Convert base64 to plain data
        const base64Data = imageData.split(',')[1];
        
        // Build API URL
        const apiUrl = `https://detect.roboflow.com/${ROBOFLOW_CONFIG.MODEL_ID}` +
                      `?api_key=${ROBOFLOW_CONFIG.API_KEY}` +
                      `&confidence=${ROBOFLOW_CONFIG.CONFIDENCE_THRESHOLD}`;
        
        // Call Roboflow API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: base64Data
        });
        
        if (!response.ok) {
            throw new Error(`Roboflow API returned ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Roboflow Response:', result);
        
        // No predictions = no civic issue detected
        if (!result.predictions || result.predictions.length === 0) {
            return {
                isRelevant: false,
                topLabel: 'No civic issue detected',
                confidence: 0,
                predictions: []
            };
        }
        
        // Get top prediction
        const topPrediction = result.predictions[0];
        const detectedClass = topPrediction.class.toLowerCase();
        const confidence = topPrediction.confidence;
        
        // Map detected classes to categories
        const categoryMapping = {
            'pothole': ['pothole', 'hole', 'crack', 'road-damage'],
            'garbage': ['garbage', 'trash', 'waste', 'litter', 'debris'],
            'water-leakage': ['water', 'leak', 'leakage', 'puddle', 'flooding'],
            'streetlight': ['streetlight', 'lamp', 'light', 'broken-light'],
            'others': []  // Accept anything for 'others'
        };
        
        // Check if detected class matches selected category
        const expectedClasses = categoryMapping[category] || [];
        const isRelevant = category === 'others' || 
                          expectedClasses.some(cls => 
                              detectedClass.includes(cls) || cls.includes(detectedClass)
                          );
        
        // Extract bounding box coordinates
        const boundingBox = topPrediction.x && topPrediction.y ? {
            x: topPrediction.x,
            y: topPrediction.y,
            width: topPrediction.width,
            height: topPrediction.height
        } : null;
        
        return {
            isRelevant: isRelevant,
            topLabel: detectedClass.charAt(0).toUpperCase() + detectedClass.slice(1),
            confidence: confidence,
            predictions: result.predictions,
            boundingBox: boundingBox
        };
        
    } catch (error) {
        console.error('❌ Roboflow error:', error);
        // Fallback to simulation
        return await simulateSmartValidation(imageData, category);
    }
}


// ========== 3. DRAW BOUNDING BOX FUNCTION ==========

function drawBoundingBox(bbox) {
    const capturedImage = document.getElementById('capturedImage');
    const canvas = document.getElementById('captureCanvas');
    
    if (!canvas || !bbox) return;
    
    const ctx = canvas.getContext('2d');
    
    // Draw image first
    const img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Calculate box coordinates (Roboflow returns center x, y)
        const boxX = bbox.x - (bbox.width / 2);
        const boxY = bbox.y - (bbox.height / 2);
        
        // Draw bounding box
        ctx.strokeStyle = '#10b981';  // Green color
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, bbox.width, bbox.height);
        
        // Draw label background
        ctx.fillStyle = '#10b981';
        ctx.fillRect(boxX, boxY - 30, bbox.width, 30);
        
        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('Detected', boxX + 5, boxY - 10);
        
        // Update image
        capturedImage.src = canvas.toDataURL('image/jpeg', 0.9);
    };
    img.src = capturedImageData;
}


// ========== 4. UPDATE VALIDATION FUNCTION ==========

async function validateImageRelevance() {
    const category = document.getElementById('category').value;
    const cameraStatus = document.getElementById('cameraStatus');
    
    // ... existing validation checks ...
    
    // Show validating status
    cameraStatus.innerHTML = '<p style="color: #3b82f6;">🔄 Validating image with AI...</p>';
    
    // Use Roboflow if enabled
    let validationResult;
    if (ROBOFLOW_CONFIG.ENABLED && ROBOFLOW_CONFIG.API_KEY !== 'YOUR_ROBOFLOW_API_KEY') {
        validationResult = await validateWithRoboflow(capturedImageData, category);
    } else {
        validationResult = await validateWithHuggingFace(capturedImageData, category);
    }
    
    // Display results
    if (validationResult.isRelevant) {
        const topLabel = validationResult.topLabel;
        const confidencePercent = Math.round(validationResult.confidence * 100);
        
        cameraStatus.innerHTML = 
            `<p style="color: #10b981;">✓ Image validated! AI detected: <strong>${topLabel}</strong> (confidence: ${confidencePercent}%)</p>`;
        
        // Draw bounding box if available
        if (validationResult.boundingBox) {
            drawBoundingBox(validationResult.boundingBox);
        }
        
        imageValidated = true;
    } else {
        const detectedLabel = validationResult.topLabel;
        cameraStatus.innerHTML = 
            `<p style="color: #ef4444;">❌ Image rejected! AI detected: <strong>${detectedLabel}</strong>, but expected "${getCategoryLabel(category)}". Please retake.</p>`;
        
        imageValidated = false;
    }
    
    checkFormReadiness();
}


/* ================================================
   USAGE EXAMPLE
   ================================================
   
   1. Add ROBOFLOW_CONFIG to top of complaint.js
   2. Add validateWithRoboflow() function
   3. Add drawBoundingBox() function
   4. Update validateImageRelevance() to use Roboflow
   5. Replace YOUR_ROBOFLOW_API_KEY with actual key
   6. Replace MODEL_ID with your project/version
   7. Test with roboflow-demo.html first
   8. Deploy!
   
   ================================================ */


/* ================================================
   API ENDPOINT FORMAT
   ================================================
   
   URL:
   https://detect.roboflow.com/{MODEL_ID}?api_key={API_KEY}&confidence={THRESHOLD}
   
   METHOD:
   POST
   
   HEADERS:
   Content-Type: application/x-www-form-urlencoded
   
   BODY:
   base64_image_data (without the "data:image/jpeg;base64," prefix)
   
   RESPONSE:
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
   
   ================================================ */


/* ================================================
   TESTING CHECKLIST
   ================================================
   
   □ API key configured correctly
   □ Model ID matches your Roboflow project
   □ ENABLED set to true
   □ Category mappings match your model's classes
   □ Confidence threshold tested (try 0.3, 0.5, 0.7)
   □ Tested with multiple issue types
   □ Tested rejection cases (wrong category images)
   □ Bounding boxes display correctly
   □ Error handling works (try invalid API key)
   □ Fallback works when Roboflow disabled
   
   ================================================ */
