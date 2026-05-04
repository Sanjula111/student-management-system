import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
            {/* ── Top Nav ── */}
            <nav style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                position: 'sticky', top: 0, zIndex: 999,
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '62px', gap: '8px' }}>

                        {/* Logo */}
                        <Link href={route('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: '12px' }}>
                            <div style={{ width: '34px', height: '34px', background: 'rgba(255,255,255,0.18)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎓</div>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.2px' }}>Student MS</span>
                        </Link>

                        {/* Desktop links */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }} className="hide-mobile">
                            <NavItem href={route('dashboard')} active={route().current('dashboard')} icon="📊">Dashboard</NavItem>
                            <NavItem href={route('students.index')} active={route().current('students.index')} icon="👥">All Students</NavItem>
                            <NavItem href={route('students.create')} active={route().current('students.create')} icon="➕">Add Student</NavItem>
                        </div>

                        {/* User + logout */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hide-mobile">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                                    {auth?.user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', fontWeight: 500 }}>{auth?.user?.name}</span>
                            </div>
                            <Link
                                href={route('logout')} method="post" as="button"
                                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 14px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                            >
                                🚪 Logout
                            </Link>
                            {/* Mobile hamburger */}
                            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer' }} className="show-mobile">☰</button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileOpen && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
                            {[
                                { href: route('dashboard'), label: '📊 Dashboard' },
                                { href: route('students.index'), label: '👥 All Students' },
                                { href: route('students.create'), label: '➕ Add Student' },
                            ].map(l => (
                                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                                    style={{ display: 'block', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '10px 4px', fontSize: '14px', fontWeight: 500 }}>
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* Flash messages */}
            <FlashBar />

            {/* Page content */}
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 20px' }}>
                {children}
            </main>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', marginTop: '20px' }}>
                Student Management System · Built with Laravel 13 + Inertia.js + React
            </footer>
        </div>
    );
}

function NavItem({ href, active, icon, children }) {
    return (
        <Link href={href} style={{
            color: active ? '#fff' : 'rgba(255,255,255,0.72)',
            textDecoration: 'none',
            padding: '7px 14px',
            borderRadius: '7px',
            fontSize: '13px',
            fontWeight: active ? 700 : 400,
            background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.15s',
        }}
            onMouseOver={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
        >
            <span>{icon}</span> {children}
        </Link>
    );
}

function FlashBar() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState('');
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) { setMsg(flash.success); setType('success'); setVisible(true); }
        if (flash?.error)   { setMsg(flash.error);   setType('danger');  setVisible(true); }
        if (flash?.success || flash?.error) {
            const t = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    if (!visible) return null;

    return (
        <div style={{ maxWidth: '1280px', margin: '16px auto 0', padding: '0 20px' }}>
            <div className={`alert alert-${type}`} style={{ justifyContent: 'space-between' }}>
                <span>{msg}</span>
                <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'inherit', lineHeight: 1, padding: 0 }}>×</button>
            </div>
        </div>
    );
}
