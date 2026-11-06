/* Update persisted role labels before page data is loaded. */
(()=>{
const previous='\u8d22\u7ecf\u5b58\u8d27\u4f1a\u8ba1',current='存货核算会计';
for(const storage of [localStorage,sessionStorage]){
 try{for(const key of Object.keys(storage)){if(!/^(erp|herp|yunxu)[-:]/.test(key))continue;const value=storage.getItem(key);if(value?.includes(previous))storage.setItem(key,value.replaceAll(previous,current))}}catch{}
}
})();
