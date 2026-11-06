(()=>{
'use strict';
const selector='button,a[role="button"],[role="button"],[onclick][aria-label],.close[onclick]';
function update(root){
 const nodes=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
 for(const button of nodes){
  const text=button.textContent.trim();
  const label=(button.getAttribute('aria-label')||button.title||'').trim();
  const closeName=/关闭|close/i.test(label+' '+button.className+' '+button.id);
  const cross=/^[×✕✖⨉xX]$/.test(text);
  if(!cross&&!(closeName&&!text&&button.querySelector('svg')))continue;
  if(button.classList.contains('unified-close-icon'))continue;
  if(!label)button.setAttribute('aria-label','关闭');
  if(getComputedStyle(button).position==='static')button.style.position='relative';
  button.classList.add('unified-close-icon');
 }
}
const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('unified-close.css',document.currentScript.src).href;document.head.append(css);
update(document);
new MutationObserver(records=>{for(const record of records){if(record.type==='characterData'){const el=record.target.parentElement;if(el)update(el.closest(selector)||el);}else for(const node of record.addedNodes){if(node.nodeType===1)update(node);else if(node.parentElement)update(node.parentElement);}}}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
