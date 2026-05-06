import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen,    setSidebarOpen]    = useState(true);
    const [notifOpen,      setNotifOpen]      = useState(false);
    const [userOpen,       setUserOpen]       = useState(false);
    const [notifications,  setNotifications]  = useState([]);
    const [toast,          setToast]          = useState(null);
    const notifRef = useRef(); const userRef = useRef(); const toastTimer = useRef();

    /* ── Load stored notifications ── */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('sms_notifs') || '[]');
        setNotifications(stored);
    }, []);

    /* ── Handle flash → toast + notification ── */
    useEffect(() => {
        if (!flash?.success && !flash?.error) return;
        const msg  = flash.success || flash.error;
        const type = flash.success ? 'success' : 'error';

        // Show toast
        setToast({ msg, type });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 5000);

        // Persist to notification list
        const newN = { id: Date.now(), type, message: msg, time: new Date().toISOString(), read: false };
        setNotifications(prev => {
            const updated = [newN, ...prev].slice(0, 30);
            localStorage.setItem('sms_notifs', JSON.stringify(updated));
            return updated;
        });
    }, [flash]);

    /* ── Close dropdowns on outside click ── */
    useEffect(() => {
        const fn = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
            if (userRef.current  && !userRef.current.contains(e.target))  setUserOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    const unread = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        const u = notifications.map(n => ({ ...n, read: true }));
        setNotifications(u); localStorage.setItem('sms_notifs', JSON.stringify(u));
    };
    const clearAll = () => {
        setNotifications([]); localStorage.removeItem('sms_notifs');
    };
    const removeOne = (id) => {
        const u = notifications.filter(n => n.id !== id);
        setNotifications(u); localStorage.setItem('sms_notifs', JSON.stringify(u));
    };
    const timeAgo = (iso) => {
        const s = Math.floor((Date.now() - new Date(iso)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s/60)}m ago`;
        if (s < 86400) return `${Math.floor(s/3600)}h ago`;
        return `${Math.floor(s/86400)}d ago`;
    };

    const navItems = [
        { href: route('dashboard'),       label: 'Dashboard',    icon: <IconGrid />,     name: 'dashboard' },
        { href: route('students.index'),  label: 'All Students', icon: <IconUsers />,    name: 'students'  },
        { href: route('students.create'), label: 'Add Student',  icon: <IconPlus />,     name: 'create'    },
        { href: '/reports', label: 'Reports',   icon: <IconReport />,   name: 'reports' },
        { href: '/settings', label: 'Settings',  icon: <IconSettings />, name: 'settings' },
    ];
    const isActive = (n) => {
        if (n === 'dashboard') return route().current('dashboard');
        if (n === 'students')  return route().current('students.index') || route().current('students.edit');
        if (n === 'create')    return route().current('students.create');
        return false;
    };

    return (
        <>
            <style>{css}</style>
            <div className="shell">

                {/* ══════ SIDEBAR ══════ */}
                <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
                    <div className="s-logo">
                        <div className="s-logo-icon">🎓</div>
                        {sidebarOpen && <span className="s-logo-text">Student MS</span>}
                        {sidebarOpen && (
                            <button className="s-collapse" onClick={() => setSidebarOpen(false)}>‹</button>
                        )}
                    </div>

                    <nav className="s-nav">
                        {navItems.map(item => (
                            item.disabled
                            ? <div key={item.label} className="nav-item disabled" title={item.label}>
                                  <span className="nav-ico">{item.icon}</span>
                                  {sidebarOpen && <span className="nav-lbl">{item.label}</span>}
                              </div>
                            : <Link key={item.label} href={item.href}
                                  className={`nav-item ${isActive(item.name) ? 'active' : ''}`}
                                  title={!sidebarOpen ? item.label : ''}>
                                  <span className="nav-ico">{item.icon}</span>
                                  {sidebarOpen && <span className="nav-lbl">{item.label}</span>}
                                  {isActive(item.name) && <span className="nav-bar" />}
                              </Link>
                        ))}
                    </nav>

                    <div className="s-footer">
                        <div className="s-av">{auth?.user?.name?.charAt(0)?.toUpperCase()}</div>
                        {sidebarOpen && (
                            <div className="s-uinfo">
                                <div className="s-uname">{auth?.user?.name}</div>
                                <div className="s-urole">Admin</div>
                            </div>
                        )}
                        {sidebarOpen && (
                            <Link href={route('logout')} method="post" as="button" className="s-logout">
                                <IconLogout />
                            </Link>
                        )}
                    </div>
                </aside>

                {/* ══════ MAIN ══════ */}
                <div className="main">

                    {/* Topbar */}
                    <header className="topbar">
                        <button className="t-ham" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <span /><span /><span />
                        </button>

                        <div className="t-right">
                            {/* Search pill */}
                            <div className="t-search" onClick={() => router.visit(route('students.index'))}>
                                <IconSearch />
                                <span>Search students...</span>
                            </div>

                            {/* Bell */}
                            <div className="notif-wrap" ref={notifRef}>
                                <button className={`bell-btn ${unread > 0 ? 'has-notif' : ''}`}
                                    onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}>
                                    <IconBell />
                                    {unread > 0 && <span className="bell-badge">{unread > 9 ? '9+' : unread}</span>}
                                </button>

                                {notifOpen && (
                                    <div className="notif-panel">
                                        <div className="np-head">
                                            <div className="np-title">
                                                Notifications
                                                {unread > 0 && <span className="np-new">{unread} new</span>}
                                            </div>
                                            <div style={{ display:'flex', gap:'6px' }}>
                                                {unread > 0 && <button className="np-act" onClick={markAllRead}>Mark read</button>}
                                                {notifications.length > 0 && <button className="np-act red" onClick={clearAll}>Clear</button>}
                                            </div>
                                        </div>
                                        <div className="np-list">
                                            {notifications.length === 0
                                                ? <div className="np-empty"><div style={{fontSize:'36px'}}>🔔</div><div>No notifications</div></div>
                                                : notifications.map(n => (
                                                    <div key={n.id} className={`np-item ${n.type} ${!n.read?'unread':''}`}>
                                                        <span className="np-ico">{n.type==='success'?'✅':'❌'}</span>
                                                        <div className="np-body">
                                                            <div className="np-msg">{n.message}</div>
                                                            <div className="np-time">{timeAgo(n.time)}</div>
                                                        </div>
                                                        <button className="np-del" onClick={() => removeOne(n.id)}>×</button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User */}
                            <div className="user-wrap" ref={userRef}>
                                <button className="t-user" onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}>
                                    <div className="t-av">{auth?.user?.name?.charAt(0)?.toUpperCase()}</div>
                                    <span className="t-uname">{auth?.user?.name}</span>
                                    <IconChevron />
                                </button>
                                {userOpen && (
                                    <div className="user-panel">
                                        <div className="up-head">
                                            <div className="up-av">{auth?.user?.name?.charAt(0)?.toUpperCase()}</div>
                                            <div>
                                                <div style={{fontWeight:700,fontSize:'14px',color:'#1a1f37'}}>{auth?.user?.name}</div>
                                                <div style={{fontSize:'12px',color:'#94a3b8'}}>{auth?.user?.email}</div>
                                            </div>
                                        </div>
                                        <div className="up-div" />
                                        <Link href={route('logout')} method="post" as="button" className="up-logout">
                                            <IconLogout /> Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Toast */}
                    {toast && (
                        <div className={`toast ${toast.type}`} key={toast.msg}>
                            <span className="toast-ico">{toast.type === 'success' ? '✅' : '❌'}</span>
                            <span className="toast-msg">{toast.msg}</span>
                            <button className="toast-x" onClick={() => setToast(null)}>×</button>
                            <div className="toast-bar" />
                        </div>
                    )}

                    <main className="content">{children}</main>
                </div>
            </div>
        </>
    );
}

/* ── Icons ── */
const IconGrid     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
const IconUsers    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconPlus     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const IconReport   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const IconSettings = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>;
const IconBell     = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IconSearch   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IconLogout   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconChevron  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#f0f2f8;}

.shell{display:flex;min-height:100vh;}

/* ── Sidebar ── */
.sidebar{width:222px;min-width:222px;background:#1a1f37;display:flex;flex-direction:column;transition:all .24s cubic-bezier(.4,0,.2,1);position:sticky;top:0;height:100vh;overflow:hidden;flex-shrink:0;}
.sidebar.collapsed{width:66px;min-width:66px;}
.s-logo{display:flex;align-items:center;gap:11px;padding:20px 16px 18px;border-bottom:1px solid rgba(255,255,255,0.07);}
.s-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#5c6bc0,#7986cb);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.s-logo-text{font-size:15px;font-weight:800;color:#fff;white-space:nowrap;flex:1;letter-spacing:-.2px;}
.s-collapse{background:none;border:none;color:rgba(255,255,255,0.35);font-size:20px;cursor:pointer;padding:2px 5px;border-radius:6px;line-height:1;transition:all .15s;}
.s-collapse:hover{background:rgba(255,255,255,0.1);color:#fff;}
.s-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px;overflow-y:auto;}
.nav-item{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:10px;color:rgba(255,255,255,0.52);font-size:13px;font-weight:500;text-decoration:none;cursor:pointer;position:relative;transition:all .16s;white-space:nowrap;}
.nav-item:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.88);}
.nav-item.active{background:#3949ab;color:#fff;font-weight:700;box-shadow:0 4px 16px rgba(57,73,171,0.45);}
.nav-item.disabled{opacity:.3;cursor:not-allowed;}
.nav-item.disabled:hover{background:transparent;}
.nav-ico{width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.nav-lbl{flex:1;}
.nav-bar{position:absolute;right:0;top:50%;transform:translateY(-50%);width:3px;height:22px;background:#7986cb;border-radius:2px 0 0 2px;}
.s-footer{display:flex;align-items:center;gap:10px;padding:14px 14px 16px;border-top:1px solid rgba(255,255,255,0.07);}
.s-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;flex-shrink:0;}
.s-uinfo{flex:1;min-width:0;}
.s-uname{font-size:12px;font-weight:700;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.s-urole{font-size:11px;color:rgba(255,255,255,0.38);}
.s-logout{background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;padding:6px;border-radius:7px;display:flex;align-items:center;transition:all .15s;}
.s-logout:hover{background:rgba(239,68,68,0.15);color:#ef4444;}

/* ── Main ── */
.main{flex:1;display:flex;flex-direction:column;min-width:0;}

/* ── Topbar ── */
.topbar{background:#fff;border-bottom:1px solid #eaecf4;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:64px;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.04);position:sticky;top:0;z-index:200;}
.t-ham{background:none;border:none;cursor:pointer;padding:8px;border-radius:8px;display:flex;flex-direction:column;gap:5px;transition:background .15s;}
.t-ham:hover{background:#f0f2f8;}
.t-ham span{display:block;width:20px;height:2px;background:#64748b;border-radius:1px;}
.t-right{display:flex;align-items:center;gap:10px;}
.t-search{display:flex;align-items:center;gap:8px;background:#f0f2f8;border:1.5px solid #eaecf4;border-radius:10px;padding:9px 16px;cursor:pointer;transition:all .2s;min-width:210px;}
.t-search:hover{border-color:#c5cae9;background:#eef0fb;}
.t-search span{font-size:13px;color:#94a3b8;}

/* ── Bell ── */
.notif-wrap{position:relative;}
.bell-btn{background:none;border:none;cursor:pointer;padding:9px;border-radius:10px;color:#64748b;position:relative;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.bell-btn:hover{background:#f0f2f8;color:#3949ab;}
.bell-btn.has-notif{color:#3949ab;}
.bell-badge{position:absolute;top:4px;right:4px;min-width:16px;height:16px;background:#ef4444;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;font-weight:800;border:2px solid #fff;padding:0 3px;}
.notif-panel{position:absolute;top:calc(100% + 10px);right:0;width:348px;background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,0.16);border:1px solid #eaecf4;z-index:9999;overflow:hidden;animation:dropIn .2s ease;}
@keyframes dropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.np-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f4f6fb;}
.np-title{font-size:14px;font-weight:700;color:#1a1f37;display:flex;align-items:center;gap:8px;}
.np-new{background:#eef0fb;color:#3949ab;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:700;}
.np-act{background:none;border:1px solid #eaecf4;border-radius:7px;padding:4px 10px;font-size:11px;color:#64748b;cursor:pointer;font-family:'Inter',sans-serif;transition:all .15s;}
.np-act:hover{background:#f0f2f8;}
.np-act.red{color:#ef4444;border-color:#fecaca;}
.np-act.red:hover{background:#fef2f2;}
.np-list{max-height:300px;overflow-y:auto;}
.np-empty{text-align:center;padding:36px 20px;color:#94a3b8;font-size:13px;display:flex;flex-direction:column;align-items:center;gap:10px;}
.np-item{display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid #f8fafc;transition:background .15s;position:relative;}
.np-item:hover{background:#fafbff;}
.np-item.unread{background:#fafbff;}
.np-item.unread::before{content:'';position:absolute;left:7px;top:50%;transform:translateY(-50%);width:5px;height:5px;background:#3949ab;border-radius:50%;}
.np-ico{font-size:17px;flex-shrink:0;margin-top:1px;}
.np-body{flex:1;min-width:0;}
.np-msg{font-size:13px;color:#1a1f37;font-weight:500;line-height:1.4;margin-bottom:3px;}
.np-time{font-size:11px;color:#94a3b8;}
.np-del{background:none;border:none;color:#cbd5e1;cursor:pointer;font-size:19px;padding:0;line-height:1;flex-shrink:0;transition:color .15s;}
.np-del:hover{color:#ef4444;}

/* ── User dropdown ── */
.user-wrap{position:relative;}
.t-user{display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 10px;border-radius:10px;background:none;border:none;font-family:'Inter',sans-serif;transition:background .15s;}
.t-user:hover{background:#f0f2f8;}
.t-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:800;flex-shrink:0;}
.t-uname{font-size:13px;font-weight:600;color:#1e293b;}
.user-panel{position:absolute;top:calc(100% + 10px);right:0;width:240px;background:#fff;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,0.16);border:1px solid #eaecf4;z-index:9999;overflow:hidden;animation:dropIn .2s ease;}
.up-head{display:flex;align-items:center;gap:12px;padding:16px;}
.up-av{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:800;flex-shrink:0;}
.up-div{height:1px;background:#f4f6fb;}
.up-logout{display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:13px;font-weight:500;color:#64748b;text-decoration:none;transition:all .15s;background:none;border:none;width:100%;cursor:pointer;font-family:'Inter',sans-serif;}
.up-logout:hover{background:#fef2f2;color:#ef4444;}

/* ── Toast ── */
.toast{position:fixed;top:74px;right:22px;z-index:9999;display:flex;align-items:center;gap:12px;background:#fff;border-radius:12px;padding:14px 16px;box-shadow:0 8px 36px rgba(0,0,0,0.15);border-left:4px solid #22c55e;min-width:300px;max-width:420px;animation:toastIn .38s cubic-bezier(.34,1.56,.64,1) both;overflow:hidden;}
.toast.error{border-left-color:#ef4444;}
@keyframes toastIn{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
.toast-ico{font-size:18px;flex-shrink:0;}
.toast-msg{font-size:13px;font-weight:500;color:#1a1f37;flex:1;line-height:1.4;}
.toast-x{background:none;border:none;cursor:pointer;font-size:22px;color:#94a3b8;padding:0;line-height:1;}
.toast-x:hover{color:#475569;}
.toast-bar{position:absolute;bottom:0;left:0;height:3px;background:linear-gradient(90deg,#22c55e,#16a34a);animation:tbar 5s linear forwards;width:100%;}
.toast.error .toast-bar{background:linear-gradient(90deg,#ef4444,#dc2626);}
@keyframes tbar{from{width:100%}to{width:0%}}

/* ── Content ── */
.content{flex:1;padding:28px;overflow-y:auto;}
.page-title{font-size:22px;font-weight:800;color:#1a1f37;margin-bottom:3px;}
.page-sub{font-size:13px;color:#94a3b8;}
.page-header{margin-bottom:22px;}

@media(max-width:768px){
  .sidebar{position:fixed;z-index:999;height:100vh;transform:translateX(-100%);}
  .sidebar:not(.collapsed){transform:translateX(0);}
  .t-search{display:none;}
  .content{padding:18px 14px;}
}
`;
