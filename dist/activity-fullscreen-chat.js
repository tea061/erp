(()=>{
const previous=openAIAnalysis;
openAIAnalysis=function(task){
 previous(task);
 const overlay=document.getElementById('analysis-overlay');
 overlay.classList.toggle('activity-chat-fullscreen',task.id!=='ASSET-PURCHASE-APPROVAL');
 if(task.id==='ASSET-PURCHASE-APPROVAL')return;
 const content=overlay.querySelector('.analysis-content'),form=content.querySelector('#analysis-followup'),answer=content.querySelector('#analysis-answer');
 const role=sessionStorage.getItem('yunxu-role');const assistantName=(role==='inventory-accountant'||role==='purchase-lead'||task.id==='IC-OVERDUE-INVENTORY-STATUS')?'库存智能助手':'AI智能助手';
 const person=document.getElementById('current-person')?.textContent?.trim()||'我';
 const time=new Intl.DateTimeFormat('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Asia/Shanghai'}).format(new Date());
 const conversation=document.createElement('div');conversation.className='activity-analysis-messages';
 const mine=document.createElement('div');mine.className='asset-message mine';
 mine.innerHTML='<div class="asset-message-main"><div class="asset-message-meta">我 · '+escapeHTML(person)+'　'+time+'</div><div class="asset-message-body">请分析“'+escapeHTML(task.title)+'”。<br>'+escapeHTML(task.desc||'')+'</div></div><div class="asset-message-avatar">'+escapeHTML(person.slice(-1))+'</div>';
 const assistant=document.createElement('div');assistant.className='asset-message assistant';assistant.innerHTML='<div class="asset-message-avatar">AI</div><div class="asset-message-main"><div class="asset-message-meta">'+assistantName+'　'+time+'</div><div class="asset-message-body"></div></div>';
 const bubble=assistant.querySelector('.asset-message-body');
 if(task.id==='IC-OVERDUE-INVENTORY-STATUS'){const description=content.querySelector('.analysis-task-desc');if(description)description.innerHTML='待结转余量/余额<strong class="inventory-risk-word">为负</strong>，明显<strong class="inventory-risk-word">超出</strong>核算基线的数据波动、<strong class="inventory-risk-word">不符合</strong>业务场景假设的数据波动';}
 [...content.children].filter(el=>el!==form&&el!==answer).forEach(el=>bubble.append(el));
 conversation.append(mine,assistant,answer);content.replaceChildren(conversation);overlay.querySelector('.analysis-drawer').append(form);
 overlay.querySelector('.analysis-footer')?.remove();overlay.querySelector('.analysis-header img')?.remove();
 overlay.querySelector('#analysis-title').textContent=assistantName;overlay.querySelector('.analysis-header p').textContent=assistantName+' · 异常分析与解决建议';form.querySelector('input').placeholder='继续询问当前任务的分析与处理建议…';
};
const style=document.createElement('style');style.textContent=`
#analysis-overlay .inventory-risk-word{color:#d92d20!important;font-weight:700!important;font-style:normal}
#analysis-overlay.activity-chat-fullscreen{background:#fff;backdrop-filter:none}
#analysis-overlay.activity-chat-fullscreen .analysis-drawer{width:100%;max-width:none;background:#fff;box-shadow:none;animation:none}
.activity-chat-fullscreen .analysis-content{width:100%;box-sizing:border-box;padding:24px max(24px,calc((100vw - 960px)/2));min-height:0}
.activity-analysis-messages{width:100%;max-width:960px;margin:auto}
.activity-chat-fullscreen .asset-message{display:flex;gap:12px;margin-bottom:24px;align-items:flex-start}
.activity-chat-fullscreen .asset-message.mine{justify-content:flex-end;margin-left:15%}
.activity-chat-fullscreen .asset-message-main{flex:1;min-width:0}
.activity-chat-fullscreen .asset-message-avatar{width:32px;height:32px;border-radius:50%;background:#eaf3ff;color:#0067d1;display:grid;place-items:center;flex-shrink:0;font-size:12px;font-weight:700}
.activity-chat-fullscreen .asset-message-meta{font-size:12px;color:#667085;margin-bottom:8px}
.activity-chat-fullscreen .asset-message-body{padding:18px;border:1px solid #e1e7ef;border-radius:12px;background:#fff;line-height:1.8;color:#182230;font-size:14px}
.activity-chat-fullscreen .mine .asset-message-body{background:#edf5ff;border-color:#dfebfa}
.activity-chat-fullscreen .analysis-followup{flex-shrink:0;width:min(900px,calc(100% - 48px));box-sizing:border-box;margin:12px auto 24px;padding:12px;border-radius:12px}
.activity-chat-fullscreen .analysis-followup input{font-size:14px}.activity-chat-fullscreen .analysis-followup button{width:36px;height:36px;background:#0067d1;color:#fff}
.activity-chat-fullscreen .analysis-result{box-shadow:none!important;margin-top:16px}.activity-chat-fullscreen .analysis-content::-webkit-scrollbar{width:0}
`;document.head.append(style);
})();
