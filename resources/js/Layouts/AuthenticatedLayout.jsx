import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [flashMsg, setFlashMsg] = useState(null);
    const [flashType, setFlashType] = useState('success');

    useEffect(() => {
        if (flash?.success) { setFlashMsg(flash.success); setFlashType('success'); }
        if (flash?.error)   { setFlashMsg(flash.error);   setFlashType('error'); }
        if (flash?.success || flash?.error) {
            const t = setTimeout(() => setFlashMsg(null), 5000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    const navItems = [
        { href: route('dashboard'),        label: 'Dashboard',    icon: '⊞', name: 'dashboard' },
        { href: route('students.index'),   label: 'All Students', icon: '👤', name: 'students' },
        { href: route('students.create'),  label: 'Add Student',  icon: '+',  name: 'create' },
        { href: '#',                       label: 'Reports',      icon: '▦',  name: 'reports', disabled: true },
        { href: '#',                       label: 'Settings',     icon: '⚙',  name: 'settings', disabled: true },
    ];

    const isActive = (name) => {
        if (name === 'dashboard') return route().current('dashboard');
        if (name === 'students') return route().current('students.index') || route().current('students.edit');
        if (name === 'create') return route().current('students.create');
        return false;
    };

    return (
        <>
            <style>{layoutCss}</style>
            <div className="app-shell">

                {/* ── Sidebar ── */}
                <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
                    {/* Logo */}
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">🎓</div>
                        {sidebarOpen && <span className="sidebar-logo-text">Student MS</span>}
                    </div>

                    {/* Nav */}
                    <nav className="sidebar-nav">
                        {navItems.map(item => (
                            item.disabled
                                ? (
                                    <div key={item.label} className="nav-item disabled">
                                        <span className="nav-icon">{item.icon}</span>
                                        {sidebarOpen && <span className="nav-label">{item.label}</span>}
                                    </div>
                                )
                                : (
                                    <Link key={item.label} href={item.href}
                                        className={`nav-item ${isActive(item.name) ? 'active' : ''}`}>
                                        <span className="nav-icon">{item.icon}</span>
                                        {sidebarOpen && <span className="nav-label">{item.label}</span>}
                                        {isActive(item.name) && <div className="nav-active-bar" />}
                                    </Link>
                                )
                        ))}
                    </nav>

                    {/* User footer */}
                    <div className="sidebar-footer">
                        <div className="sidebar-avatar">
                            {auth?.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        {sidebarOpen && (
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{auth?.user?.name}</div>
                                <div className="sidebar-user-role">Admin</div>
                            </div>
                        )}
                        {sidebarOpen && (
                            <Link href={route('logout')} method="post" as="button" className="sidebar-logout-btn" title="Logout">
                                ⇥
                            </Link>
                        )}
                    </div>
                </aside>

                {/* ── Main area ── */}
                <div className="main-area">
                    {/* Topbar */}
                    <header className="topbar">
                        <div className="topbar-left">
                            <button className="topbar-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                        </div>
                        <div className="topbar-right">
                            <div className="topbar-search">
                                <span className="search-icon">🔍</span>
                                <input type="text" placeholder="Search students..." className="search-input" readOnly
                                    onClick={() => router.visit(route('students.index'))} />
                            </div>
                            <div className="topbar-notif">
                                🔔
                                <span className="notif-badge">3</span>
                            </div>
                            <div className="topbar-user">
                                <div className="topbar-avatar">{auth?.user?.name?.charAt(0)?.toUpperCase()}</div>
                                <span className="topbar-username">{auth?.user?.name}</span>
                                <span style={{ color: '#94a3b8', fontSize: '12px' }}>▾</span>
                            </div>
                        </div>
                    </header>

                    {/* Flash */}
                    {flashMsg && (
                        <div className={`flash-bar ${flashType}`}>
                            <span>{flashType === 'success' ? '✅' : '❌'} {flashMsg}</span>
                            <button onClick={() => setFlashMsg(null)} className="flash-close">×</button>
                        </div>
                    )}

                    {/* Page content */}
                    <main className="page-content">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}

const layoutCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#f4f6fb;}

.app-shell{display:flex;min-height:100vh;}

/* ── Sidebar ── */
.sidebar{
  width:220px;min-width:220px;background:#1a1f37;
  display:flex;flex-direction:column;
  transition:all 0.25s ease;position:sticky;top:0;height:100vh;
  overflow:hidden;flex-shrink:0;
}
.sidebar.collapsed{width:68px;min-width:68px;}

.sidebar-logo{
  display:flex;align-items:center;gap:12px;
  padding:20px 18px;border-bottom:1px solid rgba(255,255,255,0.06);
  flex-shrink:0;
}
.sidebar-logo-icon{
  width:36px;height:36px;background:linear-gradient(135deg,#5c6bc0,#7986cb);
  border-radius:10px;display:flex;align-items:center;
  justify-content:center;font-size:18px;flex-shrink:0;
}
.sidebar-logo-text{font-size:15px;font-weight:800;color:#fff;white-space:nowrap;}

.sidebar-nav{flex:1;padding:16px 10px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;}
.nav-item{
  display:flex;align-items:center;gap:12px;
  padding:11px 12px;border-radius:10px;
  color:rgba(255,255,255,0.55);font-size:13px;font-weight:500;
  text-decoration:none;cursor:pointer;position:relative;
  transition:all 0.18s;white-space:nowrap;
}
.nav-item:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.85);}
.nav-item.active{background:#3949ab;color:#fff;font-weight:700;box-shadow:0 4px 14px rgba(57,73,171,0.4);}
.nav-item.disabled{opacity:0.35;cursor:not-allowed;}
.nav-item.disabled:hover{background:transparent;}
.nav-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;font-style:normal;}
.nav-label{flex:1;}
.nav-active-bar{position:absolute;right:0;top:50%;transform:translateY(-50%);width:3px;height:22px;background:#7986cb;border-radius:2px 0 0 2px;}

.sidebar-footer{
  display:flex;align-items:center;gap:10px;
  padding:16px 14px;border-top:1px solid rgba(255,255,255,0.06);
  flex-shrink:0;
}
.sidebar-avatar{
  width:34px;height:34px;border-radius:50%;
  background:linear-gradient(135deg,#667eea,#764ba2);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:13px;font-weight:800;flex-shrink:0;
}
.sidebar-user-info{flex:1;min-width:0;}
.sidebar-user-name{font-size:12px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sidebar-user-role{font-size:11px;color:rgba(255,255,255,0.45);}
.sidebar-logout-btn{
  background:none;border:none;color:rgba(255,255,255,0.4);
  font-size:18px;cursor:pointer;padding:4px;flex-shrink:0;
  transition:color 0.15s;
}
.sidebar-logout-btn:hover{color:#ef4444;}

/* ── Main Area ── */
.main-area{flex:1;display:flex;flex-direction:column;min-width:0;overflow-x:hidden;}

/* ── Topbar ── */
.topbar{
  background:#fff;border-bottom:1px solid #eef0f7;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;height:64px;flex-shrink:0;
  box-shadow:0 1px 4px rgba(0,0,0,0.04);
  position:sticky;top:0;z-index:100;
}
.topbar-left{display:flex;align-items:center;gap:12px;}
.topbar-hamburger{background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;padding:6px;border-radius:6px;}
.topbar-hamburger:hover{background:#f1f5f9;}
.topbar-right{display:flex;align-items:center;gap:14px;}

.topbar-search{display:flex;align-items:center;gap:8px;background:#f4f6fb;border:1px solid #eef0f7;border-radius:10px;padding:8px 14px;cursor:pointer;}
.search-icon{font-size:14px;color:#94a3b8;}
.search-input{background:none;border:none;outline:none;font-size:13px;color:#64748b;width:160px;cursor:pointer;font-family:'Inter',sans-serif;}

.topbar-notif{position:relative;font-size:20px;cursor:pointer;padding:4px;}
.notif-badge{
  position:absolute;top:-2px;right:-4px;
  width:16px;height:16px;background:#ef4444;
  border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:9px;color:#fff;font-weight:800;
}
.topbar-user{display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;border-radius:10px;transition:background 0.15s;}
.topbar-user:hover{background:#f4f6fb;}
.topbar-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;}
.topbar-username{font-size:13px;font-weight:600;color:#1e293b;}

/* ── Flash bar ── */
.flash-bar{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 24px;font-size:13px;font-weight:500;
}
.flash-bar.success{background:#f0fdf4;border-bottom:1px solid #bbf7d0;color:#166534;}
.flash-bar.error{background:#fef2f2;border-bottom:1px solid #fecaca;color:#991b1b;}
.flash-close{background:none;border:none;font-size:20px;cursor:pointer;color:inherit;padding:0;line-height:1;}

/* ── Page Content ── */
.page-content{flex:1;padding:28px 28px;overflow-y:auto;}

/* ── Utility ── */
.page-header{margin-bottom:24px;}
.page-title{font-size:22px;font-weight:800;color:#1a1f37;margin-bottom:4px;}
.page-sub{font-size:13px;color:#94a3b8;}

@media(max-width:768px){
  .sidebar{width:0;min-width:0;overflow:hidden;}
  .sidebar.open{width:220px;min-width:220px;position:fixed;z-index:999;height:100vh;}
  .topbar-search{display:none;}
  .page-content{padding:20px 16px;}
}
`;
