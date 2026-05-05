import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Index({ students, stats, search: initialSearch }) {
    const [search,    setSearch]    = useState(initialSearch || '');
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef();

    /* ── Live search with debounce ── */
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (search === (initialSearch || '')) { setSearching(false); return; }
        setSearching(true);
        debounceRef.current = setTimeout(() => {
            router.get(route('students.index'), { search: search || undefined }, {
                preserveState: true, preserveScroll: true,
                onFinish: () => setSearching(false),
            });
        }, 350);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    const handleDelete = (id, name) => {
        if (!window.confirm(`Delete "${name}"?\n\nThis will permanently remove the student and their photo.`)) return;
        router.delete(route('students.destroy', id));
    };

    const handleToggle = (id, status) => {
        const next = status === 'active' ? 'Inactive' : 'Active';
        router.patch(route('students.status', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Students" />
            <style>{css}</style>

            {/* Page header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'22px', flexWrap:'wrap', gap:'12px' }}>
                <div>
                    <h1 className="page-title">All Students</h1>
                    <p className="page-sub">Manage and organise your student records.</p>
                </div>
                <Link href={route('students.create')} className="add-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add New Student
                </Link>
            </div>

            {/* Stats bar */}
            <div className="mini-stats">
                {[
                    { label:'Total',    value: stats?.total    ?? students.total, color:'#3949ab', bg:'#eef0fb', icon:'📊' },
                    { label:'Active',   value: stats?.active   ?? '—',            color:'#00897b', bg:'#e0f2f1', icon:'✅' },
                    { label:'Inactive', value: stats?.inactive ?? '—',            color:'#e53935', bg:'#fce4ec', icon:'⏸' },
                ].map(s => (
                    <div key={s.label} className="mini-stat" style={{ background:s.bg }}>
                        <span style={{ fontSize:'20px' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize:'22px', fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                            <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="tbl-card">
                {/* Toolbar */}
                <div className="tbl-toolbar">
                    <div className="search-wrap">
                        <svg className="search-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by name, ID or age..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {searching && <span className="search-spin">⟳</span>}
                        {search && (
                            <button className="search-clear" onClick={() => setSearch('')}>×</button>
                        )}
                    </div>
                    <div style={{ fontSize:'13px', color:'#94a3b8', whiteSpace:'nowrap' }}>
                        {students.total} record{students.total !== 1 ? 's' : ''}
                        {search && ` · searching "${search}"`}
                    </div>
                </div>

                {/* Empty state */}
                {students.data.length === 0 ? (
                    <div className="empty-state">
                        <div style={{ fontSize:'56px', marginBottom:'14px' }}>🧑‍🎓</div>
                        <div style={{ fontSize:'16px', fontWeight:700, color:'#1a1f37', marginBottom:'8px' }}>
                            {search ? `No students match "${search}"` : 'No students yet'}
                        </div>
                        <div style={{ fontSize:'13px', color:'#94a3b8', marginBottom:'20px' }}>
                            {search ? 'Try a different name, ID or age.' : 'Add your first student to get started.'}
                        </div>
                        {search
                            ? <button className="add-btn" onClick={() => setSearch('')}>Clear Search</button>
                            : <Link href={route('students.create')} className="add-btn">+ Add First Student</Link>
                        }
                    </div>
                ) : (
                    <div style={{ overflowX:'auto' }}>
                        <table className="s-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Student</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th className="hide-sm">Registered</th>
                                    <th style={{ textAlign:'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.map((s, i) => (
                                    <tr key={s.id} className="s-row" style={{ animationDelay:`${i*40}ms` }}>
                                        <td className="c-num">{(students.current_page-1)*students.per_page + i + 1}</td>
                                        <td>
                                            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                                                {s.image_url
                                                    ? <img src={s.image_url} alt={s.name} className="s-avatar" />
                                                    : <div className="s-avatar-ph">{s.name.charAt(0).toUpperCase()}</div>
                                                }
                                                <div>
                                                    <div className="s-name">{s.name}</div>
                                                    <div className="s-id">ID #{s.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="age-pill">{s.age} yrs</span></td>
                                        <td>
                                            <span className={`status-pill ${s.status}`}>
                                                <span className="status-dot"/>
                                                {s.status.charAt(0).toUpperCase()+s.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="hide-sm c-date">
                                            {new Date(s.created_at).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                                        </td>
                                        <td>
                                            <div className="act-group">
                                                <Link href={route('students.edit', s.id)} className="act-btn edit" title="Edit">
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleToggle(s.id, s.status)}
                                                    className={`act-btn toggle ${s.status}`}
                                                    title="Toggle Status"
                                                >
                                                    {s.status === 'active'
                                                        ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Deactivate</>
                                                        : <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Activate</>
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s.id, s.name)}
                                                    className="act-btn del"
                                                    title="Delete"
                                                >
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="pag-bar">
                        <span className="pag-info">
                            Showing {(students.current_page-1)*students.per_page+1}–{Math.min(students.current_page*students.per_page, students.total)} of <strong>{students.total}</strong>
                        </span>
                        <div className="pag-links">
                            {students.links.map((l,i) =>
                                l.url
                                    ? <Link key={i} href={l.url} className={`pag-btn ${l.active?'active':''}`} dangerouslySetInnerHTML={{__html:l.label}} />
                                    : <span key={i} className="pag-btn off" dangerouslySetInnerHTML={{__html:l.label}} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
.add-btn{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#3949ab,#5c6bc0);color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-size:13px;font-weight:700;box-shadow:0 4px 14px rgba(57,73,171,0.35);transition:all .22s;border:none;cursor:pointer;font-family:'Inter',sans-serif;}
.add-btn:hover{transform:translateY(-2px);box-shadow:0 7px 20px rgba(57,73,171,0.45);}

.mini-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;}
.mini-stat{border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:12px;border:1px solid #eaecf4;animation:fadeUp .4s ease both;}

.tbl-card{background:#fff;border-radius:14px;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;animation:fadeUp .4s ease both;animation-delay:120ms;}
.tbl-toolbar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #f0f2f8;gap:12px;flex-wrap:wrap;}

.search-wrap{position:relative;flex:1;max-width:340px;display:flex;align-items:center;}
.search-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#94a3b8;}
.search-input{width:100%;padding:9px 36px 9px 36px;border:1.5px solid #eaecf4;border-radius:10px;font-size:13px;color:#1a1f37;background:#f8fafc;outline:none;transition:all .2s;font-family:'Inter',sans-serif;}
.search-input:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.search-spin{position:absolute;right:34px;color:#94a3b8;font-size:16px;animation:spin 1s linear infinite;}
.search-clear{position:absolute;right:11px;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:18px;padding:0;line-height:1;top:50%;transform:translateY(-50%);}
.search-clear:hover{color:#475569;}

.empty-state{text-align:center;padding:60px 20px;}

.s-table{width:100%;border-collapse:collapse;}
.s-table th{padding:12px 16px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;background:#fafbff;border-bottom:1.5px solid #eaecf4;white-space:nowrap;}
.s-table td{padding:14px 16px;border-bottom:1px solid #f4f6fb;vertical-align:middle;}
.s-row{animation:fadeUp .35s ease both;transition:background .15s;}
.s-row:hover td{background:#fafbff;}
.s-row:last-child td{border-bottom:none;}
.c-num{font-size:12px;color:#94a3b8;font-weight:600;}
.c-date{font-size:12px;color:#94a3b8;}
.s-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #eaecf4;flex-shrink:0;}
.s-avatar-ph{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;border:2px solid #eaecf4;flex-shrink:0;}
.s-name{font-size:14px;font-weight:700;color:#1a1f37;}
.s-id{font-size:11px;color:#94a3b8;margin-top:1px;}
.age-pill{background:#f0f2f8;color:#475569;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;}
.status-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.status-pill.active{background:#e8f5e9;color:#2e7d32;}
.status-pill.inactive{background:#fce4ec;color:#c62828;}
.status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;}

.act-group{display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;}
.act-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;border:none;cursor:pointer;text-decoration:none;transition:all .2s;font-family:'Inter',sans-serif;white-space:nowrap;}
.act-btn:hover{transform:translateY(-1px);}
.act-btn.edit{background:#eef0fb;color:#3949ab;}
.act-btn.edit:hover{background:#3949ab;color:#fff;box-shadow:0 4px 10px rgba(57,73,171,0.3);}
.act-btn.toggle.active{background:#fff3e0;color:#e65100;}
.act-btn.toggle.active:hover{background:#e65100;color:#fff;box-shadow:0 4px 10px rgba(230,81,0,0.3);}
.act-btn.toggle.inactive{background:#e8f5e9;color:#2e7d32;}
.act-btn.toggle.inactive:hover{background:#2e7d32;color:#fff;box-shadow:0 4px 10px rgba(46,125,50,0.3);}
.act-btn.del{background:#fce4ec;color:#c62828;}
.act-btn.del:hover{background:#c62828;color:#fff;box-shadow:0 4px 10px rgba(198,40,40,0.3);}

.pag-bar{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-top:1px solid #f0f2f8;flex-wrap:wrap;gap:8px;}
.pag-info{font-size:13px;color:#64748b;}
.pag-links{display:flex;gap:4px;}
.pag-btn{padding:6px 11px;border-radius:7px;font-size:12px;font-weight:600;border:1.5px solid #eaecf4;background:#fff;color:#64748b;text-decoration:none;transition:all .15s;display:inline-flex;align-items:center;}
.pag-btn:hover{border-color:#5c6bc0;color:#3949ab;}
.pag-btn.active{background:#3949ab;color:#fff;border-color:#3949ab;}
.pag-btn.off{opacity:.4;cursor:not-allowed;}

.hide-sm{} @media(max-width:640px){.hide-sm{display:none;}.mini-stats{grid-template-columns:1fr;}}
`;
