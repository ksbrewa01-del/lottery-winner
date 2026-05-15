# LOTTERY WINNER — FIREBASE SETUP GUIDE
# ========================================

## STEP 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Enter name "lottery-winner"
3. Disable Google Analytics (optional) → Create project

## STEP 2: Enable Firestore Database
1. In Firebase Console → Build → Firestore Database
2. Click "Create database" → Start in TEST MODE (for development)
3. Select location (asia-south1 recommended for India)
4. Click "Enable"

## STEP 3: Enable Firebase Storage
1. In Firebase Console → Build → Storage
2. Click "Get started" → Start in test mode
3. Click "Next" → "Done"

## STEP 4: Get Firebase Config
1. In Firebase Console → Project Settings (gear icon)
2. Scroll down to "Your apps" → Click </> (Web)
3. Register app with name "lottery-winner"
4. Copy the firebaseConfig object
5. Paste it into js/firebase-config.js (replacing YOUR_API_KEY etc.)

## STEP 5: Set Firebase Security Rules

### FIRESTORE RULES (Firestore → Rules tab):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if true; // Tighten in production
    }
    match /tickets/{ticketId} {
      allow read, write: if true;
    }
    match /winners/{winnerId} {
      allow read: if true;
      allow write: if true;
    }
    match /spinLogs/{logId} {
      allow read, write: if true;
    }
  }
}
```

### STORAGE RULES (Storage → Rules tab):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Tighten in production
    }
  }
}
```

## STEP 6: Create Firestore Indexes
For the tickets query to work, create these composite indexes:
1. Collection: tickets | Fields: purchasedAt (Ascending), status (Ascending)
2. Collection: spinLogs | Fields: date (Ascending), createdAt (Descending)

(Firebase will prompt you to create these automatically when you first run a query)

## STEP 7: Configure Your Settings in Code

### In js/firebase-config.js:
- Paste your Firebase config object

### In user/dashboard.html (line ~65):
- Change: const UPI_ID = 'lottery@upi';
- To: const UPI_ID = 'youractualupi@upi';

### In admin/login.html (line ~54-55):
- Change: const ADMIN_USERNAME = 'admin';
- Change: const ADMIN_PASSWORD = 'admin123';

## STEP 8: Deploy / Host
Option A - Firebase Hosting (Free):
  npm install -g firebase-tools
  firebase login
  firebase init hosting (select lottery-winner project)
  firebase deploy

Option B - Simple HTTP Server (local testing):
  npx serve . (run from lottery-winner folder)
  OR
  python -m http.server 8000

## FILE STRUCTURE
```
lottery-winner/
├── index.html              ← Public homepage
├── css/
│   └── style.css           ← All styles
├── js/
│   └── firebase-config.js  ← Firebase config + utilities
├── user/
│   ├── register.html       ← User registration
│   ├── login.html          ← User login
│   └── dashboard.html      ← User panel (buy/view tickets)
└── admin/
    ├── login.html          ← Admin login
    └── dashboard.html      ← Full admin panel
```

## FIRESTORE COLLECTIONS STRUCTURE

### users/
  - applicantID: number (8-10 digits)
  - name: string
  - mobile: string (10 digits, unique)
  - email: string (gmail, unique)
  - dob: string
  - password: string (base64)
  - createdAt: timestamp
  - status: string

### tickets/
  - applicantID: number
  - userDocId: string
  - userName: string
  - userMobile: string
  - utr: string (12 digits)
  - screenshotURL: string
  - secretCode: number (100000-999999, unique)
  - tokenNumber: number (100-9999, unique)
  - status: string (pending/approved/rejected)
  - amount: number (9)
  - purchasedAt: timestamp

### winners/
  - spinRound: number (1,2,3)
  - tokenNumber: number
  - secretCode: number
  - applicantID: number
  - userName: string
  - createdAt: timestamp

### spinLogs/
  - date: string (YYYY-MM-DD)
  - spinRound: number
  - tokenNumber: number
  - secretCode: number
  - applicantID: number
  - userName: string
  - createdAt: timestamp
  - drawnBy: string

## IMPORTANT NOTES
- Records are auto-filtered to last 7 days in admin panel
- Spin wheel limited to 3 spins per day
- All tickets start as "pending" — admin must approve/reject
- Token numbers (100-9999) and secret codes (100000-999999) are unique in DB
- UPI payment is manual verification (screenshot + UTR required)
- Change admin password in admin/login.html before deployment!
