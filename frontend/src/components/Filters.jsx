const CATS = ['All','Food','Transport','Shopping','Bills','Entertainment','Other'];
export default function Filters({ filters, onChange }) {
  const set = k => e => onChange({...filters,[k]:e.target.value});
  const reset = () => onChange({category:'All',date_from:'',date_to:'',title:''});
  const active = filters.category!=='All'||filters.date_from||filters.date_to||filters.title;
  return (
    <div style={S.bar}>
      <div style={S.search}>
        <span style={{color:'#4a5568',fontSize:'0.9rem'}}>🔍</span>
        <input style={S.sInput} placeholder='Search by title...' value={filters.title} onChange={set('title')} aria-label='Search'/>
      </div>
      <select style={S.sel} value={filters.category} onChange={set('category')} aria-label='Category'>
        {CATS.map(c=><option key={c}>{c}</option>)}
      </select>
      <div style={{display:'flex',alignItems:'center',gap:6}}>
        <input style={S.date} type='date' value={filters.date_from} onChange={set('date_from')} aria-label='From'/>
        <span style={{color:'#4a5568',fontSize:'0.8rem'}}>→</span>
        <input style={S.date} type='date' value={filters.date_to} onChange={set('date_to')} aria-label='To'/>
      </div>
      {active && <button style={S.clear} onClick={reset}>✕ Clear</button>}
    </div>
  );
}
const S = {
  bar: {display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',background:'#1a1d27',padding:'0.85rem 1rem',borderRadius:12,border:'1px solid #2d3148',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'},
  search: {display:'flex',alignItems:'center',flex:2,minWidth:140,background:'#0f1117',border:'1.5px solid #2d3148',borderRadius:9,padding:'0 0.7rem',gap:6},
  sInput: {border:'none',background:'transparent',padding:'0.48rem 0',fontSize:'0.88rem',flex:1,outline:'none',color:'#e2e8f0'},
  sel: {padding:'0.5rem 0.6rem',borderRadius:9,border:'1.5px solid #2d3148',fontSize:'0.87rem',background:'#0f1117',color:'#e2e8f0',flex:1,minWidth:100},
  date: {padding:'0.48rem 0.6rem',borderRadius:9,border:'1.5px solid #2d3148',fontSize:'0.83rem',background:'#0f1117',color:'#e2e8f0',flex:1},
  clear: {background:'rgba(239,68,68,0.1)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)',borderRadius:9,padding:'0.48rem 0.85rem',fontWeight:700,fontSize:'0.8rem',whiteSpace:'nowrap'},
};
