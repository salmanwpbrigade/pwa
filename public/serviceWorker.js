self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated');
});

self.addEventListener('sync', function (event) {
  if (event.tag === 'sync-weather') {
    event.waitUntil(syncWeatherRequests());
  }
});

async function syncWeatherRequests() {
  const queue = JSON.parse(localStorage.getItem('weatherQueue') || '[]');
  for (const city of queue) {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY`);
  }
  localStorage.removeItem('weatherQueue');
}

self.addEventListener('push', function (event) {
  const data = event.data?.text() || "Check today’s weather!";
  event.waitUntil(
    self.registration.showNotification("Daily Weather", {
      body: data,
      icon: "/icon.png",
    })
  );
});
