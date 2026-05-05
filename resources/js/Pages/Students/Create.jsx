import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({ name:'', image:null, age:'', status:'active' });
    const [preview, setPreview] = useState(null);
    const [drag,    setDrag]    = useState(false);
    const fileRef = useRef();

    const pickFile = (file) => {
        if (!file) return;
        setData('image', file);
        const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(file);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('students.store'), { forceFormData:true, onSuccess:()=>{ reset(); setPreview(null); } });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Student" />
            <style>{css}</style>

            <div className="breadcrumb">
                <Link href={route('dashboard')} className="bc-link">Dashboard</Link>
                <span className="bc-sep">/</span>
                <Link href={route('students.index')} className="bc-link">Students</Link>
                <span className="bc-sep">/</span>
                <span className="bc-cur">Add New Student</span>
            </div>

            <div className="form-layout">
                <div className="form-card">
                    <div className="form-card-head">
                        <div className="fch-icon">🧑‍🎓</div>
                        <div>
                            <h2 className="fch-title">Student Information</h2>
                            <p className="fch-sub">Fill in the details below to register a new student.</p>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data">
                        {/* Name */}
                        <div className="fld">
                            <label className="fld-lbl">Full Name <span className="req">*</span></label>
                            <div className="fld-wrap">
                                <span className="fld-ico">👤</span>
                                <input type="text" className={`fld-in ${errors.name?'err':''}`}
                                    value={data.name} onChange={e=>setData('name',e.target.value)}
                                    placeholder="e.g. Sanjula Ekanayaka" autoFocus />
                            </div>
                            {errors.name && <div className="fld-err">⚠ {errors.name}</div>}
                        </div>

                        {/* Age + Status */}
                        <div className="two-col">
                            <div className="fld">
                                <label className="fld-lbl">Age <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-ico">🎂</span>
                                    <input type="number" className={`fld-in ${errors.age?'err':''}`}
                                        value={data.age} onChange={e=>setData('age',e.target.value)}
                                        placeholder="e.g. 22" min="1" max="120" />
                                </div>
                                {errors.age && <div className="fld-err">⚠ {errors.age}</div>}
                            </div>
                            <div className="fld">
                                <label className="fld-lbl">Status <span className="req">*</span></label>
                                <div style={{ display:'flex', gap:'10px' }}>
                                    {['active','inactive'].map(s => (
                                        <div key={s} className={`status-opt ${data.status===s?'sel':''}`} onClick={()=>setData('status',s)}>
                                            <span>{s==='active'?'✅':'⏸'}</span>
                                            <span style={{ textTransform:'capitalize', fontWeight:600 }}>{s}</span>
                                        </div>
                                    ))}
                                </div>
                                {errors.status && <div className="fld-err">⚠ {errors.status}</div>}
                            </div>
                        </div>

                        {/* Image */}
                        <div className="fld">
                            <label className="fld-lbl">Profile Photo <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:400 }}>(optional · max 2MB)</span></label>
                            <div className={`upload-zone ${drag?'drag':''} ${errors.image?'err':''}`}
                                onClick={()=>fileRef.current.click()}
                                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                                onDragLeave={()=>setDrag(false)}
                                onDrop={e=>{e.preventDefault();setDrag(false);pickFile(e.dataTransfer.files[0]);}}>
                                {preview
                                    ? <div style={{textAlign:'center'}}>
                                        <img src={preview} style={{width:'90px',height:'90px',borderRadius:'50%',objectFit:'cover',border:'3px solid #3949ab',marginBottom:'8px'}}/>
                                        <div style={{fontSize:'13px',color:'#3949ab',fontWeight:600}}>✅ Photo ready</div>
                                        <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'3px'}}>Click to change</div>
                                      </div>
                                    : <div style={{textAlign:'center'}}>
                                        <div style={{fontSize:'38px',marginBottom:'8px'}}>📷</div>
                                        <div style={{fontSize:'14px',fontWeight:600,color:'#475569'}}>Click or drag & drop</div>
                                        <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>JPEG · PNG · GIF · WebP — max 2MB</div>
                                      </div>
                                }
                                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>pickFile(e.target.files[0])} />
                            </div>
                            {errors.image && <div className="fld-err">⚠ {errors.image}</div>}
                        </div>

                        <div style={{ display:'flex', gap:'12px', marginTop:'8px', paddingTop:'20px', borderTop:'1px solid #f0f2f8' }}>
                            <button type="submit" className="submit-btn" disabled={processing}>
                                {processing ? '⏳ Saving...' : '✅ Save Student'}
                            </button>
                            <Link href={route('students.index')} className="cancel-btn">Cancel</Link>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="tips-col">
                    {[
                        { icon:'💡', title:'Photo Tips', body:'Upload a clear face photo. Supported: JPG, PNG, GIF, WebP. Max 2MB.' },
                        { icon:'📋', title:'Required Fields', body:'Name, Age and Status are required. Photo is optional but recommended.' },
                        { icon:'🔄', title:'Status', body:'Active = enrolled. Inactive = suspended/left. You can change this anytime.' },
                    ].map(t => (
                        <div key={t.title} className="tip-card">
                            <div style={{ fontSize:'22px', marginBottom:'8px' }}>{t.icon}</div>
                            <div style={{ fontSize:'13px', fontWeight:700, color:'#1a1f37', marginBottom:'5px' }}>{t.title}</div>
                            <div style={{ fontSize:'12px', color:'#94a3b8', lineHeight:1.65 }}>{t.body}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:18px;font-size:13px;}
.bc-link{color:#94a3b8;text-decoration:none;transition:color .15s;}.bc-link:hover{color:#3949ab;}
.bc-sep{color:#cbd5e1;}.bc-cur{color:#1a1f37;font-weight:600;}

.form-layout{display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;animation:fadeUp .4s ease both;}
.form-card{background:#fff;border-radius:14px;padding:28px;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.form-card-head{display:flex;align-items:center;gap:14px;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #f0f2f8;}
.fch-icon{width:48px;height:48px;background:linear-gradient(135deg,#eef0fb,#c5cae9);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.fch-title{font-size:17px;font-weight:800;color:#1a1f37;margin-bottom:3px;}
.fch-sub{font-size:12px;color:#94a3b8;}

.fld{margin-bottom:18px;}
.fld-lbl{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;}
.req{color:#ef4444;margin-left:2px;}
.fld-wrap{position:relative;}
.fld-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.fld-in{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #eaecf4;border-radius:10px;font-size:13px;color:#1a1f37;background:#fafafa;outline:none;transition:all .2s;font-family:'Inter',sans-serif;}
.fld-in:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.fld-in.err{border-color:#ef4444;background:#fff5f5;}
.fld-err{font-size:11px;color:#ef4444;margin-top:5px;display:flex;align-items:center;gap:3px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

.status-opt{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border-radius:10px;border:1.5px solid #eaecf4;cursor:pointer;font-size:13px;color:#64748b;background:#fafafa;transition:all .18s;}
.status-opt.sel{border-color:#3949ab;background:#eef0fb;color:#3949ab;}
.status-opt:hover{border-color:#9fa8da;}

.upload-zone{border:2px dashed #c5cae9;border-radius:12px;padding:28px;cursor:pointer;transition:all .2s;background:#fafbff;}
.upload-zone:hover,.upload-zone.drag{border-color:#3949ab;background:#eef0fb;}
.upload-zone.err{border-color:#ef4444;background:#fff5f5;}

.submit-btn{flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#3949ab,#5c6bc0);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(57,73,171,0.35);transition:all .2s;font-family:'Inter',sans-serif;}
.submit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(57,73,171,0.45);}
.submit-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
.cancel-btn{padding:12px 22px;border-radius:10px;border:1.5px solid #eaecf4;color:#64748b;text-decoration:none;font-size:14px;font-weight:600;background:#fff;display:flex;align-items:center;transition:all .2s;}
.cancel-btn:hover{background:#f0f2f8;}

.tips-col{display:flex;flex-direction:column;gap:14px;}
.tip-card{background:#fff;border-radius:12px;padding:18px;border:1px solid #eaecf4;box-shadow:0 2px 6px rgba(0,0,0,0.04);}

@media(max-width:900px){.form-layout{grid-template-columns:1fr;}.tips-col{display:none;}}
@media(max-width:600px){.two-col{grid-template-columns:1fr;}}
`;
