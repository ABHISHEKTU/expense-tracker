import { useState, useEffect } from 'react';
const CATS = ['Food','Transport','Shopping','Bills','Entertainment','Other'];
const today = () => new Date().toISOString().split('T')[0];
const EMPTY = { title:'', amount:'', category:'Food', date:today(), note:'' };

export default function ExpenseForm({ onSubmit, initial=null, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  useEffect(() => {
    setForm(initial ? {...initial, amount:String(initial.amount), note:initial.note||''} : {...EMPTY,date:today()});
    setError('');
  }, [initial]);

  const submit = async e => {
    e.preventDefault(); setError('');
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.amount || +form.amount <= 0) return setError('Enter a valid positive amount.');
    if ((form.note||'').length > 500) return setError('Note must be under 500 characters.');
    try {
     const payload = {...form, amount: parseFloat((+form.amount).toFixed(2))};
if (!payload.note) payload.note = null;
await onSubmit(payload);
      if (!initial) setForm({...EMPTY, date:today()});
    } catch(err) { setError(err.message); }
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <span style={S.icon}>💰</span>
        <h2 style={S.title}>{initial ? 'Edit Expense' : 'New Expense'}</h2>
      </div>
      {error && <div style={S.error}>{error}</div>}
      <form onSubmit={submit} style={S.body}>
        <label style={S.label}>Title</label>
        <input style={S.input} value={form.title} onChange={set('title')} placeholder='e.g. Coffee at Starbucks' maxLength={200}/>
        <div className='form-grid' style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div>
            <label style={S.label}>Amount (₹)</label>
            <input style={S.input} type='number' value={form.amount} onChange={set('amount')} placeholder='0.00' min='0.01' step='0.01'/>
          </div>
          <div>
            <label style={S.label}>Category</label>
            <select style={S.input} value={form.category} onChange={set('category')}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <label style={S.label}>Date</label>
        <input style={S.input} type='date' value={form.date} onChange={set('date')}/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <label style={S.label}>Note <span style={{color:'#4a5568',fontWeight:400}}>(optional)</span></label>
          <span style={{fontSize:'0.72rem',color:(form.note||'').length>480?'#fc8181':'#4a5568'}}>{(form.note||'').length}/500</span>
        </div>
        <textarea style={{...S.input,minHeight:68,resize:'vertical'}} value={form.note} onChange={set('note')} placeholder='Any details...' maxLength={500}/>
        <div style={{display:'flex',gap:8,marginTop:4}}>
          <button style={{...S.btn, opacity:submitting?.7:1}} type='submit' disabled={submitting}>
            {submitting?'Saving...':(initial?'Save Changes':'Add Expense')}
          </button>
          {onCancel && <button style={S.btnGhost} type='button' onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}

const S = {
  card: {background:'#1a1d27',borderRadius:16,overflow:'hidden',border:'1px solid #2d3148',boxShadow:'0 4px 24px rgba(0,0,0,0.4)'},
  header: {background:'linear-gradient(135deg,#7c3aed,#4f46e5)',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:10},
  icon: {fontSize:'1.4rem'},
  title: {fontSize:'1rem',fontWeight:700,color:'#fff'},
  error: {background:'rgba(252,129,129,0.1)',color:'#fc8181',padding:'0.6rem 1.25rem',fontSize:'0.83rem',borderBottom:'1px solid rgba(252,129,129,0.2)'},
  body: {padding:'1.1rem 1.25rem',display:'flex',flexDirection:'column',gap:8},
  label: {fontSize:'0.74rem',fontWeight:600,color:'#94a3b8',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2,display:'block'},
  input: {width:'100%',padding:'0.55rem 0.75rem',borderRadius:9,border:'1.5px solid #2d3148',fontSize:'0.92rem',background:'#0f1117',color:'#e2e8f0',display:'block'},
  btn: {flex:1,background:'linear-gradient(135deg,#7c3aed,#4f46e5)',color:'#fff',border:'none',borderRadius:9,padding:'0.65rem',fontWeight:700,fontSize:'0.92rem'},
  btnGhost: {background:'#1e2235',color:'#94a3b8',border:'1px solid #2d3148',borderRadius:9,padding:'0.65rem 1rem',fontWeight:600,fontSize:'0.92rem'},
};
