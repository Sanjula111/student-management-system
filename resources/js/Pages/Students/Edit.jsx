import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Edit({ student }) {
    const { data, setData, post, processing, errors } = useForm({
        name:    student.name  || '',
        image:   null,
        age:     student.age   || '',
        status:  student.status || 'active',
        _method: 'PUT',
    });

    const [preview, setPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef();

    const pickFile = (file) => {
        if (!file) return;
        setData('image', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('students.update', student.id), { forceFormData: true });
    };

    const displayImage = preview || student.image_url;

    return (
        <AuthenticatedLayout>
            <Head title={`Edit — ${student.name}`} />

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px', fontSize: '13px', color: '#94a3b8' }}>
                <Link href={route('dashboard')} style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span>
                <Link href={route('students.index')} style={{ color: '#94a3b8', textDecoration: 'none' }}>Students</Link>
                <span>/</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>Edit: {student.name}</span>
            </div>

            <div style={{ maxWidth: '640px' }}>
                <div className="card">
                    {/* Card header */}
                    <div style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed)', padding: '22px 26px', color: '#fff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {displayImage
                            ? <img src={displayImage} alt={student.name} style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
                            : <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, flexShrink: 0 }}>{student.name.charAt(0).toUpperCase()}</div>
                        }
                        <div>
                            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>✏️ Edit Student</h2>
                            <p style={{ margin: '3px 0 0', opacity: 0.75, fontSize: '13px' }}>Updating record for <strong>{student.name}</strong></p>
                        </div>
                    </div>

                    <div className="card-body">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            {/* Name */}
                            <div className="form-group">
                                <label className="form-label">Full Name <span className="req">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Student full name"
                                    autoFocus
                                />
                                {errors.name && <div className="invalid-feedback">⚠ {errors.name}</div>}
                            </div>

                            {/* Image */}
                            <div className="form-group">
                                <label className="form-label">Profile Photo
                                    {student.image_url && !preview && <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 500, marginLeft: '8px' }}>← current photo shown</span>}
                                </label>
                                <div
                                    className={`upload-box ${errors.image ? 'is-invalid' : ''} ${dragOver ? 'drag-over' : ''}`}
                                    onClick={() => fileRef.current.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
                                >
                                    {displayImage ? (
                                        <>
                                            <img src={displayImage} alt="preview" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #7c3aed', marginBottom: '10px' }} />
                                            <div style={{ fontSize: '13px', color: preview ? '#16a34a' : '#7c3aed', fontWeight: 600 }}>
                                                {preview ? '✅ New photo selected' : '📷 Current photo'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Click to {preview ? 'change again' : 'replace'}</div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ fontSize: '38px', marginBottom: '10px' }}>📷</div>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Click or drag & drop a photo</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>JPEG · PNG · GIF · WebP — max 2MB</div>
                                        </>
                                    )}
                                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => pickFile(e.target.files[0])} />
                                </div>
                                {!preview && student.image_url && (
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '5px' }}>
                                        💡 Leave unchanged to keep the current photo. Uploading a new one will replace and delete the old photo.
                                    </div>
                                )}
                                {errors.image && <div className="invalid-feedback">⚠ {errors.image}</div>}
                            </div>

                            {/* Age + Status */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Age <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                                        value={data.age}
                                        onChange={e => setData('age', e.target.value)}
                                        min="1" max="120"
                                    />
                                    {errors.age && <div className="invalid-feedback">⚠ {errors.age}</div>}
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Status <span className="req">*</span></label>
                                    <select
                                        className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="active">✅ Active</option>
                                        <option value="inactive">⏸ Inactive</option>
                                    </select>
                                    {errors.status && <div className="invalid-feedback">⚠ {errors.status}</div>}
                                </div>
                            </div>

                            {/* Student meta info */}
                            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px 14px', marginTop: '16px', fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <span>🆔 ID: <strong>#{student.id}</strong></span>
                                <span>📅 Created: <strong>{new Date(student.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                                <span>🔄 Status: <strong style={{ color: student.status === 'active' ? '#16a34a' : '#d97706' }}>{student.status}</strong></span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                <button type="submit" className="btn btn-lg" style={{ flex: 1, background: 'linear-gradient(135deg,#5b21b6,#7c3aed)', color: '#fff' }} disabled={processing}>
                                    {processing ? '⏳ Updating...' : '✅ Update Student'}
                                </button>
                                <Link href={route('students.index')} className="btn btn-secondary btn-lg">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
