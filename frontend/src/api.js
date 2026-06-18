const BASE = '/expenses';
const json = r => r.ok ? r.json() : r.json().then(e => Promise.reject(new Error(e.detail?.[0]?.msg || e.detail || 'Error')));

export const fetchExpenses = (f={}) => {
  const p = new URLSearchParams();
  if (f.category && f.category!=='All') p.append('category',f.category);
  if (f.date_from) p.append('date_from',f.date_from);
  if (f.date_to) p.append('date_to',f.date_to);
  if (f.title) p.append('title',f.title);
  return fetch(`${BASE}?${p}`).then(json);
};
export const createExpense = d => {
  const body = {...d};
  if (!body.date) delete body.date;
  return fetch(BASE,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(json);
};
export const updateExpense = (id,d) => fetch(`${BASE}/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(json);
export const deleteExpense = id => fetch(`${BASE}/${id}`,{method:'DELETE'}).then(r=>{ if(!r.ok) throw new Error('Delete failed'); });
export const fetchMonthlySummary = (y,m) => fetch(`/summary/monthly?year=${y}&month=${m}`).then(json);
