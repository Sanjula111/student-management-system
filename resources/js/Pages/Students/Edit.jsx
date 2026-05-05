import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { showToast } from '@/Components/Toast';

export default function Edit({ student }) {
    const [data, setData] = useState({
        name: student.name || '', image: null,
        age: student.age || '', status: student.status || 'active',
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [drag, setDrag] = useState(false);
    const [processing, setProcessing] = useState(false);
    const fileRef = useRef();

    const pickFile = (file) => {
        if (!file) return;
        setData(prev => ({ ...prev, image: file }));
        const r = new FileReader();
        r.onloadend = () => setPreview(r.result);
        r.readAsDataURL(file);
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('age', data.age);
        formData.append('status', data.status);
        if (data.image) {
            formData.append('image', data.image);
        }

        try {
            const response = await fetch(route('students.update', student.id), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                setErrors(result.errors || {});
                showToast('❌ ' + (result.message || 'Error updating student'), 'error');
            } else {
                showToast('✅ Student updated successfully!', 'success');
                setTimeout(() => window.location.href = route('students.index'), 1500);
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('❌ Network error. Please try again.', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const displayImg = preview || student.image_url;

    return (
        <AuthenticatedLayout>
            <Head title={`Edit — ${student.name}`} />
            <style>{editCss}</style>

            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'13px', color:'#94a3b8' }}>
                <Link href={route('dashboard')} style={{ color:'#94a3b8', textDecoration:'none' }}>Dashboard</Link>
                <span>/</span>
                <Link href={route('students.index')} style={{ color:'#94a3b8', textDecoration:'none' }}>Students</Link>
                <span>/</span>
                <span style={{ color:'#1a1f37', fontWeight:600 }}>Edit: {student.name}</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', alignItems:'start' }}>
                <div className="edit-card">
                    <div className="edit-card-header">
                        {displayImg
                            ? <img src={displayImg} style={{ width:'52px', height:'52px', borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.4)', flexShrink:0 }} />
                            : <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', fontWeight:800, flexShrink:0 }}>{student.name.charAt(0).toUpperCase()}</div>
                        }
                        <div>
                            <h2 className="edit-card-title">✏️ Edit Student</h2>
                            <p className="edit-card-sub">Updating record for <strong>{student.name}</strong></p>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="form-grid-2">
                            <div className="fld">
                                <label className="fld-label">Full Name <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-icon">👤</span>
                                    <input type="text" className={`fld-input ${errors.name?'err':''}`}
                                        value={data.name} onChange={e=>setData(prev => ({ ...prev, name: e.target.value }))} autoFocus />
                                </div>
                                {errors.name && <span className="fld-err">⚠ {errors.name}</span>}
                            </div>
                            <div className="fld">
                                <label className="fld-label">Age <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-icon">🎂</span>
                                    <input type="number" className={`fld-input ${errors.age?'err':''}`}
                                        value={data.age} onChange={e=>setData(prev => ({ ...prev, age: e.target.value }))} min="1" max="120" />
                                </div>
                                {errors.age && <span className="fld-err">⚠ {errors.age}</span>}
                            </div>
                        </div>

                        <div className="fld">
                            <label className="fld-label">Status <span className="req">*</span></label>
                            <div style={{ display:'flex', gap:'10px' }}>
                                {['active','inactive'].map(s => (
                                    <label key={s} className={`status-opt ${data.status===s?'selected':''}`} onClick={()=>setData(prev => ({ ...prev, status: s }))}>
                                        <span>{s==='active'?'✅':'⏸'}</span>
                                        <span style={{ textTransform:'capitalize', fontWeight:600 }}>{s}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="fld">
                            <label className="fld-label">Profile Photo
                                {student.image_url && !preview && <span style={{ fontSize:'11px', color:'#7c3aed', fontWeight:500, marginLeft:'8px', textTransform:'none' }}>← current photo shown</span>}
                            </label>
                            <div className={`upload-zone ${drag?'dragging':''}`}
                                onClick={()=>fileRef.current.click()}
                                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                                onDragLeave={()=>setDrag(false)}
                                onDrop={e=>{e.preventDefault();setDrag(false);pickFile(e.dataTransfer.files[0]);}}>
                                {displayImg ? (
                                    <div style={{ textAlign:'center' }}>
                                        <img src={displayImg} style={{ width:'90px', height:'90px', borderRadius:'50%', objectFit:'cover', border:'3px solid #7c3aed', marginBottom:'8px' }} />
                                        <div style={{ fontSize:'13px', color: preview?'#16a34a':'#7c3aed', fontWeight:600 }}>{preview?'✅ New photo selected':'📷 Current photo'}</div>
                                        <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'3px' }}>Click to {preview?'change again':'replace'}</div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign:'center' }}>
                                        <div style={{ fontSize:'40px', marginBottom:'8px' }}>📷</div>
                                        <div style={{ fontSize:'14px', fontWeight:600, color:'#475569' }}>Click or drag & drop</div>
                                        <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>JPEG · PNG · GIF · WebP</div>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>pickFile(e.target.files[0])} />
                            </div>
                            {errors.image && <span className="fld-err">⚠ {errors.image}</span>}
                        </div>

                        {/* Meta info */}
                        <div className="student-meta">
                            <span>🆔 ID: <strong>#{student.id}</strong></span>
                            <span>📅 Created: <strong>{new Date(student.created_at).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}</strong></span>
                            <span>Current: <strong style={{ color: student.status==='active'?'#2e7d32':'#c62828' }}>{student.status}</strong></span>
                        </div>

                        <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                            <button type="submit" className="update-btn" disabled={processing}>
                                {processing ? '⏳ Updating...' : '✅ Update Student'}
                            </button>
                            <Link href={route('students.index')} className="cancel-btn">Cancel</Link>
                        </div>
                    </form>
                </div>

                {/* Right: current data card */}
                <div style={{ background:'#fff', borderRadius:'14px', border:'1px solid #eef0f7', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ background:'linear-gradient(135deg,#5b21b6,#7c3aed)', padding:'20px', color:'#fff', textAlign:'center' }}>
                        {student.image_url
                            ? <img src={student.image_url} style={{ width:'70px', height:'70px', borderRadius:'50%', objectFit:'cover', border:'3px solid rgba(255,255,255,0.4)', margin:'0 auto 10px', display:'block' }} />
                            : <div style={{ width:'70px', height:'70px', borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:800, margin:'0 auto 10px' }}>{student.name.charAt(0).toUpperCase()}</div>
                        }
                        <div style={{ fontWeight:800, fontSize:'15px' }}>{student.name}</div>
                        <div style={{ opacity:0.7, fontSize:'12px', marginTop:'2px' }}>ID #{student.id}</div>
                    </div>
                    <div style={{ padding:'18px', display:'flex', flexDirection:'column', gap:'12px' }}>
                        {[
                            { label:'Age', value: `${student.age} years old` },
                            { label:'Status', value: student.status.charAt(0).toUpperCase() + student.status.slice(1), color: student.status==='active'?'#2e7d32':'#c62828' },
                            { label:'Registered', value: new Date(student.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) },
                        ].map(r => (
                            <div key={r.label} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', paddingBottom:'10px', borderBottom:'1px solid #f4f6fb' }}>
                                <span style={{ color:'#94a3b8', fontWeight:500 }}>{r.label}</span>
                                <span style={{ color: r.color||'#1a1f37', fontWeight:700 }}>{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const editCss = `
.edit-card{background:#fff;border-radius:14px;padding:28px;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.edit-card-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding:20px;background:linear-gradient(135deg,#5b21b6,#7c3aed);border-radius:10px;color:#fff;margin-bottom:24px;}
.edit-card-title{font-size:17px;font-weight:800;margin-bottom:2px;}
.edit-card-sub{font-size:12px;opacity:0.8;}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
.fld{margin-bottom:18px;}
.fld-label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.4px;}
.req{color:#ef4444;}
.fld-wrap{position:relative;}
.fld-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.fld-input{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #eef0f7;border-radius:10px;font-size:13px;color:#1a1f37;background:#fafafa;outline:none;transition:all 0.2s;font-family:'Inter',sans-serif;}
.fld-input:focus{border-color:#7c3aed;background:#fff;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.fld-input.err{border-color:#ef4444;background:#fff5f5;}
.fld-err{font-size:11px;color:#ef4444;margin-top:4px;display:block;}
.status-opt{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:10px;border:1.5px solid #eef0f7;cursor:pointer;font-size:13px;color:#64748b;background:#fafafa;transition:all 0.2s;}
.status-opt.selected{border-color:#7c3aed;background:#f5f3ff;color:#7c3aed;}
.upload-zone{border:2px dashed #ddd6fe;border-radius:12px;padding:28px;cursor:pointer;transition:all 0.2s;background:#faf5ff;}
.upload-zone:hover,.upload-zone.dragging{border-color:#7c3aed;background:#f5f3ff;}
.student-meta{background:#f8fafc;border-radius:8px;padding:12px 14px;margin-bottom:16px;display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:#94a3b8;}
.update-btn{flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(124,58,237,0.35);transition:all 0.2s;font-family:'Inter',sans-serif;}
.update-btn:hover{transform:translateY(-1px);}
.update-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.cancel-btn{padding:12px 22px;border-radius:10px;border:1.5px solid #eef0f7;color:#64748b;text-decoration:none;font-size:14px;font-weight:600;background:#fff;display:flex;align-items:center;transition:all 0.2s;}
.cancel-btn:hover{background:#f4f6fb;}
@media(max-width:900px){div[style*="300px"]{grid-template-columns:1fr!important;}}
@media(max-width:600px){.form-grid-2{grid-template-columns:1fr;}}
`;
