// =============================================
// FIREBASE CONFIGURATION - UPDATE WITH YOUR FIREBASE PROJECT DETAILS
// =============================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

// =============================================
// GLOBAL UTILITY FUNCTIONS
// =============================================

// Generate unique applicant ID (8-10 digit int)
async function generateApplicantID() {
  let id, exists = true;
  while (exists) {
    const digits = Math.floor(Math.random() * 3) + 8; // 8,9,10
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    id = Math.floor(Math.random() * (max - min + 1)) + min;
    const snap = await db.collection('users').where('applicantID', '==', id).get();
    exists = !snap.empty;
  }
  return id;
}

// Generate unique secret code (100000-999999)
async function generateSecretCode() {
  let code, exists = true;
  while (exists) {
    code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const snap = await db.collection('tickets').where('secretCode', '==', code).get();
    exists = !snap.empty;
  }
  return code;
}

// Generate unique token number (100-9999)
async function generateTokenNumber() {
  let token, exists = true;
  while (exists) {
    token = Math.floor(Math.random() * (9999 - 100 + 1)) + 100;
    const snap = await db.collection('tickets').where('tokenNumber', '==', token).get();
    exists = !snap.empty;
  }
  return token;
}

// Format date to DD/MM/YYYY
function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Check 18+ age
function isAdult(dobString) {
  const dob = new Date(dobString);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
}

// Toast notification
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 3500);
}

// Loader
function showLoader(show) {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.style.display = show ? 'flex' : 'none';
}

// Current user session (stored in localStorage)
function getSession() {
  try { return JSON.parse(localStorage.getItem('lotteryUser')); } catch { return null; }
}
function setSession(data) {
  localStorage.setItem('lotteryUser', JSON.stringify(data));
}
function clearSession() {
  localStorage.removeItem('lotteryUser');
}

// Admin session
function getAdminSession() {
  try { return JSON.parse(localStorage.getItem('lotteryAdmin')); } catch { return null; }
}
function setAdminSession(data) {
  localStorage.setItem('lotteryAdmin', JSON.stringify(data));
}
function clearAdminSession() {
  localStorage.removeItem('lotteryAdmin');
}
