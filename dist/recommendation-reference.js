(()=>{
const fields=['行','物料编码','物料描述','物料版本','来源子库','来源货位','目标子库','目标货位','库存类型','物权组织','交易数量','交易单位','交易日期','交易原因','交易参考'];
const rows=[['1','PCB-A100','主控板','A.1','RM01 · 原料子库','A-01-01','WIP01 · 线边子库','B-01-01','普通库存','华东制造有限公司','200','块','2026-10-26','李小梅通过 WeLink 发起：车间补料。','WL-LXM-20261026-001'],['2','CON-D400','连接器','B.2','RM01 · 原料子库','A-02-03','WIP01 · 线边子库','B-01-02','普通库存','华东制造有限公司','120','个','2026-10-26','李小梅通过 WeLink 发起：车间补料。','WL-LXM-20261026-001']];
function selectSkill(skill){selectedComposerAgent='inventory-ops-agent';const toggle=document.getElementById('agent-toggle');toggle.dataset.selectedAgent='inventory-ops-agent';toggle.dataset.selectedSkill=skill;toggle.textContent='库存作业智能体 · '+skill;toggle.title=toggle.textContent}
function table(){return '<div class="reference-transfer-table"><table><thead><tr>'+fields.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(x=>'<td>'+escapeHTML(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
function closePane(){document.querySelector('.reference-transfer-pane')?.remove()}
function pendingTransfer(entry){
 closePane();openNewConversation();selectSkill('创建转库单');
 if(entry)currentSessionId=entry.id;
 const person=document.getElementById('current-person').textContent||'我';restoringSession=Boolean(entry);
 addMessage('李小梅通过 WeLink 发来：请帮我录入一张转库单，华东库存组织用于车间补料：主控板 PCB-A100，200 块；连接器 CON-D400，120 个，均从原料子库 RM01 转至线边子库 WIP01。',true);
 addMessage('我已读取李小梅的指令，提取关键信息并填写转库单草稿，尚未提交。请点击“查看已填页面”，核对字段后提交确认。',false);
 restoringSession=false;const result=document.createElement('section');result.className='reference-transfer-preview';result.innerHTML='<h3>头信息</h3><table><thead><tr><th>库存组织</th><th>交易类型</th><th>申请人</th><th>申请日期</th></tr></thead><tbody><tr><td>华东库存组织</td><td>子库转移</td><td>'+escapeHTML(person)+'</td><td>2026-10-26</td></tr></tbody></table><h3>行信息 <small>2 行</small></h3>'+table()+'<p>左右滚动查看完整行信息</p><button type="button" class="reference-transfer-open">查看已填页面</button>';
 document.getElementById('messages').lastElementChild.append(result);
 const current=sessionRecords.find(s=>s.id===currentSessionId);if(current){current.title='李小梅的转库单待确认';current.referenceTransfer=true;saveSessionRecords();renderSessionHistory()}
 result.querySelector('button').onclick=()=>{closePane();const pane=document.createElement('aside');pane.className='reference-transfer-pane';pane.setAttribute('aria-label','已填转库单');pane.innerHTML='<header><div><h2>转库单录入</h2><p>草稿 · 华东库存组织</p></div><button type="button" aria-label="关闭转库单页面">×</button></header><div class="reference-transfer-form"><p class="reference-transfer-notice">信息已根据李小梅的指令预填，请核对后确认提交。</p><div class="reference-transfer-fields"><label>库存组织<input value="华东库存组织" readonly></label><label>交易类型<input value="子库转移" readonly></label><label>申请人<input value="'+escapeHTML(person)+'" readonly></label><label>申请日期<input type="date" value="2026-10-26"></label></div><h3>行信息</h3><table><thead><tr><th>物料</th><th>来源子库</th><th>目标子库</th><th>数量</th><th>单位</th></tr></thead><tbody>'+rows.map((row,i)=>'<tr><td>'+row[1]+'<small>'+row[2]+'</small></td><td>RM01</td><td>WIP01</td><td><input type="number" min="1" value="'+row[10]+'" aria-label="'+row[2]+'转库数量" data-line="'+i+'"></td><td>'+row[11]+'</td></tr>').join('')+'</tbody></table><label class="reference-transfer-reason">交易原因<textarea>李小梅通过 WeLink 发起：车间补料。</textarea></label><p class="reference-transfer-status" role="status"></p></div><footer><button type="button" data-cancel>关闭</button><button type="button" data-submit>确认提交</button></footer>';
 document.body.append(pane);pane.querySelector('[aria-label="关闭转库单页面"]').onclick=pane.querySelector('[data-cancel]').onclick=closePane;
 pane.querySelector('[data-submit]').onclick=()=>{const inputs=[...pane.querySelectorAll('[data-line]')];if(inputs.some(x=>!x.reportValidity()))return;inputs.forEach(x=>rows[Number(x.dataset.line)][10]=x.value);pane.querySelector('.reference-transfer-status').textContent='✓ 转库单已确认提交（演示）';pane.querySelector('[data-submit]').disabled=true;pane.querySelector('[data-submit]').textContent='已提交';if(current){current.title='李小梅的转库单已确认';saveSessionRecords();renderSessionHistory()}result.querySelector('.reference-transfer-open').textContent='查看已确认页面';};
 };
}
window.openReferenceRecommendation=function(action,prompt){
 if(action==='asset-purchase-analysis'){openAIAnalysis({id:'ASSET-PURCHASE-APPROVAL',title:'资产购置审批',desc:'购置管理模块，¥128,000',state:'doing'});return}

 if(action==='inventory-risk-status'){let task;try{task=(JSON.parse(localStorage.getItem('erp-inventory-accountant-activity-tasks'))||[]).find(x=>x.id==='IC-OVERDUE-INVENTORY-STATUS')}catch{}openAIAnalysis(task||{id:'IC-OVERDUE-INVENTORY-STATUS',title:'超期&异常存货情况',desc:'每日08:00查询权限范围内的超期与异常存货，待复核异常事项及处理建议。',owner:'agent',priority:'高',state:'doing',result:'异常'});return}

 if(action==='stock'||action==='transfer'){selectSkill(action==='stock'?'查询库存现有量及可用量':'创建转库单');suggest(prompt);promptBox.focus();return}
 if(action==='pending'){pendingTransfer();return}
 if(action==='daily'){openInventoryComparison();document.body.classList.remove('conversation-entry');document.body.classList.add('ai-session');selectedComposerAgent='inventory-ops-agent';const toggle=document.getElementById('agent-toggle');toggle.dataset.selectedAgent='inventory-ops-agent';delete toggle.dataset.selectedSkill;toggle.textContent='库存作业智能体';return}
};
const restore=openSavedSession;openSavedSession=function(id){const entry=sessionRecords.find(s=>s.id===id);if(entry?.referenceTransfer){pendingTransfer(entry);return}return restore(id)};
for(const name of ['openNewConversation','setModule','showRoleSelection','openActivityBoard']){const base=window[name];if(typeof base==='function')window[name]=function(...args){closePane();const result=base.apply(this,args);if(name==='openNewConversation')promptBox.placeholder='查询华东库存组织主控板的现有量及可用量。';if(name==='openNewConversation'&&sessionStorage.getItem('yunxu-role')==='inventory-accountant'){document.getElementById('title').textContent=(document.getElementById('current-person').textContent||'小桐')+'，今天想处理什么存货业务？';document.getElementById('subtitle').textContent='直接描述你的需求，让智能体协助查询、核对与跟进。'}return result}}
})();
