const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const C = { Food:'#f97316',Transport:'#3b82f6',Shopping:'#ec4899',Bills:'#ef4444',Entertainment:'#8b5cf6',Other:'#6b7280' };
const fmt = n => '₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:2});

export default function MonthlySummary({ summary, month, year, onMonthChange, onYearChange }) {
  const years = Array.from({length:5},(_,i)=>new Date().getFullYear()-i);
  return (
    <div style={S.box}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
        <h2 style={S.heading}>📊 Monthly Summary</h2>
        <div style={{display:'flex',gap:6}}>
          <select style={S.sel} value={month} onChange={e=>onMonthChange(+e.target.value)}>
            {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
          </select>
          <select style={S.sel} value={year} onChange={e=>onYearChange(+e.target.value)}>
            {years.map(y=><option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      {!summary ? <p style={{color:'#4a5568',fontSize:'0.85rem'}}>Loading...</p> : <>
        <div style={{marginBottom:'1rem'}}>
          <div style={{fontSize:'0.72rem',color:'#4a5568',textTransform:'uppercase',letterSpacing:0.5,fontWeight:600}}>Total Spent</div>
          <div style={{fontSize:'2rem',fontWeight:900,color:'#a78bfa',letterSpacing:-1,lineHeight:1.1}}>{fmt(summary.total)}</div>
          <div style={{fontSize:'0.75rem',color:'#4a5568',marginTop:2}}>{summary.count} transaction{summary.count!==1?'s':''} · {MONTHS[month-1]} {year}</div>
        </div>
        {!Object.keys(summary.breakdown).length
          ? <p style={{color:'#2d3148',fontSize:'0.85rem'}}>No expenses this month.</p>
          : Object.entries(summary.breakdown).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
              const pct = summary.total>0 ? amt/summary.total*100 : 0;
              return (
                <div key={cat} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{width:8,height:8,borderRadius:'50%',background:C[cat]||'#6b7280',display:'inline-block'}}/>
                      <span style={{fontSize:'0.8rem',fontWeight:600,color:'#94a3b8'}}>{cat}</span>
                    </div>
                    <div style={{display:'flex',gap:8}}>
                      <span style={{fontSize:'0.8rem',fontWeight:700,color:'#e2e8f0'}}>{fmt(amt)}</span>
                      <span style={{fontSize:'0.72rem',color:'#4a5568',width:30,textAlign:'right'}}>{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div style={{background:'#0f1117',borderRadius:4,height:6,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:C[cat]||'#6b7280',borderRadius:4,transition:'width 0.5s'}}/>
                  </div>
                </div>
              );
            })
        }
      </>}
    </div>
  );
}
const S = {
  box: {background:'#1a1d27',borderRadius:16,padding:'1.25rem',border:'1px solid #2d3148',boxShadow:'0 4px 24px rgba(0,0,0,0.4)'},
  heading: {fontSize:'0.88rem',fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:0.5},
  sel: {padding:'0.3rem 0.5rem',borderRadius:7,border:'1px solid #2d3148',fontSize:'0.8rem',color:'#94a3b8',background:'#0f1117'},
};
