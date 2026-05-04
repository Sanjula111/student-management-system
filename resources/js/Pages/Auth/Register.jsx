import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => { e.preventDefault(); post(route('register')); };

    const strength = (() => {
        const p = data.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    })();
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

    return (
        <>
            <Head title="Create Account" />
            <style>{css}</style>
            <div className="reg-wrapper">
                {/* ── Left panel ── */}
                <div className="reg-left">
                    <div className="reg-blob1" /><div className="reg-blob2" />
                    <div className="reg-left-content">
                        <h1 className="reg-left-title">Create Your<br />Account 🚀</h1>
                        <p className="reg-left-sub">Join our platform and start managing students with ease and efficiency.</p>

                        <div className="reg-features">
                            {[
                                { icon: '🔒', title: 'Secure & Reliable', sub: 'Your data is safe and encrypted' },
                                { icon: '✏️', title: 'Easy to Use', sub: 'Simple interface for everyone' },
                                { icon: '⏰', title: 'Save Time', sub: 'Manage everything in one place' },
                            ].map(f => (
                                <div key={f.title} className="reg-feature-item">
                                    <div className="reg-feature-icon">{f.icon}</div>
                                    <div>
                                        <div className="reg-feature-title">{f.title}</div>
                                        <div className="reg-feature-sub">{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Person illustration */}
                        <div className="reg-illustration">
                            <div className="person-figure">
                                <div className="person-head" />
                                <div className="person-body">
                                    <div className="laptop-screen">
                                        <div className="screen-line" /><div className="screen-line" /><div className="screen-line short" />
                                    </div>
                                </div>
                                <div className="desk-plant">🪴</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right panel ── */}
                <div className="reg-right">
                    <div className="reg-card">
                        <div className="reg-card-icon"><span>👤</span></div>
                        <h2 className="reg-card-title">Create Account</h2>
                        <p className="reg-card-sub">Fill in the details to get started</p>

                        <form onSubmit={submit} className="reg-form">
                            {/* Full name */}
                            <div className="field-group">
                                <label className="field-label">Full Name</label>
                                <div className="field-wrap">
                                    <span className="field-icon">👤</span>
                                    <input type="text" className={`field-input ${errors.name ? 'is-error' : ''}`}
                                        value={data.name} onChange={e => setData('name', e.target.value)}
                                        placeholder="Enter your full name" autoFocus />
                                </div>
                                {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className="field-group">
                                <label className="field-label">Email Address</label>
                                <div className="field-wrap">
                                    <span className="field-icon">✉️</span>
                                    <input type="email" className={`field-input ${errors.email ? 'is-error' : ''}`}
                                        value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="Enter your email" />
                                </div>
                                {errors.email && <span className="field-error">⚠ {errors.email}</span>}
                            </div>

                            {/* Password + Confirm — side by side */}
                            <div className="two-col">
                                <div className="field-group">
                                    <label className="field-label">Password</label>
                                    <div className="field-wrap">
                                        <span className="field-icon">🔒</span>
                                        <input type={showPass ? 'text' : 'password'}
                                            className={`field-input pr-eye ${errors.password ? 'is-error' : ''}`}
                                            value={data.password} onChange={e => setData('password', e.target.value)}
                                            placeholder="Create a password" />
                                        <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                    {errors.password && <span className="field-error">⚠ {errors.password}</span>}
                                </div>

                                <div className="field-group">
                                    <label className="field-label">Confirm Password</label>
                                    <div className="field-wrap">
                                        <span className="field-icon">🔐</span>
                                        <input type={showConfirm ? 'text' : 'password'}
                                            className={`field-input pr-eye ${errors.password_confirmation ? 'is-error' : ''}`}
                                            value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm your password" />
                                        <button type="button" className="eye-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Strength bar */}
                            {data.password && (
                                <div className="strength-section">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '11px', color: '#64748b' }}>Password strength:</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
                                    </div>
                                    <div className="strength-track">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="strength-seg" style={{ background: i <= strength ? strengthColors[strength] : '#e2e8f0' }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Match indicator */}
                            {data.password_confirmation && (
                                <div style={{ fontSize: '12px', fontWeight: 600, color: data.password === data.password_confirmation ? '#22c55e' : '#ef4444' }}>
                                    {data.password === data.password_confirmation ? '✅ Passwords match' : '❌ Passwords do not match'}
                                </div>
                            )}

                            <button type="submit" className="reg-submit-btn" disabled={processing}>
                                {processing ? '⏳ Creating...' : 'Register'}
                            </button>
                        </form>

                        <p className="reg-switch-text">
                            Already have an account? <Link href={route('login')} className="reg-switch-link">Sign in</Link>
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

.reg-wrapper{
  display:flex;min-height:100vh;
  background:linear-gradient(135deg,#2d1b8e 0%,#4527a0 40%,#9c27b0 100%);
}

.reg-left{
  flex:1;display:flex;align-items:center;justify-content:center;
  padding:48px;position:relative;overflow:hidden;
}
.reg-blob1{position:absolute;top:-100px;right:-100px;width:350px;height:350px;border-radius:50%;background:rgba(255,255,255,0.06);}
.reg-blob2{position:absolute;bottom:-80px;left:-60px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,0.04);}

.reg-left-content{position:relative;max-width:400px;color:#fff;}
.reg-left-title{font-size:36px;font-weight:900;line-height:1.2;margin-bottom:12px;}
.reg-left-sub{font-size:14px;opacity:0.8;line-height:1.75;margin-bottom:32px;}

.reg-features{display:flex;flex-direction:column;gap:18px;margin-bottom:36px;}
.reg-feature-item{display:flex;align-items:flex-start;gap:14px;background:rgba(255,255,255,0.1);border-radius:12px;padding:14px 16px;backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.15);}
.reg-feature-icon{font-size:20px;flex-shrink:0;margin-top:1px;}
.reg-feature-title{font-size:14px;font-weight:700;margin-bottom:2px;}
.reg-feature-sub{font-size:12px;opacity:0.75;}

/* Illustration */
.reg-illustration{display:flex;justify-content:center;}
.person-figure{position:relative;width:160px;height:130px;}
.person-head{width:34px;height:34px;border-radius:50%;background:#ffb74d;position:absolute;top:0;left:50%;transform:translateX(-50%);}
.person-body{
  width:120px;height:70px;background:linear-gradient(135deg,#5c6bc0,#7986cb);
  border-radius:12px 12px 6px 6px;position:absolute;bottom:0;left:50%;transform:translateX(-50%);
  display:flex;align-items:center;justify-content:center;
}
.laptop-screen{background:#1a237e;width:80px;height:46px;border-radius:6px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;}
.screen-line{height:4px;background:rgba(255,255,255,0.5);border-radius:2px;}
.screen-line.short{width:50%;}
.desk-plant{position:absolute;right:-20px;bottom:0;font-size:32px;}

/* Right */
.reg-right{
  width:100%;max-width:520px;background:#f0f2ff;
  display:flex;align-items:center;justify-content:center;
  padding:32px;overflow-y:auto;
}
.reg-card{background:#fff;border-radius:20px;padding:36px 32px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.12);}
.reg-card-icon{width:52px;height:52px;background:linear-gradient(135deg,#e8eaf6,#c5cae9);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin:0 auto 16px;}
.reg-card-title{text-align:center;font-size:21px;font-weight:800;color:#1a1a2e;margin-bottom:4px;}
.reg-card-sub{text-align:center;font-size:13px;color:#94a3b8;margin-bottom:24px;}

.reg-form{display:flex;flex-direction:column;gap:16px;}
.field-group{display:flex;flex-direction:column;gap:5px;}
.field-label{font-size:12px;font-weight:600;color:#374151;}
.field-wrap{position:relative;}
.field-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:14px;z-index:1;}
.field-input{
  width:100%;padding:10px 13px 10px 38px;
  border:1.5px solid #e8eaf6;border-radius:9px;
  font-size:13px;color:#1a1a2e;background:#fafafa;
  outline:none;transition:all 0.2s;font-family:'Inter',sans-serif;
}
.field-input:focus{border-color:#5c6bc0;background:#fff;box-shadow:0 0 0 3px rgba(92,107,192,0.1);}
.field-input.is-error{border-color:#ef4444;background:#fff5f5;}
.field-input.pr-eye{padding-right:40px;}
.eye-toggle{position:absolute;right:11px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:14px;color:#94a3b8;}
.field-error{font-size:11px;color:#ef4444;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

.strength-section{margin-top:-4px;}
.strength-track{display:flex;gap:4px;height:5px;}
.strength-seg{flex:1;border-radius:3px;transition:background 0.3s;}

.reg-submit-btn{
  width:100%;padding:12px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#3949ab,#5c6bc0);
  color:#fff;font-size:14px;font-weight:700;
  cursor:pointer;letter-spacing:0.3px;margin-top:4px;
  box-shadow:0 4px 14px rgba(57,73,171,0.4);
  transition:all 0.2s;font-family:'Inter',sans-serif;
}
.reg-submit-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(57,73,171,0.5);}
.reg-submit-btn:disabled{opacity:0.6;cursor:not-allowed;transform:none;}

.reg-switch-text{text-align:center;font-size:13px;color:#94a3b8;margin-top:16px;}
.reg-switch-link{color:#5c6bc0;font-weight:700;text-decoration:none;}

@media(max-width:900px){
  .reg-left{display:none;}
  .reg-right{max-width:100%;padding:24px 16px;}
  .two-col{grid-template-columns:1fr;}
}
`;
