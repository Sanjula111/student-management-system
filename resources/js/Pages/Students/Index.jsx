import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { showToast } from '@/Components/Toast';

export default function Index({ students: initialStudents, stats: initialStats }) {
    const [students, setStudents] = useState(initialStudents.data);
    const [stats, setStats] = useState(initialStats);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(initialStudents.total);

    useEffect(() => {
        // Only listen if Echo is available
        if (!window.Echo) return;

        // Subscribe to the students channel
        const channel = window.Echo.channel('students');

        // Listen for new student created
        channel.listen('StudentCreated', (event) => {
            const newStudent = event;
            // Add to top of list
            setStudents(prev => [newStudent, ...prev]);
            setTotal(prev => prev + 1);
            setStats(prev => ({ ...prev, total: prev.total + 1 }));
            showToast(`✅ ${newStudent.name} added by another user!`, 'success');
        });

        // Listen for student deleted
        channel.listen('StudentDeleted', (event) => {
            const deletedId = event.id;
            // Remove from list
            setStudents(prev => prev.filter(s => s.id !== deletedId));
            setTotal(prev => prev - 1);
            setStats(prev => ({ ...prev, total: prev.total - 1 }));
            showToast('🗑️ Student deleted!', 'info');
        });

        // Listen for student updated
        channel.listen('StudentUpdated', (event) => {
            const updatedStudent = event;
            // Update in list
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            
            // Update stats if status changed
            const oldStudent = students.find(s => s.id === updatedStudent.id);
            if (oldStudent && oldStudent.status !== updatedStudent.status) {
                setStats(prev => {
                    const newStats = { ...prev };
                    if (updatedStudent.status === 'active') {
                        newStats.active = (newStats.active || 0) + 1;
                        newStats.inactive = Math.max(0, (newStats.inactive || 0) - 1);
                    } else {
                        newStats.inactive = (newStats.inactive || 0) + 1;
                        newStats.active = Math.max(0, (newStats.active || 0) - 1);
                    }
                    return newStats;
                });
                showToast(`🔄 ${updatedStudent.name} status changed!`, 'info');
            } else {
                showToast(`✏️ ${updatedStudent.name} updated!`, 'info');
            }
        });

        // Cleanup on component unmount
        return () => {
            window.Echo.leaveChannel('students');
        };
    }, []);

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id, name) => {
        if (!window.confirm(`Delete "${name}"?\n\nThis cannot be undone.`)) return;
        router.delete(route('students.destroy', id));
    };

    const handleToggle = (id, status) => {
        const next = status === 'active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Change status to ${next}?`)) return;
        router.patch(route('students.status', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Students" />
            <style>{pageCss}</style>

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 className="page-title">All Students</h1>
                    <p className="page-sub">Manage and organize your student records.</p>
                </div>
                <Link href={route('students.create')} className="add-btn">
                    <span>+</span> Add New Student
                </Link>
            </div>

            {/* Mini stat bar */}
            <div className="mini-stats">
                {[
                    { label: 'Total', value: total, color: '#3949ab', bg: '#eef0fb', icon: '📊' },
                    { label: 'Active', value: stats?.active ?? '—', color: '#00897b', bg: '#e0f2f1', icon: '✅' },
                    { label: 'Inactive', value: stats?.inactive ?? '—', color: '#e53935', bg: '#fce4ec', icon: '⏸' },
                ].map(s => (
                    <div key={s.label} className="mini-stat" style={{ background: s.bg }}>
                        <span style={{ fontSize: '20px' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="table-card">
                {/* Toolbar */}
                <div className="table-toolbar">
                    <div className="table-search-wrap">
                        <span className="table-search-icon">🔍</span>
                        <input
                            type="text"
                            className="table-search"
                            placeholder="Search students by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                        {filtered.length} of {total} records
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state-d">
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🧑‍🎓</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1a1f37', marginBottom: '8px' }}>No students found</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
                            {search ? `No results for "${search}"` : 'Start by adding your first student.'}
                        </div>
                        {!search && <Link href={route('students.create')} className="add-btn">+ Add First Student</Link>}
                        {search && <button className="add-btn" onClick={() => setSearch('')} style={{ background: '#64748b' }}>Clear Search</button>}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th>Registered</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((s, i) => (
                                    <tr key={s.id} className="student-row">
                                        <td className="cell-num">{filtered.indexOf(s) + 1}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {s.image_url
                                                    ? <img src={s.image_url} alt={s.name} className="student-avatar" />
                                                    : <div className="student-avatar-ph">{s.name.charAt(0).toUpperCase()}</div>
                                                }
                                                <div>
                                                    <div className="student-name">{s.name}</div>
                                                    <div className="student-id">ID #{s.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="age-pill">{s.age} yrs</span></td>
                                        <td>
                                            <span className={`status-pill ${s.status}`}>
                                                <span className="status-dot" />
                                                {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="cell-date">
                                            {new Date(s.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <Link href={route('students.edit', s.id)} className="act-btn edit" title="Edit">✏️</Link>
                                                <button onClick={() => handleToggle(s.id, s.status)} className={`act-btn toggle ${s.status}`} title="Toggle Status">
                                                    {s.status === 'active' ? '⏸' : '▶'}
                                                </button>
                                                <button onClick={() => handleDelete(s.id, s.name)} className="act-btn del" title="Delete">🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {false && (
                    <div className="pagination-bar">
                        <span className="pagination-info">
                            Showing — of <strong>{total}</strong>
                        </span>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

const pageCss = `
.add-btn{
  display:inline-flex;align-items:center;gap:6px;
  background:linear-gradient(135deg,#3949ab,#5c6bc0);
  color:#fff;text-decoration:none;padding:10px 20px;
  border-radius:10px;font-size:13px;font-weight:700;
  box-shadow:0 4px 12px rgba(57,73,171,0.35);
  transition:all 0.2s;border:none;cursor:pointer;
}
.add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(57,73,171,0.45);}

.mini-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;}
.mini-stat{border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:12px;border:1px solid #eef0f7;}

.table-card{background:#fff;border-radius:14px;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);overflow:hidden;}
.table-toolbar{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #f4f6fb;gap:12px;flex-wrap:wrap;}
.table-search-wrap{position:relative;flex:1;max-width:320px;}
.table-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;}
.table-search{width:100%;padding:9px 14px 9px 36px;border:1.5px solid #eef0f7;border-radius:10px;font-size:13px;color:#1a1f37;background:#f8fafc;outline:none;transition:all 0.2s;font-family:'Inter',sans-serif;}
.table-search:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}

.students-table{width:100%;border-collapse:collapse;}
.students-table th{
  padding:12px 16px;text-align:left;
  font-size:11px;font-weight:700;color:#94a3b8;
  text-transform:uppercase;letter-spacing:0.6px;
  background:#fafbff;border-bottom:1.5px solid #eef0f7;
  white-space:nowrap;
}
.students-table td{padding:14px 16px;border-bottom:1px solid #f4f6fb;vertical-align:middle;}
.student-row:hover td{background:#fafbff;}
.student-row:last-child td{border-bottom:none;}

.cell-num{font-size:12px;color:#94a3b8;font-weight:600;}
.cell-date{font-size:12px;color:#94a3b8;}
.student-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #eef0f7;flex-shrink:0;}
.student-avatar-ph{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;flex-shrink:0;border:2px solid #eef0f7;}
.student-name{font-size:14px;font-weight:700;color:#1a1f37;}
.student-id{font-size:11px;color:#94a3b8;margin-top:1px;}
.age-pill{background:#f4f6fb;color:#475569;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;}

.status-pill{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 12px;border-radius:20px;
  font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;
}
.status-pill.active{background:#e8f5e9;color:#2e7d32;}
.status-pill.inactive{background:#fce4ec;color:#c62828;}
.status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;}

.action-btns{display:flex;gap:6px;justify-content:flex-end;}
.act-btn{
  width:32px;height:32px;border-radius:8px;
  display:inline-flex;align-items:center;justify-content:center;
  font-size:14px;border:none;cursor:pointer;
  text-decoration:none;transition:all 0.15s;
}
.act-btn.edit{background:#eef0fb;color:#3949ab;}
.act-btn.edit:hover{background:#3949ab;color:#fff;}
.act-btn.toggle.active{background:#fff3e0;color:#e65100;}
.act-btn.toggle.active:hover{background:#e65100;color:#fff;}
.act-btn.toggle.inactive{background:#e8f5e9;color:#2e7d32;}
.act-btn.toggle.inactive:hover{background:#2e7d32;color:#fff;}
.act-btn.del{background:#fce4ec;color:#c62828;}
.act-btn.del:hover{background:#c62828;color:#fff;}

.empty-state-d{text-align:center;padding:60px 20px;}

.pagination-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-top:1px solid #f4f6fb;flex-wrap:wrap;gap:8px;}
.pagination-info{font-size:13px;color:#64748b;}
.pagination-links{display:flex;gap:4px;}
.page-btn{
  padding:6px 11px;border-radius:7px;font-size:12px;font-weight:600;
  border:1.5px solid #eef0f7;background:#fff;color:#64748b;
  text-decoration:none;cursor:pointer;transition:all 0.15s;
  display:inline-flex;align-items:center;
}
.page-btn:hover{border-color:#5c6bc0;color:#3949ab;}
.page-btn.active{background:#3949ab;color:#fff;border-color:#3949ab;}
.page-btn.disabled{opacity:0.4;cursor:not-allowed;}

@media(max-width:600px){
  .mini-stats{grid-template-columns:1fr;}
  .cell-date{display:none;}
}
`;
