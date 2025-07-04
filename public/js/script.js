document.addEventListener('DOMContentLoaded', () => {
  const socket = io({
    transports: ['websocket'],
    path: '/socket.io',
    query: { clientType: 'dashboard' }, // ✅ Tell server you're a dashboard client
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    timeout: 10000
  });

  // Cache status if card hasn't been rendered yet
  const statusCache = new Map();

  // Just listen — never emit registerPresence from the browser
  socket.on('connect', () => {
    console.log('Connected to server, id:', socket.id);
  });

  socket.on('connect_error', err => {
    console.error('Connection error:', err);
  });

  socket.on('disconnect', reason => {
    console.log('Disconnected, reason:', reason);
  });

  // Handle user going online
  socket.on('userOnline', ({ uniqueid }) => {
    console.log('User online:', uniqueid);
    updateCard(uniqueid, true);
  });

  // Handle user going offline
  socket.on('userOffline', ({ uniqueid }) => {
    console.log('User offline:', uniqueid);
    updateCard(uniqueid, false);
  });

  // Optional battery updates
  socket.on('batteryUpdate', updates => {
    if (!Array.isArray(updates)) {
      console.warn('batteryUpdate payload is not an array:', updates);
      return;
    }
    updates.forEach(({ uniqueid, connectivity }) => {
      const isOnline =
        connectivity === true ||
        connectivity === 'Online' ||
        connectivity === 'online';
      updateCard(uniqueid, isOnline);
    });
  });

  // New device received from server
  socket.on('newDevice', dev => {
    console.log('New device:', dev);
    addDeviceCard(dev);
  });

  // Clicking a card → open details
  document.getElementById('deviceContainer').addEventListener('click', e => {
    let el = e.target;
    while (el && !el.classList.contains('device-card')) {
      el = el.parentElement;
    }
    if (el) {
      window.location.href = `/api/device/admin/phone/${el.dataset.id}`;
    }
  });

  // Mobile nav toggle
  const menu = document.querySelector('.menu-icon');
  const nav  = document.querySelector('.nav-links');
  menu.addEventListener('click', e => {
    e.stopPropagation();
    nav.classList.toggle('active');
    menu.classList.toggle('rotate');
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !menu.contains(e.target)) {
      nav.classList.remove('active');
      menu.classList.remove('rotate');
    }
  });

  // Update status of existing card OR cache it if missing
  function updateCard(id, isOnline) {
    const container = document.getElementById('deviceContainer');
    let card = container.querySelector(`.device-card[data-id="${id}"]`);

    if (!card) {
      // Card doesn't exist yet — cache status until it arrives
      statusCache.set(id, isOnline);
      return;
    }

    const statusEl = card.querySelector('.device-status');
    if (!statusEl) {
      console.warn(`Card with id ${id} has no .device-status element`);
      return;
    }

    statusEl.classList.toggle('status-online', isOnline);
    statusEl.classList.toggle('status-offline', !isOnline);
    statusEl.textContent = `Status – ${isOnline ? 'Online' : 'Offline'}`;

    // Update cache
    statusCache.set(id, isOnline);
  }

  // Add a new device card and apply cached status if present
  function addDeviceCard(dev) {
    const container = document.getElementById('deviceContainer');

    let card = container.querySelector(`.device-card[data-id="${dev.uniqueid}"]`);
    const isOnline = statusCache.has(dev.uniqueid)
      ? statusCache.get(dev.uniqueid)
      : dev.connectivity === 'Online' || dev.connectivity === true;

    if (card) {
      updateCard(dev.uniqueid, isOnline);
      return;
    }

    const el = document.createElement('div');
    el.className = 'device-card';
    el.dataset.id = dev.uniqueid;

    el.innerHTML = `
      <div class="device-content">
        <img src="/images/user-icon.png" alt="User Icon" />
        <div class="device-details">
          <h2>Brand: ${dev.brand}</h2>
          <p><strong>ID:</strong> ${dev.uniqueid}</p>
        </div>
      </div>
      <div class="device-status ${isOnline ? 'status-online' : 'status-offline'}">
        Status – ${isOnline ? 'Online' : 'Offline'}
      </div>`;

    container.appendChild(el);
  }
});