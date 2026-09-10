// =====================================================================
// KKDGMS — Firebase Cloud Messaging & Client Setup
// =====================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { supabase } from './supabase';

export const firebaseConfig = {
  apiKey: "AIzaSyBSyMx_ozuq0IBS0J6b22vx45HOyTvJfJw",
  authDomain: "kkdgmschool.firebaseapp.com",
  projectId: "kkdgmschool",
  storageBucket: "kkdgmschool.firebasestorage.app",
  messagingSenderId: "1091598835673",
  appId: "1:1091598835673:web:0b613f8750669ac0e403c8",
  measurementId: "G-ZHSCYNGK23"
};

// Initialize Firebase safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Analytics
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(firebaseApp);
  }
  return null;
};

// FCM Messaging instance
let messagingInstance: Messaging | null = null;
if (typeof window !== 'undefined' && 'Notification' in window) {
  try {
    messagingInstance = getMessaging(firebaseApp);
  } catch (err) {
    console.warn('Firebase Messaging init skipped:', err);
  }
}

export const messaging = messagingInstance;

// Request FCM Web Push Notification Permission & Save Token
export async function requestNotificationPermission(userId: string, authId?: string): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted.');
      return null;
    }

    // Register service worker if not registered
    let registration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(async () => {
        return await navigator.serviceWorker.register('/sw.js');
      });
    }

    if (messaging) {
      const currentToken = await getToken(messaging, {
        serviceWorkerRegistration: registration
      });

      if (currentToken) {
        // Save/Update token in Supabase fcm_tokens table
        try {
          const userAgent = navigator.userAgent;
          const deviceInfo = /mobile/i.test(userAgent) ? 'Mobile Browser' : 'Desktop Browser';

          await supabase.from('notification_tokens').upsert({
            user_id: userId,
            auth_id: authId || userId,
            token: currentToken,
            device: deviceInfo,
            is_active: true,
            updated_at: new Date().toISOString()
          }, { onConflict: 'token' });
        } catch (dbErr) {
          console.warn('Could not persist FCM token to Supabase:', dbErr);
        }

        return currentToken;
      }
    }
  } catch (error) {
    console.warn('Error retrieving FCM token:', error);
  }

  return null;
}

// Listen for foreground notifications
export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}

// Trigger browser test notification
export function showLocalNotification(title: string, body: string, icon = '/kk.png') {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon,
      badge: icon
    });
  }
}
