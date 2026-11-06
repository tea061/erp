(()=>{
if(!document.body.classList.contains('w2-frame'))return;
if(typeof agentCatalog!=='undefined'&&typeof catalog!=='undefined'){
 const base=agentCatalog.filter(a=>/库存作业|生产作业/.test(a.name));base.push({id:'public-agent',name:'公共智能体',desc:'协助整理信息、生成业务摘要与说明',type:'purchase',tag:'公共服务',skills:'整理业务信息 · 生成业务摘要'});const custom=agentCatalog.filter(a=>a.id.startsWith('custom-'));agentCatalog.splice(0,agentCatalog.length,...base,...custom);
 const toolbar=document.createElement('div');toolbar.className='w2-directory-toolbar';toolbar.innerHTML='<div class="w2-source" role="group" aria-label="来源筛选"><button data-source="all" aria-pressed="true">全部</button><button data-source="official" aria-pressed="false">官方</button><button data-source="custom" aria-pressed="false">自定义</button></div>';const cards=document.getElementById('cards');cards.before(toolbar);const search=document.getElementById('search');if(search)toolbar.append(search);toolbar.querySelectorAll('button').forEach(b=>b.onclick=()=>{toolbar.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));setDirectorySource(b.dataset.source)});render();
}
})();
