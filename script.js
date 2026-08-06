/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 1
  CORE + NAVIGATION
=========================================================*/

"use strict";

/*=========================================================
  DOM SELECTOR
=========================================================*/

const $ = (id) => document.getElementById(id);

/*=========================================================
  SCREENS
=========================================================*/

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

/*=========================================================
  BUTTONS
=========================================================*/

const startButton = $("startButton");
const continueButton = $("continueButton");
const verifyOtpButton = $("verifyOtpButton");

const popupButton = $("popupButton");

/*=========================================================
  POPUP
=========================================================*/

const popupScreen = $("popupScreen");
const popupTitle = $("popupTitle");
const popupMessage = $("popupMessage");

/*=========================================================
  ALL SCREENS
=========================================================*/

const allScreens = [

loadingScreen,

welcomeScreen,

registrationScreen,

otpScreen,

homeScreen,

profileScreen,

trustedContactsScreen,

volunteerScreen,

timelineScreen,

deviceScreen,

settingsScreen,

mapScreen

];

/*=========================================================
  APP
=========================================================*/

const APP={

version:"2.0",

user:null,

loggedIn:false,

latitude:null,

longitude:null,

firebaseReady:false,

currentScreen:"loading"

};

/*=========================================================
  SHOW SCREEN
=========================================================*/

function showScreen(screen){

allScreens.forEach(item=>{

if(item){

item.classList.add("hideScreen");

}

});

if(screen){

screen.classList.remove("hideScreen");

APP.currentScreen=screen.id;

}

}

/*=========================================================
  POPUP
=========================================================*/

function showPopup(title,message){

popupTitle.textContent=title;

popupMessage.textContent=message;

popupScreen.classList.remove("hideScreen");

}

function closePopup(){

popupScreen.classList.add("hideScreen");

}

/*=========================================================
  EVENTS
=========================================================*/

popupButton.addEventListener(

"click",

closePopup

);

startButton.addEventListener(

"click",

()=>{

showScreen(

registrationScreen

);

}

);

continueButton.addEventListener(

"click",

()=>{

showScreen(

otpScreen

);

}

);


/*=========================================================
  SPLASH
=========================================================*/

window.addEventListener(

"load",

()=>{

showScreen(

loadingScreen

);

setTimeout(()=>{

showScreen(

welcomeScreen

);

},3000);

}

/*=========================================================
  END OF PART 1
=========================================================*/
);
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 2
  FIREBASE INITIALIZATION
=========================================================*/

/*=========================================================
  FIREBASE CONFIG
  (YOUR FIREBASE DETAILS)
=========================================================*/

const firebaseConfig = {
  apiKey: "AIzaSyCG6g-oPgCij8DWZJRjWWFePHveAq1oKLE",
  authDomain: "safety-bubble.firebaseapp.com",
  projectId: "safety-bubble",
  storageBucket: "safety-bubble.firebasestorage.app",
  messagingSenderId: "299468562457",
  appId: "1:299468562457:web:3e564a9a41d2bb71ed8a88",
  measurementId: "G-60CE4S5JD3"
};

/*=========================================================
  INITIALIZE FIREBASE
=========================================================*/

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();

let analytics = null;

if (firebase.analytics) {

    analytics = firebase.analytics();

}

APP.firebaseReady = true;

/*=========================================================
  COLLECTIONS
=========================================================*/

const COLLECTION = {

    users: "users",

    contacts: "trustedContacts",

    timeline: "timeline",

    volunteers: "volunteers"

};

/*=========================================================
  FIRESTORE SAVE
=========================================================*/

async function saveUser(data){

    try{

        await db

        .collection(COLLECTION.users)

        .doc(data.mobile)

        .set(data);

        return true;

    }

    catch(error){

        console.error(error);

        showPopup(

            "Error",

            "Unable to save data."

        );

        return false;

    }

}

/*=========================================================
  FIRESTORE READ
=========================================================*/

async function getUser(mobile){

    try{

        const doc = await db

        .collection(COLLECTION.users)

        .doc(mobile)

        .get();

        if(doc.exists){

            return doc.data();

        }

        return null;

    }

    catch(error){

        console.error(error);

        return null;

    }

}

/*=========================================================
  CONNECTION CHECK
=========================================================*/

window.addEventListener(

    "online",

    ()=>{

        console.log("Internet Connected");

    }

);

window.addEventListener(

    "offline",

    ()=>{

        showPopup(

            "Offline",

            "No Internet Connection"

        );

    }

);

/*=========================================================
  END OF PART 2
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 3
  REGISTRATION VALIDATION + SAVE
=========================================================*/

/*=========================================================
  INPUTS
=========================================================*/

const fullName = $("fullName");
const mobileNumber = $("mobileNumber");
const country = $("country");
const state = $("state");
const district = $("district");
const mandal = $("mandal");
const city = $("city");
const address = $("address");

/*=========================================================
  VALIDATE MOBILE
=========================================================*/

function isValidMobile(number){

    return /^[6-9]\d{9}$/.test(number);

}

/*=========================================================
  GET FORM DATA
=========================================================*/

function getRegistrationData(){

    return{

        fullName:fullName.value.trim(),

        mobile:mobileNumber.value.trim(),

        country:country.value.trim(),

        state:state.value.trim(),

        district:district.value.trim(),

        mandal:mandal.value.trim(),

        city:city.value.trim(),

        address:address.value.trim(),

        createdAt:new Date().toISOString()

    };

}

/*=========================================================
  VALIDATION
=========================================================*/

function validateRegistration(data){

    if(data.fullName===""){

        showPopup(

            "Validation",

            "Enter Full Name"

        );

        return false;

    }

    if(!isValidMobile(data.mobile)){

        showPopup(

            "Validation",

            "Enter Valid Mobile Number"

        );

        return false;

    }

    if(data.country===""){

        showPopup(

            "Validation",

            "Enter Country"

        );

        return false;

    }

    if(data.state===""){

        showPopup(

            "Validation",

            "Enter State"

        );

        return false;

    }

    if(data.district===""){

        showPopup(

            "Validation",

            "Enter District"

        );

        return false;

    }

    if(data.city===""){

        showPopup(

            "Validation",

            "Enter City / Village"

        );

        return false;

    }

    return true;

}

/*=========================================================
  REGISTER USER
=========================================================*/

async function registerUser(){

    if(!APP.firebaseReady){

        showPopup(

            "Firebase",

            "Firebase not initialized."

        );

        return;

    }

    const user=getRegistrationData();

    if(!validateRegistration(user)){

        return;

    }

    continueButton.disabled=true;

    const saved=await saveUser(user);

    continueButton.disabled=false;

    if(saved){

        APP.user=user;

        showPopup(

            "Success",

            "Registration completed successfully."

        );

        showScreen(otpScreen);

    }

}

/*=========================================================
  BUTTON EVENT
=========================================================*/

continueButton.removeEventListener("click",()=>{});

continueButton.addEventListener(

    "click",

    registerUser

);

/*=========================================================
  END OF PART 3
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 4
  FIREBASE PHONE OTP
=========================================================*/

/*=========================================================
  RECAPTCHA
=========================================================*/

let confirmationResult = null;
let recaptchaVerifier = null;

/*=========================================================
  INITIALIZE RECAPTCHA
=========================================================*/

function initializeRecaptcha(){

    if(recaptchaVerifier) return;

    recaptchaVerifier = new firebase.auth.RecaptchaVerifier(

        continueButton,

        {

            size: "invisible"

        }

    );

}

/*=========================================================
  SEND OTP
=========================================================*/

async function sendOTP(){

    if(!APP.user){

        showPopup(

            "Registration",

            "Please complete registration first."

        );

        return;

    }

    initializeRecaptcha();

    const phoneNumber = "+91" + APP.user.mobile;

    try{

        confirmationResult = await auth.signInWithPhoneNumber(

            phoneNumber,

            recaptchaVerifier

        );

        showScreen(otpScreen);

        showPopup(

            "OTP Sent",

            "Verification code sent successfully."

        );

    }

    catch(error){

        console.error(error);

        showPopup(

            "OTP Error",

            error.message

        );

    }

}

/*=========================================================
  GET OTP
=========================================================*/

function getOTP(){

    return [

        $("otp1").value,

        $("otp2").value,

        $("otp3").value,

        $("otp4").value,

        $("otp5").value,

        $("otp6").value

    ].join("");

}

/*=========================================================
  VERIFY OTP
=========================================================*/

async function verifyOTP(){

    if(!confirmationResult){

        showPopup(

            "OTP",

            "Please request OTP first."

        );

        return;

    }

    const code = getOTP();

    if(code.length !== 6){

        showPopup(

            "OTP",

            "Enter 6 digit OTP."

        );

        return;

    }

    try{

        const result = await confirmationResult.confirm(code);

        APP.loggedIn = true;
        APP.firebaseUser = result.user;

        showScreen(homeScreen);

        showPopup(

            "Welcome",

            "Mobile number verified successfully."

        );

    }

    catch(error){

        console.error(error);

        showPopup(

            "Invalid OTP",

            "Verification failed."

        );

    }

}

/*=========================================================
  RESEND OTP
=========================================================*/

$("resendOtp").addEventListener(

    "click",

    sendOTP

);

/*=========================================================
  BUTTON EVENTS
=========================================================*/

continueButton.removeEventListener(

    "click",

    registerUser

);

continueButton.addEventListener(

    "click",

    async ()=>{

        await registerUser();

        if(APP.user){

            await sendOTP();

        }

    }

);


/*=========================================================
  END OF PART 4
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 5
  HOME DASHBOARD + USER PROFILE
=========================================================*/

/*=========================================================
  HOME ELEMENTS
=========================================================*/

const userName = $("userName");

const profileName = $("profileName");
const profileMobile = $("profileMobile");
const profileCountry = $("profileCountry");
const profileState = $("profileState");
const profileDistrict = $("profileDistrict");
const profileMandal = $("profileMandal");
const profileCity = $("profileCity");
const profileAddress = $("profileAddress");

/*=========================================================
  SAFETY STATUS
=========================================================*/

const currentLocation = $("currentLocation");
const gpsStatus = $("gpsStatus");
const batteryStatus = $("batteryStatus");
const trustedContactsCount = $("trustedContactsCount");
const safetyScore = $("safetyScore");

/*=========================================================
  LOAD USER DETAILS
=========================================================*/

function loadUserProfile(){

    if(!APP.user) return;

    userName.textContent =
        "Welcome, " + APP.user.fullName;

    profileName.textContent =
        APP.user.fullName;

    profileMobile.textContent =
        APP.user.mobile;

    profileCountry.textContent =
        APP.user.country;

    profileState.textContent =
        APP.user.state;

    profileDistrict.textContent =
        APP.user.district;

    profileMandal.textContent =
        APP.user.mandal;

    profileCity.textContent =
        APP.user.city;

    profileAddress.textContent =
        APP.user.address;

}

/*=========================================================
  BATTERY STATUS
=========================================================*/

async function loadBatteryStatus(){

    if(!navigator.getBattery){

        batteryStatus.textContent =
        "Unsupported";

        return;

    }

    const battery =
    await navigator.getBattery();

    function updateBattery(){

        batteryStatus.textContent =
        Math.round(
            battery.level*100
        )+"%";

    }

    updateBattery();

    battery.addEventListener(
        "levelchange",
        updateBattery
    );

}

/*=========================================================
  DEFAULT STATUS
=========================================================*/

function initializeDashboard(){

    gpsStatus.textContent = "Checking...";
    currentLocation.textContent = "Detecting...";
    trustedContactsCount.textContent = "0";
    safetyScore.textContent = "100";

    loadUserProfile();
    loadBatteryStatus();
    getCurrentLocation();
    loadSafePlaces();

}
/*=========================================================
  LOGIN SUCCESS
=========================================================*/

function openHome(){

    APP.loggedIn = true;

    showScreen(homeScreen);

    initializeDashboard();

}

/*=========================================================
  UPDATE OTP SUCCESS
=========================================================*/

verifyOtpButton.removeEventListener(
    "click",
    verifyOTP
);

verifyOtpButton.addEventListener(

    "click",

    async()=>{

        await verifyOTP();

        if(APP.loggedIn){

            openHome();

        }

    }

);

/*=========================================================
  END OF PART 5
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 6
  GPS LOCATION + OPENSTREETMAP
=========================================================*/

/*=========================================================
  MAP VARIABLES
=========================================================*/

let map = null;
let userMarker = null;

/*=========================================================
  GET LOCATION
=========================================================*/

function getCurrentLocation(){

    if(!navigator.geolocation){

        gpsStatus.textContent = "Unsupported";

        currentLocation.textContent = "GPS Not Supported";

        return;

    }

    gpsStatus.textContent = "Locating...";

    navigator.geolocation.getCurrentPosition(

        locationSuccess,

        locationError,

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}

/*=========================================================
  LOCATION SUCCESS
=========================================================*/

function locationSuccess(position){

    APP.latitude = position.coords.latitude;

    APP.longitude = position.coords.longitude;
console.log("GPS:", APP.latitude, APP.longitude);
    gpsStatus.textContent = "Connected";

    currentLocation.textContent =

        APP.latitude.toFixed(6)+

        ", "+

        APP.longitude.toFixed(6);

    initializeMap();

}

/*=========================================================
  LOCATION ERROR
=========================================================*/

function locationError(error){

    gpsStatus.textContent = "Failed";

    currentLocation.textContent =

    "Location Unavailable";

    console.error(error);

}

/*=========================================================
  INITIALIZE MAP
=========================================================*/

function initializeMap(){

    if(!window.L){

        console.warn("Leaflet Not Loaded");

        return;

    }

    if(map){

        map.remove();

    }

    map = L.map(

        "liveMapContainer"

    ).setView(

        [

            APP.latitude,

            APP.longitude

        ],

        16

    );

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:

            "&copy; OpenStreetMap"

        }

    ).addTo(map);

    userMarker = L.marker(

        [

            APP.latitude,

            APP.longitude

        ]

    )

    .addTo(map)

    .bindPopup(

        "You are here"

    )

    .openPopup();

}

/*=========================================================
  REFRESH LOCATION
=========================================================*/

function refreshLocation(){

    getCurrentLocation();

}

/*=========================================================
  VIEW MAP BUTTON
=========================================================*/

$("viewMapButton").addEventListener(

    "click",

    ()=>{

        showScreen(mapScreen);

    }

);

/*=========================================================
  HOME START
=========================================================*/

function initializeDashboardGPS(){

    gpsStatus.textContent="Checking...";

    currentLocation.textContent="Detecting...";

    trustedContactsCount.textContent="0";

    safetyScore.textContent="100";

    loadUserProfile();

    loadBatteryStatus();

    getCurrentLocation();

}
/*=========================================================
  AUTO REFRESH GPS
=========================================================*/

setInterval(

    refreshLocation,

    5000

);

/*=========================================================
  END OF PART 6
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 7
  NEARBY SAFE PLACES
=========================================================*/

/*=========================================================
  SAFE PLACES
=========================================================*/

const safePlacesList = $("safePlacesList");

/*=========================================================
  LOAD SAFE PLACES
=========================================================*/

async function loadSafePlaces(){

    if(APP.latitude===null || APP.longitude===null){

        safePlacesList.innerHTML=

        "<p>Location not available.</p>";

        return;

    }

    safePlacesList.innerHTML=

    "<p>Searching nearby safe places...</p>";

    try{

        const query=`

[out:json];

(

node

(around:3000,

${APP.latitude},

${APP.longitude})

["amenity"="police"];

node

(around:3000,

${APP.latitude},

${APP.longitude})

["amenity"="hospital"];

node

(around:3000,

${APP.latitude},

${APP.longitude})

["amenity"="pharmacy"];

);

out;

`;

        const response=await fetch(

"https://overpass-api.de/api/interpreter",

{

method:"POST",

body:query

}

);

        const data=await response.json();

        displaySafePlaces(data.elements);

    }

    catch(error){

        console.error(error);

        safePlacesList.innerHTML=

        "<p>Unable to load nearby places.</p>";

    }

}

/*=========================================================
  DISPLAY SAFE PLACES
=========================================================*/

function displaySafePlaces(list){

    safePlacesList.innerHTML="";

    if(list.length===0){

        safePlacesList.innerHTML=

        "<p>No nearby places found.</p>";

        return;

    }

    list.slice(0,10).forEach(place=>{

        const div=document.createElement("div");

        div.className="timelineCard";

        div.innerHTML=`

<h3>${place.tags.name || "Unknown Place"}</h3>

<p>

${place.tags.amenity}

</p>

`;

        safePlacesList.appendChild(div);

    });

}

/*=========================================================
  UPDATE DASHBOARD
=========================================================*/

const oldInitializeDashboard = initializeDashboard;

initializeDashboard=function(){

    oldInitializeDashboard();

    loadSafePlaces();

};

/*=========================================================
  END OF PART 7
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 8
  TRUSTED CONTACTS
=========================================================*/

/*=========================================================
  CONTACT VARIABLES
=========================================================*/

let trustedContacts=[];

/*=========================================================
  ELEMENTS
=========================================================*/

const trustedContactsList=$("trustedContactsList");

/*=========================================================
  LOAD CONTACTS
=========================================================*/

async function loadTrustedContacts(){

    if(!APP.user) return;

    try{

        const snapshot=await db

        .collection(COLLECTION.contacts)

        .doc(APP.user.mobile)

        .collection("list")

        .get();

        trustedContacts=[];

        snapshot.forEach(doc=>{

            trustedContacts.push(doc.data());

        });

        trustedContactsCount.textContent=

        trustedContacts.length;

        renderTrustedContacts();

    }

    catch(error){

        console.error(error);

    }

}

/*=========================================================
  RENDER CONTACTS
=========================================================*/

function renderTrustedContacts(){

    trustedContactsList.innerHTML="";

    if(trustedContacts.length===0){

        trustedContactsList.innerHTML=`

<div class="dailyQuote">

<h3>No Trusted Contacts</h3>

<p>Add your first trusted contact.</p>

</div>

`;

        return;

    }

    trustedContacts.forEach(contact=>{

        const card=document.createElement("div");

        card.className="timelineCard";

        card.innerHTML=`

<h3>${contact.name}</h3>

<p>${contact.mobile}</p>

`;

        trustedContactsList.appendChild(card);

    });

}

/*=========================================================
  ADD CONTACT
=========================================================*/

$("addTrustedContactCard")

.addEventListener(

"click",

async()=>{

    const name=prompt(

"Contact Name"

);

    if(!name) return;

    const mobile=prompt(

"Mobile Number"

);

    if(!mobile) return;

    const data={

        name,

        mobile,

        createdAt:Date.now()

    };

    try{

        await db

        .collection(COLLECTION.contacts)

        .doc(APP.user.mobile)

        .collection("list")

        .add(data);

        showPopup(

            "Success",

            "Trusted Contact Added"

        );

        loadTrustedContacts();

    }

    catch(error){

        console.error(error);

    }

}

);

/*=========================================================
  QUICK CALL
=========================================================*/

$("callTrustedContactCard")

.addEventListener(

"click",

()=>{

    if(trustedContacts.length===0){

        showPopup(

            "Contacts",

            "No trusted contact available."

        );

        return;

    }

    window.location.href=

    "tel:"+trustedContacts[0].mobile;

}

);

/*=========================================================
  QUICK WHATSAPP
=========================================================*/

$("whatsappTrustedContactCard")

.addEventListener(

"click",

()=>{

    if(trustedContacts.length===0){

        showPopup(

            "Contacts",

            "No trusted contact available."

        );

        return;

    }

    window.open(

`https://wa.me/91${trustedContacts[0].mobile}`,

"_blank"

);

}

/*=========================================================
  LOAD AFTER LOGIN
=========================================================*/

/*=========================================================
  END OF PART 8
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 9
  SOS EMERGENCY SYSTEM
=========================================================*/

/*=========================================================
  ELEMENTS
=========================================================*/

const sosButton = $("sosButton");
const activeSOSPanel = $("activeSOSPanel");
const cancelSOSButton = $("cancelSOSButton");

const emergencyResponseStatus = $("emergencyResponseStatus");
const acceptedVolunteerName = $("acceptedVolunteerName");
const volunteerETA = $("volunteerETA");

/*=========================================================
  SOS STATUS
=========================================================*/

APP.sosActive = false;

/*=========================================================
  SEND SMS
=========================================================*/

function sendSMSAlert(){

    if(trustedContacts.length===0){

        showPopup(

            "SOS",

            "No Trusted Contacts Added."

        );

        return;

    }

    const message =

`🚨 EMERGENCY ALERT

I need immediate help.

My Location:

https://maps.google.com/?q=${APP.latitude},${APP.longitude}

Safety Bubble`;

    window.location.href=

"sms:"+trustedContacts[0].mobile+

"?body="+encodeURIComponent(message);

}

/*=========================================================
  SEND WHATSAPP
=========================================================*/

function sendWhatsAppAlert(){

    if(trustedContacts.length===0){

        return;

    }

    const message =

`🚨 EMERGENCY!

I need help.

Live Location:

https://maps.google.com/?q=${APP.latitude},${APP.longitude}`;

    window.open(

"https://wa.me/91"+

trustedContacts[0].mobile+

"?text="+

encodeURIComponent(message),

"_blank"

);

}

/*=========================================================
  START SOS
=========================================================*/

function startSOS(){

    if(APP.sosActive) return;

    APP.sosActive = true;

    activeSOSPanel.classList.remove(

        "hideScreen"

    );

    emergencyResponseStatus.textContent =

    "Emergency Active";

    acceptedVolunteerName.textContent =

    "Searching...";

    volunteerETA.textContent =

    "--";

    sendSMSAlert();

    sendWhatsAppAlert();

    showPopup(

        "SOS Activated",

        "Emergency alerts sent successfully."

    );

}

/*=========================================================
  CANCEL SOS
=========================================================*/

function cancelSOS(){

    APP.sosActive = false;

    activeSOSPanel.classList.add(

        "hideScreen"

    );

    emergencyResponseStatus.textContent =

    "Standby";

    acceptedVolunteerName.textContent =

    "--";

    volunteerETA.textContent =

    "--";

    showPopup(

        "SOS Cancelled",

        "Emergency mode stopped."

    );

}

/*=========================================================
  EVENTS
=========================================================*/

sosButton.addEventListener(

    "click",

    startSOS

);

$("navSOS").addEventListener(

    "click",

    startSOS

);

cancelSOSButton.addEventListener(

    "click",

    cancelSOS

);

/*=========================================================
  END OF PART 9
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 10
  PROFILE + TIMELINE + SETTINGS + NAVIGATION
=========================================================*/

/*=========================================================
  BOTTOM NAVIGATION
=========================================================*/

$("navHome").addEventListener("click",()=>{

    showScreen(homeScreen);

});

$("navProfile").addEventListener("click",()=>{

    loadUserProfile();

    showScreen(profileScreen);

});

$("navContacts").addEventListener("click",()=>{

    loadTrustedContacts();

    showScreen(trustedContactsScreen);

});

$("navLocation").addEventListener("click",()=>{

    showScreen(mapScreen);

});

/*=========================================================
  HOME MENU CARDS
=========================================================*/

$("timelineCard").addEventListener("click",()=>{

    showScreen(timelineScreen);

    loadTimeline();

});

$("volunteerCard").addEventListener("click",()=>{

    showScreen(volunteerScreen);

});

$("deviceCard").addEventListener("click",()=>{

    showScreen(deviceScreen);

});

$("settingsCard").addEventListener("click",()=>{

    showScreen(settingsScreen);

});

/*=========================================================
  TIMELINE
=========================================================*/

const timelineList=$("timelineList");

function addTimeline(title,description){

    const card=document.createElement("div");

    card.className="timelineCard";

    card.innerHTML=`

<h3>${title}</h3>

<p>${description}</p>

<p>${new Date().toLocaleString()}</p>

`;

    timelineList.prepend(card);

}

function loadTimeline(){

    if(timelineList.children.length===0){

        addTimeline(

            "Application Started",

            "Safety Bubble is ready."

        );

    }

}

/*=========================================================
  SETTINGS
=========================================================*/

$("themeSetting").addEventListener(

"click",

()=>{

    showPopup(

        "Theme",

        "Dark Mode feature coming soon."

    );

}

);

$("languageSetting").addEventListener(

"click",

()=>{

    showPopup(

        "Language",

        "Multi-language support coming soon."

    );

}

);

$("notificationSetting").addEventListener(

"click",

()=>{

    showPopup(

        "Notifications",

        "Notification settings coming soon."

    );

}

);

$("privacySetting").addEventListener(

"click",

()=>{

    showPopup(

        "Privacy",

        "Privacy settings coming soon."

    );

}

);

$("securitySetting").addEventListener(

"click",

()=>{

    showPopup(

        "Security",

        "Security settings coming soon."

    );

}

);

$("aboutSetting").addEventListener(

"click",

()=>{

    showPopup(

        "Safety Bubble",

        "Version 2.0"

    );

}

);

/*=========================================================
  LOGOUT
=========================================================*/

$("logoutCard").addEventListener(

"click",

async()=>{

    try{

        await auth.signOut();

    }catch(e){}
clearSession();
    APP.loggedIn=false;

    APP.user=null;

    showScreen(welcomeScreen);

    showPopup(

        "Logout",

        "Logged out successfully."

    );

});

/*=========================================================
  END OF PART 10
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 11
  DEVICE + VOLUNTEER + LIVE STATUS
=========================================================*/

/*=========================================================
  DEVICE INFORMATION
=========================================================*/

function initializeDevice(){

    $("deviceConnection").textContent = "Not Connected";
    $("deviceBattery").textContent = "--";
    $("deviceSignal").textContent = "--";
    $("deviceBluetooth").textContent = "OFF";
    $("deviceWakeWord").textContent = "Inactive";
    $("deviceEmergencyButton").textContent = "Ready";
    $("deviceLastSync").textContent = "Never";

}

/*=========================================================
  BLUETOOTH CHECK
=========================================================*/

async function connectDevice(){

    if(!navigator.bluetooth){

        showPopup(

            "Bluetooth",

            "Bluetooth is not supported on this device."

        );

        return;

    }

    try{

        const device = await navigator.bluetooth.requestDevice({

            acceptAllDevices:true

        });

        $("deviceConnection").textContent="Connected";

        $("deviceBluetooth").textContent="ON";

        $("deviceLastSync").textContent=

        new Date().toLocaleTimeString();

        showPopup(

            "Connected",

            device.name || "Safety Device"

        );

    }

    catch(error){

        console.error(error);

    }

}

/*=========================================================
  DEVICE BUTTONS
=========================================================*/

$("connectDeviceCard")

.addEventListener(

"click",

connectDevice

);

$("disconnectDeviceCard")

.addEventListener(

"click",

()=>{

    initializeDevice();

    showPopup(

        "Disconnected",

        "Safety Device disconnected."

    );

}

);

$("syncDeviceCard")

.addEventListener(

"click",

()=>{

    $("deviceLastSync").textContent=

    new Date().toLocaleTimeString();

    showPopup(

        "Sync",

        "Device synchronized."

    );

}

);

/*=========================================================
  VOLUNTEER
=========================================================*/

function initializeVolunteer(){

    $("volunteerStatus").textContent=

    "Not Registered";

    $("volunteerAvailability").textContent=

    "Offline";

    $("volunteerHelpCount").textContent=

    "0";

}

/*=========================================================
  REGISTER VOLUNTEER
=========================================================*/

$("registerVolunteerCard")

.addEventListener(

"click",

()=>{

    $("volunteerStatus").textContent=

    "Registered";

    $("volunteerAvailability").textContent=

    "Online";

    showPopup(

        "Volunteer",

        "Registration completed successfully."

    );

}

);

/*=========================================================
  TOGGLE AVAILABILITY
=========================================================*/

$("volunteerAvailabilityCard")

.addEventListener(

"click",

()=>{

    const status=

    $("volunteerAvailability");

    status.textContent=

    status.textContent==="Online"

    ?"Offline"

    :"Online";

}

);

/*=========================================================
  DEVICE STARTUP
=========================================================*/

initializeDevice();

initializeVolunteer();

/*=========================================================
  END OF PART 11
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 12
  FINAL INITIALIZATION + AUTO LOGIN + APP START
=========================================================*/

/*=========================================================
  SAVE USER SESSION
=========================================================*/

function saveSession(){

    if(APP.user){

        localStorage.setItem(

            "SafetyBubbleUser",

            JSON.stringify(APP.user)

        );

    }

}

/*=========================================================
  RESTORE USER SESSION
=========================================================*/

function restoreSession(){

    const savedUser = localStorage.getItem(

        "SafetyBubbleUser"

    );

    if(!savedUser) return;

    APP.user = JSON.parse(savedUser);

    APP.loggedIn = true;

    openHome();

}

/*=========================================================
  CLEAR SESSION
=========================================================*/

function clearSession(){

    localStorage.removeItem(

        "SafetyBubbleUser"

    );

}

/*=========================================================
  UPDATE LOGIN
=========================================================*/

/*=========================================================
  UPDATE LOGOUT
=========================================================*/

/*=========================================================
  NAVIGATION ACTIVE STATE
=========================================================*/

const navButtons = document.querySelectorAll(

    ".navButton"

);

navButtons.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            navButtons.forEach(item=>{

                item.classList.remove(

                    "active"

                );

            });

            button.classList.add(

                "active"

            );

        }

    );

});

/*=========================================================
  APPLICATION START
=========================================================*/


/*=========================================================
  CONSOLE
=========================================================*/

console.log(

"===================================="

);

console.log(

" Safety Bubble Version 2.0 Started "

);

console.log(

"===================================="

);

console.log(

"Firebase :",APP.firebaseReady);

console.log(

"Version :",APP.version);

/*=========================================================
  END OF PART 12
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 13
  FINAL UTILITIES + HELPERS
=========================================================*/

/*=========================================================
  DATE & TIME
=========================================================*/

function getCurrentDateTime(){

    return new Date().toLocaleString();

}

/*=========================================================
  RANDOM MOTIVATION
=========================================================*/

const motivationalQuotes=[

"Stay Strong. Stay Safe.",

"Your courage is your power.",

"Safety begins with awareness.",

"You are never alone.",

"Believe in yourself.",

"Every woman deserves to feel safe.",

"Confidence is your best protection.",

"Strength grows every day."

];

function loadDailyQuote(){

    const quote=$("dailyQuote");

    if(!quote) return;

    const random=Math.floor(

        Math.random()*

        motivationalQuotes.length

    );

    quote.textContent=

    motivationalQuotes[random];

}

/*=========================================================
  NETWORK STATUS
=========================================================*/

function updateNetworkStatus(){

    if(navigator.onLine){

        console.log("Internet Connected");

    }else{

        showPopup(

            "Offline",

            "Internet connection lost."

        );

    }

}

window.addEventListener(

"online",

updateNetworkStatus

);

window.addEventListener(

"offline",

updateNetworkStatus

);

/*=========================================================
  COPY TEXT
=========================================================*/

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        showPopup(

            "Copied",

            "Copied to clipboard."

        );

    }

    catch(error){

        console.error(error);

    }

}

/*=========================================================
  SHARE LOCATION
=========================================================*/

async function shareLocation(){

    if(APP.latitude===null){

        showPopup(

            "Location",

            "Location not available."

        );

        return;

    }

    const url=

`https://maps.google.com/?q=${APP.latitude},${APP.longitude}`;

    if(navigator.share){

        navigator.share({

            title:"Safety Bubble",

            text:"My Live Location",

            url:url

        });

    }else{

        copyText(url);

    }

}

/*=========================================================
  QUICK ACTION
=========================================================*/

$("liveLocationCard")

.addEventListener(

"click",

shareLocation

);

/*=========================================================
  ABOUT APP
=========================================================*/

function appInformation(){

    return{

        app:"Safety Bubble",

        version:"2.0",

        developer:"Venkat Rao Tirupati",

        platform:"Firebase + OpenStreetMap",

        status:"Development"

    };

}

console.table(

appInformation()

);

/*=========================================================
  APP READY
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadDailyQuote();

    updateNetworkStatus();

    console.log(

        "Safety Bubble Ready."

    );

});

/*=========================================================
  END OF PART 13
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 14
  FINAL OPTIMIZATION + ERROR HANDLING
=========================================================*/

/*=========================================================
  GLOBAL ERROR HANDLER
=========================================================*/

window.addEventListener(

"error",

(event)=>{

    console.error(

        "Application Error:",

        event.message

    );

});

window.addEventListener(

"unhandledrejection",

(event)=>{

    console.error(

        "Promise Error:",

        event.reason

    );

});

/*=========================================================
  SAFE TEXT UPDATE
=========================================================*/

function setText(id,value){

    const element=$(id);

    if(element){

        element.textContent=value;

    }

}

/*=========================================================
  SAFE HTML UPDATE
=========================================================*/

function setHTML(id,value){

    const element=$(id);

    if(element){

        element.innerHTML=value;

    }

}

/*=========================================================
  LOADING
=========================================================*/

function showLoader(){

    $("pageLoader")

    .classList.remove(

        "hideScreen"

    );

}

function hideLoader(){

    $("pageLoader")

    .classList.add(

        "hideScreen"

    );

}

/*=========================================================
  BUTTON LOADING
=========================================================*/

function buttonLoading(button,state){

    if(!button) return;

    button.disabled=state;

    if(state){

        button.classList.add("loading");

    }else{

        button.classList.remove("loading");

    }

}

/*=========================================================
  AUTO CLOSE POPUP
=========================================================*/

function autoPopup(title,message,time=2500){

    showPopup(title,message);

    setTimeout(

        closePopup,

        time

    );

}

/*=========================================================
  APP HEALTH
=========================================================*/

function appHealth(){

    console.log({

        Version:APP.version,

        Firebase:APP.firebaseReady,

        Login:APP.loggedIn,

        GPS:

        APP.latitude!==null,

        User:APP.user

    });

}

/*=========================================================
  REFRESH DASHBOARD
=========================================================*/

function refreshDashboard(){

    if(APP.loggedIn){

        loadUserProfile();

        loadBatteryStatus();

        getCurrentLocation();

        loadSafePlaces();

        loadTrustedContacts();

    }

}

/*=========================================================
  AUTO REFRESH
=========================================================*/

setInterval(

refreshDashboard,

60000

);

/*=========================================================
  INITIAL HEALTH CHECK
=========================================================*/


/*=========================================================
  END OF PART 14
=========================================================*/
/*=========================================================
  SAFETY BUBBLE
  SCRIPT.JS V2
  PART 15
  FINAL APP BOOT + VERSION INFO
=========================================================*/

/*=========================================================
  APP VERSION
=========================================================*/

APP.build = "2.0.0";

APP.releaseDate = "2026";

/*=========================================================
  APPLICATION START
=========================================================*/

async function startApplication(){

    try{

        showLoader();

        if(APP.loggedIn){

            refreshDashboard();

            showScreen(homeScreen);

        }else{

            showScreen(welcomeScreen);

        }

    }catch(error){

        console.error(error);

        autoPopup(

            "Startup Error",

            "Unable to initialize Safety Bubble."

        );

    }finally{

        hideLoader();

    }

}

/*=========================================================
  NAVIGATION HELPERS
=========================================================*/

function goHome(){

    showScreen(homeScreen);

}

function goProfile(){

    loadUserProfile();

    showScreen(profileScreen);

}

function goSettings(){

    showScreen(settingsScreen);

}

function goTimeline(){

    loadTimeline();

    showScreen(timelineScreen);

}

function goContacts(){

    loadTrustedContacts();

    showScreen(trustedContactsScreen);

}

function goVolunteer(){

    showScreen(volunteerScreen);

}

function goDevice(){

    showScreen(deviceScreen);

}

function goMap(){

    showScreen(mapScreen);

}

/*=========================================================
  APP INFORMATION
=========================================================*/

console.log("========================================");
console.log("Safety Bubble");
console.log("Version :",APP.build);
console.log("Release :",APP.releaseDate);
console.log("Developer : Venkat Rao Tirupati");
console.log("Status : Development");
console.log("========================================");

/*=========================================================
  START APPLICATION
=========================================================*/

/*=========================================================
  SCRIPT.JS V2 COMPLETED
=========================================================*/
