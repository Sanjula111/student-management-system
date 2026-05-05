import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Initialize Echo with broadcasting configuration
window.Echo = new Echo({
    broadcaster: import.meta.env.VITE_BROADCAST_DRIVER || 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true,
    // Fallback to HTTP if WebSocket fails
    wsHost: import.meta.env.VITE_REVERB_HOST || 'ws-' + import.meta.env.VITE_APP_NAME?.toLowerCase().replace(/\s/g, '') + '.pusher.com',
    wsPort: import.meta.env.VITE_REVERB_PORT || 443,
    wssPort: import.meta.env.VITE_REVERB_PORT || 443,
    scheme: 'https',
    enabledTransports: ['ws', 'wss'],
});

export default window.Echo;
