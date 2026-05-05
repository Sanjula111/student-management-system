import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [showPass,    setShowPass]    = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const submit = (e) => { e.preventDefault(); post(route('register')); };

    const strength = (() => {
        const p = data.password; if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();
    const sLabels = ['','Weak','Fair','Good','Strong'];
    const sColors = ['','#ef4444','#f97316','#eab308','#22c55e'];

    return (
        <>
            <Head title="Create Account" />
            <style>{css}</style>
            <div className="reg-wrap">
                {/* Left */}
                <div className="reg-left">
                    <div className="blob1"/><div className="blob2"/>
                    <div className="reg-left-inner">
                        <h1 className="reg-left-title">Create Your<br/>Account 🚀</h1>
                        <p className="reg-left-sub">Join our platform and start managing students with ease and efficiency.</p>
                        <div className="reg-features">
                            {[
                                {icon:'🔒',title:'Secure & Reliable',sub:'Your data is safe and encrypted'},
                                {icon:'✏️',title:'Easy to Use',sub:'Simple interface for everyone'},
                                {icon:'⏰',title:'Save Time',sub:'Manage everything in one place'},
                            ].map(f=>(
                                <div key={f.title} className="reg-feat">
                                    <div className="reg-feat-icon">{f.icon}</div>
                                    <div>
                                        <div style={{fontSize:'14px',fontWeight:700,marginBottom:'2px'}}>{f.title}</div>
                                        <div style={{fontSize:'12px',opacity:.72}}>{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Person illustration */}
                        <div className="person-wrap">
                            <div className="person-head"/>
                            <div className="person-body">
                                <div className="laptop">
                                    <div className="lp-line"/><div className="lp-line"/><div className="lp-line short"/>
                                </div>
                            </div>
                            <span style={{position:'absolute',right:-16,bottom:0,fontSize:'30px'}}>🪴</span>
                        </div>
                    </div>
                </div>
                {/* Right */}
                <div className="reg-right">
                    <div className="reg-card">
                        <div className="reg-card-icon"><span style={{fontSize:'24px'}}>👤</span></div>
                        <h2 className="reg-card-title">Create Account</h2>
                        <p className="reg-card-sub">Fill in the details to get started</p>

                        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                            {/* Name */}
                            <div className="fld">
                                <label className="fld-lbl">Full Name</label>
                                <div className="fld-wrap"><span className="fld-ico">👤</span>
                                    <input type="text" className={`fld-in ${errors.name?'err':''}`}
                                        value={data.name} onChange={e=>setData('name',e.target.value)}
                                        placeholder="Enter your full name" autoFocus />
                                </div>
                                {errors.name && <div className="fld-err">⚠ {errors.name}</div>}
                            </div>

                            {/* Email */}
                            <div className="fld">
                                <label className="fld-lbl">Email Address</label>
                                <div className="fld-wrap"><span className="fld-ico">✉️</span>
                                    <input type="email" className={`fld-in ${errors.email?'err':''}`}
                                        value={data.email} onChange={e=>setData('email',e.target.value)}
                                        placeholder="Enter your email" />
                                </div>
                                {errors.email && <div className="fld-err">⚠ {errors.email}</div>}
                            </div>

                            {/* Password row */}
                            <div className="two-col">
                                <div className="fld">
                                    <label className="fld-lbl">Password</label>
                                    <div className="fld-wrap"><span className="fld-ico">🔒</span>
                                        <input type={showPass?'text':'password'} className={`fld-in pr ${errors.password?'err':''}`}
                                            value={data.password} onChange={e=>setData('password',e.target.value)}
                                            placeholder="Create a password" />
                                        <button type="button" className="eye-btn" onClick={()=>setShowPass(!showPass)}>{showPass?'🙈':'👁️'}</button>
                                    </div>
                                    {errors.password && <div className="fld-err">⚠ {errors.password}</div>}
                                </div>
                                <div className="fld">
                                    <label className="fld-lbl">Confirm Password</label>
                                    <div className="fld-wrap"><span className="fld-ico">🔐</span>
                                        <input type={showConfirm?'text':'password'} className="fld-in pr"
                                            value={data.password_confirmation} onChange={e=>setData('password_confirmation',e.target.value)}
                                            placeholder="Confirm your password" />
                                        <button type="button" className="eye-btn" onClick={()=>setShowConfirm(!showConfirm)}>{showConfirm?'🙈':'👁️'}</button>
                                    </div>
                                </div>
                            </div>

                            {/* Strength */}
                            {data.password && (
                                <div>
                                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                                        <span style={{fontSize:'11px',color:'#64748b'}}>Password strength:</span>
                                        <span style={{fontSize:'11px',fontWeight:700,color:sColors[strength]}}>{sLabels[strength]}</span>
                                    </div>
                                    <div style={{display:'flex',gap:'4px',height:'5px'}}>
                                        {[1,2,3,4].map(i=>(
                                            <div key={i} style={{flex:1,borderRadius:'3px',background:i<=strength?sColors[strength]:'#e8eaf6',transition:'background .3s'}}/>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Match */}
                            {data.password_confirmation && (
                                <div style={{fontSize:'12px',fontWeight:600,color:data.password===data.password_confirmation?'#22c55e':'#ef4444'}}>
                                    {data.password===data.password_confirmation?'✅ Passwords match':'❌ Passwords do not match'}
                                </div>
                            )}

                            <button type="submit" className="reg-btn" disabled={processing}>
                                {processing?'⏳ Creating account...':'Register'}
                            </button>
                        </form>

                        <p className="reg-switch">Already have an account? <Link href={route('login')} className="reg-switch-link">Sign in</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',sans-serif;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

.reg-wrap{display:flex;min-height:100vh;background:linear-gradient(135deg,#1a237e 0%,#283593 40%,#4a148c 100%);}
.reg-left{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;position:relative;overflow:hidden;}
.blob1{position:absolute;top:-100px;right:-100px;width:340px;height:340px;border-radius:50%;background:rgba(255,255,255,0.06);}
.blob2{position:absolute;bottom:-80px;left:-60px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,0.04);}
.reg-left-inner{position:relative;max-width:400px;color:#fff;}
.reg-left-title{font-size:34px;font-weight:900;line-height:1.2;margin-bottom:14px;letter-spacing:-.3px;}
.reg-left-sub{font-size:14px;opacity:.8;line-height:1.75;margin-bottom:30px;}
.reg-features{display:flex;flex-direction:column;gap:14px;margin-bottom:32px;}
.reg-feat{display:flex;align-items:flex-start;gap:14px;background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;border:1px solid rgba(255,255,255,0.15);}
.reg-feat-icon{font-size:20px;flex-shrink:0;margin-top:1px;}

.person-wrap{position:relative;width:170px;height:130px;}
.person-head{width:36px;height:36px;border-radius:50%;background:#ffb74d;position:absolute;top:0;left:50%;transform:translateX(-50%);}
.person-body{width:120px;height:72px;background:linear-gradient(135deg,#5c6bc0,#7986cb);border-radius:12px 12px 6px 6px;position:absolute;bottom:0;left:50%;transform:translateX(-50%);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,0.2);}
.laptop{background:#1a237e;width:80px;height:48px;border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;}
.lp-line{height:4px;background:rgba(255,255,255,0.5);border-radius:2px;}
.lp-line.short{width:50%;}

.reg-right{width:100%;max-width:520px;background:#eef0fb;display:flex;align-items:center;justify-content:center;padding:32px;overflow-y:auto;}
.reg-card{background:#fff;border-radius:20px;padding:36px 32px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.14);animation:fadeUp .5s ease both;}
.reg-card-icon{width:52px;height:52px;background:linear-gradient(135deg,#e8eaf6,#c5cae9);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;}
.reg-card-title{text-align:center;font-size:21px;font-weight:800;color:#1a237e;margin-bottom:4px;}
.reg-card-sub{text-align:center;font-size:13px;color:#94a3b8;margin-bottom:22px;}

.fld{display:flex;flex-direction:column;}
.fld-lbl{font-size:12px;font-weight:600;color:#374151;margin-bottom:5px;}
.fld-wrap{position:relative;}
.fld-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;z-index:1;}
.fld-in{width:100%;padding:10px 13px 10px 38px;border:1.5px solid #e8eaf6;border-radius:10px;font-size:13px;color:#1a237e;background:#fafafa;outline:none;transition:all .2s;font-family:'Inter',sans-serif;}
.fld-in:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.fld-in.err{border-color:#ef4444;background:#fff5f5;}
.fld-in.pr{padding-right:40px;}
.eye-btn{position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:#94a3b8;}
.fld-err{font-size:11px;color:#ef4444;margin-top:4px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.reg-btn{width:100%;padding:12px;border:none;border-radius:10px;background:linear-gradient(135deg,#3949ab,#5c6bc0);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(57,73,171,0.4);transition:all .22s;font-family:'Inter',sans-serif;margin-top:4px;}
.reg-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(57,73,171,0.5);}
.reg-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}
.reg-switch{text-align:center;font-size:13px;color:#94a3b8;margin-top:16px;}
.reg-switch-link{color:#5c6bc0;font-weight:700;text-decoration:none;}

@media(max-width:900px){.reg-left{display:none;}.reg-right{max-width:100%;padding:24px 16px;}}
@media(max-width:600px){.two-col{grid-template-columns:1fr;}}
`;
