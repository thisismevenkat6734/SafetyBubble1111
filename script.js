/*=========================================================
  SAFETY BUBBLE - SCRIPT.JS V2 (FIXED)
=========================================================*/
"use strict";

const $ = (id) => document.getElementById(id);

const loadingScreen = $("loadingScreen");
const welcomeScreen = $("welcomeScreen");
const registrationScreen = $("registrationScreen");
const otpScreen = $("otpScreen");
const homeScreen = $("homeScreen");
const profileScreen = $("profileScreen");
const trustedContactsScreen = $("trustedContactsScreen");
const volunteerScreen = $("volunteerScreen");
const timelineScreen = $("timelineScreen");
const deviceScreen = $("deviceScreen");
const settingsScreen = $("settingsScreen");
const mapScreen = $("mapScreen");

const startButton = $("startButton");
const continueButton = $("continueButton");
const verifyOtpButton = $("verifyOtpButton");
const popupButton = $("popupButton");

const popupScreen = $("popupScreen");
const popupTitle = $("popupTitle");
const popupMessage = $("popupMessage");

const allScreens = [
    loadingScreen, welcomeScreen, registrationScreen, otpScreen,
    homeScreen, profileScreen, trustedContactsScreen, volunteerScreen,
    timelineScreen, deviceScreen, settingsScreen, mapScreen
];

const APP = {
    version: "2.0",
    user: null,
    loggedIn: false,
    latitude: null,
    longitude: null,
    firebaseReady: false,
    currentScreen: "loading",
    sosActive: false
};

function showScreen(screen) {
    allScreens.forEach(item => { if (item) item.classList.add("hideScreen"); });
    if (screen) {
        screen.classList.remove("hideScreen");
        APP.currentScreen = screen.id;
    }
}

function showPopup(title, message) {
    if (popupTitle && popupMessage && popupScreen) {
        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popupScreen.classList.remove("hideScreen");
    }
}

function closePopup() {
    if (popupScreen) popupScreen.classList.add("hideScreen");
}

if (popupButton) popupButton.addEventListener("click", closePopup);
if (startButton) startButton.addEventListener("click", () => showScreen(registrationScreen));

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG6g-oPgCij8DWZJRjWWFePHveAq1oKLE",
  authDomain: "safety-bubble.firebaseapp.com",
  projectId: "safety-bubble",
  storageBucket: "safety-bubble.firebasestorage.app",
  messagingSenderId: "299468562457",
  appId: "1:299468562457:web:3e564a9a41d2bb71ed8a88",
  measurementId: "G-60CE4S5JD3"
};

try {
    firebase.initializeApp(firebaseConfig);
    APP.firebaseReady = true;
} catch (e) {
    console.error("Firebase init error:", e);
}

const auth = firebase.auth ? firebase.auth() : null;
const db = firebase.firestore ? firebase.firestore() : null;

const COLLECTION = {
    users: "users",
    contacts: "trustedContacts",
    timeline: "timeline",
    volunteers: "volunteers"
};

async function saveUser(data) {
    if (!db) return false;
    try {
        await db.collection(COLLECTION.users).doc(data.mobile).set(data);
        return true;
    } catch (error) {
        console.error(error);
        showPopup("Error", "Unable to save data.");
        return false;
    }
}

const fullName = $("fullName");
const mobileNumber = $("mobileNumber");
const country = $("country");
const state = $("state");
const district = $("district");
const mandal = $("mandal");
const city = $("city");
const address = $("address");

function isValidMobile(number) { return /^[6-9]\d{9}$/.test(number); }

function getRegistrationData() {
    return {
        fullName: fullName ? fullName.value.trim() : "",
        mobile: mobileNumber ? mobileNumber.value.trim() : "",
        country: country ? country.value.trim() : "",
        state: state ? state.value.trim() : "",
        district: district ? district.value.trim() : "",
        mandal: mandal ? mandal.value.trim() : "",
        city: city ? city.value.trim() : "",
        address: address ? address.value.trim() : "",
        createdAt: new Date().toISOString()
    };
}

function validateRegistration(data) {
    if (!data.fullName) { showPopup("Validation", "Enter Full Name"); return false; }
    if (!isValidMobile(data.mobile)) { showPopup("Validation", "Enter Valid 10-digit Mobile Number"); return false; }
    if (!data.country || !data.state || !data.district || !data.city) {
        showPopup("Validation", "Fill required fields"); return false;
    }
    return true;
}

async function registerUser() {
    if (!APP.firebaseReady) { showPopup("Firebase", "Firebase not initialized."); return; }
    const user = getRegistrationData();
    if (!validateRegistration(user)) return;
    if (continueButton) continueButton.disabled = true;
    const saved = await saveUser(user);
    if (continueButton) continueButton.disabled = false;
    if (saved) {
        APP.user = user;
        showPopup("Success", "Registration completed successfully.");
        showScreen(otpScreen);
    }
}

let confirmationResult = null;
let recaptchaVerifier = null;

function initializeRecaptcha() {
    if (recaptchaVerifier || !auth) return;
    try {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier(continueButton || document.body, { size: "invisible" });
    } catch (e) { console.error(e); }
}

async function sendOTP() {
    if (!APP.user) { showPopup("Registration", "Please complete registration first."); return; }
    initializeRecaptcha();
    try {
        confirmationResult = await auth.signInWithPhoneNumber("+91" + APP.user.mobile, recaptchaVerifier);
        showScreen(otpScreen);
        showPopup("OTP Sent", "Verification code sent successfully.");
    } catch (error) {
        showPopup("OTP Error", error.message || "Failed to send OTP.");
    }
}

function getOTP() {
    return [$("otp1")?.value, $("otp2")?.value, $("otp3")?.value, $("otp4")?.value, $("otp5")?.value, $("otp6")?.value].join("");
}

async function verifyOTP() {
    if (!confirmationResult) { showPopup("OTP", "Please request OTP first."); return; }
    const code = getOTP();
    if (code.length !== 6) { showPopup("OTP", "Enter 6 digit OTP."); return; }
    try {
        const result = await confirmationResult.confirm(code);
        APP.loggedIn = true;
        APP.firebaseUser = result.user;
        saveSession();
        openHome();
        showPopup("Welcome", "Mobile number verified successfully.");
    } catch (error) {
        showPopup("Invalid OTP", "Verification failed.");
    }
}

const resendOtpEl = $("resendOtp");
if (resendOtpEl) resendOtpEl.addEventListener("click", sendOTP);
if (continueButton) continueButton.addEventListener("click", async () => { await registerUser(); await sendOTP(); });
if (verifyOtpButton) verifyOtpButton.addEventListener("click", async () => { await verifyOTP(); });

const userName = $("userName");
const profileName = $("profileName");
const profileMobile = $("profileMobile");
const profileCountry = $("profileCountry");
const profileState = $("profileState");
const profileDistrict = $("profileDistrict");
const profileMandal = $("profileMandal");
const profileCity = $("profileCity");
const profileAddress = $("profileAddress");

const currentLocation = $("currentLocation");
const gpsStatus = $("gpsStatus");
const batteryStatus = $("batteryStatus");
const trustedContactsCount = $("trustedContactsCount");
const safetyScore = $("safetyScore");

function loadUserProfile() {
    if (!APP.user) return;
    if (userName) userName.textContent = "Welcome, " + APP.user.fullName;
    if (profileName) profileName.textContent = APP.user.fullName;
    if (profileMobile) profileMobile.textContent = APP.user.mobile;
    if (profileCountry) profileCountry.textContent = APP.user.country;
    if (profileState) profileState.textContent = APP.user.state;
    if (profileDistrict) profileDistrict.textContent = APP.user.district;
    if (profileMandal) profileMandal.textContent = APP.user.mandal;
    if (profileCity) profileCity.textContent = APP.user.city;
    if (profileAddress) profileAddress.textContent = APP.user.address;
}

function initializeDashboard() {
    if (gpsStatus) gpsStatus.textContent = "Checking...";
    if (currentLocation) currentLocation.textContent = "Detecting...";
    if (trustedContactsCount) trustedContactsCount.textContent = "0";
    if (safetyScore) safetyScore.textContent = "100";
    loadUserProfile();
    getCurrentLocation();
    loadSafePlaces();
}

function openHome() {
    APP.loggedIn = true;
    showScreen(homeScreen);
    initializeDashboard();
}

let map = null;
let userMarker = null;

function getCurrentLocation() {
    if (!navigator.geolocation) {
        if (gpsStatus) gpsStatus.textContent = "Unsupported";
        return;
    }
    if (gpsStatus) gpsStatus.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(position => {
        APP.latitude = position.coords.latitude;
        APP.longitude = position.coords.longitude;
        if (gpsStatus) gpsStatus.textContent = "Connected";
        if (currentLocation) currentLocation.textContent = APP.latitude.toFixed(6) + ", " + APP.longitude.toFixed(6);
        initializeMap();
    }, error => {
        if (gpsStatus) gpsStatus.textContent = "Failed";
        if (currentLocation) currentLocation.textContent = "Unavailable";
    }, { enableHighAccuracy: true });
}

function initializeMap() {
    if (!window.L || !$("liveMapContainer")) return;
    if (map) { map.remove(); map = null; }
    try {
        map = L.map("liveMapContainer").setView([APP.latitude, APP.longitude], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
        userMarker = L.marker([APP.latitude, APP.longitude]).addTo(map).bindPopup("You are here").openPopup();
    } catch (e) { console.error(e); }
}

const viewMapBtn = $("viewMapButton");
if (viewMapBtn) viewMapBtn.addEventListener("click", () => {
    showScreen(mapScreen);
    setTimeout(() => { if (map) map.invalidateSize(); }, 300);
});

const safePlacesList = $("safePlacesList");
async function loadSafePlaces() {
    if (!safePlacesList || APP.latitude === null) return;
    safePlacesList.innerHTML = "<p>Searching nearby safe places...</p>";
    try {
        const query = `[out:json];(node(around:3000,${APP.latitude},${APP.longitude})["amenity"="police"];node(around:3000,${APP.latitude},${APP.longitude})["amenity"="hospital"];);out;`;
        const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
        const data = await res.json();
        safePlacesList.innerHTML = "";
        (data.elements || []).slice(0, 5).forEach(place => {
            const div = document.createElement("div");
            div.className = "timelineCard";
            div.innerHTML = `<h3>${place.tags?.name || "Safe Location"}</h3><p>${place.tags?.amenity || "facility"}</p>`;
            safePlacesList.appendChild(div);
        });
    } catch (e) { safePlacesList.innerHTML = "<p>Unable to load places.</p>"; }
}

let trustedContacts = [];
const trustedContactsList = $("trustedContactsList");

async function loadTrustedContacts() {
    if (!APP.user || !db) return;
    try {
        const snap = await db.collection(COLLECTION.contacts).doc(APP.user.mobile).collection("list").get();
        trustedContacts = [];
        snap.forEach(doc => trustedContacts.push(doc.data()));
        if (trustedContactsCount) trustedContactsCount.textContent = trustedContacts.length;
        renderTrustedContacts();
    } catch (e) { console.error(e); }
}

function renderTrustedContacts() {
    if (!trustedContactsList) return;
    trustedContactsList.innerHTML = "";
    if (trustedContacts.length === 0) {
        trustedContactsList.innerHTML = `<div class="dailyQuote"><h3>No Trusted Contacts</h3><p>Add your first trusted contact.</p></div>`;
        return;
    }
    trustedContacts.forEach(contact => {
        const card = document.createElement("div");
        card.className = "timelineCard";
        card.innerHTML = `<h3>${contact.name}</h3><p>${contact.mobile}</p>`;
        trustedContactsList.appendChild(card);
    });
}

const addContactCard = $("addTrustedContactCard");
if (addContactCard) addContactCard.addEventListener("click", async () => {
    if (!APP.user) { showPopup("Error", "Please login first."); return; }
    const name = prompt("Contact Name");
    if (!name) return;
    const mobile = prompt("Mobile Number");
    if (!mobile) return;
    try {
        await db.collection(COLLECTION.contacts).doc(APP.user.mobile).collection("list").add({ name, mobile, createdAt: Date.now() });
        showPopup("Success", "Contact Added");
        loadTrustedContacts();
    } catch (e) { showPopup("Error", "Failed to add."); }
});

const sosButton = $("sosButton");
const activeSOSPanel = $("activeSOSPanel");
const cancelSOSButton = $("cancelSOSButton");

function startSOS() {
    if (APP.sosActive) return;
    APP.sosActive = true;
    if (activeSOSPanel) activeSOSPanel.classList.remove("hideScreen");
    if (trustedContacts.length > 0) {
        const msg = `🚨 EMERGENCY ALERT! I need help. Location: https://maps.google.com/?q=${APP.latitude},${APP.longitude}`;
        window.location.href = "sms:" + trustedContacts[0].mobile + "?body=" + encodeURIComponent(msg);
    }
    showPopup("SOS Activated", "Emergency alerts initiated.");
}

function cancelSOS() {
    APP.sosActive = false;
    if (activeSOSPanel) activeSOSPanel.classList.add("hideScreen");
    showPopup("SOS Cancelled", "Emergency mode stopped.");
}

if (sosButton) sosButton.addEventListener("click", startSOS);
const navSOS = $("navSOS");
if (navSOS) navSOS.addEventListener("click", startSOS);
if (cancelSOSButton) cancelSOSButton.addEventListener("click", cancelSOS);

// Navigation
if ($("navHome")) $("navHome").addEventListener("click", () => showScreen(homeScreen));
if ($("navProfile")) $("navProfile").addEventListener("click", () => { loadUserProfile(); showScreen(profileScreen); });
if ($("navContacts")) $("navContacts").addEventListener("click", () => { loadTrustedContacts(); showScreen(trustedContactsScreen); });
if ($("navLocation")) $("navLocation").addEventListener("click", () => { showScreen(mapScreen); setTimeout(() => map?.invalidateSize(), 300); });

if ($("timelineCard")) $("timelineCard").addEventListener("click", () => showScreen(timelineScreen));
if ($("volunteerCard")) $("volunteerCard").addEventListener("click", () => showScreen(volunteerScreen));
if ($("deviceCard")) $("deviceCard").addEventListener("click", () => showScreen(deviceScreen));
if ($("settingsCard")) $("settingsCard").addEventListener("click", () => showScreen(settingsScreen));

if ($("logoutCard")) $("logoutCard").addEventListener("click", () => {
    clearSession();
    APP.loggedIn = false;
    APP.user = null;
    showScreen(welcomeScreen);
    showPopup("Logout", "Logged out successfully.");
});

function saveSession() {
    if (APP.user) localStorage.setItem("SafetyBubbleUser", JSON.stringify(APP.user));
}

function restoreSession() {
    const saved = localStorage.getItem("SafetyBubbleUser");
    if (!saved) return false;
    try {
        APP.user = JSON.parse(saved);
        APP.loggedIn = true;
        openHome();
        return true;
    } catch (e) { return false; }
}

function clearSession() { localStorage.removeItem("SafetyBubbleUser"); }

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        if (!restoreSession()) {
            showScreen(welcomeScreen);
        }
    }, 1200);
});
