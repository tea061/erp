const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const exports=[
 {id:'asset-additions',name:'本月新增资产入账清单.xlsx',agent:'资产核算智能助手',source:'查询新增资产',date:'2026-10-23 09:20',file:'exports/asset-additions.xlsx',headers:['资产编号','资产名称','资产类别','所属部门','原值','入账日期','状态'],amount:4,status:6,rows:[['FA-021','自动组装设备','机器设备','制造部',280000,'2026-10-21','待复核'],['FA-024','检测仪器','仪器设备','质检部',86400,'2026-10-22','正常'],['FA-028','仓储搬运设备','运输设备','物流部',120000,'2026-10-23','待确认']]},
 {id:'depreciation',name:'本月折旧复核清单.xlsx',agent:'资产核算智能助手',source:'查询折旧核算',date:'2026-10-22 16:40',file:'exports/depreciation-review.xlsx',headers:['资产编号','资产名称','账簿','部门','本月折旧','累计折旧','状态'],amount:4,status:6,rows:[['FA-011','自动组装设备','HWBG2 TAX BOOK','制造部',5800,69600,'正常'],['FA-013','测试工作站','HWBG2 TAX BOOK','研发部',3200,38400,'待复核'],['FA-018','包装生产线','HWBG2 TAX BOOK','制造部',7500,90000,'异常']]},
 {id:'differences',name:'待处理资产差异.xlsx',agent:'资产核算智能助手',source:'查询资产台账',date:'2026-10-22 11:15',file:'exports/asset-differences.xlsx',headers:['资产编号','资产名称','问题类型','责任部门','涉及金额','发现日期','状态'],amount:4,status:6,rows:[['FA-031','自动装配线','类别转换','制造部',168000,'2026-10-22','异常'],['FA-036','办公设备','台账信息不一致','行政部',18500,'2026-10-22','待确认'],['FA-042','检测设备','资本化标准校验','质检部',42000,'2026-10-23','待处理']]}
];
let favorites=[];try{favorites=JSON.parse(localStorage.getItem('erp-myspace-items'))||[]}catch{}if(!Array.isArray(favorites)||!favorites.length){favorites=[{id:'asset-entry',kind:'业务单据',code:'FA-20261022-021',title:'新增设备资产入账',desc:'资产入账 · 待复核',date:'2026-10-22'},{id:'asset-check',kind:'业务单据',code:'FA-20261022-023',title:'资产调拨账务核对',desc:'账务核对 · 待确认',date:'2026-10-22'},{id:'month-query',kind:'常用查询',title:'本月资产核算进度',desc:'我负责的资产 · 本月 · 未完成',date:'2026-10-22'},{id:'risk-query',kind:'常用查询',title:'高风险单据',desc:'需重点关注 · 待确认',date:'2026-10-22'}];localStorage.setItem('erp-myspace-items',JSON.stringify(favorites))}
let tab='Excel',active=null,rows=[],sortDescending=false,onlyExceptions=false;
function render(){
 const q=$('search').value.trim().toLowerCase(),isExcel=tab==='Excel';
 const data=isExcel?exports.filter(x=>(x.name+x.agent+x.source).toLowerCase().includes(q)):favorites.filter(x=>(x.title+x.desc+(x.code||'')).toLowerCase().includes(q));
 $('excel-count').textContent=exports.length;$('favorite-count').textContent=favorites.length;$('total').textContent=(isExcel?exports.length:favorites.length)+(isExcel?' 个文件':' 个收藏');
 $('list').innerHTML=data.length?'<div class="grid">'+data.map(x=>isExcel?
  '<article class="file-card"><div class="card-top"><span class="file-icon">▦</span><span>示例导出</span></div><h2>'+esc(x.name)+'</h2><p>'+esc(x.agent)+'</p><div class="details"><span>'+x.rows.length+' 条记录</span><span>'+esc(x.date)+'</span></div><div class="bottom"><button class="open" data-file="'+x.id+'">打开并继续对话 →</button></div></article>':
  '<article class="file-card"><div class="card-top"><span class="file-icon">'+(x.kind==='常用查询'?'☆':'▤')+'</span><button class="remove" data-remove="'+esc(x.id)+'" aria-label="取消收藏 '+esc(x.title)+'">×</button></div><h2>'+esc(x.code||x.title)+'</h2><p>'+esc(x.code?x.title+' · '+x.desc:x.desc)+'</p><div class="details"><span>'+esc(x.kind)+'</span><span>收藏于 '+esc(x.date)+'</span></div><div class="bottom"><button class="open" data-favorite="'+esc(x.id)+'">'+(x.kind==='业务单据'?'查看详情':'打开查询')+' →</button></div></article>').join('')+'</div>':'<div class="empty">没有匹配的'+(isExcel?'文件':'收藏')+'，试试其他关键词。</div>';
 $('note').textContent=isExcel?'示例导出用于演示表格分析；下载的是对应的示例 Excel 文件。':'收藏保存在当前浏览器，可随时取消收藏并返回相应业务内容。';
}
document.querySelector('.tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;tab=b.dataset.tab;document.querySelectorAll('.tabs button').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-selected',String(x===b))});$('search').value='';render()});
$('search').addEventListener('input',render);
$('list').addEventListener('click',e=>{
 const file=e.target.closest('[data-file]'),remove=e.target.closest('[data-remove]'),favorite=e.target.closest('[data-favorite]');
 if(file){openFile(file.dataset.file);return}
 if(remove){favorites=favorites.filter(x=>x.id!==remove.dataset.remove);localStorage.setItem('erp-myspace-items',JSON.stringify(favorites));render();return}
 if(favorite){const x=favorites.find(y=>y.id===favorite.dataset.favorite);if(x)parent.postMessage(x.kind==='业务单据'?{type:'erp-space-record'}:{type:'erp-space-query',query:x.title},location.origin)}
});
function openFile(id){active=exports.find(x=>x.id===id);if(!active)return;rows=active.rows.map(x=>[...x]);sortDescending=false;onlyExceptions=false;$('library-view').hidden=true;$('detail').classList.add('active');$('intro').innerHTML='已打开 <strong>'+esc(active.name)+'</strong>，共 '+rows.length+' 条业务记录。你可以用对话控制右侧表格。';$('agent').innerHTML='✧ '+esc(active.agent)+'<small>来源：'+esc(active.source)+' · '+esc(active.date)+'</small>';$('sheet-title').textContent=active.name;$('download').href=active.file;$('download').download=active.name;$('messages').innerHTML='';renderSheet();document.title=active.name+' · 我的空间 · H ERP'}
function closeFile(){active=null;$('detail').classList.remove('active');$('library-view').hidden=false;document.title='我的空间 · H ERP'}
function renderSheet(){if(!active)return;let visible=rows.filter(x=>!onlyExceptions||/异常|待处理|待复核|待确认/.test(x[active.status]));$('sheet').innerHTML='<thead><tr>'+active.headers.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+visible.map(row=>'<tr>'+row.map(v=>'<td>'+esc(typeof v==='number'?v.toLocaleString('zh-CN'):v)+'</td>').join('')+'</tr>').join('')+'</tbody>';$('sheet-foot').textContent='显示 '+visible.length+' / '+active.rows.length+' 条 · 示例数据 · 下载保留原始导出内容'}
function reply(command){
 if(!active)return;const t=command.trim();if(!t)return;
 $('messages').insertAdjacentHTML('beforeend','<div class="bubble user">'+esc(t)+'</div>');
 let response='';
 if(/恢复|重置|原始/.test(t)){rows=active.rows.map(x=>[...x]);onlyExceptions=false;sortDescending=false;response='已恢复原始数据，共 '+rows.length+' 条记录。'}
 else if(/降序|从高到低|金额.*排序/.test(t)){rows.sort((a,b)=>b[active.amount]-a[active.amount]);sortDescending=true;response='已按“'+active.headers[active.amount]+'”降序排列。'}
 else if(/升序|从低到高/.test(t)){rows.sort((a,b)=>a[active.amount]-b[active.amount]);sortDescending=false;response='已按“'+active.headers[active.amount]+'”升序排列。'}
 else if(/异常|待处理|待复核|待确认|筛选/.test(t)){onlyExceptions=true;response='已筛选需要关注的记录。'}
 else if(/汇总|合计|总额|多少/.test(t)){const sum=rows.reduce((n,x)=>n+Number(x[active.amount]||0),0);response='当前 '+rows.length+' 条记录，'+active.headers[active.amount]+'合计 '+sum.toLocaleString('zh-CN')+' 元；其中 '+rows.filter(x=>/异常|待处理|待复核|待确认/.test(x[active.status])).length+' 条需要关注。'}
 else response='这是交互演示。你可以试试“汇总当前数据”“按金额降序排列”“筛选异常”或“恢复原始数据”。';
 renderSheet();$('messages').insertAdjacentHTML('beforeend','<div class="bubble">'+esc(response)+'</div>');$('messages').lastElementChild.scrollIntoView({block:'nearest',behavior:'smooth'});
}
$('back').addEventListener('click',closeFile);document.querySelector('.quick').addEventListener('click',e=>{const b=e.target.closest('[data-command]');if(b)reply(b.dataset.command)});
$('composer').addEventListener('submit',e=>{e.preventDefault();reply($('prompt').value);$('prompt').value=''});
$('prompt').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('composer').requestSubmit()}});
$('sort').addEventListener('click',()=>reply(sortDescending?'按金额升序排列':'按金额降序排列'));
$('filter').addEventListener('click',()=>reply('筛选异常'));
$('reset').addEventListener('click',()=>reply('恢复原始数据'));
render();
