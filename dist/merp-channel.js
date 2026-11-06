(()=>{
'use strict';
if(!document.getElementById('cards'))return;
const root=document.createElement('div');root.className='merp-directory-controls';root.innerHTML='<div class="merp-source" role="group" aria-label="能力来源"><button data-origin="all" aria-pressed="true">全部来源</button><button data-origin="official" aria-pressed="false">官方</button><button data-origin="custom" aria-pressed="false">我的自定义</button></div>';
if(sessionStorage.getItem('yunxu-role')==='purchase-lead'){
const official=agentCatalog.filter(a=>/库存作业|生产作业/.test(a.name));official.push({id:'public-agent',name:'公共智能体',desc:'整理业务信息与通用事项，协助生成摘要和说明',type:'analysis',tag:'公共服务',skills:'整理业务信息 · 生成业务摘要'});agentCatalog.splice(0,agentCatalog.length,...official,...personalAgents);
}
const cards=document.getElementById('cards');cards.before(root);const search=document.getElementById('search');if(search)root.append(search);
root.querySelectorAll('[data-origin]').forEach(b=>b.onclick=()=>setDirectorySource(b.dataset.origin));
const filters=document.getElementById('filters');if(filters)filters.hidden=true;
const skillAgent=document.createElement('select');skillAgent.setAttribute('aria-label','按智能体筛选技能');skillAgent.innerHTML='<option value="">全部智能体</option>'+agentCatalog.filter(a=>!a.id.startsWith('custom-')).map(a=>'<option>'+safeText(a.name)+'</option>').join('');root.prepend(skillAgent);
function apply(){skillAgent.hidden=marketTab!=='skill';if(marketTab==='skill')cards.querySelectorAll('.card').forEach(c=>{const text=c.textContent;const value=skillAgent.value;if(value)c.hidden=!text.includes(value)})}
skillAgent.onchange=()=>{render();apply()};document.getElementById('agent-tab').addEventListener('click',apply);document.getElementById('skill-tab').addEventListener('click',apply);apply();
function icons(){cards.querySelectorAll('.card img').forEach(img=>{const icon=document.createElement('span');icon.className='merp-catalog-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="14" rx="4"/><path d="M12 2v4M8 11h.01M16 11h.01M8 16h8M2 11v4m20-4v4"/></svg>';img.replaceWith(icon)})}
const tabs=document.querySelector('.market-tabs');
if(tabs){const filterPanel=document.createElement('section');filterPanel.className='merp-directory-filter-panel';filterPanel.setAttribute('aria-label','目录筛选');tabs.after(filterPanel);filterPanel.append(root)}
const actions=document.querySelector('.directory-create-actions');
if(tabs&&actions){const toolbar=document.createElement('div');toolbar.className='merp-directory-tabbar';tabs.before(toolbar);toolbar.append(tabs,actions);const intro=document.querySelector('.market-intro');if(intro&&!intro.textContent.trim())intro.remove()}
new MutationObserver(icons).observe(cards,{childList:true,subtree:true});render();icons();
})();
