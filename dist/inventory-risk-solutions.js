(()=>{
const previous=renderSolutionChoices;
renderSolutionChoices=function(task){
if(task.id!=='IC-OVERDUE-INVENTORY-STATUS')return previous(task);
const choices=[['手工分录调整','核对原始凭证与账务记录，确认调整依据后按审批流程处理。'],['报废评审','整理存货状态、货龄与处置依据，提交业务及财经人员评审。'],['减值评审','结合存货可回收金额、货龄与业务情况，复核减值判断依据。'],['撤销异常单据，重新处理','核实异常单据及上下游影响，经确认后撤销并重新发起处理。']];
const root=document.getElementById('solution-options'),button=document.getElementById('confirm-solution'),status=document.getElementById('solution-confirmation');let selected=-1;
root.innerHTML=choices.map((choice,i)=>'<button type="button" class="solution-choice" role="radio" aria-checked="false" data-risk-solution="'+i+'"><span class="choice-head"><span class="choice-radio"></span><strong>'+(i+1)+'、'+choice[0]+'</strong></span><span class="choice-desc">'+choice[1]+'</span></button>').join('');
root.querySelectorAll('[data-risk-solution]').forEach(option=>option.onclick=()=>{selected=Number(option.dataset.riskSolution);root.querySelectorAll('[data-risk-solution]').forEach(item=>item.setAttribute('aria-checked',String(item===option)));status.textContent='';button.disabled=false;button.textContent='同步到地区部财经'});
button.disabled=false;button.classList.add('sync-regional-finance');button.textContent='同步到地区部财经';button.onclick=()=>{
const key='erp-regional-activity-regional-finance';let tasks;try{tasks=JSON.parse(localStorage.getItem(key))}catch{}if(!Array.isArray(tasks))tasks=(window.REGIONAL_WORKSPACES?.['regional-finance']?.tasks||[]).map(item=>({...item}));
const id='REG-IC-OVERDUE-INVENTORY-STATUS',entry={id,title:'超期&异常存货情况',desc:'小桐同步：待结转余量/余额为负、超出核算基线或不符合业务场景假设的存货异常，需地区部财经复核。',owner:'agent',priority:'高',state:'doing',result:'异常',sourceRole:'inventory-accountant',sourcePerson:'小桐',solutions:choices.map(c=>({title:c[0],description:c[1]})),selectedSolution:selected<0?null:choices[selected][0],syncedAt:new Date().toISOString()};const at=tasks.findIndex(item=>item.id===id);if(at<0)tasks.unshift(entry);else tasks[at]={...tasks[at],...entry};localStorage.setItem(key,JSON.stringify(tasks));
status.className='solution-saved';status.textContent='✓ 已同步到地区部财经（演示）'+(selected>=0?' · 建议方案：'+choices[selected][0]:' · 已附四项处理方案');button.textContent='✓ 已同步到地区部财经';button.disabled=true;
};
};
})();
