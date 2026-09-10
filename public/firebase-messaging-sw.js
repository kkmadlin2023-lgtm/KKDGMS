// =====================================================================
// KKDGMS — Firebase Cloud Messaging Service Worker
// =====================================================================

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSyMx_ozuq0IBS0J6b22vx45HOyTvJfJw",
  authDomain: "kkdgmschool.firebaseapp.com",
  projectId: "kkdgmschool",
  storageBucket: "kkdgmschool.firebasestorage.app",
  messagingSenderId: "1091598835673",
  appId: "1:1091598835673:web:0b613f8750669ac0e403c8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification?.title || 'KKDGMS Circular Notice';
  const notificationOptions = {
    body: payload.notification?.body || 'New notification published from Principal Office.',
    icon: '/kk.png',
    badge: '/kk.png',
    tag: 'kkdgms-broadcast'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
