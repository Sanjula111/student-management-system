import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ students, stats }) {

    const handleDelete = (id, name) => {
        if (!window.confirm(`⚠️ Delete "${name}"?\n\nThis will permanently remove the student and their photo. This cannot be undone.`)) return;
        router.delete(route('students.destroy', id));
    };

    const handleToggle = (id, currentStatus) => {
        const next = currentStatus === 'active' ? 'Inactive' : 'Active';
        if (!window.confirm(`Change student status to ${next}?`)) return;
        router.patch(route('students.status', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="All Students" />

            {/* Page header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>👥 All Students</h1>
                    <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Manage student records — add, edit, delete, or change status.</p>
                </div>
                <Link href={route('students.create')} className="btn btn-success btn-lg">
                    ➕ Add New Student
                </Link>
            </div>

            {/* Stat mini-bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Total', value: stats?.total ?? students.total, color: '#2d6a9f', bg: '#eff6ff', icon: '📊' },
                    { label: 'Active', value: stats?.active ?? '—', color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
                    { label: 'Inactive', value: stats?.inactive ?? '—', color: '#d97706', bg: '#fffbeb', icon: '⏸' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table card */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Student Records</h3>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{students.total} total record{students.total !== 1 ? 's' : ''}</span>
                </div>

                {students.data.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🧑‍🎓</div>
                        <p>No students registered yet</p>
                        <Link href={route('students.create')} className="btn btn-primary">➕ Add First Student</Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="sms-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Status</th>
                                    <th className="hide-mobile">Registered</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.data.map((student, i) => (
                                    <tr key={student.id}>
                                        {/* # */}
                                        <td style={{ color: '#94a3b8', fontWeight: 600, fontSize: '13px' }}>
                                            {(students.current_page - 1) * students.per_page + i + 1}
                                        </td>

                                        {/* Photo */}
                                        <td>
                                            {student.image_url
                                                ? <img src={student.image_url} alt={student.name} className="avatar" />
                                                : <div className="avatar-placeholder">{student.name.charAt(0).toUpperCase()}</div>
                                            }
                                        </td>

                                        {/* Name */}
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{student.name}</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID #{student.id}</div>
                                        </td>

                                        {/* Age */}
                                        <td>
                                            <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                                {student.age} yrs
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td>
                                            <span className={student.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                                                <span style={{ fontSize: '8px' }}>●</span>
                                                {student.status}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="hide-mobile" style={{ fontSize: '12px', color: '#94a3b8' }}>
                                            {new Date(student.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                <Link href={route('students.edit', student.id)} className="btn btn-primary btn-sm">✏️ Edit</Link>
                                                <button
                                                    onClick={() => handleToggle(student.id, student.status)}
                                                    className={`btn btn-sm ${student.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                                                >
                                                    {student.status === 'active' ? '⏸ Deactivate' : '▶ Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id, student.name)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    🗑 Delete
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                            Showing {(students.current_page - 1) * students.per_page + 1}–{Math.min(students.current_page * students.per_page, students.total)} of <strong>{students.total}</strong> students
                        </span>
                        <div className="pagination">
                            {students.links.map((link, i) =>
                                link.url
                                    ? <Link key={i} href={link.url} className={`page-link ${link.active ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    : <span key={i} className="page-link disabled" dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
