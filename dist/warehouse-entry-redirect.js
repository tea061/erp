(()=>{
const previous=enterWorkspace;
const destinations={'purchase-lead':'https://erp-assistant-workbench-hao.mightyaspen68.chatgpt.site/'};
enterWorkspace=function(){
 const role=chosenRole.id;
 if(destinations[role]){window.open(destinations[role],'_blank','noopener');return}
 const url=new URL(location.href);url.hash='';url.searchParams.set('workspaceRole',role);
 window.open(url.href,'_blank','noopener');
};
function openRequestedWorkspace(){try{const id=new URLSearchParams(location.search).get('workspaceRole');const role=workRoles.find(item=>item.id===id);if(!role||destinations[id])return;chosenRole=id==='purchase-lead-2'?{...role,id:'purchase-lead',entryRoleId:id}:role;previous();}finally{document.documentElement.removeAttribute('data-workspace-entry-pending')}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openRequestedWorkspace,{once:true});else openRequestedWorkspace();
})();
