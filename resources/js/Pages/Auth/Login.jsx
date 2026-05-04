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
            <div className="auth-wrapper">
                {/* ── Left Panel ── */}
                <div className="auth-left">
                    <div className="auth-left-blob1" />
                    <div className="auth-left-blob2" />
                    <div className="auth-left-content">
                        <div className="auth-logo-box">
                            <span>🎓</span>
                        </div>
                        <h1 className="auth-left-title">Student Management<br />System</h1>
                        <p className="auth-left-sub">A smart and simple solution to manage students, track performance and organize academic data efficiently.</p>
                        <div className="auth-illustration">
                            <div className="books-stack">
                                <div className="book book-1" />
                                <div className="book book-2" />
                                <div className="book book-3" />
                                <div className="plant">🪴</div>
                            </div>
                        </div>
                        <div className="auth-dots">
                            {[...Array(12)].map((_, i) => <div key={i} className="dot-grid" />)}
                        </div>
                    </div>
                </div>

                {/* ── Right Panel (form) ── */}
                <div className="auth-right">
                    <div className="auth-card">
                        <div className="auth-card-icon">
                            <span>🎓</span>
                        </div>
                        <h2 className="auth-card-title">Welcome Back! 👋</h2>
                        <p className="auth-card-sub">Sign in to continue to your account</p>

                        {status && <div className="flash-success">✅ {status}</div>}

                        <form onSubmit={submit} className="auth-form">
                            <div className="field-group">
                                <label className="field-label">Email Address</label>
                                <div className="field-wrap">
                                    <span className="field-icon">✉️</span>
                                    <input
                                        type="email"
                                        className={`field-input ${errors.email ? 'is-error' : ''}`}
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="myselfwebsites@gmail.com"
                                        autoFocus
                                    />
                                </div>
                                {errors.email && <span className="field-error">⚠ {errors.email}</span>}
                            </div>

                            <div className="field-group">
                                <div className="field-label-row">
                                    <label className="field-label">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="forgot-link">Forgot password?</Link>
                                    )}
                                </div>
                                <div className="field-wrap">
                                    <span className="field-icon">🔒</span>
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        className={`field-input pr-eye ${errors.password ? 'is-error' : ''}`}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="••••••••••••"
                                    />
                                    <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                {errors.password && <span className="field-error">⚠ {errors.password}</span>}
                            </div>

                            <label className="remember-row">
                                <input type="checkbox" className="remember-check" checked={data.remember} onChange={e => setData('remember', e.target.checked)} />
                                <span className="remember-label">Remember me</span>
                            </label>

                            <button type="submit" className="auth-submit-btn" disabled={processing}>
                                {processing ? '⏳ Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className="auth-switch-text">
                            Don't have an account? <Link href={route('register')} className="auth-switch-link">Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;}

.auth-wrapper{
  display:flex;min-height:100vh;
  background:linear-gradient(135deg,#2d1b8e 0%,#4527a0 40%,#7b1fa2 100%);
}

/* Left */
.auth-left{
  flex:1;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;padding:48px;
}
.auth-left-blob1{
  position:absolute;top:-80px;right:-80px;
  width:300px;height:300px;border-radius:50%;
  background:rgba(255,255,255,0.07);
}
.auth-left-blob2{
  position:absolute;bottom:-100px;left:-60px;
  width:250px;height:250px;border-radius:50%;
  background:rgba(255,255,255,0.05);
}
.auth-left-content{position:relative;max-width:380px;color:#fff;}
.auth-logo-box{
  width:64px;height:64px;background:rgba(255,255,255,0.15);
  border-radius:16px;display:flex;align-items:center;
  justify-content:center;font-size:30px;margin-bottom:28px;
  backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.2);
}
.auth-left-title{font-size:30px;font-weight:800;line-height:1.25;margin-bottom:16px;}
.auth-left-sub{font-size:14px;opacity:0.8;line-height:1.75;margin-bottom:40px;}

.books-stack{position:relative;height:120px;margin-bottom:24px;}
.book{position:absolute;border-radius:4px;bottom:0;}
.book-1{width:90px;height:80px;background:linear-gradient(135deg,#42a5f5,#1976d2);left:20px;transform:rotate(-8deg);}
.book-2{width:90px;height:90px;background:linear-gradient(135deg,#66bb6a,#388e3c);left:60px;transform:rotate(2deg);}
.book-3{width:80px;height:70px;background:linear-gradient(135deg,#ffa726,#f57c00);left:110px;transform:rotate(10deg);}
.plant{position:absolute;bottom:-4px;right:0;font-size:40px;}

.auth-dots{display:flex;flex-wrap:wrap;gap:8px;width:120px;margin-top:20px;}
.dot-grid{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.3);}

/* Right */
.auth-right{
  width:100%;max-width:480px;background:#f0f2ff;
  display:flex;align-items:center;justify-content:center;
  padding:40px 32px;
}
.auth-card{
  background:#fff;border-radius:20px;
  padding:40px 36px;width:100%;
  box-shadow:0 20px 60px rgba(0,0,0,0.12);
}
.auth-card-icon{
  width:54px;height:54px;background:linear-gradient(135deg,#ede7f6,#d1c4e9);
  border-radius:16px;display:flex;align-items:center;
  justify-content:center;font-size:26px;margin:0 auto 20px;
}
.auth-card-title{text-align:center;font-size:22px;font-weight:800;color:#1a1a2e;margin-bottom:6px;}
.auth-card-sub{text-align:center;font-size:13px;color:#94a3b8;margin-bottom:28px;}

.flash-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 14px;font-size:13px;color:#166534;margin-bottom:16px;}

.auth-form{display:flex;flex-direction:column;gap:18px;}
.field-group{display:flex;flex-direction:column;gap:6px;}
.field-label{font-size:13px;font-weight:600;color:#374151;}
.field-label-row{display:flex;align-items:center;justify-content:space-between;}
.forgot-link{font-size:12px;color:#5c6bc0;font-weight:500;text-decoration:none;}
.forgot-link:hover{text-decoration:underline;}
.field-wrap{position:relative;}
.field-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;z-index:1;}
.field-input{
  width:100%;padding:11px 14px 11px 40px;
  border:1.5px solid #e8eaf6;border-radius:10px;
  font-size:14px;color:#1a1a2e;background:#fafafa;
  outline:none;transition:all 0.2s;font-family:'Inter',sans-serif;
}
.field-input:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.field-input.is-error{border-color:#ef4444;background:#fff5f5;}
.field-input.pr-eye{padding-right:44px;}
.eye-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:15px;color:#94a3b8;}
.field-error{font-size:11px;color:#ef4444;}

.remember-row{display:flex;align-items:center;gap:8px;cursor:pointer;}
.remember-check{width:15px;height:15px;accent-color:#5c6bc0;cursor:pointer;}
.remember-label{font-size:13px;color:#64748b;}

.auth-submit-btn{
  width:100%;padding:13px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#3949ab,#5c6bc0);
  color:#fff;font-size:15px;font-weight:700;
  cursor:pointer;letter-spacing:0.3px;
  box-shadow:0 4px 14px rgba(57,73,171,0.4);
  transition:all 0.2s;font-family:'Inter',sans-serif;
}
.auth-submit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(57,73,171,0.5);}
.auth-submit-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}

.auth-switch-text{text-align:center;font-size:13px;color:#94a3b8;margin-top:20px;}
.auth-switch-link{color:#5c6bc0;font-weight:700;text-decoration:none;}
.auth-switch-link:hover{text-decoration:underline;}

@media(max-width:768px){
  .auth-left{display:none;}
  .auth-right{max-width:100%;padding:24px 16px;}
}
`;
