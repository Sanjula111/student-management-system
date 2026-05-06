import { useState, useEffect, useRef } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';

/* ─── Inline SVG Icons (no extra deps) ─────────────────────────── */
const Icon = {
    chart:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    users:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    alert:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    spinner:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
    file:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    trend:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    back:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    star:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    pause:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    chevron:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
};

/* ─── Toast Notification ────────────────────────────────────────── */
function Toast({ type, message, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, []);
    return (
        <div style={{ animation: 'toastIn .4s cubic-bezier(.34,1.56,.64,1) forwards' }}
            className={`fixed top-5 right-5 z-[999] flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold max-w-sm
            ${type === 'success' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-red-500 to-rose-500'} text-white`}>
            <span className="w-5 h-5 flex-shrink-0">{type === 'success' ? Icon.check : Icon.alert}</span>
            {message}
            <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 text-xl leading-none">×</button>
        </div>
    );
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, colorClass, bgClass, icon, delay }) {
    return (
        <div style={{ animationDelay: `${delay}ms`, animation: 'fadeUp .55s ease forwards', opacity: 0 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
                    <p className={`text-3xl font-black tracking-tight ${colorClass}`}>{value ?? <span className="text-slate-200">—</span>}</p>
                    <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`w-5 h-5 ${colorClass}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Progress Bar ──────────────────────────────────────────────── */
function ProgressBar({ value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{pct}%</span>
        </div>
    );
}

/* ─── Empty State ───────────────────────────────────────────────── */
function EmptyPreview() {
    return (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 min-h-[520px] flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center border border-indigo-100">
                    <span className="w-9 h-9 text-indigo-300">{Icon.chart}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl flex items-center justify-center border-2 border-slate-100 shadow-sm">
                    <span className="w-3.5 h-3.5 text-slate-400">{Icon.file}</span>
                </div>
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-2">Report Preview</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
                Configure your filters on the left panel, then click <strong className="text-indigo-600">Generate Report</strong> to see a live preview before downloading.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                {['Date Range', 'Status Filter', 'Report Type', 'PDF Export'].map(t => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">{t}</span>
                ))}
            </div>
        </div>
    );
}

/* ─── Report Preview ────────────────────────────────────────────── */
function ReportPreview({ data, filters }) {
    const rate   = data.total > 0 ? Math.round((data.active   / data.total) * 100) : 0;
    const irrate = data.total > 0 ? Math.round((data.inactive / data.total) * 100) : 0;

    return (
        <div style={{ animation: 'fadeUp .4s ease forwards' }} className="space-y-4">
            {/* Gradient header */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-52 h-52 bg-white/5 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Report Generated</p>
                            <h2 className="text-xl font-black tracking-tight">Student Analytics Report</h2>
                        </div>
                        <span className="bg-white/15 border border-white/25 rounded-xl px-3 py-1.5 text-xs font-bold capitalize backdrop-blur-sm">
                            {filters?.report_type}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[['From', filters?.start_date], ['To', filters?.end_date], ['Status', filters?.status]].map(([l, v]) => (
                            <div key={l} className="bg-white/15 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-medium">
                                <span className="opacity-70">{l}: </span><span className="font-bold capitalize">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Three stat blocks */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label:'Total',    value: data.total,    color:'text-indigo-600', bg:'bg-indigo-50',  bar:'bg-indigo-500' },
                    { label:'Active',   value: data.active,   color:'text-emerald-600',bg:'bg-emerald-50', bar:'bg-emerald-500' },
                    { label:'Inactive', value: data.inactive, color:'text-rose-500',   bg:'bg-rose-50',    bar:'bg-rose-400' },
                ].map(({ label, value, color, bg, bar }) => (
                    <div key={label} className={`${bg} rounded-2xl p-4`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                        <p className={`text-3xl font-black ${color}`}>{value}</p>
                        <ProgressBar value={value} max={data.total} color={bar} />
                    </div>
                ))}
            </div>

            {/* Rate bar */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-700">Active Rate Overview</h3>
                    <div className="flex gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Active {rate}%</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Inactive {irrate}%</span>
                    </div>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-1000" style={{ width: `${rate}%` }} />
                    <div className="h-full bg-rose-400 transition-all duration-1000" style={{ width: `${irrate}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-300 mt-1.5 px-0.5">
                    <span>0%</span><span>50%</span><span>100%</span>
                </div>
            </div>

            {/* Student table */}
            {data.students?.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700">Student Records</h3>
                        <span className="text-xs bg-indigo-100 text-indigo-600 font-bold px-2.5 py-1 rounded-full">{data.students.length} records</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {['ID','Name','Age','Status','Registered'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.students.slice(0,10).map(s => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-indigo-50/40 transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-slate-400">#{s.id}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                                                    {s.name?.[0]??'?'}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-slate-500">{s.age}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                                                ${s.status==='active'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-600'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-xs text-slate-400">{s.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {data.students.length > 10 && (
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">+{data.students.length - 10} more records in the PDF</p>
                        </div>
                    )}
                </div>
            )}

            {/* Monthly breakdown */}
            {data.monthly?.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Monthly Breakdown</h3>
                    <div className="space-y-3">
                        {data.monthly.map(m => (
                            <div key={m.month} className="flex items-center gap-4">
                                <span className="text-xs font-semibold text-slate-500 w-20 flex-shrink-0">{m.month}</span>
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                                        style={{ width: data.total > 0 ? `${(m.total/data.total)*100}%` : '0%' }} />
                                </div>
                                <span className="text-xs font-black text-slate-600 w-6 text-right">{m.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Generate({ stats }) {
    const { flash = {} } = usePage().props;
    const [toast, setToast]               = useState(null);
    const [reportData, setReportData]     = useState(null);
    const [previewFilters, setPreviewFilters] = useState(null);
    const [downloading, setDownloading]   = useState(false);
    const previewRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        start_date: '', end_date: '', status: 'all', report_type: 'summary',
    });

    useEffect(() => {
        if (flash.success) {
            setToast({ type: 'success', message: flash.success });
            if (flash.reportData) {
                setReportData(flash.reportData);
                setPreviewFilters({ ...data });
                setTimeout(() => previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
            }
        }
        if (flash.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    function submit(e) { e.preventDefault(); post('/reports/generate', { preserveScroll: true }); }

    function downloadPdf() {
        if (!reportData) return;
        setDownloading(true);
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = `/reports/download-pdf?${new URLSearchParams(data)}`;
        document.body.appendChild(form); form.submit(); document.body.removeChild(form);
        setTimeout(() => { setDownloading(false); setToast({ type:'success', message:'PDF downloaded!' }); }, 1800);
    }

    const inp  = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200 placeholder-slate-300";
    const errC = "text-red-500 text-xs mt-1.5 flex items-center gap-1";

    return (
        <>
            <Head title="Generate Report — Student MS" />
            <style>{`
                @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
                @keyframes toastIn { from{opacity:0;transform:translateX(32px) scale(.92)} to{opacity:1;transform:none} }
                @keyframes pulse2  { 0%,100%{opacity:1} 50%{opacity:.6} }
                .shimmer-indigo { background: linear-gradient(90deg,#4f46e5 0%,#7c3aed 50%,#4f46e5 100%); background-size:200% auto; }
                .shimmer-indigo:hover:not(:disabled) { animation: shimmer 1.5s linear infinite; }
                @keyframes shimmer { to{ background-position:-200% center } }
            `}</style>

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className="min-h-screen bg-[#f8f9fc]">
                {/* Sticky top bar */}
                <div style={{ animation:'fadeUp .35s ease forwards' }}
                    className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/dashboard" className="text-slate-400 hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
                        <span className="w-3.5 h-3.5 text-slate-300">{Icon.chevron}</span>
                        <span className="text-slate-700 font-bold">Reports</span>
                    </nav>
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3.5 py-2 rounded-xl transition-all">
                        <span className="w-3.5 h-3.5">{Icon.back}</span> Dashboard
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Page title */}
                    <div style={{ animation:'fadeUp .45s ease forwards' }} className="mb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <span className="w-5 h-5 text-white">{Icon.chart}</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Generate Report</h1>
                        </div>
                        <p className="text-slate-400 text-sm ml-12">Build custom student analytics and export as PDF</p>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard delay={0}   label="Total Students"  value={stats?.total}        sub="All registered"       colorClass="text-indigo-600"  bgClass="bg-indigo-50"  icon={Icon.users}  />
                        <StatCard delay={70}  label="Active Students" value={stats?.active}       sub="Currently active"     colorClass="text-emerald-600" bgClass="bg-emerald-50" icon={Icon.check}  />
                        <StatCard delay={140} label="Inactive"        value={stats?.inactive}     sub="Currently inactive"   colorClass="text-rose-500"    bgClass="bg-rose-50"    icon={Icon.pause}  />
                        <StatCard delay={210} label="New This Month"  value={stats?.newThisMonth} sub="Recent registrations"  colorClass="text-violet-600"  bgClass="bg-violet-50"  icon={Icon.star}   />
                    </div>

                    {/* Two-col layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Config panel */}
                        <div style={{ animationDelay:'250ms', animation:'fadeUp .55s ease forwards', opacity:0 }} className="lg:col-span-4">
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-20">
                                <div className="px-6 pt-6 pb-5 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                            <span className="w-4 h-4 text-indigo-600">{Icon.file}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-black text-slate-800">Report Configuration</h2>
                                            <p className="text-xs text-slate-400 mt-0.5">Set filters & report type</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="p-6 space-y-6">
                                    {/* Date range */}
                                    <div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <span className="w-3.5 h-3.5">{Icon.calendar}</span> Date Range
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start Date <span className="text-rose-400">*</span></label>
                                                <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inp} />
                                                {errors.start_date && <p className={errC}><span className="w-3 h-3">{Icon.alert}</span>{errors.start_date}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Date <span className="text-rose-400">*</span></label>
                                                <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inp} />
                                                {errors.end_date && <p className={errC}><span className="w-3 h-3">{Icon.alert}</span>{errors.end_date}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-slate-100" />

                                    {/* Status */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Student Status</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { v:'all',      dot:'bg-indigo-500',  label:'All'      },
                                                { v:'active',   dot:'bg-emerald-500', label:'Active'   },
                                                { v:'inactive', dot:'bg-rose-500',    label:'Inactive' },
                                            ].map(({ v, dot, label }) => (
                                                <button key={v} type="button" onClick={() => setData('status', v)}
                                                    className={`relative flex flex-col items-center gap-1.5 py-3 rounded-2xl border text-xs font-bold transition-all duration-200 overflow-hidden
                                                        ${data.status===v ? 'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-200'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                                                    {label}
                                                    {data.status===v && <span className="absolute inset-0 ring-2 ring-indigo-300 ring-inset rounded-2xl pointer-events-none" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Report type */}
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Report Type</p>
                                        <div className="space-y-2">
                                            {[
                                                { v:'summary',  label:'Summary',  desc:'Overview stats & charts',     icon:Icon.trend },
                                                { v:'detailed', label:'Detailed', desc:'Full student records included', icon:Icon.file  },
                                            ].map(({ v, label, desc, icon }) => (
                                                <button key={v} type="button" onClick={() => setData('report_type', v)}
                                                    className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200
                                                        ${data.report_type===v ? 'border-indigo-400 bg-indigo-50 shadow-sm' : 'border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30'}`}>
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${data.report_type===v?'bg-indigo-600':'bg-slate-200'}`}>
                                                        <span className={`w-4 h-4 ${data.report_type===v?'text-white':'text-slate-500'}`}>{icon}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-black ${data.report_type===v?'text-indigo-700':'text-slate-700'}`}>{label}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                                                    </div>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.report_type===v?'border-indigo-500 bg-indigo-500':'border-slate-300'}`}>
                                                        {data.report_type===v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA buttons */}
                                    <div className="space-y-3 pt-1">
                                        <button type="submit" disabled={processing}
                                            className="shimmer-indigo w-full flex items-center justify-center gap-2.5 text-white font-black py-3.5 rounded-2xl text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 active:scale-[0.98]">
                                            <span className="w-4 h-4">{processing ? Icon.spinner : Icon.chart}</span>
                                            {processing ? 'Generating…' : 'Generate Report'}
                                        </button>

                                        {reportData && (
                                            <button type="button" onClick={downloadPdf} disabled={downloading}
                                                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-3.5 rounded-2xl text-sm transition-all duration-300 disabled:opacity-60 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 active:scale-[0.98]">
                                                <span className="w-4 h-4">{downloading ? Icon.spinner : Icon.download}</span>
                                                {downloading ? 'Preparing PDF…' : 'Download PDF Report'}
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Preview panel */}
                        <div ref={previewRef} style={{ animationDelay:'320ms', animation:'fadeUp .55s ease forwards', opacity:0 }} className="lg:col-span-8">
                            {reportData ? <ReportPreview data={reportData} filters={previewFilters} /> : <EmptyPreview />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
