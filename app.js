
const MERCHANTS={
netflix:{link:'https://www.netflix.com/cancelplan',cat:'OTT',amt:649},
spotify:{link:'https://www.spotify.com/account/subscription/',cat:'OTT',amt:119},
hotstar:{link:'https://www.hotstar.com/in/subscribe/myaccount',cat:'OTT',amt:299},
prime:{link:'https://www.amazon.in/mc/yourmembershipsandsubscriptions',cat:'OTT',amt:1499,yrly:true},
youtube:{link:'https://www.youtube.com/paid_memberships',cat:'OTT',amt:129},
jio:{link:'https://www.jio.com/selfcare/dashboard/',cat:'Telecom',amt:299},
airtel:{link:'https://www.airtel.in/myaccount/',cat:'Telecom',amt:299},
microsoft:{link:'https://account.microsoft.com/services',cat:'Software',amt:4899,yrly:true},
adobe:{link:'https://account.adobe.com/plans',cat:'Software',amt:1675},
canva:{link:'https://www.canva.com/settings/billing',cat:'Software',amt:4000,yrly:true},
swiggy:{link:'https://www.swiggy.com/membership',cat:'Food',amt:149},
zomato:{link:'https://www.zomato.com/gold',cat:'Food',amt:149},
cult:{link:'https://www.cult.fit/profile',cat:'Fitness',amt:1499},
cultfit:{link:'https://www.cult.fit/profile',cat:'Fitness',amt:1499},
google:{link:'https://one.google.com/about/ai-premium',cat:'Software',amt:1950,yrly:true},
icloud:{link:'https://support.apple.com/billing',cat:'Software',amt:75,yrly:true},
apple:{link:'https://support.apple.com/billing',cat:'Software',amt:75,yrly:true},
chatgpt:{link:'https://chat.openai.com/#settings/Subscription',cat:'Software',amt:1950,yrly:true},
openai:{link:'https://chat.openai.com/#settings/Subscription',cat:'Software',amt:1950,yrly:true},
github:{link:'https://github.com/settings/billing',cat:'Software',amt:499,yrly:true},
notion:{link:'https://www.notion.so/my-integrations',cat:'Software',amt:800,yrly:true},
linktree:{link:'https://linktr.ee/account/settings',cat:'Software',amt:999,yrly:true},
linkedin:{link:'https://www.linkedin.com/premium/manage',cat:'Software',amt:1400,yrly:true},
gaana:{link:'https://gaana.com/myaccount',cat:'OTT',amt:999,yrly:true},
wynk:{link:'https://www.wynk.in/music/profile',cat:'OTT',amt:399,yrly:true},
jiosaavn:{link:'https://www.jiosaavn.com/account',cat:'OTT',amt:399,yrly:true},
amazon:{link:'https://www.amazon.in/mc/yourmembershipsandsubscriptions',cat:'OTT',amt:1499,yrly:true},
disney:{link:'https://www.hotstar.com/in/subscribe/myaccount',cat:'OTT',amt:299},
hbo:{link:'https://www.hbomax.com/account',cat:'OTT',amt:649},
mubi:{link:'https://mubi.com/settings',cat:'OTT',amt:499,yrly:true},
medium:{link:'https://medium.com/me/subscription',cat:'Software',amt:400,yrly:true},
dribbble:{link:'https://dribbble.com/account',cat:'Software',amt:640,yrly:true},
behance:{link:'https://www.behance.net/settings',cat:'Software',amt:0},
figma:{link:'https://www.figma.com/settings',cat:'Software',amt:2400,yrly:true},
namecheap:{link:'https://www.namecheap.com/dashboard/',cat:'Software',amt:800,yrly:true},
godaddy:{link:'https://dcc.godaddy.com/manage',cat:'Software',amt:600,yrly:true},
dream11:{link:'https://www.dream11.com/',cat:'Gaming',amt:199},
gpay:{link:'',cat:'Telecom',amt:0},
phonepe:{link:'',cat:'Telecom',amt:0},
paytm:{link:'',cat:'Telecom',amt:0},
gmail:{link:'https://one.google.com/about/ai-premium',cat:'Software',amt:1950,yrly:true},
dopub:{link:'https://digitalopc.onelink.me/collect',cat:'Telecom',amt:0},
electricity:{link:'',cat:'Utility',amt:1200},
gas:{link:'',cat:'Utility',amt:500},
water:{link:'',cat:'Utility',amt:300},
broadband:{link:'',cat:'Utility',amt:999},
internet:{link:'',cat:'Utility',amt:999},
wifi:{link:'',cat:'Utility',amt:999},
gym:{link:'',cat:'Fitness',amt:1500},
insurance:{link:'',cat:'Insurance',amt:8000,yrly:true},
rent:{link:'',cat:'Rent',amt:15000},
loan:{link:'',cat:'Insurance',amt:5000},
emi:{link:'',cat:'Insurance',amt:5000},
sip:{link:'',cat:'Insurance',amt:5000},
udemy:{link:'https://www.udemy.com/home/my-courses/learning/',cat:'Education',amt:500},
coursera:{link:'https://www.coursera.org/account',cat:'Education',amt:3999,yrly:true},
skillshare:{link:'https://www.skillshare.com/account/subscription',cat:'Education',amt:2000,yrly:true},
duolingo:{link:'https://www.duolingo.com/plus',cat:'Education',amt:2500,yrly:true},
byjus:{link:'',cat:'Education',amt:3000},
unacademy:{link:'',cat:'Education',amt:1500}
};
const PAY_APPS=[{name:'PhonePe',icon:'P',color:'#5f259f',scheme:'phonepe'},{name:'GPay',icon:'G',color:'#1a73e8',scheme:'tez'},{name:'Paytm',icon:'P',color:'#00baf2',scheme:'paytmmp'},{name:'BHIM',icon:'B',color:'#f47216',scheme:'bhim'},{name:'Amazon Pay',icon:'A',color:'#ff9900',scheme:'amazonpay'},{name:'WhatsApp',icon:'W',color:'#25d366',scheme:'whatsapp'}];
const DAILY_CATS=['Food','Transport','Shopping','Entertainment','Bills','Health','Other'];
let expenses=[],payments=[],settings={},currentPayExpense=null;
let dailyLogs=[],ratings={};
let catChartInst=null,trendChartInst=null,typeChartInst=null,methodChartInst=null;
let streakCount=0,streakFreeze=0,streakLastDate='';
function load(key,def){try{const v=localStorage.getItem('toka_'+key);return v?JSON.parse(v):def;}catch(e){return def;}}
function save(key,val){localStorage.setItem('toka_'+key,JSON.stringify(val));}
function genId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function fmtR(n){return new Intl.NumberFormat('en-IN').format(Math.round(n));}
function daysUntil(d){const x=new Date(d);x.setHours(0,0,0,0);const t=new Date();t.setHours(0,0,0,0);return Math.round((x-t)/86400000);}
function fmtDue(d){const days=daysUntil(d);if(days<0)return'Overdue by '+Math.abs(days)+'d';if(days===0)return'Due today';if(days===1)return'Tomorrow';return'In '+days+' days';}
function typeBadge(t){return'<span class="type-badge type-badge--'+t+'">'+(t==='sub'?'Sub':t==='bill'?'Bill':'Pers')+'</span>';}
function statusBadge(s){return'<span class="status-badge status-badge--'+s+'">'+(s==='active'?'Active':s==='snoozed'?'Snoozed':'Cancelled')+'</span>';}
function catColor(c){const m={'OTT':'accent','Telecom':'blue','Utility':'blue','Fitness':'green','Food':'amber','Software':'accent','Rent':'red','Education':'green','Gaming':'purple','Insurance':'blue','Other':'accent'};return m[c]||'accent';}
function catIcon(c){return c?c.charAt(0).toUpperCase():'?';}
function getCSSVar(name){return getComputedStyle(document.documentElement).getPropertyValue(name).trim();}
function todayStr(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function loadData(){expenses=load('expenses',[]);payments=load('payments',[]);settings=load('settings',{});dailyLogs=load('dailyLogs',[]);ratings=load('ratings',{});updateStreak();renderDashboard();renderPayments();renderSettings();renderInsights();renderDailyLog();renderStreak();renderInsightsTab();}

// ===== STREAK SYSTEM =====
function updateStreak(){
  const today=todayStr();
  if(streakLastDate===today)return;
  if(!streakLastDate){streakCount=0;streakFreeze=1;streakLastDate=today;saveStreak();return;}
  const last=new Date(streakLastDate);
  const now=new Date(today);
  const diff=Math.round((now-last)/86400000);
  if(diff===1){
    streakCount++;
    if(streakCount===7)streakFreeze=Math.max(streakFreeze,1);
    if(streakCount===30)streakFreeze=Math.max(streakFreeze,2);
    streakLastDate=today;
  }else if(diff>1){
    if(streakFreeze>0&&diff===2){
      streakFreeze--;
      streakCount++;
      streakLastDate=today;
    }else{
      streakCount=1;
      streakFreeze=1;
      streakLastDate=today;
    }
  }
  saveStreak();
}
function saveStreak(){save('streak',{count:streakCount,freeze:streakFreeze,lastDate:streakLastDate});}
function loadStreak(){const s=load('streak',{});streakCount=s.count||0;streakFreeze=s.freeze||0;streakLastDate=s.lastDate||'';}
function renderStreak(){
  const el=document.getElementById('streakBadge');
  if(!el)return;
  let flame='🔥';
  el.innerHTML='<span class="streak-flame">'+flame+'</span><span class="streak-count">'+streakCount+'</span>'+(streakFreeze>0?'<span class="streak-freeze" title="Streak freeze available">❄️</span>':'');
  el.className=streakCount>0?'streak-badge active':'streak-badge';
}

// ===== DAILY KHARCHA LOG =====
function quickLog(){
  const amt=document.getElementById('quickAmount').value;
  const cat=document.getElementById('quickCat').value;
  const note=document.getElementById('quickNote').value.trim();
  if(!amt||parseInt(amt)<=0){showToast('Enter an amount');return;}
  const entry={id:genId(),amount:parseInt(amt),category:cat||'Other',note:note||'',date:todayStr(),time:new Date().toISOString()};
  dailyLogs.unshift(entry);
  save('dailyLogs',dailyLogs);
  document.getElementById('quickAmount').value='';
  document.getElementById('quickNote').value='';
  document.getElementById('quickCat').value='Food';
  renderDailyLog();
  renderInsightsTab();
  showToast('Logged ₹'+fmtR(parseInt(amt)));
}
function deleteDailyLog(id){dailyLogs=dailyLogs.filter(e=>e.id!==id);save('dailyLogs',dailyLogs);renderDailyLog();renderInsightsTab();showToast('Deleted');}
function renderDailyLog(){
  const list=document.getElementById('dailyLogList');
  if(!list)return;
  const today=todayStr();
  const todayEntries=dailyLogs.filter(e=>e.date===today);
  const todayTotal=todayEntries.reduce((s,e)=>s+e.amount,0);
  document.getElementById('dailyTotal').textContent='₹'+fmtR(todayTotal);
  if(todayEntries.length===0){list.innerHTML='<div class="empty"><div class="empty__text">No spending logged today</div></div>';return;}
  list.innerHTML=todayEntries.map((e,i)=>{
    const cv=catColor(e.category);
    return '<div class="daily-item" style="--i:'+i+'"><div class="daily-item__icon" style="background:var(--'+cv+'-dim);color:var(--'+cv+')">'+catIcon(e.category)+'</div><div class="daily-item__info"><div class="daily-item__cat">'+e.category+(e.note?' · <span class="daily-item__note">'+e.note+'</span>':'')+'</div><div class="daily-item__time">'+new Date(e.time).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})+'</div></div><div class="daily-item__amount">₹'+fmtR(e.amount)+'</div><button class="del-btn" onclick="deleteDailyLog(\''+e.id+'\')">x</button></div>';
  }).join('');
  const weekTotal=dailyLogs.filter(e=>{const d=new Date(e.date);const now=new Date();return(now-d)/86400000<=7;}).reduce((s,e)=>s+e.amount,0);
  const wt=document.getElementById('weekTotal');if(wt)wt.textContent='₹'+fmtR(weekTotal);
}
function renderDailyHistory(){
  const list=document.getElementById('dailyHistoryList');
  if(!list)return;
  if(dailyLogs.length===0){list.innerHTML='<div class="empty"><div class="empty__text">No history yet</div></div>';return;}
  const byDate={};
  dailyLogs.forEach(e=>{if(!byDate[e.date])byDate[e.date]=[];byDate[e.date].push(e);});
  const dates=Object.keys(byDate).sort().reverse().slice(0,14);
  list.innerHTML=dates.map(date=>{
    const entries=byDate[date];
    const total=entries.reduce((s,e)=>s+e.amount,0);
    const d=new Date(date);
    const label=d.toLocaleDateString('en-IN',{day:'numeric',month:'short',weekday:'short'});
    const today=todayStr()===date;
    return '<div class="daily-hist-day"><div class="daily-hist-day__head"><span class="daily-hist-day__date">'+(today?'Today':label)+'</span><span class="daily-hist-day__total">₹'+fmtR(total)+'</span></div>'+entries.map(e=>'<div class="daily-hist-item"><span class="daily-hist-item__cat">'+e.category+(e.note?' · '+e.note:'')+'</span><span class="daily-hist-item__amt">₹'+fmtR(e.amount)+'</span></div>').join('')+'</div>';
  }).join('');
}

// ===== SMART INSIGHTS =====
function renderInsightsTab(){
  const el=document.getElementById('insightsCards');
  if(!el)return;
  const insights=generateInsights();
  if(insights.length===0){el.innerHTML='<div class="empty"><div class="empty__text">Add expenses and log daily spending to see insights</div></div>';return;}
  el.innerHTML=insights.map((ins,i)=>'<div class="insight-card insight-card--'+ins.type+'" style="--i:'+i+'"><div class="insight-card__icon">'+ins.icon+'</div><div class="insight-card__body"><div class="insight-card__title">'+ins.title+'</div><div class="insight-card__desc">'+ins.desc+'</div></div></div>').join('');
}
function generateInsights(){
  const out=[];
  const today=todayStr();
  const todayEntries=dailyLogs.filter(e=>e.date===today);
  const todayTotal=todayEntries.reduce((s,e)=>s+e.amount,0);
  const now=new Date();
  const thisWeek=dailyLogs.filter(e=>{const d=new Date(e.date);return(now-d)/86400000<=7;});
  const lastWeek=dailyLogs.filter(e=>{const d=new Date(e.date);const diff=(now-d)/86400000;return diff>7&&diff<=14;});
  const weekTotal=thisWeek.reduce((s,e)=>s+e.amount,0);
  const lastWeekTotal=lastWeek.reduce((s,e)=>s+e.amount,0);
  const active=expenses.filter(e=>e.status!=='cancelled');
  const subMonthly=active.reduce((s,e)=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;return s+m;},0);
  const subYearly=subMonthly*12;
  if(subYearly>0){
    out.push({type:'amber',icon:'💰',title:'Yearly subscription burn: ₹'+fmtR(subYearly),desc:'That\'s ₹'+fmtR(subYearly/12)+' every month on subscriptions alone. Cancelling even one could save you thousands.'});
  }
  if(weekTotal>0&&lastWeekTotal>0){
    const pct=Math.round((weekTotal-lastWeekTotal)/lastWeekTotal*100);
    if(pct>20){
      out.push({type:'red',icon:'📈',title:'You\'re spending '+pct+'% more this week',desc:'₹'+fmtR(weekTotal)+' this week vs ₹'+fmtR(lastWeekTotal)+' last week. Time to slow down?'});
    }else if(pct<-20){
      out.push({type:'green',icon:'📉',title:'You\'re spending '+Math.abs(pct)+'% less this week',desc:'₹'+fmtR(weekTotal)+' this week vs ₹'+fmtR(lastWeekTotal)+' last week. Nice control!'});
    }else{
      out.push({type:'blue',icon:'⚖️',title:'Spending is stable',desc:'₹'+fmtR(weekTotal)+' this week vs ₹'+fmtR(lastWeekTotal)+' last week. Consistent.'});
    }
  }else if(weekTotal>0){
    out.push({type:'blue',icon:'📅',title:'₹'+fmtR(weekTotal)+' spent this week',desc:'Keep logging daily to see weekly trends and patterns.'});
  }
  if(todayTotal>0){
    out.push({type:'accent',icon:'🛒',title:'₹'+fmtR(todayTotal)+' spent today',desc:todayEntries.length+' transaction'+(todayEntries.length>1?'s':'')+' today. '+DAILY_CATS.map(c=>{const t=todayEntries.filter(e=>e.category===c).reduce((s,e)=>s+e.amount,0);return t>0?c+': ₹'+fmtR(t):null;}).filter(Boolean).join(', ')+'.'});
  }
  if(thisWeek.length>0){
    const catMap={};
    thisWeek.forEach(e=>{catMap[e.category]=(catMap[e.category]||0)+e.amount;});
    const topCat=Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0];
    if(topCat){
      const pctOfWeek=Math.round(topCat[1]/weekTotal*100);
      out.push({type:'purple',icon:'🏆',title:topCat[0]+' is your top category',desc:'₹'+fmtR(topCat[1])+' this week — '+pctOfWeek+'% of your weekly spending.'});
    }
  }
  if(todayTotal>0&&subMonthly>0){
    const days=Math.round(todayTotal/(subMonthly/30));
    if(days>=1){
      out.push({type:'amber',icon:'🔄',title:'Today\'s spending = '+days+' day'+(days>1?'s':'')+' of subscriptions',desc:'You spent ₹'+fmtR(todayTotal)+' today. Your subscriptions cost ₹'+fmtR(Math.round(subMonthly/30))+'/day.'});
    }
  }
  if(active.length>0){
    const mostExp=active.reduce((a,b)=>{let ma=a.amount;if(a.cycle==='yearly')ma=a.amount/12;else if(a.cycle==='quarterly')ma=a.amount/3;else if(a.cycle==='onetime')ma=0;let mb=b.amount;if(b.cycle==='yearly')mb=b.amount/12;else if(b.cycle==='quarterly')mb=b.amount/3;else if(b.cycle==='onetime')mb=0;return mb>ma?b:a;});
    let mAmt=mostExp.amount;if(mostExp.cycle==='yearly')mAmt=mostExp.amount/12;else if(mostExp.cycle==='quarterly')mAmt=mostExp.amount/3;
    out.push({type:'red',icon:'⚠️',title:mostExp.name+' costs ₹'+fmtR(mAmt)+'/month',desc:'Your most expensive active subscription. ₹'+fmtR(mAmt*12)+'/year. Worth it?'});
  }
  if(dailyLogs.length>=3){
    const dates=[...new Set(dailyLogs.map(e=>e.date))];
    const totalAll=dailyLogs.reduce((s,e)=>s+e.amount,0);
    const avg=Math.round(totalAll/dates.length);
    out.push({type:'blue',icon:'📊',title:'Average daily spending: ₹'+fmtR(avg),desc:'Across '+dates.length+' days of tracking. Total ₹'+fmtR(totalAll)+' logged.'});
  }
  return out.slice(0,6);
}

// ===== SUBSCRIPTION REVIEW / RATING =====
function getRatingPrompt(){
  const active=expenses.filter(e=>e.status!=='cancelled');
  if(active.length===0)return null;
  const today=todayStr();
  for(const e of active){
    const lastRated=ratings[e.id];
    if(!lastRated||daysSince(lastRated.date)>=7){
      return e;
    }
  }
  return null;
}
function daysSince(dateStr){const d=new Date(dateStr);const now=new Date();d.setHours(0,0,0,0);now.setHours(0,0,0,0);return Math.round((now-d)/86400000);}
function showRatingPrompt(){
  const e=getRatingPrompt();
  if(!e){document.getElementById('ratingPrompt').style.display='none';return;}
  document.getElementById('ratingPrompt').style.display='block';
  document.getElementById('ratingName').textContent=e.name;
  document.getElementById('ratingName').dataset.expenseId=e.id;
  document.querySelectorAll('.star-btn').forEach(s=>s.dataset.selected='');
}
function rateSub(stars){
  document.querySelectorAll('.star-btn').forEach(s=>{
    s.dataset.selected=parseInt(s.dataset.star)<=stars?'1':'';
  });
}
function submitRating(){
  const nameEl=document.getElementById('ratingName');
  const id=nameEl.dataset.expenseId;
  const selected=document.querySelector('.star-btn[data-selected="1"]');
  if(!selected){showToast('Tap a star to rate');return;}
  const stars=parseInt(selected.dataset.star);
  if(!ratings[id])ratings[id]={};
  ratings[id].lastRating=stars;
  ratings[id].date=todayStr();
  ratings[id].history=ratings[id].history||[];
  ratings[id].history.push({stars,date:todayStr()});
  save('ratings',ratings);
  showRatingPrompt();
  renderSubReview();
  showToast('Rated '+stars+'⭐');
}
function skipRating(){showRatingPrompt();showToast('Skipped');}
function renderSubReview(){
  const el=document.getElementById('subReviewList');
  if(!el)return;
  const active=expenses.filter(e=>e.status!=='cancelled');
  if(active.length===0){el.innerHTML='<div class="empty"><div class="empty__text">No active subscriptions</div></div>';return;}
  const items=active.map(e=>{
    let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;
    const r=ratings[e.id];
    const avgR=r&&r.history?Math.round(r.history.reduce((s,h)=>s+h.stars,0)/r.history.length*10)/10:null;
    const perUse=avgR&&avgR>0?Math.round(m/(avgR/5*30)):null;
    return {e,m,avgR,perUse};
  }).filter(x=>x.avgR).sort((a,b)=>(a.avgR||5)-(b.avgR||5));
  if(items.length===0){el.innerHTML='<div class="empty"><div class="empty__text">Rate your subscriptions to see cost-per-use</div></div>';return;}
  el.innerHTML=items.map(x=>{
    const stars='⭐'.repeat(Math.round(x.avgR));
    const cpuTxt=x.perUse?'₹'+fmtR(x.perUse)+'/use':'';
    const lowRating=x.avgR<=2.5;
    return '<div class="sub-review-item'+(lowRating?' sub-review-item--low':'')+'"><div class="sub-review-item__name">'+x.e.name+'</div><div class="sub-review-item__rating">'+stars+' <span class="sub-review-item__avg">'+x.avgR+'</span></div><div class="sub-review-item__cost">'+cpuTxt+'</div>'+(lowRating?'<div class="sub-review-item__warn">Low usage — consider cancelling?</div>':'')+'</div>';
  }).join('');
}

function addExpense(d){const id=genId();const e={id,...d,status:'active',createdAt:new Date().toISOString()};expenses.push(e);save('expenses',expenses);return e;}
function updateExpense(id,updates){const e=expenses.find(x=>x.id===id);if(!e)return null;if(updates.status!==undefined)e.status=updates.status;if(updates.nextDue!==undefined)e.nextDue=updates.nextDue;save('expenses',expenses);return e;}
function deleteExpenseData(id){expenses=expenses.filter(e=>e.id!==id);save('expenses',expenses);}
function addPayment(p){const pay={id:genId(),...p,date:new Date().toISOString()};payments.unshift(pay);save('payments',payments);return pay;}
function saveSettingsData(d){settings={...settings,...d};save('settings',settings);}
function clearAllDataLocal(){expenses=[];payments=[];settings={};dailyLogs=[];ratings={};streakCount=0;streakFreeze=0;streakLastDate='';localStorage.removeItem('toka_expenses');localStorage.removeItem('toka_payments');localStorage.removeItem('toka_settings');localStorage.removeItem('toka_dailyLogs');localStorage.removeItem('toka_ratings');localStorage.removeItem('toka_streak');}
function renderDashboard(){const a=expenses.filter(e=>e.status!=='cancelled');let tm=0,sm=0,bm=0,pm=0;a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;tm+=m;if(e.type==='sub')sm+=m;else if(e.type==='bill')bm+=m;else pm+=m;});document.getElementById('totalMonthly').textContent=fmtR(tm);document.getElementById('burnSub').innerHTML='<span><span class="dot dot--sub"></span>Subs <strong>₹'+fmtR(sm)+'</strong></span><span><span class="dot dot--bill"></span>Bills <strong>₹'+fmtR(bm)+'</strong></span><span><span class="dot dot--pers"></span>Pers <strong>₹'+fmtR(pm)+'</strong></span>';const uc=a.filter(e=>{const d=daysUntil(e.nextDue);return d>=0&&d<=7;}).length;const sc=expenses.filter(e=>e.status==='snoozed').length;document.getElementById('kpiRow').innerHTML='<div class="kpi-card" style="--i:0"><div class="kpi-card__value">₹'+fmtR(tm*12)+'</div><div class="kpi-card__label">Yearly</div></div><div class="kpi-card" style="--i:1"><div class="kpi-card__value">'+uc+'</div><div class="kpi-card__label">This Week</div></div><div class="kpi-card" style="--i:2"><div class="kpi-card__value" style="color:var(--amber)">'+sc+'</div><div class="kpi-card__label">Snoozed</div></div><div class="kpi-card" style="--i:3"><div class="kpi-card__value">'+expenses.length+'</div><div class="kpi-card__label">Total</div></div>';renderRenewals();renderTable();renderCategories();}
function renderRenewals(){const l=document.getElementById('renewalList');const u=expenses.filter(e=>e.status!=='cancelled').sort((a,b)=>daysUntil(a.nextDue)-daysUntil(b.nextDue)).slice(0,5);if(u.length===0){l.innerHTML='<div class="empty"><div class="empty__text">No renewals yet</div></div>';return;}l.innerHTML=u.map((e,i)=>{const d=daysUntil(e.nextDue);let cls='';if(d<=1)cls='urgent';else if(d<=3)cls='soon';const cv=catColor(e.category);const isManual=e.payType==='manual';const payLabel=isManual?'Pay':'Mark Paid';return'<div class="renewal-item" style="--i:'+i+'"><div class="renewal-item__icon" style="background:var(--'+cv+'-dim);color:var(--'+cv+')">'+catIcon(e.category)+'</div><div class="renewal-item__info"><div class="renewal-item__name">'+(e.link?'<a href="'+e.link+'" target="_blank">'+e.name+'</a>':e.name)+'</div><div class="renewal-item__due '+cls+'">'+fmtDue(e.nextDue)+' - '+e.category+(isManual?'':' · Auto')+'</div></div><div class="renewal-item__amount">₹'+fmtR(e.amount)+'</div><div class="renewal-item__actions">'+(e.link?'<a class="btn-mini btn-mini--manage" href="'+e.link+'" target="_blank">Manage</a>':'')+'<button class="btn-mini btn-mini--pay" onclick="openPayModal(\''+e.id+'\')">'+payLabel+'</button><button class="btn-mini btn-mini--snooze" onclick="snoozeExpense(\''+e.id+'\')">Snooze</button><button class="btn-mini btn-mini--cancel" onclick="cancelExpense(\''+e.id+'\')">Cancel</button></div></div>';}).join('');}
function monthlyAmount(e){let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;return m;}
function renderTable(){const t=document.getElementById('expenseTableBody');const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();const f=document.getElementById('filterStatus')?.value||'';let list=expenses.slice();if(q)list=list.filter(e=>e.name.toLowerCase().includes(q)||e.category.toLowerCase().includes(q));if(f)list=list.filter(e=>e.status===f);if(list.length===0){t.innerHTML='<tr><td colspan="9"><div class="empty">'+((q||f)?'No matches found':'No expenses yet')+'</div></td></tr>';return;}t.innerHTML=list.map(e=>{const mo=monthlyAmount(e);const yr=e.cycle==='onetime'?e.amount:mo*12;return'<tr><td class="row-name">'+(e.link?'<a href="'+e.link+'" target="_blank">'+e.name+'</a>':e.name)+'</td><td>'+typeBadge(e.type)+'</td><td><div class="row-cat">'+e.category+'</div></td><td>'+e.cycle+'</td><td>'+fmtDue(e.nextDue)+'</td><td class="num">₹'+fmtR(mo)+'</td><td class="num">₹'+fmtR(yr)+'</td><td>'+statusBadge(e.status)+'</td><td><button class="del-btn" onclick="deleteExpense(\''+e.id+'\')">x</button></td></tr>';}).join('');}
function renderCategories(){const g=document.getElementById('catGrid');const a=expenses.filter(e=>e.status!=='cancelled');const c={};a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;c[e.category]=(c[e.category]||0)+m;});const s=Object.entries(c).sort((a,b)=>b[1]-a[1]);if(s.length===0){g.innerHTML='<div class="empty">No categories</div>';return;}const mx=s[0][1];g.innerHTML=s.map(([cat,amt])=>{const cv=catColor(cat);return'<div class="cat-card"><div class="cat-card__name">'+cat+'</div><div class="cat-card__amount">₹'+fmtR(amt)+'<span class="per">/mo</span></div><div class="cat-card__bar"><div class="cat-card__bar-fill" style="width:'+Math.round(amt/mx*100)+'%;background:var(--'+cv+')"></div></div></div>';}).join('');}
function renderPayments(){const l=document.getElementById('payHistoryList');if(!payments.length){l.innerHTML='<div class="empty"><div class="empty__text">No payments yet</div></div>';}else{l.innerHTML=payments.map((p,i)=>'<div class="pay-history-item" style="--i:'+i+'"><div class="pay-history-item__icon" style="background:var(--'+catColor(p.category)+'-dim);color:var(--'+catColor(p.category)+')">'+catIcon(p.category)+'</div><div class="pay-history-item__info"><div class="pay-history-item__name">'+p.name+'</div><div class="pay-history-item__meta">'+(p.category||'-')+' - '+new Date(p.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})+'</div></div><span class="pay-method pay-method--'+(p.method==='upi'?'upi':'manual')+'">'+p.method+'</span><div class="pay-history-item__amount">₹'+fmtR(p.amount)+'</div></div>').join('');}const total=payments.reduce((s,p)=>s+p.amount,0);const upiT=payments.filter(p=>p.method==='upi').reduce((s,p)=>s+p.amount,0);document.getElementById('paySummary').innerHTML='<div class="summary-row"><span class="summary-row__label">UPI</span><span class="summary-row__value">₹'+fmtR(upiT)+'</span></div><div class="summary-row"><span class="summary-row__label">Manual</span><span class="summary-row__value">₹'+fmtR(total-upiT)+'</span></div><div class="summary-row summary-row--total"><span class="summary-row__label">Total Paid</span><span class="summary-row__value">₹'+fmtR(total)+'</span></div>';}
function renderSettings(){if(settings.renewal==='true')document.getElementById('setRenewal').checked=true;if(settings.days)document.getElementById('setDays').value=settings.days;if(settings.push==='true')document.getElementById('setPush').checked=true;}
function switchTab(t,b){document.querySelectorAll('.nav-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');['dashboard','dailylog','payments','insights','settings'].forEach(v=>{const el=document.getElementById('view-'+v);if(el)el.style.display=v===t?'block':'none';});if(t==='insights'){renderInsights();renderInsightsTab();renderSubReview();}if(t==='dailylog'){renderDailyLog();renderDailyHistory();}}
function openModal(){document.getElementById('modalOverlay').classList.add('open');const d=new Date();d.setDate(d.getDate()+30);document.getElementById('fNextDue').value=d.toISOString().split('T')[0];}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');['fName','fAmount','fCategory','fLink','fUpiId'].forEach(i=>document.getElementById(i).value='');document.getElementById('fPayType').value='auto';document.getElementById('merchantHint').style.display='none';}
function checkMerchant(){const n=document.getElementById('fName').value.toLowerCase().trim();const h=document.getElementById('merchantHint');const f=Object.keys(MERCHANTS).find(m=>n.includes(m));if(f&&n.length>2){const m=MERCHANTS[f];if(!document.getElementById('fCategory').value)document.getElementById('fCategory').value=m.cat;if(!document.getElementById('fLink').value&&m.link)document.getElementById('fLink').value=m.link;if(!document.getElementById('fAmount').value&&m.amt)document.getElementById('fAmount').value=m.amt;if(m.yrly){const c=document.getElementById('fCycle');if(c.value==='monthly')c.value='yearly';}h.innerHTML='Detected: <strong>'+f+'</strong> - auto-filled';h.style.display='block';}else h.style.display='none';}
function submitExpense(){const d={name:document.getElementById('fName').value.trim(),amount:parseInt(document.getElementById('fAmount').value),category:document.getElementById('fCategory').value.trim()||'Other',type:document.getElementById('fType').value,cycle:document.getElementById('fCycle').value,nextDue:document.getElementById('fNextDue').value,link:document.getElementById('fLink').value.trim(),upiId:document.getElementById('fUpiId').value.trim(),payType:document.getElementById('fPayType').value||'auto'};if(!d.name||!d.amount||!d.nextDue){showToast('Fill name, amount, due date');return;}addExpense(d);closeModal();loadData();showToast('Added');}
function openPayModal(id){const e=expenses.find(x=>x.id===id);if(!e)return;currentPayExpense=e;document.getElementById('payName').textContent=e.name;document.getElementById('payAmount').textContent=fmtR(e.amount);const uid=e.upiId||'';const ul=uid?'upi://pay?pa='+uid+'&pn='+encodeURIComponent(e.name)+'&am='+e.amount+'&cu=INR':'';document.getElementById('upiLink').value=ul;document.getElementById('payApps').innerHTML=PAY_APPS.map(a=>'<a class="pay-app" href="'+(uid?a.scheme+'://pay?pa='+uid+'&pn='+encodeURIComponent(e.name)+'&am='+e.amount+'&cu=INR':a.scheme+'://')+'"><div class="pay-app__icon" style="background:'+a.color+'">'+a.icon+'</div><div class="pay-app__name">'+a.name+'</div></a>').join('');document.getElementById('payOverlay').classList.add('open');}
function closePayModal(){document.getElementById('payOverlay').classList.remove('open');currentPayExpense=null;}
function copyUpiLink(){const i=document.getElementById('upiLink');i.select();document.execCommand('copy');showToast('Copied');}
function markPaid(){if(!currentPayExpense)return;const e=currentPayExpense;addPayment({expenseId:e.id,name:e.name,amount:e.amount,category:e.category,method:'upi'});const n=new Date(e.nextDue);if(e.cycle==='yearly'){n.setFullYear(n.getFullYear()+1);}else if(e.cycle==='quarterly'){n.setMonth(n.getMonth()+3);}else if(e.cycle==='onetime'){updateExpense(e.id,{status:'cancelled'});closePayModal();loadData();showToast('Paid');return;}else{n.setMonth(n.getMonth()+1);}updateExpense(e.id,{nextDue:n.toISOString().split('T')[0]});closePayModal();loadData();showToast('Paid');}
function snoozeExpense(id){const e=expenses.find(x=>x.id===id);if(!e)return;const n=new Date(e.nextDue);if(e.cycle==='yearly'){n.setFullYear(n.getFullYear()+1);}else if(e.cycle==='quarterly'){n.setMonth(n.getMonth()+3);}else{n.setMonth(n.getMonth()+1);}updateExpense(id,{status:'snoozed',nextDue:n.toISOString().split('T')[0]});loadData();showToast('Snoozed');}
function cancelExpense(id){updateExpense(id,{status:'cancelled'});loadData();showToast('Cancelled');}
function renewExpense(id){const e=expenses.find(x=>x.id===id);if(!e)return;const n=new Date(e.nextDue);if(e.cycle==='yearly'){n.setFullYear(n.getFullYear()+1);}else if(e.cycle==='quarterly'){n.setMonth(n.getMonth()+3);}else{n.setMonth(n.getMonth()+1);}updateExpense(id,{status:'active',nextDue:n.toISOString().split('T')[0]});loadData();showToast('Renewed');}
function deleteExpense(id){deleteExpenseData(id);loadData();showToast('Deleted');}
function saveSettings(){const d={renewal:document.getElementById('setRenewal').checked?'true':'false',days:document.getElementById('setDays').value,push:document.getElementById('setPush').checked?'true':'false'};saveSettingsData(d);showToast('Saved');}
function togglePush(){if(document.getElementById('setPush').checked){if('Notification'in window){Notification.requestPermission().then(p=>{if(p!=='granted'){document.getElementById('setPush').checked=false;showToast('Denied');return;}saveSettings();});}else{saveSettings();}}else{saveSettings();}}
function clearAllData(){if(!confirm('Delete ALL data?'))return;clearAllDataLocal();loadData();showToast('Cleared');}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000);}

// ===== CHARTS / INSIGHTS =====
function ensureCanvas(id){let el=document.getElementById(id);if(!el||el.tagName!=='CANVAS'){const parent=el?el.parentElement:document.getElementById(id)?.parentElement;if(parent){parent.innerHTML='<canvas id="'+id+'"></canvas>';el=document.getElementById(id);}}return el;}
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
  const catMap={};
  active.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;catMap[e.category]=(catMap[e.category]||0)+m;});
  const catLabels=Object.keys(catMap);
  const catValues=Object.values(catMap);
  const catColors=[accent,blue,green,amber,purple,red,'#0891b2','#db2777','#65a30d','#7c2d12'];
  destroyChart('catChartInst');
  const catCanvas=ensureCanvas('catChart');
  if(catLabels.length>0&&catCanvas){
    catChartInst=new Chart(catCanvas,{type:'doughnut',data:{labels:catLabels.map(c=>c+' (₹'+fmtR(catMap[c])+')'),datasets:[{data:catValues,backgroundColor:catColors.slice(0,catLabels.length),borderWidth:2,borderColor:getCSSVar('--surface')||'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{padding:12,usePointStyle:true,pointStyle:'circle',font:{size:12}}}},cutout:'55%'}});
  }else if(catCanvas){catCanvas.parentElement.innerHTML='<div class="empty"><div class="empty__text">No data to chart yet</div></div>';}
  const months=[];const now=new Date();
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({key:d.getFullYear()+'-'+d.getMonth(),label:d.toLocaleDateString('en-IN',{month:'short'})});}
  const monthData=months.map(m=>{return payments.filter(p=>{const d=new Date(p.date);return d.getFullYear()+'-'+d.getMonth()===m.key;}).reduce((s,p)=>s+p.amount,0);});
  destroyChart('trendChartInst');
  const trendCanvas=ensureCanvas('trendChart');
  if(payments.length>0&&trendCanvas){
    trendChartInst=new Chart(trendCanvas,{type:'bar',data:{labels:months.map(m=>m.label),datasets:[{label:'Paid (₹)',data:monthData,backgroundColor:accent,borderRadius:6,barThickness:'flex',maxBarThickness:50}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:gridColor},ticks:{callback:v=>'₹'+fmtR(v)}},x:{grid:{display:false}}}}});
  }else if(trendCanvas){trendCanvas.parentElement.innerHTML='<div class="empty"><div class="empty__text">No payments recorded yet</div></div>';}
  const typeMap={sub:0,bill:0,pers:0};
  active.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;typeMap[e.type]=(typeMap[e.type]||0)+m;});
  destroyChart('typeChartInst');
  const typeCanvas=ensureCanvas('typeChart');
  if(active.length>0&&typeCanvas){
    typeChartInst=new Chart(typeCanvas,{type:'bar',data:{labels:['Subscriptions','Bills','Personal'],datasets:[{data:[typeMap.sub,typeMap.bill,typeMap.pers],backgroundColor:[accent,blue,green],borderRadius:6,barThickness:'flex',maxBarThickness:60}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{beginAtZero:true,grid:{color:gridColor},ticks:{callback:v=>'₹'+fmtR(v)}},y:{grid:{display:false}}}}});
  }else if(typeCanvas){typeCanvas.parentElement.innerHTML='<div class="empty"><div class="empty__text">No expenses yet</div></div>';}
  const upiTotal=payments.filter(p=>p.method==='upi').reduce((s,p)=>s+p.amount,0);
  const manualTotal=payments.filter(p=>p.method!=='upi').reduce((s,p)=>s+p.amount,0);
  destroyChart('methodChartInst');
  const methodCanvas=ensureCanvas('methodChart');
  if(payments.length>0&&methodCanvas){
    methodChartInst=new Chart(methodCanvas,{type:'pie',data:{labels:['UPI (₹'+fmtR(upiTotal)+')','Manual (₹'+fmtR(manualTotal)+')'],datasets:[{data:[upiTotal,manualTotal],backgroundColor:[purple,blue],borderWidth:2,borderColor:getCSSVar('--surface')||'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{padding:12,usePointStyle:true,pointStyle:'circle',font:{size:12}}}}}});
  }else if(methodCanvas){methodCanvas.parentElement.innerHTML='<div class="empty"><div class="empty__text">No payments recorded yet</div></div>';}
}
function destroyChart(name){if(window[name]){window[name].destroy();window[name]=null;}}

// ===== EXPORT =====
function exportCSV(){
  if(expenses.length===0&&payments.length===0&&dailyLogs.length===0){showToast('No data to export');return;}
  let csv='';
  csv+='EXPENSES\n';
  csv+='Name,Type,Category,Cycle,Next Due,Amount,Status,Created At\n';
  expenses.forEach(e=>{csv+=[e.name,e.type,e.category,e.cycle,e.nextDue,e.amount,e.status,e.createdAt].map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')+'\n';});
  csv+='\nPAYMENTS\n';
  csv+='Name,Amount,Category,Method,Date\n';
  payments.forEach(p=>{csv+=[p.name,p.amount,p.category||'',p.method,p.date].map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')+'\n';});
  csv+='\nDAILY_LOGS\n';
  csv+='Date,Amount,Category,Note\n';
  dailyLogs.forEach(e=>{csv+=[e.date,e.amount,e.category,e.note].map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')+'\n';});
  csv+='\nSUMMARY\n';
  const a=expenses.filter(e=>e.status!=='cancelled');
  let tm=0,sm=0,bm=0,pm=0;
  a.forEach(e=>{let m=e.amount;if(e.cycle==='quarterly')m=e.amount/3;else if(e.cycle==='yearly')m=e.amount/12;else if(e.cycle==='onetime')m=0;tm+=m;if(e.type==='sub')sm+=m;else if(e.type==='bill')bm+=m;else pm+=m;});
  csv+='Total Monthly Burn,₹'+fmtR(tm)+'\n';
  csv+='Subscriptions Monthly,₹'+fmtR(sm)+'\n';
  csv+='Bills Monthly,₹'+fmtR(bm)+'\n';
  csv+='Personal Monthly,₹'+fmtR(pm)+'\n';
  csv+='Yearly Estimate,₹'+fmtR(tm*12)+'\n';
  csv+='Total Expenses,'+expenses.length+'\n';
  csv+='Total Payments,'+payments.length+'\n';
  csv+='Total Paid Amount,₹'+fmtR(payments.reduce((s,p)=>s+p.amount,0))+'\n';
  csv+='Daily Logs Total,₹'+fmtR(dailyLogs.reduce((s,e)=>s+e.amount,0))+'\n';
  downloadFile(csv,'toka-export-'+new Date().toISOString().split('T')[0]+'.csv','text/csv');
  showToast('CSV downloaded');
}
function exportJSON(){
  if(expenses.length===0&&payments.length===0&&dailyLogs.length===0){showToast('No data to export');return;}
  const data={exportedAt:new Date().toISOString(),app:'Toka',version:'1.1',expenses:expenses,payments:payments,dailyLogs:dailyLogs,ratings:ratings,settings:settings};
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
loadStreak();
loadData();
showRatingPrompt();
