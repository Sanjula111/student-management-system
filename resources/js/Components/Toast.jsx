import { useState, useEffect } from 'react';

let toastQueue = [];
let toastCallback = null;

const showToast = (message, type = 'info') => {
    const id = Math.random();
    toastQueue = [...toastQueue, { id, message, type }];
    if (toastCallback) {
        toastCallback([...toastQueue]);
    }
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toastQueue = toastQueue.filter(t => t.id !== id);
        if (toastCallback) {
            toastCallback([...toastQueue]);
        }
    }, 4000);
};

export function Toast() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastCallback = setToasts;
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            pointerEvents: 'none',
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    style={{
                        background: toast.type === 'success' ? '#4caf50' : toast.type === 'error' ? '#f44336' : '#2196f3',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        animation: 'slideIn 0.3s ease-out',
                        pointerEvents: 'auto',
                    }}
                    onClick={() => {
                        toastQueue = toastQueue.filter(t => t.id !== toast.id);
                        setToasts([...toastQueue]);
                    }}
                >
                    {toast.message}
                </div>
            ))}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export { showToast };
