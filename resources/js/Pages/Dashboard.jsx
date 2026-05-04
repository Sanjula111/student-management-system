import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function Dashboard() {
    const { auth, stats } = usePage().props;
    const lineRef = useRef();
    const donutRef = useRef();

    const total    = stats?.total    ?? 0;
    const active   = stats?.active   ?? 0;
    const inactive = stats?.inactive ?? 0;
    const newMonth = stats?.new_month ?? 0;

    // Draw line chart
    useEffect(() => {
        const canvas = lineRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const totalPts  = [180,210,190,240,200,260,245,270,255,280,260,290];
        const activePts = [140,165,150,195,160,210,200,225,210,235,215,245];
        const maxV = 320, pad = { top:20, bottom:30, left:30, right:20 };
        const gW = W - pad.left - pad.right;
        const gH = H - pad.top  - pad.bottom;
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        // Grid lines
        ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 1;
        [0,1,2,3,4].forEach(i => {
            const y = pad.top + (gH / 4) * i;
            ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
        });

        // X labels
        ctx.fillStyle = '#94a3b8'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
        months.forEach((m, i) => {
            const x = pad.left + (gW / 11) * i;
            ctx.fillText(m, x, H - 6);
        });

        // Draw line function
        const drawLine = (pts, color, dash = false) => {
            ctx.strokeStyle = color; ctx.lineWidth = 2.5;
            ctx.setLineDash(dash ? [5, 4] : []);
            ctx.beginPath();
            pts.forEach((v, i) => {
                const x = pad.left + (gW / 11) * i;
                const y = pad.top + gH - (v / maxV) * gH;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.stroke();
            // Dots
            ctx.setLineDash([]);
            pts.forEach((v, i) => {
                const x = pad.left + (gW / 11) * i;
                const y = pad.top + gH - (v / maxV) * gH;
                ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = color; ctx.fill();
                ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
            });
        };

        // Area fill for total
        ctx.beginPath();
        totalPts.forEach((v, i) => {
            const x = pad.left + (gW / 11) * i;
            const y = pad.top + gH - (v / maxV) * gH;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.lineTo(W - pad.right, H - pad.bottom);
        ctx.lineTo(pad.left, H - pad.bottom);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom);
        grad.addColorStop(0, 'rgba(57,73,171,0.15)');
        grad.addColorStop(1, 'rgba(57,73,171,0.0)');
        ctx.fillStyle = grad; ctx.fill();

        drawLine(totalPts, '#3949ab');
        drawLine(activePts, '#26a69a', true);
    }, []);

    // Draw donut
    useEffect(() => {
        const canvas = donutRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2, r = 75, innerR = 50;
        ctx.clearRect(0, 0, W, H);

        const pct = total > 0 ? active / total : 0.79;
        const startAngle = -Math.PI / 2;

        // Background ring
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#fecdd3'; ctx.lineWidth = r - innerR; ctx.stroke();

        // Active arc
        ctx.beginPath(); ctx.arc(cx, cy, r, startAngle, startAngle + (pct * Math.PI * 2));
        ctx.strokeStyle = '#3949ab'; ctx.lineWidth = r - innerR;
        ctx.lineCap = 'round'; ctx.stroke();

        // Center text
        ctx.fillStyle = '#1a1f37'; ctx.font = 'bold 20px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(active || '203', cx, cy - 8);
        ctx.font = '11px Inter'; ctx.fillStyle = '#94a3b8';
        ctx.fillText('Active', cx, cy + 12);
    }, [active, total]);

    const statCards = [
        { label: 'Total Students', value: total || 256, sub: 'All registered students', trend: '+12 this month', up: true, color: '#3949ab', bg: '#eef0fb', icon: '👥' },
        { label: 'Active Students', value: active || 203, sub: 'Currently active students', trend: '+8 this month', up: true, color: '#00897b', bg: '#e0f2f1', icon: '✅' },
        { label: 'Inactive Students', value: inactive || 53, sub: 'Currently inactive students', trend: '-4 this month', up: false, color: '#e53935', bg: '#fce4ec', icon: '⏸' },
        { label: 'New This Month', value: newMonth || 18, sub: 'Newly registered students', trend: '+18 this month', up: true, color: '#1e88e5', bg: '#e3f2fd', icon: '🎓' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <style>{dashCss}</style>

            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-sub">Welcome back! Here's what's happening with your students.</p>
            </div>

            {/* Stat cards */}
            <div className="stat-grid">
                {statCards.map(s => (
                    <div key={s.label} className="stat-card-d">
                        <div className="stat-card-left">
                            <div className="stat-card-icon-d" style={{ background: s.bg }}>
                                <span>{s.icon}</span>
                            </div>
                        </div>
                        <div className="stat-card-right">
                            <div className="stat-card-label">{s.label}</div>
                            <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="stat-card-sub">{s.sub}</div>
                            <div className={`stat-card-trend ${s.up ? 'up' : 'down'}`}>
                                {s.up ? '↑' : '↓'} {s.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div className="charts-row">
                {/* Line chart */}
                <div className="chart-card wide">
                    <div className="chart-card-header">
                        <div>
                            <div className="chart-card-title">Students Overview</div>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                <span className="chart-legend"><span style={{ background: '#3949ab' }} />Total Students</span>
                                <span className="chart-legend"><span style={{ background: '#26a69a', width: '20px', height: '2px', border: 'none', borderTop: '2px dashed #26a69a', display: 'inline-block', verticalAlign: 'middle' }} />Active Students</span>
                            </div>
                        </div>
                        <select className="chart-select"><option>This Year</option></select>
                    </div>
                    <canvas ref={lineRef} width={580} height={200} style={{ width: '100%', height: '200px' }} />
                </div>

                {/* Donut */}
                <div className="chart-card narrow">
                    <div className="chart-card-title" style={{ marginBottom: '16px' }}>Active vs Inactive</div>
                    <canvas ref={donutRef} width={200} height={200} style={{ width: '180px', height: '180px', margin: '0 auto', display: 'block' }} />
                    <div className="donut-legend">
                        <div className="donut-legend-item">
                            <div className="donut-dot" style={{ background: '#3949ab' }} />
                            <span>Active ({total > 0 ? Math.round((active / total) * 100) : 79}%)</span>
                        </div>
                        <div className="donut-legend-item">
                            <div className="donut-dot" style={{ background: '#fecdd3' }} />
                            <span>Inactive ({total > 0 ? Math.round((inactive / total) * 100) : 21}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-card">
                <div className="chart-card-title" style={{ marginBottom: '16px' }}>Quick Actions</div>
                <div className="qa-grid">
                    <Link href={route('students.create')} className="qa-btn green">
                        <span className="qa-icon" style={{ background: '#e8f5e9', color: '#388e3c' }}>+</span>
                        <div><div className="qa-label">Add New Student</div><div className="qa-sub">Register a new student</div></div>
                    </Link>
                    <Link href={route('students.index')} className="qa-btn blue">
                        <span className="qa-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>👥</span>
                        <div><div className="qa-label">View All Students</div><div className="qa-sub">Browse all students</div></div>
                    </Link>
                    <div className="qa-btn orange" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                        <span className="qa-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>📊</span>
                        <div><div className="qa-label">Generate Report</div><div className="qa-sub">View detailed reports</div></div>
                    </div>
                    <div className="qa-btn purple" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                        <span className="qa-icon" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>⬇</span>
                        <div><div className="qa-label">Export Data</div><div className="qa-sub">Download student data</div></div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const dashCss = `
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;}
.stat-card-d{background:#fff;border-radius:14px;padding:20px;display:flex;gap:16px;align-items:flex-start;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);transition:box-shadow 0.2s;}
.stat-card-d:hover{box-shadow:0 6px 20px rgba(0,0,0,0.1);}
.stat-card-icon-d{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.stat-card-label{font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}
.stat-card-value{font-size:28px;font-weight:900;line-height:1;margin-bottom:4px;}
.stat-card-sub{font-size:11px;color:#94a3b8;margin-bottom:8px;}
.stat-card-trend{font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;display:inline-block;}
.stat-card-trend.up{background:#f0fdf4;color:#16a34a;}
.stat-card-trend.down{background:#fef2f2;color:#dc2626;}

.charts-row{display:grid;grid-template-columns:1fr 280px;gap:16px;margin-bottom:24px;}
.chart-card{background:#fff;border-radius:14px;padding:22px;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.chart-card.wide{}
.chart-card.narrow{display:flex;flex-direction:column;align-items:stretch;}
.chart-card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
.chart-card-title{font-size:15px;font-weight:800;color:#1a1f37;}
.chart-legend{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:#64748b;}
.chart-legend span{display:inline-block;width:24px;height:3px;border-radius:2px;}
.chart-select{border:1px solid #eef0f7;border-radius:8px;padding:5px 10px;font-size:12px;color:#64748b;outline:none;background:#f8fafc;cursor:pointer;}

.donut-legend{margin-top:16px;display:flex;flex-direction:column;gap:8px;padding:0 16px;}
.donut-legend-item{display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;font-weight:500;}
.donut-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}

.quick-actions-card{background:#fff;border-radius:14px;padding:22px;border:1px solid #eef0f7;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.qa-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;}
.qa-btn{
  display:flex;align-items:center;gap:12px;padding:14px 16px;
  border-radius:12px;border:1px solid #eef0f7;
  text-decoration:none;background:#fafbff;
  transition:all 0.2s;cursor:pointer;
}
.qa-btn:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,0.1);}
.qa-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;flex-shrink:0;}
.qa-label{font-size:13px;font-weight:700;color:#1a1f37;margin-bottom:2px;}
.qa-sub{font-size:11px;color:#94a3b8;}

@media(max-width:900px){
  .charts-row{grid-template-columns:1fr;}
}
@media(max-width:600px){
  .stat-grid{grid-template-columns:1fr 1fr;}
}
`;
