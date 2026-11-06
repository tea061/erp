(()=>{
const safe=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table=rows=>'<div class="inventory-balance-table"><table><thead><tr><th>代表处</th><th>波动金额（MUSD）</th><th>波动比例</th><th>各代表处存货余额波动概览</th></tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((x,i)=>'<td'+(i===1?' class="balance-amount"':'')+'>'+safe(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
function reportMarkup(){return '<p class="inventory-business-briefing">当前待核算批次<strong>12项</strong>、待核对凭证<strong>8笔</strong>，成本差异<strong class="inventory-business-warning">2项</strong>。请优先核对出入库成本、存货明细账与总账，跟进差异处理及关账进度。</p><nav class="inventory-analysis-navigation" aria-label="业务分析区块"><a href="#inventory-balance-section">余额波动分析</a><a href="#inventory-impairment-section">减值波动分析</a><a href="#inventory-overdue-section">超期存货分析</a></nav><section class="inventory-analysis-block" id="inventory-balance-section"><header class="balance-report-heading"><h2>一、余额波动分析</h2><span>演示数据 · MUSD · 波动比例＝增减金额÷上期余额</span></header>'+(window.inventoryDashboardMarkup?.()||'')+
'<section class="balance-business-block"><h3>1、运营商</h3><p class="balance-summary">本期存货余额 <b>331.33 MUSD</b>，较上月增加 <b>9.26 MUSD</b>，波动比例 <b>2.88%</b>。站点存货增加9.58M、在途存货增加5.65M、区域仓存货减少5.35M，其他存货减少0.62M，合计增加9.26M。大额波动如下：</p>'+
'<h4>1）站点存货增加9.58 MUSD，其中大额波动分析如下：</h4>'+table([
['土耳其代表处','10.79','39%','主要是OTH7922607001G等囤货合同、TT 5G无线和VDF DWDM项目本期分别新增站点存货5.62M、2.64M、1.74M，其他项目净增加0.79M。'],
['波兰代表处','-3.57','-55%','主要是乌克兰Kyivstar RAN Modernization and New Sites项目本期完成站点交付并结转存货3.30M，其他项目净减少0.27M。'],['其他代表处','2.36','—','其他代表处站点存货净增加2.36M，与上述项目合计增加9.58M。']])+
'<h4>2）在途存货增加5.65 MUSD，其中大额波动分析如下：</h4>'+table([
['土耳其代表处','2.84','16%','主要是TT 5G无线项目本期新增站点二次在途存货3.00M，已签收结转0.16M，净增加2.84M。'],['其他代表处','2.81','—','其他代表处在途存货净增加2.81M，合计增加5.65M。']])+
'<h4>3）区域仓存货减少5.35 MUSD，其中大额波动分析如下：</h4>'+table([
['土耳其代表处','-5.81','-16%','主要是OTH7922604001A等囤货合同、VDF Pure Equipment项目中心仓存货本期分别交付出库3.97M、1.24M，其他项目净出库0.60M。'],['其他代表处','0.46','—','其他代表处区域仓存货净增加0.46M，合计净减少5.35M。']])+'</section>'+
'<section class="balance-business-block"><h3>2、政企</h3><p class="balance-summary">本期存货余额 <b>114.08 MUSD</b>，较上月增加 <b>4.33 MUSD</b>，波动比例 <b>3.95%</b>。其中备件在库增加 <b>3.25M</b>（数据存储BU增加3.26M，其他BU减少0.01M），其他存货增加1.08M，合计增加4.33M。</p></section>'+
'<section class="balance-business-block"><h3>3、数字能源</h3><p class="balance-summary">本期存货余额 <b>381.33 MUSD</b>，较上月增加 <b>116.91 MUSD</b>，波动比例 <b>44.21%</b>。其中在途存货增加 <b>108.64M</b>，其他存货增加8.27M，合计增加116.91M。在途大额波动如下：</p>'+table([
['东南欧代表处','58.01','108%','主要是罗马尼亚、保加利亚和希腊本期分别新增国际在途发货36.05M、16.17M、5.62M，其他项目净增加0.17M，主要涉及OY06422600060B、OY03002500300V等合同。'],
['德国代表处','36.24','138%','主要是OY02762600800H、OY02762502690V等合同以及Greenovative GmbH客户新增国际在途发货36.24M。'],
['北欧代表处','9.60','64%','主要是丹麦OY02082600030Q和00210Y02082600030A合同新增国际在途发货8.23M，其他项目净增加1.37M。'],['其他代表处','4.79','—','其他代表处国际在途存货净增加4.79M，合计增加108.64M。']])+'</section></section>'}
let watched=null,section=null;
function bindAnalysisTabs(root){
 const nav=root.querySelector('.inventory-analysis-navigation');if(!nav)return;
 const links=Array.from(nav.querySelectorAll('a')),panels=links.map(link=>root.querySelector(link.getAttribute('href')));nav.setAttribute('role','tablist');nav.setAttribute('aria-label','存货分析');
 function select(index,focus=false){links.forEach((link,i)=>{const active=i===index;link.setAttribute('aria-selected',String(active));link.tabIndex=active?0:-1;if(panels[i])panels[i].hidden=!active});if(focus)links[index].focus()}
 links.forEach((link,index)=>{link.id='inventory-analysis-tab-'+index;link.setAttribute('role','tab');link.setAttribute('aria-controls',panels[index]?.id||'');if(panels[index]){panels[index].setAttribute('role','tabpanel');panels[index].setAttribute('aria-labelledby',link.id)}link.onclick=e=>{e.preventDefault();select(index);history.replaceState(null,'',link.getAttribute('href'))};link.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?links.length-1:(index+(e.key==='ArrowRight'?1:-1)+links.length)%links.length;select(next,true);history.replaceState(null,'',links[next].getAttribute('href'))}});
 const fromHash=links.findIndex(link=>link.getAttribute('href')===location.hash);select(fromHash<0?0:fromHash);window.addEventListener('hashchange',()=>{const index=links.findIndex(link=>link.getAttribute('href')===location.hash);if(index>=0)select(index)});
}

function sync(){const tabs=document.getElementById('workspace-activity-tabs');if(!tabs)return;if(!section||!section.isConnected){section=document.createElement('section');section.id='inventory-balance-report';section.setAttribute('aria-label','余额波动分析');section.hidden=true;section.innerHTML=reportMarkup()+(window.inventoryExtraReportMarkup?.()||'');tabs.after(section);window.bindInventoryDashboard?.(section);bindAnalysisTabs(section)}if(watched!==tabs){watched=tabs;new MutationObserver(sync).observe(tabs,{attributes:true,attributeFilter:['hidden','aria-selected'],subtree:true})}const show=sessionStorage.getItem('yunxu-role')==='inventory-accountant'&&!tabs.hidden&&tabs.querySelector('[data-tab="business"]')?.getAttribute('aria-selected')==='true';if(section.hidden!==!show)section.hidden=!show;const balanceCard=document.getElementById('inventory-balance-card');if(show&&balanceCard&&section.previousElementSibling!==balanceCard)section.before(balanceCard);document.body.classList.toggle('finance-balance-business',Boolean(show))}
const base=openActivityBoard;openActivityBoard=function(...args){const result=base.apply(this,args);sync();return result};sync();
})();
