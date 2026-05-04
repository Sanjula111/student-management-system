import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:   '',
        image:  null,
        age:    '',
        status: 'active',
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
        post(route('students.store'), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null); },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Student" />

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '18px', fontSize: '13px', color: '#94a3b8' }}>
                <Link href={route('dashboard')} style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
                <span>/</span>
                <Link href={route('students.index')} style={{ color: '#94a3b8', textDecoration: 'none' }}>Students</Link>
                <span>/</span>
                <span style={{ color: '#1e293b', fontWeight: 600 }}>Add Student</span>
            </div>

            <div style={{ maxWidth: '640px' }}>
                <div className="card">
                    {/* Card header */}
                    <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2d6a9f)', padding: '22px 26px', color: '#fff' }}>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>➕ Register New Student</h2>
                        <p style={{ margin: '5px 0 0', opacity: 0.75, fontSize: '13px' }}>Fill in all required fields to add a student record.</p>
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
                                    placeholder="e.g. Sanjula Ekanayaka"
                                    autoFocus
                                />
                                {errors.name && <div className="invalid-feedback">⚠ {errors.name}</div>}
                            </div>

                            {/* Image upload */}
                            <div className="form-group">
                                <label className="form-label">Profile Photo <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 400 }}>(optional · max 2MB)</span></label>
                                <div
                                    className={`upload-box ${errors.image ? 'is-invalid' : ''} ${dragOver ? 'drag-over' : ''}`}
                                    onClick={() => fileRef.current.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files[0]); }}
                                >
                                    {preview ? (
                                        <>
                                            <img src={preview} alt="preview" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #2d6a9f', marginBottom: '10px' }} />
                                            <div style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>✅ Photo selected</div>
                                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Click to change</div>
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
                                {errors.image && <div className="invalid-feedback">⚠ {errors.image}</div>}
                            </div>

                            {/* Age + Status — side by side */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Age <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                                        value={data.age}
                                        onChange={e => setData('age', e.target.value)}
                                        placeholder="e.g. 22"
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

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                                <button type="submit" className="btn btn-success btn-lg" style={{ flex: 1 }} disabled={processing}>
                                    {processing ? '⏳ Saving...' : '✅ Save Student'}
                                </button>
                                <Link href={route('students.index')} className="btn btn-secondary btn-lg">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tip */}
                <div className="alert alert-info" style={{ marginTop: '16px' }}>
                    <span>💡</span>
                    <span>After saving, you'll be redirected to the students list. The student can be edited or deleted at any time.</span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
