import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({ name:'', image:null, age:'', status:'active' });
    const [preview, setPreview] = useState(null);
    const [drag, setDrag] = useState(false);
    const fileRef = useRef();

    const pickFile = (file) => {
        if (!file) return;
        setData('image', file);
        const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('students.store'), { forceFormData: true, onSuccess: () => { reset(); setPreview(null); } });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Student" />
            <style>{formCss}</style>

            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'20px', fontSize:'13px', color:'#94a3b8' }}>
                <Link href={route('dashboard')} style={{ color:'#94a3b8', textDecoration:'none' }}>Dashboard</Link>
                <span>/</span>
                <Link href={route('students.index')} style={{ color:'#94a3b8', textDecoration:'none' }}>Students</Link>
                <span>/</span>
                <span style={{ color:'#1a1f37', fontWeight:600 }}>Add New Student</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'20px', alignItems:'start' }}>
                {/* Form card */}
                <div className="form-card">
                    <div className="form-card-header">
                        <div className="form-card-header-icon">🧑‍🎓</div>
                        <div>
                            <h2 className="form-card-title">Student Information</h2>
                            <p className="form-card-sub">Fill in the details to register a new student</p>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="form-grid-2">
                            <div className="fld">
                                <label className="fld-label">Full Name <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-icon">👤</span>
                                    <input type="text" className={`fld-input ${errors.name?'err':''}`}
                                        value={data.name} onChange={e=>setData('name',e.target.value)}
                                        placeholder="e.g. Sanjula Ekanayaka" autoFocus />
                                </div>
                                {errors.name && <span className="fld-err">⚠ {errors.name}</span>}
                            </div>

                            <div className="fld">
                                <label className="fld-label">Age <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-icon">🎂</span>
                                    <input type="number" className={`fld-input ${errors.age?'err':''}`}
                                        value={data.age} onChange={e=>setData('age',e.target.value)}
                                        placeholder="e.g. 22" min="1" max="120" />
                                </div>
                                {errors.age && <span className="fld-err">⚠ {errors.age}</span>}
                            </div>
                        </div>

                        <div className="fld">
                            <label className="fld-label">Status <span className="req">*</span></label>
                            <div style={{ display:'flex', gap:'10px' }}>
                                {['active','inactive'].map(s => (
                                    <label key={s} className={`status-opt ${data.status===s?'selected':''}`} onClick={()=>setData('status',s)}>
                                        <span>{s==='active'?'✅':'⏸'}</span>
                                        <span style={{ textTransform:'capitalize', fontWeight:600 }}>{s}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.status && <span className="fld-err">⚠ {errors.status}</span>}
                        </div>

                        <div className="fld">
                            <label className="fld-label">Profile Photo <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:400 }}>(optional · max 2MB)</span></label>
                            <div
                                className={`upload-zone ${errors.image?'err':''} ${drag?'dragging':''}`}
                                onClick={()=>fileRef.current.click()}
                                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                                onDragLeave={()=>setDrag(false)}
                                onDrop={e=>{e.preventDefault();setDrag(false);pickFile(e.dataTransfer.files[0]);}}
                            >
                                {preview ? (
                                    <div style={{ textAlign:'center' }}>
                                        <img src={preview} style={{ width:'90px', height:'90px', borderRadius:'50%', objectFit:'cover', border:'3px solid #3949ab', marginBottom:'8px' }} />
                                        <div style={{ fontSize:'13px', color:'#3949ab', fontWeight:600 }}>✅ Photo ready</div>
                                        <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'3px' }}>Click to change</div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign:'center' }}>
                                        <div style={{ fontSize:'40px', marginBottom:'8px' }}>📷</div>
                                        <div style={{ fontSize:'14px', fontWeight:600, color:'#475569' }}>Click or drag & drop</div>
                                        <div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>JPEG · PNG · GIF · WebP — max 2MB</div>
                                    </div>
                                )}
                                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>pickFile(e.target.files[0])} />
                            </div>
                            {errors.image && <span className="fld-err">⚠ {errors.image}</span>}
                        </div>

                        <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                            <button type="submit" className="submit-btn" disabled={processing}>
                                {processing ? '⏳ Saving...' : '✅ Save Student'}
                            </button>
                            <Link href={route('students.index')} className="cancel-btn">Cancel</Link>
                        </div>
                    </form>
                </div>

                {/* Side tips */}
                <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    {[
                        { icon:'💡', title:'Photo Tips', body:'Upload a clear face photo. Supported formats: JPG, PNG, GIF, WebP. Max size 2MB.' },
                        { icon:'📋', title:'Required Fields', body:'Name, Age, and Status are required. Photo is optional but recommended.' },
                        { icon:'🔄', title:'Status', body:'Active = enrolled student. Inactive = suspended/left. You can toggle this anytime.' },
                    ].map(t => (
                        <div key={t.title} style={{ background:'#fff', borderRadius:'12px', padding:'18px', border:'1px solid #eef0f7', boxShadow:'0 2px 6px rgba(0,0,0,0.04)' }}>
                            <div style={{ fontSize:'20px', marginBottom:'8px' }}>{t.icon}</div>
                            <div style={{ fontSize:'13px', fontWeight:'700', color:'#1a1f37', marginBottom:'5px' }}>{t.title}</div>
                            <div style={{ fontSize:'12px', color:'#94a3b8', lineHeight:1.6 }}>{t.body}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const formCss = `
.form-card{background:#fff;border-radius:14px;padding:28px;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.form-card-header{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #f4f6fb;}
.form-card-header-icon{width:48px;height:48px;background:linear-gradient(135deg,#eef0fb,#c5cae9);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.form-card-title{font-size:17px;font-weight:800;color:#1a1f37;margin-bottom:2px;}
.form-card-sub{font-size:12px;color:#94a3b8;}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;}
.fld{margin-bottom:18px;}
.fld-label{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.4px;}
.req{color:#ef4444;margin-left:2px;}
.fld-wrap{position:relative;}
.fld-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.fld-input{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #eef0f7;border-radius:10px;font-size:13px;color:#1a1f37;background:#fafafa;outline:none;transition:all 0.2s;font-family:'Inter',sans-serif;}
.fld-input:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.fld-input.err{border-color:#ef4444;background:#fff5f5;}
.fld-err{font-size:11px;color:#ef4444;margin-top:4px;display:block;}

.status-opt{
  flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
  padding:10px;border-radius:10px;border:1.5px solid #eef0f7;
  cursor:pointer;font-size:13px;color:#64748b;background:#fafafa;transition:all 0.2s;
}
.status-opt.selected{border-color:#3949ab;background:#eef0fb;color:#3949ab;}
.status-opt:hover{border-color:#9fa8da;}

.upload-zone{
  border:2px dashed #c5cae9;border-radius:12px;padding:28px;
  cursor:pointer;transition:all 0.2s;background:#fafbff;
}
.upload-zone:hover,.upload-zone.dragging{border-color:#3949ab;background:#eef0fb;}
.upload-zone.err{border-color:#ef4444;background:#fff5f5;}

.submit-btn{
  flex:1;padding:12px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#3949ab,#5c6bc0);
  color:#fff;font-size:14px;font-weight:700;cursor:pointer;
  box-shadow:0 4px 12px rgba(57,73,171,0.35);
  transition:all 0.2s;font-family:'Inter',sans-serif;
}
.submit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(57,73,171,0.45);}
.submit-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}
.cancel-btn{
  padding:12px 22px;border-radius:10px;border:1.5px solid #eef0f7;
  color:#64748b;text-decoration:none;font-size:14px;font-weight:600;
  background:#fff;display:flex;align-items:center;transition:all 0.2s;
}
.cancel-btn:hover{background:#f4f6fb;border-color:#d1d5db;}

@media(max-width:900px){
  div[style*="320px"]{grid-template-columns:1fr!important;}
}
@media(max-width:600px){
  .form-grid-2{grid-template-columns:1fr;}
}
`;
