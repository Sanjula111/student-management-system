import { useState, useEffect, useMemo } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';

/* ─── Inline SVG Icons ──────────────────────────────────────────── */
const Icon = {
    download:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    search:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    users:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    alert:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    spinner:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-full h-full animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>,
    excel:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="3"/></svg>,
    hash:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    user:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    calendar:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    image:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    activity:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    back:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    x:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    sliders:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
    chevron:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
    pause:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    square:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
    checkSq:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
};

/* ─── Field definitions ─────────────────────────────────────────── */
const FIELDS = [
    { key:'id',         label:'Student ID',     icon:Icon.hash,     desc:'Unique identifier' },
    { key:'name',       label:'Full Name',       icon:Icon.user,     desc:'Student full name' },
    { key:'age',        label:'Age',             icon:Icon.users,    desc:'Student age info' },
    { key:'status',     label:'Status',          icon:Icon.activity, desc:'Active / Inactive' },
    { key:'image',      label:'Image URL',       icon:Icon.image,    desc:'Profile image path' },
    { key:'created_at', label:'Registered Date', icon:Icon.calendar, desc:'Account creation date' },
];

/* ─── Toast ─────────────────────────────────────────────────────── */
function Toast({ type, message, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, []);
    return (
        <div style={{ animation:'toastIn .4s cubic-bezier(.34,1.56,.64,1) forwards' }}
            className={`fixed top-5 right-5 z-[999] flex items-center gap-3 pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold max-w-sm
            ${type==='success'?'bg-gradient-to-r from-emerald-500 to-teal-500':'bg-gradient-to-r from-red-500 to-rose-500'} text-white`}>
            <span className="w-5 h-5 flex-shrink-0">{type==='success'?Icon.check:Icon.alert}</span>
            {message}
            <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 text-xl leading-none">×</button>
        </div>
    );
}

/* ─── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ label, value, sub, colorClass, bgClass, icon, delay, isText }) {
    return (
        <div style={{ animationDelay:`${delay}ms`, animation:'fadeUp .55s ease forwards', opacity:0 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
                    <p className={`font-black tracking-tight ${colorClass} ${isText?'text-2xl':'text-3xl'}`}>
                        {value ?? <span className="text-slate-200">—</span>}
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">{sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`w-5 h-5 ${colorClass}`}>{icon}</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Export({ students: allStudents, stats }) {
    const { flash = {} } = usePage().props;
    const [toast, setToast]           = useState(null);
    const [search, setSearch]         = useState('');
    const [statusFilter, setStatus]   = useState('all');
    const [selectedFields, setFields] = useState(['id','name','age','status','created_at']);
    const [selectedIds, setIds]       = useState([]);
    const [selectAll, setSelectAll]   = useState(false);
    const [downloading, setDL]        = useState(false);
    const [fieldErr, setFieldErr]     = useState('');

    useEffect(() => {
        if (flash.success) setToast({ type:'success', message:flash.success });
        if (flash.error)   setToast({ type:'error',   message:flash.error   });
    }, [flash]);

    /* filtered list */
    const filtered = useMemo(() => allStudents.filter(s => {
        const ms = !search || s.name.toLowerCase().includes(search.toLowerCase()) || String(s.id).includes(search) || String(s.age).includes(search);
        const mf = statusFilter==='all' || s.status===statusFilter;
        return ms && mf;
    }), [allStudents, search, statusFilter]);

    useEffect(() => {
        setIds(selectAll ? filtered.map(s=>s.id) : []);
    }, [selectAll]);

    useEffect(() => { setSelectAll(false); }, [filtered]);

    function toggleId(id)    { setIds(p => p.includes(id) ? p.filter(i=>i!==id) : [...p, id]); }
    function toggleField(k)  { setFields(p => p.includes(k) ? p.filter(f=>f!==k) : [...p,k]); setFieldErr(''); }

    function handleDownload() {
        if (selectedFields.length===0) { setFieldErr('Select at least one field.'); return; }
        const records = selectedIds.length > 0 ? selectedIds : filtered.map(s=>s.id);
        if (records.length===0) { setToast({ type:'error', message:'No student records to export.' }); return; }

        setDL(true);
        const form = document.createElement('form');
        form.method='POST'; form.action='/export-data/download';
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        if (csrf) {
            const ci = document.createElement('input'); ci.type='hidden'; ci.name='_token'; ci.value=csrf; form.appendChild(ci);
        }
        selectedFields.forEach(f => { const i=document.createElement('input'); i.type='hidden'; i.name='fields[]'; i.value=f; form.appendChild(i); });
        records.forEach(id => { const i=document.createElement('input'); i.type='hidden'; i.name='student_ids[]'; i.value=id; form.appendChild(i); });
        [['status',statusFilter],['search',search]].forEach(([n,v]) => { const i=document.createElement('input'); i.type='hidden'; i.name=n; i.value=v; form.appendChild(i); });
        document.body.appendChild(form); form.submit(); document.body.removeChild(form);
        setTimeout(() => { setDL(false); setToast({ type:'success', message:`Excel downloaded! (${records.length} records, ${selectedFields.length} fields)` }); }, 1800);
    }

    const exportCount = selectedIds.length > 0 ? selectedIds.length : filtered.length;

    return (
        <>
            <Head title="Export Data — Student MS" />
            <style>{`
                @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
                @keyframes toastIn { from{opacity:0;transform:translateX(32px) scale(.92)} to{opacity:1;transform:none} }
                @keyframes shimmer { to{background-position:-200% center} }
                .shimmer-emerald { background:linear-gradient(90deg,#059669 0%,#0d9488 50%,#059669 100%);background-size:200% auto; }
                .shimmer-emerald:hover:not(:disabled) { animation:shimmer 1.5s linear infinite; }
            `}</style>

            {toast && <Toast type={toast.type} message={toast.message} onClose={()=>setToast(null)} />}

            <div className="min-h-screen bg-[#f8f9fc]">
                {/* Sticky nav bar */}
                <div style={{ animation:'fadeUp .35s ease forwards' }}
                    className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-3.5 flex items-center justify-between">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/dashboard" className="text-slate-400 hover:text-indigo-600 transition-colors font-medium">Dashboard</Link>
                        <span className="w-3.5 h-3.5 text-slate-300">{Icon.chevron}</span>
                        <span className="text-slate-700 font-bold">Export Data</span>
                    </nav>
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3.5 py-2 rounded-xl transition-all">
                        <span className="w-3.5 h-3.5">{Icon.back}</span> Dashboard
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Page title */}
                    <div style={{ animation:'fadeUp .45s ease forwards' }} className="mb-8">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                                <span className="w-5 h-5 text-white">{Icon.excel}</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Export Data</h1>
                        </div>
                        <p className="text-slate-400 text-sm ml-12">Select students and fields, then download as Excel (.xlsx)</p>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard delay={0}   label="Total Students"  value={stats?.total}    sub="All records"         colorClass="text-indigo-600"  bgClass="bg-indigo-50"  icon={Icon.users}    />
                        <StatCard delay={70}  label="Active Students" value={stats?.active}   sub="Currently active"    colorClass="text-emerald-600" bgClass="bg-emerald-50" icon={Icon.check}    />
                        <StatCard delay={140} label="Inactive"        value={stats?.inactive} sub="Currently inactive"  colorClass="text-rose-500"    bgClass="bg-rose-50"    icon={Icon.pause}    />
                        <StatCard delay={210} label="Export Format"   value="XLSX"            sub="Excel spreadsheet"   colorClass="text-violet-600"  bgClass="bg-violet-50"  icon={Icon.download} isText />
                    </div>

                    {/* Main 3-col layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* ── Left sidebar ─────────────────────────── */}
                        <div style={{ animationDelay:'250ms', animation:'fadeUp .55s ease forwards', opacity:0 }} className="lg:col-span-4 space-y-4">

                            {/* Search & Filter */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <span className="w-3.5 h-3.5 text-indigo-600">{Icon.sliders}</span>
                                    </div>
                                    <h3 className="text-sm font-black text-slate-700">Search & Filter</h3>
                                </div>
                                <div className="relative mb-3">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">{Icon.search}</span>
                                    <input
                                        type="text"
                                        placeholder="Name, ID, or age…"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all placeholder-slate-300"
                                    />
                                    {search && (
                                        <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors">
                                            {Icon.x}
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {v:'all',dot:'bg-indigo-500',label:'All'},
                                        {v:'active',dot:'bg-emerald-500',label:'Active'},
                                        {v:'inactive',dot:'bg-rose-500',label:'Inactive'},
                                    ].map(({v,dot,label})=>(
                                        <button key={v} onClick={()=>setStatus(v)}
                                            className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200
                                                ${statusFilter===v?'border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm':'border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-200'}`}>
                                            <span className={`w-2 h-2 rounded-full ${dot}`} />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Field Selector */}
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-xl bg-violet-50 flex items-center justify-center">
                                            <span className="w-3.5 h-3.5 text-violet-600">{Icon.checkSq}</span>
                                        </div>
                                        <h3 className="text-sm font-black text-slate-700">Fields to Export</h3>
                                    </div>
                                    <span className="text-xs bg-indigo-100 text-indigo-600 font-black px-2 py-0.5 rounded-full">
                                        {selectedFields.length}/{FIELDS.length}
                                    </span>
                                </div>

                                {fieldErr && (
                                    <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 mb-3">
                                        <span className="w-3.5 h-3.5 flex-shrink-0">{Icon.alert}</span> {fieldErr}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {FIELDS.map(({ key, label, icon, desc }) => {
                                        const on = selectedFields.includes(key);
                                        return (
                                            <button key={key} onClick={()=>toggleField(key)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200
                                                    ${on?'bg-indigo-50 border-indigo-300 shadow-sm':'bg-slate-50 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30'}`}>
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${on?'bg-indigo-600':'bg-slate-200'}`}>
                                                    <span className={`w-4 h-4 ${on?'text-white':'text-slate-400'}`}>{icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-xs font-black ${on?'text-indigo-700':'text-slate-700'}`}>{label}</p>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                                                </div>
                                                <span className={`w-4 h-4 flex-shrink-0 transition-all ${on?'text-indigo-500':'text-slate-300'}`}>
                                                    {on ? Icon.checkSq : Icon.square}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Export CTA */}
                            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-5 text-white relative overflow-hidden">
                                <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
                                <div className="relative z-10">
                                    <span className="w-8 h-8 block mb-3 opacity-80">{Icon.excel}</span>
                                    <p className="text-sm font-black">Ready to Export</p>
                                    <p className="text-xs opacity-70 mt-1 mb-4">
                                        <strong className="opacity-100">{exportCount}</strong> student{exportCount!==1?'s':''} · <strong className="opacity-100">{selectedFields.length}</strong> field{selectedFields.length!==1?'s':''}
                                    </p>
                                    <button onClick={handleDownload} disabled={downloading||selectedFields.length===0}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-black py-3 rounded-2xl text-sm hover:bg-emerald-50 transition-all disabled:opacity-60 active:scale-[0.98] shadow-lg">
                                        <span className="w-4 h-4">{downloading?Icon.spinner:Icon.download}</span>
                                        {downloading?'Downloading…':'Download Excel'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Student table ─────────────────────────── */}
                        <div style={{ animationDelay:'320ms', animation:'fadeUp .55s ease forwards', opacity:0 }} className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                {/* Table header */}
                                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                            <span className="w-4 h-4 text-slate-600">{Icon.users}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-700">Student Records</h3>
                                            <p className="text-xs text-slate-400">
                                                {filtered.length} result{filtered.length!==1?'s':''} · {selectedIds.length} selected
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={()=>setSelectAll(!selectAll)}
                                        className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all duration-200
                                            ${selectAll?'bg-indigo-600 text-white border-indigo-600 shadow-sm':'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                                        <span className="w-3.5 h-3.5">{selectAll?Icon.checkSq:Icon.square}</span>
                                        {selectAll?'Deselect All':'Select All'}
                                    </button>
                                </div>

                                {/* Table body */}
                                <div className="overflow-x-auto">
                                    {filtered.length===0 ? (
                                        <div className="py-20 text-center">
                                            <span className="w-12 h-12 text-slate-200 block mx-auto mb-3">{Icon.search}</span>
                                            <p className="text-sm font-bold text-slate-400">No students found</p>
                                            <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filter</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="w-12 px-5 py-3" />
                                                    {['ID','Name','Age','Status','Registered'].map(h=>(
                                                        <th key={h} className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filtered.map(s => {
                                                    const sel = selectedIds.includes(s.id);
                                                    return (
                                                        <tr key={s.id} onClick={()=>toggleId(s.id)}
                                                            className={`border-b border-slate-50 cursor-pointer transition-all duration-150
                                                                ${sel?'bg-indigo-50/60':'hover:bg-slate-50/80'}`}>
                                                            <td className="px-5 py-3.5">
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                                                                    ${sel?'bg-indigo-600 border-indigo-600':'border-slate-300 hover:border-indigo-400'}`}>
                                                                    {sel && <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><polyline points="1 6 4 9 11 2"/></svg>}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3.5 font-mono text-xs text-slate-400">#{s.id}</td>
                                                            <td className="px-4 py-3.5">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-xs font-black text-white flex-shrink-0 shadow-sm shadow-indigo-200">
                                                                        {s.name?.[0]??'?'}
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3.5 text-sm text-slate-500">{s.age}</td>
                                                            <td className="px-4 py-3.5">
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black
                                                                    ${s.status==='active'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-600'}`}>
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${s.status==='active'?'bg-emerald-500':'bg-rose-500'}`} />
                                                                    {s.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3.5 text-xs text-slate-400">{s.created_at}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>

                                {/* Footer */}
                                {filtered.length > 0 && (
                                    <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
                                        <p className="text-xs text-slate-500 font-medium">
                                            {selectedIds.length > 0
                                                ? <><strong className="text-indigo-600">{selectedIds.length}</strong> of {filtered.length} selected for export</>
                                                : <><strong className="text-slate-700">{filtered.length}</strong> records will be exported</>
                                            }
                                        </p>
                                        <button onClick={handleDownload} disabled={downloading||selectedFields.length===0}
                                            className="shimmer-emerald flex items-center gap-2 text-white font-black py-2 px-4 rounded-xl text-xs transition-all disabled:opacity-60 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.98]">
                                            <span className="w-3.5 h-3.5">{downloading?Icon.spinner:Icon.download}</span>
                                            {downloading?'Downloading…':'Export Excel'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* What's included info */}
                            {selectedFields.length > 0 && (
                                <div style={{ animation:'fadeUp .4s ease forwards' }} className="mt-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">What's Included in Export</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFields.map(k => {
                                            const f = FIELDS.find(f=>f.key===k);
                                            return f ? (
                                                <div key={k} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold">
                                                    <span className="w-3 h-3">{f.icon}</span>
                                                    {f.label}
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
                                        <span className="w-3.5 h-3.5 text-indigo-400">{Icon.alert}</span>
                                        The exported file can be opened in Excel, Google Sheets, or any spreadsheet application.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
