import { useState, useEffect, useCallback, useRef } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Filters from './components/Filters';
import MonthlySummary from './components/MonthlySummary';
import { fetchExpenses, createExpense, updateExpense, deleteExpense, fetchMonthlySummary } from './api';

const DEF = { category:'All', date_from:'', date_to:'', title:'' };

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [filters, setFilters] = useState(DEF);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [summary, setSummary] = useState(null);
  const now = new Date();
  const [sMonth, setSMonth] = useState(now.getMonth()+1);
  const [sYear, setSYear] = useState(now.getFullYear());
  const formRef = useRef(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(''),3000); };

  const loadExp = useCallback(async () => {
    setLoading(true); setError('');
    try { setExpenses(await fetchExpenses(filters)); }
    catch { setError('Cannot reach backend. Is it running on port 8000?'); }
    finally { setLoading(false); }
  }, [filters]);

  const loadSum = useCallback(async () => {
    try { setSummary(await fetchMonthlySummary(sYear, sMonth)); } catch {}
  }, [sYear, sMonth]);

  useEffect(()=>{ loadExp(); },[loadExp]);
  useEffect(()=>{ loadSum(); },[loadSum]);

  const wrap = async (fn, msg) => {
    if (submitting) return;
    setSubmitting(true);
    try { await fn(); await Promise.all([loadExp(),loadSum()]); showToast(msg); }
    finally { setSubmitting(false); }
  };

  const handleAdd    = d => wrap(()=>createExpense(d), '✓ Expense added');
  const handleUpdate = d => wrap(async()=>{ await updateExpense(editing.id,d); setEditing(null); }, '✓ Expense updated');
  const handleDelete = id => wrap(()=>deleteExpense(id), '✓ Expense deleted');

  const handleEdit = e => {
    setEditing(e);
    setTimeout(()=>formRef.current?.scrollIntoView({behavior:'smooth',block:'start'}),50);
  };

  const total = expenses.reduce((s,e)=>s+e.amount,0);

  return (
    <div style={{minHeight:'100vh',background:'#0f1117'}}>
      {/* Header */}
      <header style={S.header}>
        <div className='container' style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div style={S.logoBox}>₹</div>
            <div>
              <div style={{fontWeight:800,fontSize:'1.1rem',color:'#fff',letterSpacing:-0.3}}>ExpenseTracker</div>
              <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.5)',marginTop:1}}>Personal finance, simplified</div>
            </div>
          </div>
          <div style={S.pill}>🔒 Local · No account needed</div>
        </div>
      </header>

      <main className='container' style={{paddingTop:'1.75rem',paddingBottom:'3rem'}}>
        {/* Stats bar */}
        <div style={S.statsBar}>
          <div style={S.stat}>
            <div style={S.statVal}>{expenses.length}</div>
            <div style={S.statLabel}>Expenses shown</div>
          </div>
          <div style={{width:1,background:'#2d3148',alignSelf:'stretch'}}/>
          <div style={S.stat}>
            <div style={{...S.statVal,color:'#a78bfa'}}>₹{total.toLocaleString('en-IN',{minimumFractionDigits:2})}</div>
            <div style={S.statLabel}>Total amount</div>
          </div>
          <div style={{width:1,background:'#2d3148',alignSelf:'stretch'}}/>
          <div style={S.stat}>
            <div style={S.statVal}>{new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</div>
            <div style={S.statLabel}>Current period</div>
          </div>
        </div>

        <div className='layout-grid' style={S.grid} ref={formRef}>
          {/* Left */}
          <div className='sticky-col' style={S.left}>
            {editing && (
              <div style={S.editBanner}>
                ✏️ Editing: <strong style={{color:'#fff'}}>{editing.title}</strong>
                <button style={S.editX} onClick={()=>setEditing(null)}>✕</button>
              </div>
            )}
            <ExpenseForm initial={editing} onSubmit={editing?handleUpdate:handleAdd} onCancel={editing?()=>setEditing(null):null} submitting={submitting}/>
            <MonthlySummary summary={summary} month={sMonth} year={sYear} onMonthChange={setSMonth} onYearChange={setSYear}/>
          </div>

          {/* Right */}
          <div style={{display:'flex',flexDirection:'column',gap:'0.85rem'}}>
            <Filters filters={filters} onChange={setFilters}/>
            {error && <div style={S.err}>{error}</div>}
            <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} loading={loading}/>
          </div>
        </div>
      </main>

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}

const S = {
  header: {background:'linear-gradient(135deg,#1a0533 0%,#1a1d27 100%)',borderBottom:'1px solid #2d3148',padding:'1rem 0'},
  logoBox: {width:40,height:40,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',fontWeight:900,color:'#fff',boxShadow:'0 4px 12px rgba(124,58,237,0.4)'},
  pill: {background:'rgba(255,255,255,0.05)',border:'1px solid #2d3148',borderRadius:20,padding:'5px 12px',fontSize:'0.74rem',color:'rgba(255,255,255,0.4)'},
  statsBar: {display:'flex',alignItems:'center',gap:0,background:'#1a1d27',border:'1px solid #2d3148',borderRadius:14,marginBottom:'1.5rem',overflow:'hidden'},
  stat: {flex:1,padding:'1rem 1.25rem'},
  statVal: {fontSize:'1.1rem',fontWeight:800,color:'#e2e8f0',marginBottom:2},
  statLabel: {fontSize:'0.72rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:0.4,fontWeight:600},
  grid: {display:'grid',gridTemplateColumns:'370px 1fr',gap:'1.25rem',alignItems:'start'},
  left: {display:'flex',flexDirection:'column',gap:'1rem',position:'sticky',top:16},
  editBanner: {background:'rgba(124,58,237,0.15)',border:'1.5px solid rgba(124,58,237,0.4)',borderRadius:10,padding:'0.65rem 1rem',fontSize:'0.84rem',color:'rgba(255,255,255,0.6)',display:'flex',alignItems:'center',gap:6},
  editX: {marginLeft:'auto',background:'none',border:'none',color:'#94a3b8',fontSize:'1rem',cursor:'pointer',padding:'0 4px'},
  err: {background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,padding:'0.7rem 1rem',fontSize:'0.87rem'},
  toast: {position:'fixed',bottom:'2rem',right:'2rem',background:'#1a1d27',color:'#a78bfa',border:'1px solid #7c3aed',padding:'0.75rem 1.25rem',borderRadius:12,fontSize:'0.88rem',fontWeight:600,boxShadow:'0 8px 24px rgba(0,0,0,0.5)',animation:'slideUp 0.2s ease',zIndex:1000},
};
