import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toast } from './Components/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'Student MS';

function AppWrapper({ App, props }) {
    return (
        <>
            <App {...props} />
            <Toast />
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        color: '#2d6a9f',
    },
});
