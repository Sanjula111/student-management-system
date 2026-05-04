import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth, stats } = usePage().props;

    const statCards = [
        { label: 'Total Students', value: stats?.total ?? 0, icon: '👥', bg: '#eff6ff', iconBg: '#dbeafe', color: '#1d4ed8' },
        { label: 'Active',         value: stats?.active ?? 0, icon: '✅', bg: '#f0fdf4', iconBg: '#dcfce7', color: '#15803d' },
        { label: 'Inactive',       value: stats?.inactive ?? 0, icon: '⏸', bg: '#fffbeb', iconBg: '#fde68a', color: '#b45309' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Hero banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
                borderRadius: '16px', padding: '36px 40px', color: '#fff',
                marginBottom: '28px', position: 'relative', overflow: 'hidden',
            }}>
                {/* decorative circles */}
                {['top:-50px;right:-50px;width:200px;height:200px', 'bottom:-70px;right:100px;width:150px;height:150px'].map((s, i) => (
                    <div key={i} style={{ position: 'absolute', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', ...Object.fromEntries(s.split(';').map(p => p.split(':'))) }} />
                ))}
                <div style={{ position: 'relative' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '12px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600 }}>Welcome back</p>
                    <h1 style={{ margin: '0 0 10px', fontSize: '30px', fontWeight: 800 }}>{auth?.user?.name} 👋</h1>
                    <p style={{ margin: '0 0 26px', opacity: 0.8, fontSize: '15px', maxWidth: '520px', lineHeight: 1.65 }}>
                        You are logged into the <strong>Student Management System</strong>. Add, edit, and manage student records with ease.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link href={route('students.index')} className="btn btn-lg" style={{ background: '#fff', color: '#1e3a5f' }}>
                            👥 View All Students
                        </Link>
                        <Link href={route('students.create')} className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                            ➕ Add New Student
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px', marginBottom: '28px' }}>
                {statCards.map(s => (
                    <div key={s.label} className="stat-card" style={{ background: s.bg }}>
                        <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
                        <div>
                            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Two column section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: '20px' }}>

                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title">⚡ Quick Actions</h3></div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                            { href: route('students.index'), icon: '📋', label: 'View All Students', desc: 'Browse, search, edit records', color: '#2d6a9f', bg: '#eff6ff' },
                            { href: route('students.create'), icon: '🧑‍🎓', label: 'Add New Student', desc: 'Register a student with photo', color: '#16a34a', bg: '#f0fdf4' },
                        ].map(a => (
                            <Link key={a.label} href={a.href} style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                padding: '14px 16px', borderRadius: '10px',
                                background: a.bg, border: '1px solid #e2e8f0',
                                textDecoration: 'none', transition: 'box-shadow 0.2s',
                            }}
                                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ width: '42px', height: '42px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #e2e8f0', flexShrink: 0 }}>{a.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: a.color }}>{a.label}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{a.desc}</div>
                                </div>
                                <span style={{ color: '#cbd5e1', fontSize: '18px' }}>→</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Facade Pattern diagram */}
                <div className="card">
                    <div className="card-header"><h3 className="card-title">🏗️ Architecture</h3></div>
                    <div className="card-body">
                        <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                            This project uses the <strong>Facade Design Pattern</strong> for clean separation of concerns.
                        </p>
                        {[
                            { name: 'StudentController', role: 'HTTP layer only — no logic', color: '#dbeafe', border: '#93c5fd', text: '#1e40af', icon: '🌐' },
                            { name: 'StudentFacade', role: 'Simplified interface', color: '#dcfce7', border: '#86efac', text: '#166534', icon: '🔀' },
                            { name: 'StudentService', role: 'Business logic + image ops', color: '#fef9c3', border: '#fde047', text: '#854d0e', icon: '⚙️' },
                            { name: 'Student Model', role: 'Eloquent → MySQL', color: '#f3e8ff', border: '#d8b4fe', text: '#6b21a8', icon: '🗄️' },
                        ].map((l, i, arr) => (
                            <div key={l.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: l.color, border: `1px solid ${l.border}` }}>
                                    <span style={{ fontSize: '16px' }}>{l.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: l.text }}>{l.name}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{l.role}</div>
                                    </div>
                                </div>
                                {i < arr.length - 1 && <div style={{ textAlign: 'center', fontSize: '14px', color: '#cbd5e1', margin: '3px 0' }}>↓</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User info bar */}
            <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 22px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '17px', fontWeight: 800, flexShrink: 0 }}>
                        {auth?.user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{auth?.user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{auth?.user?.email} · Session active ✅</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <span className="badge-active">Logged In</span>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
