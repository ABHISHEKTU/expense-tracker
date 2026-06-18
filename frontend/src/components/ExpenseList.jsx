import { useState } from 'react';
const C = { Food:'#f97316',Transport:'#3b82f6',Shopping:'#ec4899',Bills:'#ef4444',Entertainment:'#8b5cf6',Other:'#6b7280' };
const I = { Food:'🍽️',Transport:'🚌',Shopping:'🛍️',Bills:'📄',Entertainment:'🎬',Other:'📦' };
const fmt = n => '₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:2});
const fmtD = d => new Date(d+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});

function DelBtn({ onConfirm }) {
  const [c,setC] = useState(false);
  return c
    ? <span style={{display:'flex',alignItems:'center',gap:4,background:'rgba(239,68,68,0.1)',borderRadius:7,padding:'2px 8px'}}>
        <span style={{fontSize:'0.75rem',color:'#f87171',fontWeight:600}}>Delete?</span>
        <button style={S.yes} onClick={()=>{setC(false);onConfirm();}}>Yes</button>
        <button style={S.no} onClick={()=>setC(false)}>No</button>
      </span>
    : <button className='btn-ghost' style={S.icon} aria-label='Delete' onClick={()=>setC(true)}>🗑️</button>;
}

export default function ExpenseList({ expenses, onEdit, onDelete, loading }) {
  if (loading) return <div style={S.empty}><div style={S.spinner}/><p style={{color:'#4a5568',marginTop:12}}>Loading...</p></div>;
  if (!expenses.length) return (
    <div style={S.empty}>
      <div style={{fontSize:'2.5rem',marginBottom:8}}>💸</div>
      <p style={{fontWeight:700,color:'#e2e8f0',marginBottom:4}}>No expenses yet</p>
      <p style={{fontSize:'0.85rem',color:'#4a5568'}}>Add your first expense using the form.</p>
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {expenses.map(e=>(
        <div key={e.id} className='card-hover' style={S.card}>
          <div style={{width:4,background:C[e.category]||'#6b7280',borderRadius:'4px 0 0 4px',flexShrink:0}}/>
          <div style={{width:38,height:38,borderRadius:10,background:(C[e.category]||'#6b7280')+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',flexShrink:0,margin:'0 10px'}}>{I[e.category]||'📦'}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:600,fontSize:'0.93rem',color:'#e2e8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.title}</div>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:3,flexWrap:'wrap'}}>
              <span style={{background:(C[e.category]||'#6b7280')+'22',color:C[e.category]||'#6b7280',borderRadius:20,padding:'1px 8px',fontSize:'0.7rem',fontWeight:700}}>{e.category}</span>
              <span style={{fontSize:'0.75rem',color:'#4a5568'}}>{fmtD(e.date)}</span>
              {e.note && <span style={{fontSize:'0.75rem',color:'#4a5568',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:160}} title={e.note}>· {e.note}</span>}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0,paddingRight:10}}>
            <span style={{fontWeight:800,fontSize:'0.97rem',color:'#e2e8f0'}}>{fmt(e.amount)}</span>
            <button className='btn-ghost' style={S.icon} aria-label='Edit' onClick={()=>onEdit(e)}>✏️</button>
            <DelBtn onConfirm={()=>onDelete(e.id)}/>
          </div>
        </div>
      ))}
    </div>
  );
}

const S = {
  card: {background:'#1a1d27',borderRadius:12,border:'1px solid #2d3148',display:'flex',alignItems:'center',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'},
  icon: {background:'none',border:'none',fontSize:'1rem',padding:'5px',borderRadius:7,color:'#94a3b8'},
  yes: {background:'#ef4444',color:'#fff',border:'none',borderRadius:5,padding:'2px 7px',fontSize:'0.72rem',fontWeight:700,cursor:'pointer'},
  no: {background:'#2d3148',color:'#94a3b8',border:'none',borderRadius:5,padding:'2px 7px',fontSize:'0.72rem',fontWeight:600,cursor:'pointer'},
  empty: {background:'#1a1d27',borderRadius:12,border:'1px solid #2d3148',padding:'3rem 1rem',textAlign:'center'},
  spinner: {width:28,height:28,border:'3px solid #2d3148',borderTop:'3px solid #7c3aed',borderRadius:'50%',margin:'0 auto',animation:'spin 0.8s linear infinite'},
};
