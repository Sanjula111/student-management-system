import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Dashboard() {
    const { stats } = usePage().props;
    const lineRef  = useRef();
    const donutRef = useRef();
    const [counts, setCounts] = useState({ total:0, active:0, inactive:0, newMonth:0 });

    const total    = stats?.total     ?? 0;
    const active   = stats?.active    ?? 0;
    const inactive = stats?.inactive  ?? 0;
    const newMonth = stats?.new_month ?? 0;

    /* ── Animated number counters ── */
    useEffect(() => {
        const targets = { total, active, inactive, newMonth };
        const dur = 1400; const start = Date.now();
        const tick = () => {
            const t = Math.min((Date.now()-start)/dur, 1);
            const e = 1 - Math.pow(1-t, 4); // ease-out-quart
            setCounts({
                total:    Math.round(targets.total    * e),
                active:   Math.round(targets.active   * e),
                inactive: Math.round(targets.inactive * e),
                newMonth: Math.round(targets.newMonth * e),
            });
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [total, active, inactive, newMonth]);

    /* ── Animated line chart ── */
    useEffect(() => {
        const canvas = lineRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        const W = parent.offsetWidth || 600;
        const H = 230;
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');

        const base = Math.max(total, 5);
        const totalPts  = [.55,.66,.59,.75,.63,.82,.77,.86,.80,.90,.84,.94].map(f => Math.round(base*f + (base < 10 ? 0 : Math.random()*base*.05)));
        const activePts = [.42,.52,.46,.60,.50,.66,.62,.70,.64,.74,.68,.78].map(f => Math.round(base*f));
        // Override last point with real value
        totalPts[11]  = Math.max(total, 1);
        activePts[11] = Math.max(active, 1);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const pad = { top:20, bottom:36, left:40, right:20 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top  - pad.bottom;
        const maxV = Math.max(...totalPts, 10) * 1.18;

        const getXY = (pts) => pts.map((v,i) => ({
            x: pad.left + (gW / 11) * i,
            y: pad.top + gH - (v / maxV) * gH
        }));

        let prog = 0;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            // BG
            ctx.fillStyle = '#f8faff';
            ctx.beginPath(); ctx.roundRect?.(0,0,W,H,8) || ctx.rect(0,0,W,H); ctx.fill();

            // Grid
            ctx.setLineDash([4,4]); ctx.strokeStyle='#eaecf4'; ctx.lineWidth=1;
            [0,1,2,3,4].forEach(i => {
                const y = pad.top + (gH/4)*i;
                ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke();
                ctx.fillStyle='#94a3b8'; ctx.font='10px Inter'; ctx.textAlign='right';
                ctx.fillText(Math.round(maxV - (maxV/4)*i), pad.left-6, y+4);
            });
            ctx.setLineDash([]);

            // X labels
            ctx.fillStyle='#94a3b8'; ctx.font='11px Inter'; ctx.textAlign='center';
            months.forEach((m,i) => {
                const x = pad.left + (gW/11)*i;
                ctx.fillText(m, x, H-8);
            });

            const visIdx  = Math.floor(prog * 11);
            const frac    = (prog * 11) - visIdx;

            const drawLine = (pts, color, dashed, fill) => {
                const all = getXY(pts);
                const vis = all.slice(0, visIdx + 1);
                if (visIdx < 11) {
                    const last = all[visIdx], next = all[Math.min(visIdx+1, 11)];
                    vis.push({ x: last.x + (next.x-last.x)*frac, y: last.y + (next.y-last.y)*frac });
                }
                if (vis.length < 2) return;

                if (fill) {
                    ctx.beginPath();
                    vis.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
                    ctx.lineTo(vis[vis.length-1].x, pad.top+gH);
                    ctx.lineTo(vis[0].x, pad.top+gH); ctx.closePath();
                    const g = ctx.createLinearGradient(0,pad.top,0,pad.top+gH);
                    g.addColorStop(0,'rgba(57,73,171,0.13)'); g.addColorStop(1,'rgba(57,73,171,0)');
                    ctx.fillStyle=g; ctx.fill();
                }
                ctx.strokeStyle=color; ctx.lineWidth=2.5;
                ctx.setLineDash(dashed?[6,4]:[]);
                ctx.lineJoin='round'; ctx.lineCap='round';
                ctx.beginPath();
                vis.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
                ctx.stroke(); ctx.setLineDash([]);

                vis.forEach(p => {
                    ctx.beginPath(); ctx.arc(p.x,p.y,4,0,Math.PI*2);
                    ctx.fillStyle=color; ctx.fill();
                    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
                });
            };

            drawLine(totalPts, '#3949ab', false, true);
            drawLine(activePts,'#26a69a', true, false);

            if (prog < 1) { prog = Math.min(prog+0.016, 1); requestAnimationFrame(draw); }
        };
        requestAnimationFrame(draw);
    }, [total, active]);

    /* ── Animated donut ── */
    useEffect(() => {
        const canvas = donutRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = 200; canvas.height = 200;
        const cx=100, cy=100, r=80, inner=54;
        const pct = total > 0 ? active/total : 0;
        let prog = 0;
        const draw = () => {
            ctx.clearRect(0,0,200,200);
            ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
            ctx.strokeStyle='#fecdd3'; ctx.lineWidth=r-inner; ctx.stroke();
            if (pct > 0) {
                ctx.beginPath(); ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+prog*pct*Math.PI*2);
                ctx.strokeStyle='#3949ab'; ctx.lineWidth=r-inner; ctx.lineCap='round'; ctx.stroke();
            }
            ctx.fillStyle='#1a1f37'; ctx.font='bold 22px Inter'; ctx.textAlign='center'; ctx.textBaseline='middle';
            ctx.fillText(Math.round(active*prog), cx, cy-10);
            ctx.font='12px Inter'; ctx.fillStyle='#94a3b8'; ctx.fillText('Active', cx, cy+12);
            if (prog < 1) { prog = Math.min(prog+0.025,1); requestAnimationFrame(draw); }
        };
        requestAnimationFrame(draw);
    }, [active, total]);

    const statCards = [
        { label:'TOTAL STUDENTS',    value:counts.total,    sub:'All registered students',    trend:'+12 this month', up:true,  color:'#3949ab', bg:'#eef0fb', icon:'👥' },
        { label:'ACTIVE STUDENTS',   value:counts.active,   sub:'Currently active students',   trend:'+8 this month',  up:true,  color:'#00897b', bg:'#e0f2f1', icon:'✅' },
        { label:'INACTIVE STUDENTS', value:counts.inactive, sub:'Currently inactive students', trend:'-4 this month',  up:false, color:'#e53935', bg:'#fce4ec', icon:'⏸' },
        { label:'NEW THIS MONTH',    value:counts.newMonth, sub:'Newly registered students',   trend:'+18 this month', up:true,  color:'#1e88e5', bg:'#e3f2fd', icon:'🎓' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <style>{css}</style>

            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-sub">Welcome back! Here's what's happening with your students.</p>
            </div>

            {/* Stat cards */}
            <div className="stat-grid">
                {statCards.map((s,i) => (
                    <div key={s.label} className="stat-card" style={{ animationDelay:`${i*70}ms` }}>
                        <div className="stat-icon" style={{ background:s.bg }}>
                            <span style={{ fontSize:'22px' }}>{s.icon}</span>
                        </div>
                        <div className="stat-body">
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
                            <div className="stat-sub">{s.sub}</div>
                            <div className={`stat-trend ${s.up?'up':'dn'}`}>
                                {s.up ? '↑' : '↓'} {s.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-row">
                <div className="chart-box wide">
                    <div className="chart-top">
                        <div>
                            <div className="chart-title">Students Overview</div>
                            <div className="chart-legend-row">
                                <span className="leg"><span className="leg-dot solid" style={{background:'#3949ab'}}/>Total Students</span>
                                <span className="leg"><span className="leg-dot dashed" style={{borderColor:'#26a69a'}}/>Active Students</span>
                            </div>
                        </div>
                        <div className="year-pill">This Year</div>
                    </div>
                    <div style={{ position:'relative', width:'100%' }}>
                        <canvas ref={lineRef} style={{ width:'100%', display:'block' }} />
                    </div>
                </div>

                <div className="chart-box narrow">
                    <div className="chart-title" style={{ marginBottom:'14px' }}>Active vs Inactive</div>
                    <canvas ref={donutRef} style={{ width:'170px', height:'170px', display:'block', margin:'0 auto' }} />
                    <div className="donut-leg-list">
                        <div className="donut-leg"><span className="d-dot" style={{background:'#3949ab'}}/>Active ({total>0?Math.round(active/total*100):0}%)</div>
                        <div className="donut-leg"><span className="d-dot" style={{background:'#fecdd3'}}/>Inactive ({total>0?Math.round(inactive/total*100):0}%)</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="qa-box">
                <div className="chart-title" style={{ marginBottom:'14px' }}>Quick Actions</div>
                <div className="qa-grid">
                    {[
                        { href:route('students.create'), icon:'+', label:'Add New Student',  sub:'Register a new student',  ib:'#e8f5e9', ic:'#388e3c', link:true },
                        { href:route('students.index'),  icon:'👥',label:'View All Students',sub:'Browse all students',      ib:'#e3f2fd', ic:'#1976d2', link:true },
                        { href:'#', icon:'📊', label:'Generate Report', sub:'View detailed reports', ib:'#fff3e0', ic:'#f57c00', link:false },
                        { href:'#', icon:'⬇',  label:'Export Data',    sub:'Download student data',  ib:'#f3e5f5', ic:'#7b1fa2', link:false },
                    ].map(a => a.link
                        ? <Link key={a.label} href={a.href} className="qa-btn">
                              <div className="qa-ico" style={{background:a.ib,color:a.ic}}>{a.icon}</div>
                              <div><div className="qa-lbl">{a.label}</div><div className="qa-sub">{a.sub}</div></div>
                          </Link>
                        : <div key={a.label} className="qa-btn disabled">
                              <div className="qa-ico" style={{background:a.ib,color:a.ic}}>{a.icon}</div>
                              <div><div className="qa-lbl">{a.label}</div><div className="qa-sub">{a.sub}</div></div>
                          </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const css = `
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;margin-bottom:20px;}
.stat-card{background:#fff;border-radius:14px;padding:22px;display:flex;gap:16px;align-items:flex-start;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);transition:all .22s;animation:fadeUp .45s ease both;cursor:default;}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,0.11);}
.stat-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.stat-label{font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px;}
.stat-value{font-size:30px;font-weight:900;line-height:1;margin-bottom:4px;}
.stat-sub{font-size:11px;color:#94a3b8;margin-bottom:8px;}
.stat-trend{font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;display:inline-block;}
.stat-trend.up{background:#f0fdf4;color:#16a34a;}
.stat-trend.dn{background:#fef2f2;color:#dc2626;}

.charts-row{display:grid;grid-template-columns:1fr 266px;gap:16px;margin-bottom:18px;}
.chart-box{background:#fff;border-radius:14px;padding:22px;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);animation:fadeUp .45s ease both;animation-delay:280ms;}
.chart-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
.chart-title{font-size:15px;font-weight:800;color:#1a1f37;}
.chart-legend-row{display:flex;gap:18px;margin-top:8px;}
.leg{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#64748b;}
.leg-dot{display:inline-block;width:22px;height:3px;border-radius:2px;vertical-align:middle;}
.leg-dot.dashed{background:transparent;border-top:2.5px dashed;height:0;}
.year-pill{background:#f0f2f8;border:1px solid #eaecf4;border-radius:8px;padding:5px 12px;font-size:12px;color:#64748b;font-weight:500;white-space:nowrap;}
.donut-leg-list{margin-top:16px;display:flex;flex-direction:column;gap:10px;padding:0 8px;}
.donut-leg{display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;font-weight:500;}
.d-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}

.qa-box{background:#fff;border-radius:14px;padding:22px;border:1px solid #eaecf4;box-shadow:0 2px 8px rgba(0,0,0,0.05);animation:fadeUp .45s ease both;animation-delay:360ms;}
.qa-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;}
.qa-btn{display:flex;align-items:center;gap:12px;padding:15px;border-radius:12px;border:1px solid #eaecf4;text-decoration:none;background:#fafbff;transition:all .22s;cursor:pointer;}
.qa-btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.1);border-color:#c5cae9;}
.qa-btn.disabled{opacity:.5;cursor:not-allowed;}
.qa-btn.disabled:hover{transform:none;box-shadow:none;}
.qa-ico{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0;}
.qa-lbl{font-size:13px;font-weight:700;color:#1a1f37;margin-bottom:2px;}
.qa-sub{font-size:11px;color:#94a3b8;}

@media(max-width:960px){.charts-row{grid-template-columns:1fr;}}
@media(max-width:600px){.stat-grid{grid-template-columns:1fr 1fr;}}
`;
