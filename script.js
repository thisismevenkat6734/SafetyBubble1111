// ==============================
// SAFETY BUBBLE
// PART 4 - Navigation
// ==============================

const splash = document.getElementById("splash");
const welcome = document.getElementById("welcome");
const register = document.getElementById("register");
const otp = document.getElementById("otp");
const home = document.getElementById("home");

const startBtn = document.getElementById("startBtn");
const continueBtn = document.getElementById("continueBtn");
const verifyBtn = document.getElementById("verifyBtn");

function showScreen(screen){

    splash.classList.add("hidden");
    welcome.classList.add("hidden");
    register.classList.add("hidden");
    otp.classList.add("hidden");
    home.classList.add("hidden");

    screen.classList.remove("hidden");
}
function showPopup(icon,title,message){

document.getElementById("popup").classList.remove("hidden");

document.getElementById("popupIcon").innerHTML=icon;

document.getElementById("popupTitle").innerHTML=title;

document.getElementById("popupMessage").innerHTML=message;

}

function closePopup(){

document.getElementById("popup").classList.add("hidden");

}
// Splash → Welcome
setTimeout(() => {
    showScreen(welcome);
}, 3000);

// Welcome → Register
startBtn.addEventListener("click", () => {
    showScreen(register);
});

// Register → OTP
continueBtn.addEventListener("click", () => {
    showScreen(otp);
});

// OTP → Home
verifyBtn.addEventListener("click", () => {

    const otpInput = otp.querySelector("input");

    if (otpInput.value === "123456") {

        showPopup(
"✅",
"Login Successful",
"Welcome to Safety Bubble"
);
        showScreen(home);

    } else {

        alert("❌ Invalid Demo OTP");

    }

});

// SOS Button
document.addEventListener("click", (e) => {

    if (e.target.id === "sosButton") {

       showPopup(
"🛡️",
"Safety Bubble Activated",
"You are never alone."
); 

    }

});
