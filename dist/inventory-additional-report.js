/* User-supplied inventory impairment and overdue analysis. */
(()=>{
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraph=t=>'<p class="balance-summary">'+esc(t)+'</p>';
const movementTable=rows=>'<div class="inventory-balance-table"><table><thead><tr><th>代表处</th><th>波动金额（MUSD）</th><th>波动比例</th><th>各代表处减值余额波动概览</th></tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>'<td'+(i===1?' class="balance-amount"':'')+'>'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const overseas=[
['土耳其代表处','土耳其','运营商','OTH7922512000U','0.80','低','4-5月','子公司囤货箱单，贸易术语DDP，实际为客户清关，因PO获取延迟至6月，目前仍在客户清关阶段，预计7月上旬收货入库。'],
['西班牙代表处','西班牙','数字能源','Esprinet Iberica, S.LU','0.17','低','2-3月','0Y07242501760P合同直发客户指定地点，收货地址为西班牙自治区Ceuta（位于非洲马格里布最北部，与摩洛哥接壤），6月已完成清关，目前待客户签收POD。']
];
const sites=[
['土耳其代表处','土耳其','运营商','Turk Telekom 5G Wireless Project','0.85','低','4-6月','TT客户5G首发项目，以新建+GUL扩容为主，站点交付方案设计复杂，包括TK、RFI、多制式协同，分包资源需求大，导致站点在建超期0.78M，当前业务持续滚动交付中。'],
['土耳其代表处','土耳其','运营商','Turkey Turksat Universal MS&Rollout 2022 Project','0.82','未提供','4-12月','U3项目超期较26Q1无明显变化，客户Turksat代政府主导执行的农村网络项目，以TK交付场景为主，超期主要集中在建存货0.68M，业务滚动交付和持续安装中，Q2评估结论：不计提专项。'],
['土耳其代表处','土耳其','运营商','Turk Telekom Wireless Project','0.67','未提供','4-10月','超期较26Q1减少0.33M，TT无线项目交付范围主要包括4G站点新建、扩容以及改造，MBB场景为主，超期主要集中在站点在建0.55M，PAC滚动交付中，Q2评估结论：不计提专项。'],
['土耳其代表处','土耳其','运营商','Turkey Vodafone DWDM','0.28','低','1-2月','波分项目交付，主要是0007922600100B合同站点在建超期0.22M，待设备全部发货后安装交付。'],
['东南欧代表处','希腊','数字能源','Chirpan Solar Plant EOOD','0.76','低','6-7月','超期较26Q1减少4.64M，希腊数字能源Chirpan项目OY01002500150U合同站点递延存货0.66M，因控制权转移时点的判断发生变化（到达业主站点时发生转移，并非EPC站点），故25底反冲未到达业主站点前已触发的收入，因此产生超期递延存货5.40M。6月底13箱储能到货，对应收入已加回，剩余4个箱变预计7月初到货。'],
['东南欧代表处','保加利亚','数字能源','PHOTOMATE s.r.o.','0.56','低','5-6月','主要是OY01002400110X合同受币种切换影响PSP口径128存货未聚合（GC口径128实际无超期余额），新账套虚发与GL反冲的PSP构造逻辑分别是：原始来源量价构造和调整来源COA加成构造，待整单合同收入触发后128可清零退出。'],
['德国代表处','德国','政企','ARGE BSS Re-Invest','0.35','中','6-10月','德铁DB联合投标体项目交付已基本完成，待获取最终客户POD文档后触发收入，Q2专项减值评估结论为无需计提。'],
['土耳其代表处','土耳其','政企','HIGH TECHNOLOGY Bilisim Sistemleri','0.30','待核实（原文：办）','7-9月','0Y07922500460V、OY07922500670Q合同超期在建存货0.24M，客户项目节奏缓慢，站点未ready，已到货光设备无法完成安装，待安装交付后触发收入。'],
['德国代表处','德国','运营商','TDG NEMO Wireless Rollout Project','0.24','未提供','4个月以上','超期较26Q1减少0.18M，当前超期主要是在建存货0.19M，其中大部分站点已完成安装，待客户验收；少量站点安装计划取消，待回退或已回退中心仓，配置变更后清理站点存货。Q2评估结论：不计提专项。']
];
const loans=[
['德国代表处','德国','数字能源/政企','Germany EBG Test Project','1.22','低','6-10月','本期新增超期借货项目：\n1）数能：超期金额0.96M，主要涉及0Y0276250006TT、OY0276250007TN等6单合同，Q2专项评估部分计划回退，暂无报损计划，无需计提专项。\n2）政企：超期金额0.26M，涉及0Y0276250011TK等借货合同，计划Q3回退后寻找其他项目进行消耗。'],
['法国代表处','法国','政企','France POC Package Project 2021','0.54','待核实（原文：为）','6-36月','超期较26Q1增加0.23M，大额合同如下：\n1）OY02502500009B：超期金额0.11M，货龄15-18月，连续两期核销承诺未达成，26 H1 RIA通过外部函证验证无差异。\n2）OY02502500009F：超期金额0.08M，货龄12-15月，设备主体已回退至中心仓，上期承诺剩余物料待获取客户PO，预计4月核销——未达成。\n3）OY02502500009H：超期金额0.06M，货龄7-8月，客户正常测试中，待获取PO核销。\n4）OYC250250000TZ、OY025025000090：超期金额0.08M，货龄6-9月，预计年底分别退回和转售核销。\n5）OY0250230000TQ：超期金额0.02M，货龄24-36月，测试物料丢失，上期承诺客户计划下PO赔偿——未达成。\n其他借货合同超期金额0.19M，合计0.54M。'],
['土耳其代表处','土耳其','运营商','Turkcelle Account Test Projects','0.39','中','6-18月','超期较26Q1减少0.56M，大额合同如下：\n1）000792250000TX：超期金额0.27M，货龄15-18月，DPI测试借货。25Q3、Q4已连续两期承诺核销，26Q1客户提出继续测试，26 H1 RIA通过内部函证闭环：34pcs服务器已完成核销（6pcs回退机关、28pcs转销售），剩余8pcs给TC 5GC Al新通话使用；计划7月份完成测试后启动商务沟通，预计Q3整单清理。\n2）000792250062TX：TC Newcalling Test Loan，超期金额0.08M，货龄6-7月，计划Q3完成核销。\n其他借货合同超期金额0.04M，合计0.39M。']
];
function overdueTable(rows,projectHeader='项目/客户名称'){const heads=['代表处','国家','BG',projectHeader,'超期金额','风险等级','主要货龄','超期分析'];return '<div class="inventory-overdue-table"><table><thead><tr>'+heads.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map((v,i)=>'<td class="'+(i===7?'overdue-analysis':i===4?'balance-amount':'')+'">'+esc(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'}
window.inventoryExtraReportMarkup=()=>'<section class="inventory-analysis-block" id="inventory-impairment-section"><header class="balance-report-heading balance-report-section"><h2>二、减值波动分析</h2><span>演示数据 · 金额单位：MUSD</span></header>'+
'<section class="balance-business-block"><h3>1、运营商</h3>'+paragraph('本期减值余额98.85 MUSD，较上期增加0.07 MUSD，波动比例0.07%。备件在库减值减少0.23M、区域仓减值增加0.15M、站点减值增加0.14M，其他减值增加0.01M，合计增加0.07M。明细如下：')+
'<h4>1）备件在库减值减少0.23 MUSD，其中大额波动分析如下：</h4>'+movementTable([
['英国代表处','-0.25','-1.96%','主要是长货龄好件本期逆向回运，减值减少0.26M，其他项目减值增加0.01M。'],
['东南欧代表处','0.24','2.82%','希腊坏件子库余额增加，减值同步增加0.12M，同时好件受货龄滚动影响，减值增加0.06M，其他项目减值增加0.06M。'],
['西班牙代表处','-0.23','-2.10%','葡萄牙PT2 DB01坏件子库本期批量整改报废出库，减值减少0.26M，其他项目减值增加0.03M。'],['其他代表处','0.01','—','其他代表处备件在库减值净增加0.01M，合计净减少0.23M。']])+
'<h4>2）区域仓存货减值增加0.15 MUSD，其中大额波动分析如下：</h4>'+movementTable([
['土耳其代表处','0.17','9.66%','主要是TT Account Pure项目0-6月中心仓存货货龄滚动至6-12月，减值增加0.17M。'],['其他代表处','-0.02','—','其他代表处区域仓减值净减少0.02M，合计净增加0.15M。']])+
'<h4>3）站点存货减值增加0.14 MUSD</h4>'+paragraph('受多个代表处小额增减波动影响，故不打开分析。')+'</section>'+
'<section class="balance-business-block"><h3>2、政企</h3>'+paragraph('本期减值余额44.77 MUSD，较上期增加1.56 MUSD，波动比例3.61%。备件在库减值增加1.41M、区域仓减值增加0.14M，其他减值增加0.01M，合计增加1.56M。明细如下：')+
'<h4>备件在库减值增加1.41M</h4>'+paragraph('主要是维护好件余额整体增加，同时受货龄滚动影响，减值同步增加1.37M。主要涉及国家德国0.33M、土耳其0.17M、西班牙0.16M、意大利0.14M、波兰0.12M，其他国家0.45M；其他减值因素增加0.04M，合计增加1.41M。')+
'<h4>区域仓存货减值增加0.14 MUSD</h4>'+paragraph('主要是土耳其受货龄滚动影响，减值增加0.13M（Akbank客户12-18月存货滚动至18个月以上），其他代表处减值增加0.01M，合计增加0.14M。')+'</section>'+
'<section class="balance-business-block"><h3>3、数字能源</h3>'+paragraph('本期减值余额9.30 MUSD，较上期增加0.60 MUSD，波动比例6.90%。其中备件在库减值增加0.53M、其他减值增加0.07M，合计增加0.60M。备件在库受多个代表处增减波动的影响：其中西欧多国备件在库减值增加0.12M，主要是爱尔兰、比利时坏件子库余额增加，减值同步增加0.10M，西欧其他国家增加0.02M；其他地区增加0.41M，合计备件在库减值增加0.53M。')+'</section>'+
'</section><section class="inventory-analysis-block" id="inventory-overdue-section"><header class="balance-report-heading balance-report-section"><h2>三、超期存货分析</h2><span>演示数据 · 金额单位：MUSD</span></header>'+
'<section class="balance-business-block"><h3>1、国际在途</h3><p class="overdue-threshold">CNBG项目维度超期≥0.2M；EBG&DP客户维度超期≥0.1M，单位：MUSD</p>'+overdueTable(overseas)+'</section>'+
'<section class="balance-business-block"><h3>2、站点存货</h3><p class="overdue-threshold">CNBG项目维度超期≥0.2M；EBG&DP客户维度超期≥0.2M，单位：MUSD</p>'+overdueTable(sites)+'</section>'+
'<section class="balance-business-block"><h3>3、借货</h3><p class="overdue-threshold">项目维度超期≥0.2M，单位：MUSD</p>'+overdueTable(loans,'项目名称')+'</section></section>';
})();
