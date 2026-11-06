(()=>{
 const base=new URL('.',document.currentScript.src);const stamp=Date.now();
 document.title='ERP ONE助理';document.body.setAttribute('data-one-standalone','');
 document.body.innerHTML='<header class="one-page-heading"><a class="one-page-home" href="https://yunxu-erp-1021-mt.i-key.chatgpt.site/" aria-label="返回 H ERP 工作台"><span class="one-page-logo">H</span><span>H ERP</span></a><span class="one-page-caption">ERP ONE助理</span></header><p class="one-page-note">交互演示 · 预设回复，尚未接入 AI 模型</p>';
 for(const name of ['grid-8.css','ai-send-button.css','hover-tips.css','ai-assistant.css']){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL(name+'?shared='+stamp,base);document.head.append(link)}
 const script=document.createElement('script');script.src=new URL('global-ai-orb.js?shared='+stamp,base);script.onload=()=>{const tips=document.createElement('script');tips.src=new URL('hover-tips.js?shared='+stamp,base);document.body.append(tips)};document.body.append(script);
 script.onerror=()=>{const p=document.createElement('p');p.textContent='助手暂时无法加载，请刷新重试。';document.body.append(p)};
})();