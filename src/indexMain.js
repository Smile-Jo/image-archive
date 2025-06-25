// Firebase 설정
import { firebaseConfig } from "../firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM 요소
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("user-name");

// 로그인 버튼 클릭
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("로그인 성공:", user.displayName);
      userNameDisplay.textContent = `${user.displayName} 님`;
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
    })
    .catch((error) => {
      console.error("로그인 실패:", error.message);
    });
});

// 로그아웃 버튼 클릭
logoutBtn.addEventListener("click", () => {
  signOut(auth).catch((error) => console.error("로그아웃 실패:", error));
});

// 로그인 상태 감지
onAuthStateChanged(auth, (user) => {
  if (user) {
    userNameDisplay.textContent = `${user.displayName} 님`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userNameDisplay.textContent = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});