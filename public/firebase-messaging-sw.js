// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAmUsLIT2234AHh3IsOVjsYpAnbG3gP6EY",
  authDomain: "fir-practice-7c6ff.firebaseapp.com",
  projectId: "fir-practice-7c6ff",
  storageBucket: "fir-practice-7c6ff.firebasestorage.app",
  messagingSenderId: "245180587744",
  appId: "1:245180587744:web:4d54a228a01cbcfa60fa85",
  databaseURL: "https://fir-practice-7c6ff-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/vercel.svg", // Optional: add an icon to /public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});