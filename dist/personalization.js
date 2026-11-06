(()=>{
const key='herp-personalization-v1',media=matchMedia('(prefers-color-scheme: dark)');
function prefs(){try{return JSON.parse(localStorage.getItem(key))||{}}catch{return {}}}
const labels={'新建会话':['新建會話','New chat'],'工作动态':['工作動態','Work activity'],'智能体':['智慧體','Agents'],'自动化任务':['自動化任務','Automations'],'切换角色':['切換角色','Switch role']};
function apply(){const p=prefs(),dark=p.appearance==='dark'||(p.appearance==='system'&&media.matches);document.body.dataset.appearance=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';document.documentElement.lang=p.language||'zh-CN';document.querySelectorAll('#workspace-sidebar .nav>span,#automation-nav>span,.role-switch').forEach(el=>{const source=el.dataset.preferenceLabel||el.textContent.trim();if(!labels[source])return;el.dataset.preferenceLabel=source;el.textContent=p.language==='en'?labels[source][1]:p.language==='zh-TW'?labels[source][0]:source});document.dispatchEvent(new CustomEvent('herp-preferences-applied',{detail:p}))}
window.HerpPreferences={get:prefs,save(p){localStorage.setItem(key,JSON.stringify({...prefs(),...p}));apply();window.parent.postMessage({type:'herp-preferences-changed'},location.origin)}};
window.addEventListener('storage',e=>{if(e.key===key)apply()});window.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='herp-preferences-changed')apply()});media.addEventListener('change',apply);apply();
})();
