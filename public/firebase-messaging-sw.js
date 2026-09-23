importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBSyMx_ozuq0IBS0J6b22vx45HOyTvJfJw",
  authDomain: "kkdgmschool.firebaseapp.com",
  projectId: "kkdgmschool",
  storageBucket: "kkdgmschool.firebasestorage.app",
  messagingSenderId: "1091598835673",
  appId: "1:1091598835673:web:0b613f8750669ac0e403c8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || 'KKDGMS Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/assets/images/logo.png',
    badge: '/assets/images/logo.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
