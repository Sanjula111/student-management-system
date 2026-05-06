import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function Edit({ student }) {
    const { data, setData, post, processing, errors } = useForm({
        name: student.name||'', image:null, age:student.age||'',
        status:student.status||'active', _method:'PUT',
    });
    const [preview, setPreview] = useState(null);
    const [drag, setDrag] = useState(false);
    const fileRef = useRef();

    const pickFile = (file) => {
        if (!file) return;
        setData('image', file);
        const r = new FileReader(); r.onloadend = () => setPreview(r.result); r.readAsDataURL(file);
    };
    const submit = (e) => { e.preventDefault(); post(route('students.update', student.id), { forceFormData:true }); };
    
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return imageUrl;
        return `/storage/${imageUrl}`;
    };
    const displayImg = preview || getImageUrl(student.image_url);

    return (
        <AuthenticatedLayout>
            <Head title={`Edit — ${student.name}`} />
            <style>{css}</style>

            <div className="breadcrumb">
                <Link href={route('dashboard')} className="bc-link">Dashboard</Link>
                <span className="bc-sep">/</span>
                <Link href={route('students.index')} className="bc-link">Students</Link>
                <span className="bc-sep">/</span>
                <span className="bc-cur">Edit: {student.name}</span>
            </div>

            <div className="form-layout">
                <div className="form-card">
                    <div className="form-card-head purple">
                        {displayImg
                            ? <img src={displayImg} style={{width:'52px',height:'52px',borderRadius:'50%',objectFit:'cover',border:'2px solid rgba(255,255,255,0.4)',flexShrink:0}} />
                            : <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:800,flexShrink:0}}>{student.name.charAt(0).toUpperCase()}</div>
                        }
                        <div>
                            <h2 style={{margin:0,fontSize:'17px',fontWeight:800}}>✏️ Edit Student</h2>
                            <p style={{margin:'3px 0 0',opacity:.75,fontSize:'12px'}}>Updating record for <strong>{student.name}</strong></p>
                        </div>
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data" style={{padding:'0'}}>
                        <div className="fld">
                            <label className="fld-lbl">Full Name <span className="req">*</span></label>
                            <div className="fld-wrap">
                                <span className="fld-ico">👤</span>
                                <input type="text" className={`fld-in ${errors.name?'err':''}`}
                                    value={data.name} onChange={e=>setData('name',e.target.value)} autoFocus />
                            </div>
                            {errors.name && <div className="fld-err">⚠ {errors.name}</div>}
                        </div>

                        <div className="two-col">
                            <div className="fld">
                                <label className="fld-lbl">Age <span className="req">*</span></label>
                                <div className="fld-wrap">
                                    <span className="fld-ico">🎂</span>
                                    <input type="number" className={`fld-in ${errors.age?'err':''}`}
                                        value={data.age} onChange={e=>setData('age',e.target.value)} min="1" max="120" />
                                </div>
                                {errors.age && <div className="fld-err">⚠ {errors.age}</div>}
                            </div>
                            <div className="fld">
                                <label className="fld-lbl">Status <span className="req">*</span></label>
                                <div style={{display:'flex',gap:'10px'}}>
                                    {['active','inactive'].map(s => (
                                        <div key={s} className={`status-opt ${data.status===s?'sel-purple':''}`} onClick={()=>setData('status',s)}>
                                            <span>{s==='active'?'✅':'⏸'}</span>
                                            <span style={{textTransform:'capitalize',fontWeight:600}}>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="fld">
                            <label className="fld-lbl">
                                Profile Photo
                                {student.image_url && !preview && <span style={{fontSize:'11px',color:'#7c3aed',fontWeight:500,marginLeft:'8px',textTransform:'none'}}>← current photo shown</span>}
                            </label>
                            <div className={`upload-zone purple ${drag?'drag':''}`}
                                onClick={()=>fileRef.current.click()}
                                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                                onDragLeave={()=>setDrag(false)}
                                onDrop={e=>{e.preventDefault();setDrag(false);pickFile(e.dataTransfer.files[0]);}}>
                                {displayImg
                                    ? <div style={{textAlign:'center'}}>
                                        <img src={displayImg} style={{width:'90px',height:'90px',borderRadius:'50%',objectFit:'cover',border:'3px solid #7c3aed',marginBottom:'8px'}}/>
                                        <div style={{fontSize:'13px',color:preview?'#16a34a':'#7c3aed',fontWeight:600}}>{preview?'✅ New photo ready':'📷 Current photo'}</div>
                                        <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'3px'}}>Click to {preview?'change again':'replace'}</div>
                                      </div>
                                    : <div style={{textAlign:'center'}}>
                                        <div style={{fontSize:'38px',marginBottom:'8px'}}>📷</div>
                                        <div style={{fontSize:'14px',fontWeight:600,color:'#475569'}}>Click or drag & drop</div>
                                        <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'4px'}}>JPEG · PNG · GIF · WebP — max 2MB</div>
                                      </div>
                                }
                                <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>pickFile(e.target.files[0])} />
                            </div>
                            {!preview && student.image_url && <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'5px'}}>💡 Leave unchanged to keep current photo. New upload replaces it.</div>}
                            {errors.image && <div className="fld-err">⚠ {errors.image}</div>}
                        </div>

                        {/* Meta */}
                        <div className="meta-bar">
                            <span>🆔 ID: <strong>#{student.id}</strong></span>
                            <span>📅 Joined: <strong>{new Date(student.created_at).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}</strong></span>
                            <span>Status: <strong style={{color:student.status==='active'?'#2e7d32':'#c62828'}}>{student.status}</strong></span>
                        </div>

                        <div style={{display:'flex',gap:'12px',paddingTop:'18px',borderTop:'1px solid #f0f2f8'}}>
                            <button type="submit" className="update-btn" disabled={processing}>
                                {processing ? '⏳ Updating...' : '✅ Update Student'}
                            </button>
                            <Link href={route('students.index')} className="cancel-btn">Cancel</Link>
                        </div>
                    </form>
                </div>

                {/* Current info card */}
                <div className="info-card">
                    <div className="info-card-head">
                        {student.image_url
                            ? <img src={student.image_url} style={{width:'70px',height:'70px',borderRadius:'50%',objectFit:'cover',border:'3px solid rgba(255,255,255,0.4)',margin:'0 auto 10px',display:'block'}} />
                            : <div style={{width:'70px',height:'70px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:800,margin:'0 auto 10px'}}>{student.name.charAt(0).toUpperCase()}</div>
                        }
                        <div style={{fontWeight:800,fontSize:'15px'}}>{student.name}</div>
                        <div style={{opacity:.65,fontSize:'12px',marginTop:'2px'}}>ID #{student.id}</div>
                    </div>
                    <div style={{padding:'18px',display:'flex',flexDirection:'column',gap:'12px'}}>
                        {[
                            { label:'Age', value:`${student.age} years old` },
                            { label:'Status', value:student.status.charAt(0).toUpperCase()+student.status.slice(1), color:student.status==='active'?'#2e7d32':'#c62828' },
                            { label:'Registered', value:new Date(student.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) },
                        ].map(r => (
                            <div key={r.label} style={{display:'flex',justifyContent:'space-between',fontSize:'13px',paddingBottom:'10px',borderBottom:'1px solid #f4f6fb'}}>
                                <span style={{color:'#94a3b8',fontWeight:500}}>{r.label}</span>
                                <span style={{color:r.color||'#1a1f37',fontWeight:700}}>{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.breadcrumb{display:flex;align-items:center;gap:6px;margin-bottom:18px;font-size:13px;}
.bc-link{color:#94a3b8;text-decoration:none;transition:color .15s;}.bc-link:hover{color:#7c3aed;}
.bc-sep{color:#cbd5e1;}.bc-cur{color:#1a1f37;font-weight:600;}

.form-layout{display:grid;grid-template-columns:1fr 280px;gap:20px;align-items:start;animation:fadeUp .4s ease both;}
.form-card{background:#fff;border-radius:14px;padding:0;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);overflow:hidden;}
.form-card-head{display:flex;align-items:center;gap:14px;padding:22px 26px;color:#fff;}
.form-card-head.purple{background:linear-gradient(135deg,#5b21b6,#7c3aed);}
form{padding:24px 26px;}

.fld{margin-bottom:18px;}
.fld-lbl{display:block;font-size:12px;font-weight:700;color:#374151;margin-bottom:6px;text-transform:uppercase;letter-spacing:.4px;}
.req{color:#ef4444;}
.fld-wrap{position:relative;}
.fld-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.fld-in{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #eaecf4;border-radius:10px;font-size:13px;color:#1a1f37;background:#fafafa;outline:none;transition:all .2s;font-family:'Inter',sans-serif;}
.fld-in:focus{border-color:#7c3aed;background:#fff;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.fld-in.err{border-color:#ef4444;background:#fff5f5;}
.fld-err{font-size:11px;color:#ef4444;margin-top:5px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;}

.status-opt{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border-radius:10px;border:1.5px solid #eaecf4;cursor:pointer;font-size:13px;color:#64748b;background:#fafafa;transition:all .18s;}
.status-opt.sel-purple{border-color:#7c3aed;background:#f5f3ff;color:#7c3aed;}

.upload-zone{border:2px dashed #c5cae9;border-radius:12px;padding:26px;cursor:pointer;transition:all .2s;background:#fafbff;}
.upload-zone.purple:hover,.upload-zone.purple.drag{border-color:#7c3aed;background:#f5f3ff;}

.meta-bar{background:#f8fafc;border-radius:8px;padding:11px 14px;margin-bottom:16px;display:flex;gap:18px;flex-wrap:wrap;font-size:12px;color:#94a3b8;}

.update-btn{flex:1;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#5b21b6,#7c3aed);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(124,58,237,0.35);transition:all .2s;font-family:'Inter',sans-serif;}
.update-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(124,58,237,0.45);}
.update-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
.cancel-btn{padding:12px 22px;border-radius:10px;border:1.5px solid #eaecf4;color:#64748b;text-decoration:none;font-size:14px;font-weight:600;background:#fff;display:flex;align-items:center;transition:all .2s;}
.cancel-btn:hover{background:#f0f2f8;}

.info-card{background:#fff;border-radius:14px;border:1px solid #eaecf4;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.info-card-head{background:linear-gradient(135deg,#5b21b6,#7c3aed);padding:22px;color:#fff;text-align:center;}

@media(max-width:900px){.form-layout{grid-template-columns:1fr;}.info-card{display:none;}}
@media(max-width:600px){.two-col{grid-template-columns:1fr;}}
`;
