import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });
    const [showPass, setShowPass] = useState(false);
    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <>
            <Head title="Sign In" />
            <style>{css}</style>
            <div className="auth-wrap">
                {/* Left */}
                <div className="auth-left">
                    <div className="blob1" /><div className="blob2" />
                    <div className="auth-left-inner">
                        <div className="auth-logo-box"><span style={{fontSize:'28px'}}>🎓</span></div>
                        <h1 className="auth-left-title">Student Management<br/>System</h1>
                        <p className="auth-left-sub">A smart and simple solution to manage students, track performance and organise academic data efficiently.</p>
                        <div className="books-wrap">
                            <div className="book b1"/><div className="book b2"/><div className="book b3"/>
                            <span style={{position:'absolute',bottom:-4,right:0,fontSize:'36px'}}>🪴</span>
                        </div>
                        <div className="dot-grid">{[...Array(15)].map((_,i)=><div key={i} className="dot"/>)}</div>
                    </div>
                </div>
                {/* Right */}
                <div className="auth-right">
                    <div className="auth-card">
                        <div className="auth-card-icon"><span style={{fontSize:'26px'}}>🎓</span></div>
                        <h2 className="auth-card-title">Welcome Back! 👋</h2>
                        <p className="auth-card-sub">Sign in to continue to your account</p>

                        {status && <div className="flash-ok">✅ {status}</div>}

                        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'18px'}}>
                            <div className="fld">
                                <label className="fld-lbl">Email Address</label>
                                <div className="fld-wrap">
                                    <span className="fld-ico">✉️</span>
                                    <input type="email" className={`fld-in ${errors.email?'err':''}`}
                                        value={data.email} onChange={e=>setData('email',e.target.value)}
                                        placeholder="you@example.com" autoFocus />
                                </div>
                                {errors.email && <div className="fld-err">⚠ {errors.email}</div>}
                            </div>

                            <div className="fld">
                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                                    <label className="fld-lbl" style={{margin:0}}>Password</label>
                                    {canResetPassword && <Link href={route('password.request')} className="forgot-link">Forgot password?</Link>}
                                </div>
                                <div className="fld-wrap">
                                    <span className="fld-ico">🔒</span>
                                    <input type={showPass?'text':'password'} className={`fld-in pr ${errors.password?'err':''}`}
                                        value={data.password} onChange={e=>setData('password',e.target.value)}
                                        placeholder="••••••••••••" />
                                    <button type="button" className="eye-btn" onClick={()=>setShowPass(!showPass)}>
                                        {showPass?'🙈':'👁️'}
                                    </button>
                                </div>
                                {errors.password && <div className="fld-err">⚠ {errors.password}</div>}
                            </div>

                            <label className="remember-row">
                                <input type="checkbox" className="remember-chk" checked={data.remember} onChange={e=>setData('remember',e.target.checked)} />
                                <span style={{fontSize:'13px',color:'#64748b'}}>Remember me</span>
                            </label>

                            <button type="submit" className="auth-btn" disabled={processing}>
                                {processing ? '⏳ Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="auth-switch">Don't have an account? <Link href={route('register')} className="auth-switch-link">Create one</Link></p>
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
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

.auth-wrap{display:flex;min-height:100vh;background:linear-gradient(135deg,#1a237e 0%,#283593 40%,#4a148c 100%);}

.auth-left{flex:1;display:flex;align-items:center;justify-content:center;padding:48px;position:relative;overflow:hidden;}
.blob1{position:absolute;top:-100px;right:-100px;width:340px;height:340px;border-radius:50%;background:rgba(255,255,255,0.06);}
.blob2{position:absolute;bottom:-80px;left:-60px;width:260px;height:260px;border-radius:50%;background:rgba(255,255,255,0.04);}
.auth-left-inner{position:relative;max-width:380px;color:#fff;}
.auth-logo-box{width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:16px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;border:1px solid rgba(255,255,255,0.2);animation:float 4s ease-in-out infinite;}
.auth-left-title{font-size:30px;font-weight:900;line-height:1.2;margin-bottom:16px;letter-spacing:-.3px;}
.auth-left-sub{font-size:14px;opacity:.8;line-height:1.75;margin-bottom:36px;}
.books-wrap{position:relative;height:110px;margin-bottom:28px;}
.book{position:absolute;border-radius:5px;bottom:0;}
.b1{width:88px;height:78px;background:linear-gradient(135deg,#42a5f5,#1565c0);left:20px;transform:rotate(-8deg);box-shadow:0 6px 16px rgba(0,0,0,0.3);}
.b2{width:88px;height:92px;background:linear-gradient(135deg,#66bb6a,#2e7d32);left:64px;transform:rotate(2deg);box-shadow:0 6px 16px rgba(0,0,0,0.3);}
.b3{width:80px;height:72px;background:linear-gradient(135deg,#ffa726,#e65100);left:112px;transform:rotate(10deg);box-shadow:0 6px 16px rgba(0,0,0,0.3);}
.dot-grid{display:flex;flex-wrap:wrap;gap:7px;width:130px;}
.dot{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.28);}

.auth-right{width:100%;max-width:480px;background:#eef0fb;display:flex;align-items:center;justify-content:center;padding:40px 32px;}
.auth-card{background:#fff;border-radius:20px;padding:40px 36px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.14);animation:fadeUp .5s ease both;}
.auth-card-icon{width:56px;height:56px;background:linear-gradient(135deg,#e8eaf6,#c5cae9);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
.auth-card-title{text-align:center;font-size:22px;font-weight:800;color:#1a237e;margin-bottom:5px;}
.auth-card-sub{text-align:center;font-size:13px;color:#94a3b8;margin-bottom:28px;}
.flash-ok{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 14px;font-size:13px;color:#166534;margin-bottom:16px;}

.fld{display:flex;flex-direction:column;}
.fld-lbl{font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;}
.fld-wrap{position:relative;}
.fld-ico{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.fld-in{width:100%;padding:11px 14px 11px 40px;border:1.5px solid #e8eaf6;border-radius:10px;font-size:14px;color:#1a237e;background:#fafafa;outline:none;transition:all .2s;font-family:'Inter',sans-serif;}
.fld-in:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.12);}
.fld-in.err{border-color:#ef4444;background:#fff5f5;}
.fld-in.pr{padding-right:44px;}
.eye-btn{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:#94a3b8;}
.fld-err{font-size:11px;color:#ef4444;margin-top:4px;}
.forgot-link{font-size:12px;color:#5c6bc0;font-weight:500;text-decoration:none;}
.forgot-link:hover{text-decoration:underline;}

.remember-row{display:flex;align-items:center;gap:8px;cursor:pointer;}
.remember-chk{width:15px;height:15px;accent-color:#5c6bc0;cursor:pointer;}

.auth-btn{width:100%;padding:13px;border:none;border-radius:10px;background:linear-gradient(135deg,#3949ab,#5c6bc0);color:#fff;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(57,73,171,0.4);transition:all .22s;font-family:'Inter',sans-serif;letter-spacing:.2px;}
.auth-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(57,73,171,0.5);}
.auth-btn:disabled{opacity:.6;cursor:not-allowed;transform:none;}

.auth-switch{text-align:center;font-size:13px;color:#94a3b8;margin-top:20px;}
.auth-switch-link{color:#5c6bc0;font-weight:700;text-decoration:none;}
.auth-switch-link:hover{text-decoration:underline;}

@media(max-width:768px){.auth-left{display:none;}.auth-right{max-width:100%;padding:24px 16px;}}
`;
