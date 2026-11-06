(()=>{
function sync(){const id=sessionStorage.getItem('yunxu-role');const role=workRoles.find(r=>r.id===id);if(!role)return;document.querySelectorAll('.reference-composer .composer-mascot').forEach(image=>{if(image.getAttribute('src')!==role.image)image.setAttribute('src',role.image);const alt=role.name+'半身形象';if(image.alt!==alt)image.alt=alt})}
for(const name of ['openNewConversation','enterWorkspace']){const previous=window[name];if(typeof previous==='function')window[name]=function(){const result=previous.apply(this,arguments);sync();return result}}
new MutationObserver(sync).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});window.addEventListener('storage',sync);sync();
})();
