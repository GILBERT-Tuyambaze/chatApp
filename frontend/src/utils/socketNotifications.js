// socketNotifications.js
// Handles Socket.IO message events, notification sound, browser notifications, and banner state.
// Compatible with web and Electron.

import { useEffect, useState, useRef } from "react";

// Utility: Detect Electron
export function isElectron() {
  return typeof window !== "undefined" &&
    (window.electronAPI !== undefined || window.process?.type === "renderer" || window.navigator.userAgent.includes("Electron"));
}

// Utility: Play notification sound
function playSound() {
  const audio = new Audio("/notification.mp3"); // Place notification.mp3 in public folder
  audio.volume = 0.7;
  audio.play();
}

// Utility: Show browser notification
function showBrowserNotification(sender, text) {
  if (isElectron()) return; // Electron handles native notifications
  if (window.Notification && Notification.permission === "granted") {
    new Notification(sender, { body: text, icon: "/favicon.ico" });
  }
}

// Hook: useSocketNotifications
// - Connects to Socket.IO
// - Handles receive_message event
// - Manages banner state
// - Plays sound and browser notification
export function useSocketNotifications(socket, settings = { mute: false }) {
  const [banner, setBanner] = useState(null); // { sender, text }
  const timerRef = useRef(null);

  // Request notification permission
  const requestPermission = () => {
    if (!isElectron() && window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handler = ({ sender, text }) => {
      if (!settings.mute) {
        setBanner({ sender, text });
        playSound();
        showBrowserNotification(sender, text);
      }
      // Electron: show native notification and badge
      if (isElectron() && window.electronAPI && window.electronAPI.notify) {
        window.electronAPI.notify({ title: sender, body: text });
      }
      // Auto-hide banner after 5s
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setBanner(null), 5000);
    };
    socket.on("receive_message", handler);
    return () => {
      socket.off("receive_message", handler);
      clearTimeout(timerRef.current);
    };
  }, [socket, settings.mute]);

  // Electron: clear badge when window regains focus
  useEffect(() => {
    if (!isElectron() || !window.electronAPI || !window.electronAPI.clearBadge) return;
    const clear = () => window.electronAPI.clearBadge();
    window.addEventListener('focus', clear);
    return () => window.removeEventListener('focus', clear);
  }, []);

  return { banner, setBanner, requestPermission };
}
