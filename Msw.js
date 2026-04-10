// Msw.js - Service Worker for Maths Magic PWA

const CACHE_NAME = 'maths-magic-v1';
// Un sabhi files ki list jo offline chalne ke liye chahiye
const ASSETS_TO_CACHE = [
    'index.html',
    'Mstyle.css',
    'Mapp.js',
    'Mmanifest.json',
    'icon-192.png',
    'icon-512.png',
    'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap',
    'Gemini_Generated_Image_wud787wud787wud7 (1).png'
];

// 1. Install Event: Files ko cache mein save karna
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('M-Project: Caching shell assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Purane cache ko delete karna (jab aap update karein)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: Internet na hone par cache se files dena
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Agar file cache mein hai toh wahi de do, nahi toh network se lo
            return response || fetch(event.request);
        })
    );
});
