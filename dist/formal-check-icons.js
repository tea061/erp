/* Shared, font-independent status checkmarks across the workbench and embedded pages. */
(()=>{
 if(window.herpFormalChecks)return;window.herpFormalChecks=true;
 const style=document.createElement('style');style.textContent='.herp-formal-check{display:inline-flex!important;align-items:center;justify-content:center;width:1em;height:1em;min-width:1em;vertical-align:-.12em;line-height:1;color:inherit;flex-shrink:0}.herp-formal-check>svg{display:block;width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}';document.head.append(style);
 const excluded='script,style,textarea,input,pre,code,svg,math,[contenteditable]:not([contenteditable="false"]),.herp-formal-check';
 function normalize(root){
  if(!root||root.nodeType!==1||root.closest(excluded))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return /[✓✔√☑]/u.test(node.data)&&!node.parentElement?.closest(excluded)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}}),nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){const fragment=document.createDocumentFragment();node.data.split(/([✓✔√☑])/u).forEach(part=>{if(!/^[✓✔√☑]$/u.test(part)){fragment.append(document.createTextNode(part));return}const icon=document.createElement('span');icon.className='herp-formal-check';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24" focusable="false"><path d="M5 12.5 9.25 16.75 19 7"/></svg>';fragment.append(icon)});node.replaceWith(fragment)}
 }
 const pending=new Set();let scheduled=false;
 function enqueue(root){if(!root||root.closest?.(excluded))return;pending.add(root);if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;for(const item of pending)normalize(item);pending.clear()})}
 function start(){normalize(document.body);new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')enqueue(r.target.parentElement);else for(const node of r.addedNodes)enqueue(node.nodeType===1?node:node.parentElement)}}).observe(document.body,{subtree:true,childList:true,characterData:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
