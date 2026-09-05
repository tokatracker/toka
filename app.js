
const MERCHANTS={netflix:{link:'https://www.netflix.com/cancelplan',cat:'OTT'},spotify:{link:'https://www.spotify.com/account/subscription/',cat:'OTT'},hotstar:{link:'https://www.hotstar.com/in/subscribe/myaccount',cat:'OTT'},prime:{link:'https://www.amazon.in/mc/yourmembershipsandsubscriptions',cat:'OTT'},youtube:{link:'https://www.youtube.com/paid_memberships',cat:'OTT'},jio:{link:'https://www.jio.com/selfcare/dashboard/',cat:'Telecom'},airtel:{link:'https://www.airtel.in/myaccount/',cat:'Telecom'},microsoft:{link:'https://account.microsoft.com/services',cat:'Software'},adobe:{link:'https://account.adobe.com/plans',cat:'Software'},canva:{link:'https://www.canva.com/settings/billing',cat:'Software'}};
const PAY_APPS=[{name:'PhonePe',icon:'P',color:'#5f259f',scheme:'phonepe'},{name:'GPay',icon:'G',color:'#1a73e8',scheme:'tez'},{name:'Paytm',icon:'P',color:'#00baf2',scheme:'paytmmp'},{name:'BHIM',icon:'B',color:'#f47216',scheme:'bhim'},{name:'Amazon Pay',icon:'A',color:'#ff9900',scheme:'amazonpay'},{name:'WhatsApp',icon:'W',color:'#25d366',scheme:'whatsapp'}];
let expenses=[],payments=[],settings={},currentPayExpense=null;
let catChartInst=null,trendChartInst=null,typeChartInst=null,methodChartInst=null;
function load(key,def){try{const v=localStorage.getItem('toka_'+key);return v?JSON.parse(v):def;}catch(e){return def;}}
function save(key,val){localStorage.setItem('toka_'+key,JSON.stringify(val));}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function fmtR(n){return new Intl.NumberFormat('en-IN').format(Math.round(n));}
function daysUntil(d){const x=new Date(d);x.setHours(0,0,0,0);const t=new Date();t.setHours(0,0,0,0);return Math.round((x-t)/86400000);}
function fmtDue(d){const days=daysUntil(d);if(days<0)return'Overdue by '+Math.abs(days)+'d';if(days===0)return'Due today';if(days===1)return'Tomorrow';return'In '+days+' days';}
function typeBadge(t){return'<span class="type-badge type-badge--'+t+'">'+(t==='sub'?'Sub':t==='bill'?'Bill':'Pers')+'</span>';}
function statusBadge(s){return'<span class="status-badge status-badge--'+s+'">'+(s==='active'?'Active':s==='snoozed'?'Snoozed':'Cancelled')+'</span>';}
function catColor(c){const m={'OTT':'accent','Telecom':'blue','Utility':'blue','Fitness':'green','Food':'amber','Software':'accent','Rent':'red','Education':'green'};return m[c]||'accent';}
function catIcon(c){return c?c.charAt(0).toUpperCase():'?';}
function getCSSVar(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim();}
function loadData(){expenses=load('expenses',[]);payments=load('payments',[]);settings=load('settings',{});renderDashboard();renderPayments();renderSettings();renderInsights();}
function addExpense(d){const id=genId();const e={id,...d,status:'active',createdAt:new Date().toISOString()};expenses.push(e);save('expenses',expenses);return e;}
function updateExpense(id,updates){const e=expenses.find(x=>x.id===id);if(!e)return null;if(updates.status!==undefined)e.status=updates.status;if(updates.nextDue!==undefined)e.nextDue=updates.nextDue;save('expenses',expenses);return e;}
function deleteExpenseData(id){expenses=expenses.filter(e=>e.id!==id);save('expenses',expenses);}
function addPayment(p){const pay={id:genId(),...p,date:new Date().toISOString()};payments.unshift(pay);save('payments',payments);return pay;}
function saveSettingsData(d){settings={...settings,...d};save('settings',settings);}
function clearAllDataLocal(){expenses=[];payments=[];settings={};localStorage.removeItem('toka_expenses');localStorage.removeItem('toka_payments');localStorage.removeItem('toka_settings');}
function renderDashboard(){const a=expenses.filter(e=>e.status!=='cancelled');let tm=0,sm=0,bm=0,pm=0;a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;tm+=m;if(e.type==='sub')sm+=m;else if(e.type==='bill')bm+=m;else pm+=m;});document.getElementById('totalMonthly').textContent=fmtR(tm);document.getElementById('burnSub').innerHTML='<span><span class="dot dot--sub"></span>Subs <strong>&#8377;'+fmtR(sm)+'</strong></span><span><span class="dot dot--bill"></span>Bills <strong>&#8377;'+fmtR(bm)+'</strong></span><span><span class="dot dot--pers"></span>Pers <strong>&#8377;'+fmtR(pm)+'</strong></span>';const uc=a.filter(e=>{const d=daysUntil(e.nextDue);return d>=0&&d<=7;}).length;const sc=expenses.filter(e=>e.status==='snoozed').length;document.getElementById('kpiRow').innerHTML='<div class="kpi-card" style="--i:0"><div class="kpi-card__value">&#8377;'+fmtR(tm*12)+'</div><div class="kpi-card__label">Yearly</div></div><div class="kpi-card" style="--i:1"><div class="kpi-card__value">'+uc+'</div><div class="kpi-card__label">This Week</div></div><div class="kpi-card" style="--i:2"><div class="kpi-card__value" style="color:var(--amber)">'+sc+'</div><div class="kpi-card__label">Snoozed</div></div><div class="kpi-card" style="--i:3"><div class="kpi-card__value">'+expenses.length+'</div><div class="kpi-card__label">Total</div></div>';renderRenewals();renderTable();renderCategories();}
function renderRenewals(){const l=document.getElementById('renewalList');const u=expenses.filter(e=>e.status!=='cancelled').sort((a,b)=>daysUntil(a.nextDue)-daysUntil(b.nextDue)).slice(0,5);if(u.length===0){l.innerHTML='<div class="empty"><div class="empty__text">No renewals yet</div></div>';return;}l.innerHTML=u.map((e,i)=>{const d=daysUntil(e.nextDue);let cls='';if(d<=1)cls='urgent';else if(d<=3)cls='soon';const cv=catColor(e.category);return'<div class="renewal-item" style="--i:'+i+'"><div class="renewal-item__icon" style="background:var(--'+cv+'-dim);color:var(--'+cv+')">'+catIcon(e.category)+'</div><div class="renewal-item__info"><div class="renewal-item__name">'+(e.link?'<a href="'+e.link+'" target="_blank">'+e.name+'</a>':e.name)+'</div><div class="renewal-item__due '+cls+'">'+fmtDue(e.nextDue)+' - '+e.category+'</div></div><div class="renewal-item__amount">&#8377;'+fmtR(e.amount)+'</div><div class="renewal-item__actions">'+(e.link?'<a class="btn-mini btn-mini--manage" href="'+e.link+'" target="_blank">Manage</a>':'')+'<button class="btn-mini btn-mini--pay" onclick="openPayModal(\''+e.id+'\')">Pay</button><button class="btn-mini btn-mini--snooze" onclick="snoozeExpense(\''+e.id+'\')">Snooze</button><button class="btn-mini btn-mini--cancel" onclick="cancelExpense(\''+e.id+'\')">Cancel</button></div></div>';}).join('');}
function renderTable(){const t=document.getElementById('expenseTableBody');if(expenses.length===0){t.innerHTML='<tr><td colspan="8"><div class="empty">No expenses yet</div></td></tr>';return;}t.innerHTML=expenses.map(e=>'<tr><td class="row-name">'+(e.link?'<a href="'+e.link+'" target="_blank">'+e.name+'</a>':e.name)+'</td><td>'+typeBadge(e.type)+'</td><td><div class="row-cat">'+e.category+'</div></td><td>'+e.cycle+'</td><td>'+fmtDue(e.nextDue)+'</td><td class="num">&#8377;'+fmtR(e.amount)+'</td><td>'+statusBadge(e.status)+'</td><td><button class="del-btn" onclick="deleteExpense(\''+e.id+'\')">x</button></td></tr>').join('');}
function renderCategories(){const g=document.getElementById('catGrid');const a=expenses.filter(e=>e.status!=='cancelled');const c={};a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;c[e.category]=(c[e.category]||0)+m;});const s=Object.entries(c).sort((a,b)=>b[1]-a[1]);if(s.length===0){g.innerHTML='<div class="empty">No categories</div>';return;}const mx=s[0][1];g.innerHTML=s.map(([cat,amt])=>{const cv=catColor(cat);return'<div class="cat-card"><div class="cat-card__name">'+cat+'</div><div class="cat-card__amount">&#8377;'+fmtR(amt)+'<span class="per">/mo</span></div><div class="cat-card__bar"><div class="cat-card__bar-fill" style="width:'+Math.round(amt/mx*100)+'%;background:var(--'+cv+')"></div></div></div>';}).join('');}
function renderPayments(){const l=document.getElementById('payHistoryList');if(!payments.length){l.innerHTML='<div class="empty"><div class="empty__text">No payments yet</div></div>';}else{l.innerHTML=payments.map((p,i)=>'<div class="pay-history-item" style="--i:'+i+'"><div class="pay-history-item__icon" style="background:var(--'+catColor(p.category)+'-dim);color:var(--'+catColor(p.category)+')">'+catIcon(p.category)+'</div><div class="pay-history-item__info"><div class="pay-history-item__name">'+p.name+'</div><div class="pay-history-item__meta">'+(p.category||'-')+' - '+new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})+'</div></div><span class="pay-method pay-method--'+(p.method==='upi'?'upi':'manual')+'">'+p.method+'</span><div class="pay-history-item__amount">&#8377;'+fmtR(p.amount)+'</div></div>').join('');}const total=payments.reduce((s,p)=>s+p.amount,0);const upiT=payments.filter(p=>p.method==='upi').reduce((s,p)=>s+p.amount,0);document.getElementById('paySummary').innerHTML='<div class="summary-row"><span class="summary-row__label">UPI</span><span class="summary-row__value">&#8377;'+fmtR(upiT)+'</span></div><div class="summary-row"><span class="summary-row__label">Manual</span><span class="summary-row__value">&#8377;'+fmtR(total-upiT)+'</span></div><div class="summary-row summary-row--total"><span class="summary-row__label">Total Paid</span><span class="summary-row__value">&#8377;'+fmtR(total)+'</span></div>';}
function renderSettings(){if(settings.renewal==='true')document.getElementById('setRenewal').checked=true;if(settings.days)document.getElementById('setDays').value=settings.days;if(settings.push==='true')document.getElementById('setPush').checked=true;}
function switchTab(t,b){document.querySelectorAll('.nav-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');['dashboard','payments','insights','settings'].forEach(v=>{document.getElementById('view-'+v).style.display=v===t?'block':'none';});if(t==='insights')renderInsights();}
function openModal(){document.getElementById('modalOverlay').classList.add('open');const d=new Date();d.setDate(d.getDate()+30);document.getElementById('fNextDue').value=d.toISOString().split('T')[0];}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');['fName','fAmount','fCategory','fLink','fUpiId'].forEach(i=>document.getElementById(i).value='');document.getElementById('merchantHint').style.display='none';}
function checkMerchant(){const n=document.getElementById('fName').value.toLowerCase().trim();const h=document.getElementById('merchantHint');const f=Object.keys(MERCHANTS).find(m=>n.includes(m));if(f&&n.length>2){const m=MERCHANTS[f];if(!document.getElementById('fCategory').value)document.getElementById('fCategory').value=m.cat;if(!document.getElementById('fLink').value&&m.link)document.getElementById('fLink').value=m.link;h.innerHTML='Detected: <strong>'+f+'</strong> - auto-filled';h.style.display='block';}else h.style.display='none';}
function submitExpense(){const d={name:document.getElementById('fName').value.trim(),amount:parseInt(document.getElementById('fAmount').value),category:document.getElementById('fCategory').value.trim()||'Other',type:document.getElementById('fType').value,cycle:document.getElementById('fCycle').value,nextDue:document.getElementById('fNextDue').value,link:document.getElementById('fLink').value.trim(),upiId:document.getElementById('fUpiId').value.trim()};if(!d.name||!d.amount||!d.nextDue){showToast('Fill name, amount, due date');return;}addExpense(d);closeModal();loadData();showToast('Added');}
function openPayModal(id){const e=expenses.find(x=>x.id===id);if(!e)return;currentPayExpense=e;document.getElementById('payName').textContent=e.name;document.getElementById('payAmount').textContent=fmtR(e.amount);const uid=e.upiId||'';const ul=uid?'upi://pay?pa='+uid+'&pn='+encodeURIComponent(e.name)+'&am='+e.amount+'&cu=INR':'';document.getElementById('upiLink').value=ul;document.getElementById('payApps').innerHTML=PAY_APPS.map(a=>'<a class="pay-app" href="'+(uid?a.scheme+'://pay?pa='+uid+'&pn='+encodeURIComponent(e.name)+'&am='+e.amount+'&cu=INR':a.scheme+'://')+'"><div class="pay-app__icon" style="background:'+a.color+'">'+a.icon+'</div><div class="pay-app__name">'+a.name+'</div></a>').join('');document.getElementById('payOverlay').classList.add('open');}
function closePayModal(){document.getElementById('payOverlay').classList.remove('open');currentPayExpense=null;}
function copyUpiLink(){const i=document.getElementById('upiLink');i.select();document.execCommand('copy');showToast('Copied');}
function markPaid(){if(!currentPayExpense)return;const e=currentPayExpense;addPayment({expenseId:e.id,name:e.name,amount:e.amount,category:e.category,method:'upi'});const n=new Date(e.nextDue);n.setMonth(n.getMonth()+1);updateExpense(e.id,{nextDue:n.toISOString().split('T')[0]});closePayModal();loadData();showToast('Paid');}
function snoozeExpense(id){const n=new Date();n.setDate(n.getDate()+30);updateExpense(id,{status:'snoozed',nextDue:n.toISOString().split('T')[0]});loadData();showToast('Snoozed');}
function cancelExpense(id){updateExpense(id,{status:'cancelled'});loadData();showToast('Cancelled');}
function renewExpense(id){const n=new Date();n.setDate(n.getDate()+30);updateExpense(id,{status:'active',nextDue:n.toISOString().split('T')[0]});loadData();showToast('Renewed');}
function deleteExpense(id){deleteExpenseData(id);loadData();showToast('Deleted');}
function saveSettings(){const d={renewal:document.getElementById('setRenewal').checked?'true':'false',days:document.getElementById('setDays').value,push:document.getElementById('setPush').checked?'true':'false'};saveSettingsData(d);showToast('Saved');}
function togglePush(){if(document.getElementById('setPush').checked){if('Notification'in window){Notification.requestPermission().then(p=>{if(p!=='granted'){document.getElementById('setPush').checked=false;showToast('Denied');return;}saveSettings();});}else{saveSettings();}}else{saveSettings();}}
function clearAllData(){if(!confirm('Delete ALL data?'))return;clearAllDataLocal();loadData();showToast('Cleared');}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}

// ===== CHARTS =====
function renderInsights(){
  if(typeof Chart==='undefined')return;
  const isDark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  const textColor=isDark?'#9c938b':'#78706c';
  const gridColor=isDark?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)';
  const accent=getCSSVar('--accent')||'#c2410c';
  const blue=getCSSVar('--blue')||'#0369a1';
  const green=getCSSVar('--green')||'#059669';
  const amber=getCSSVar('--amber')||'#d97706';
  const purple=getCSSVar('--purple')||'#7c3aed';
  const red=getCSSVar('--red')||'#dc2626';
  Chart.defaults.font.family="'Plus Jakarta Sans',system-ui,sans-serif";
  Chart.defaults.color=textColor;
  const active=expenses.filter(e=>e.status!=='cancelled');

  // 1. Category pie chart
  const catMap={};
  active.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;catMap[e.category]=(catMap[e.category]||0)+m;});
  const catLabels=Object.keys(catMap);
  const catValues=Object.values(catMap);
  const catColors=[accent,blue,green,amber,purple,red,'#0891b2','#db2777','#65a30d','#7c2d12'];
  destroyChart('catChartInst');
  if(catLabels.length>0){
    catChartInst=new Chart(document.getElementById('catChart'),{
      type:'doughnut',
      data:{labels:catLabels.map(c=>c+' (\u20B9'+fmtR(catMap[c])+')'),datasets:[{data:catValues,backgroundColor:catColors.slice(0,catLabels.length),borderWidth:2,borderColor:getCSSVar('--surface')||'#fff'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{padding:12,usePointStyle:true,pointStyle:'circle',font:{size:12}}}},cutout:'55%'}
    });
  }else{document.getElementById('catChart').parentElement.innerHTML='<div class="empty"><div class="empty__text">No data to chart yet</div></div>';}

  // 2. Monthly trend bar chart (last 6 months from payments)
  const months=[];
  const now=new Date();
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({key:d.getFullYear()+'-'+d.getMonth(),label:d.toLocaleDateString('en-IN',{month:'short'})});}
  const monthData=months.map(m=>{return payments.filter(p=>{const d=new Date(p.date);return d.getFullYear()+'-'+d.getMonth()===m.key;}).reduce((s,p)=>s+p.amount,0);});
  destroyChart('trendChartInst');
  if(payments.length>0){
    trendChartInst=new Chart(document.getElementById('trendChart'),{
      type:'bar',
      data:{labels:months.map(m=>m.label),datasets:[{label:'Paid (\u20B9)',data:monthData,backgroundColor:accent,borderRadius:6,barThickness:'flex',maxBarThickness:50}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gridColor},ticks:{callback:v=>'\u20B9'+fmtR(v)}},x:{grid:{display:false}}}}
    });
  }else{document.getElementById('trendChart').parentElement.innerHTML='<div class="empty"><div class="empty__text">No payments recorded yet</div></div>';}

  // 3. Expenses by type (horizontal bar)
  const typeMap={sub:0,bill:0,pers:0};
  active.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;typeMap[e.type]=(typeMap[e.type]||0)+m;});
  destroyChart('typeChartInst');
  if(active.length>0){
    typeChartInst=new Chart(document.getElementById('typeChart'),{
      type:'bar',
      data:{labels:['Subscriptions','Bills','Personal'],datasets:[{data:[typeMap.sub,typeMap.bill,typeMap.pers],backgroundColor:[accent,blue,green],borderRadius:6,barThickness:'flex',maxBarThickness:60}]},
      options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,grid:{color:gridColor},ticks:{callback:v=>'\u20B9'+fmtR(v)}},y:{grid:{display:false}}}}
    });
  }else{document.getElementById('typeChart').parentElement.innerHTML='<div class="empty"><div class="empty__text">No expenses yet</div></div>';}

  // 4. Payment method breakdown (pie)
  const upiTotal=payments.filter(p=>p.method==='upi').reduce((s,p)=>s+p.amount,0);
  const manualTotal=payments.filter(p=>p.method!=='upi').reduce((s,p)=>s+p.amount,0);
  destroyChart('methodChartInst');
  if(payments.length>0){
    methodChartInst=new Chart(document.getElementById('methodChart'),{
      type:'pie',
      data:{labels:['UPI (\u20B9'+fmtR(upiTotal)+')','Manual (\u20B9'+fmtR(manualTotal)+')'],datasets:[{data:[upiTotal,manualTotal],backgroundColor:[purple,blue],borderWidth:2,borderColor:getCSSVar('--surface')||'#fff'}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{padding:12,usePointStyle:true,pointStyle:'circle',font:{size:12}}}}}
    });
  }else{document.getElementById('methodChart').parentElement.innerHTML='<div class="empty"><div class="empty__text">No payments recorded yet</div></div>';}
}
function destroyChart(name){if(window[name]){window[name].destroy();window[name]=null;}}

// ===== EXPORT =====
function exportCSV(){
  if(expenses.length===0&&payments.length===0){showToast('No data to export');return;}
  let csv='';
  csv+='EXPENSES\n';
  csv+='Name,Type,Category,Cycle,Next Due,Amount,Status,Created At\n';
  expenses.forEach(e=>{csv+=[e.name,e.type,e.category,e.cycle,e.nextDue,e.amount,e.status,e.createdAt].map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')+'\n';});
  csv+='\nPAYMENTS\n';
  csv+='Name,Amount,Category,Method,Date\n';
  payments.forEach(p=>{csv+=[p.name,p.amount,p.category||'',p.method,p.date].map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')+'\n';});
  csv+='\nSUMMARY\n';
  const a=expenses.filter(e=>e.status!=='cancelled');
  let tm=0,sm=0,bm=0,pm=0;
  a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;tm+=m;if(e.type==='sub')sm+=m;else if(e.type==='bill')bm+=m;else pm+=m;});
  csv+='Total Monthly Burn,'+fmtR(tm)+'\n';
  csv+='Subscriptions Monthly,'+fmtR(sm)+'\n';
  csv+='Bills Monthly,'+fmtR(bm)+'\n';
  csv+='Personal Monthly,'+fmtR(pm)+'\n';
  csv+='Yearly Estimate,'+fmtR(tm*12)+'\n';
  csv+='Total Expenses,'+expenses.length+'\n';
  csv+='Total Payments,'+payments.length+'\n';
  csv+='Total Paid Amount,'+fmtR(payments.reduce((s,p)=>s+p.amount,0))+'\n';
  downloadFile(csv,'toka-export-'+new Date().toISOString().split('T')[0]+'.csv','text/csv');
  showToast('CSV downloaded');
}
function exportJSON(){
  if(expenses.length===0&&payments.length===0){showToast('No data to export');return;}
  const data={exportedAt:new Date().toISOString(),app:'Toka',version:'1.0',expenses:expenses,payments:payments,settings:settings};
  downloadFile(JSON.stringify(data,null,2),'toka-backup-'+new Date().toISOString().split('T')[0]+'.json','application/json');
  showToast('JSON downloaded');
}
function downloadFile(content,filename,mime){
  const blob=new Blob([content],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=filename;document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
}

document.getElementById('modalOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.getElementById('payOverlay').addEventListener('click',e=>{if(e.target===e.currentTarget)closePayModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closePayModal();}});
loadData();
