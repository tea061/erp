(()=>{
const examples={
'维护物料货位限制关系':'维护华东库存组织中主控板 PCB-A100 的货位限制关系，限定可用货位为原料仓 A-01、A-02。',
'创建转库单':'创建转库单：华东库存组织，将原料子库 RM01 的主控板 PCB-A100 转入线边子库 WIP01，数量 200 块。',
'创建杂项单':'创建杂项单：华东库存组织，原料子库 RM01，主控板 PCB-A100，杂项入库 20 块，用途为盘点调整。',
'维护物料子库限制关系':'维护华东库存组织中主控板 PCB-A100 的子库限制关系，允许原料子库 RM01 和线边子库 WIP01。',
'查询库存现有量及可用量':'查询华东库存组织主控板 PCB-A100 的库存现有量及可用量，按子库和货位展示。',
'查询转库单':'查询华东库存组织本周的转库单，列出调出子库、调入子库、物料、数量和状态。',
'查询杂项单':'查询华东库存组织本周的杂项单，按入库、出库展示物料、数量和用途。',
'查询物料':'查询物料 PCB-A100 的名称、规格、单位和物料状态。',
'查询采购订单':'查询本周待交付采购订单，列出供应商、物料、数量和交付日期。',
'查询验收交易':'查询采购订单 PO-20261026-001 的验收交易，核对物料、数量和验收状态。',
'采购接受':'核对采购订单 PO-20261026-001 的接受信息，整理待确认事项。',
'接收':'采购订单 PO-20261026-001 到货主控板 100 块，整理接收信息并等待确认。',
'采购入库':'核对已接收采购物料，确认库存组织、子库、货位与数量后办理采购入库。',
'销售订单查询':'查询本周待发货销售订单，列出客户、物料、数量和计划发货日期。',
'销售订单退货查询':'查询销售退货订单，核对退货物料、数量、退货原因及处理状态。'
};
showDirectoryDetails=function(item){const custom=item.id.startsWith('custom-');const skills=Array.isArray(item.skills)?item.skills:String(item.skills||item.tag).split(/[·、]/).map(s=>s.trim()).filter(Boolean);const domain=item.id==='production-ops-agent'?'生产运营':item.id==='order-ops-agent'?'订单与交付':item.id==='purchase-fulfillment-agent'?'采购与交付':officialCategory(item);const d=document.createElement('dialog');d.className='market-dialog reference-agent-details';d.setAttribute('aria-labelledby','agent-detail-title');d.innerHTML='<header><div><h2 id="agent-detail-title">'+safeText(item.name)+'</h2><p>'+safeText(domain)+' · '+(custom?'自定义智能体':'官方智能体')+'</p></div><button type="button" class="detail-close" aria-label="关闭智能体详情">×</button></header><div class="agent-detail-body"><h3>智能体说明</h3><p>'+safeText(item.desc)+'</p><dl><dt>专业领域</dt><dd>'+safeText(item.desc)+'</dd><dt>执行指令</dt><dd>根据用户需求查询相关业务信息，先核对数据权限；涉及业务变更时先请求用户确认。</dd><dt>版本</dt><dd>1.0.0</dd></dl><h3>可用技能 <span>'+skills.length+'</span></h3><div class="detail-skills">'+skills.map(s=>{const type=/^维护/.test(s)?'维护':/^创建/.test(s)?'创建':/查询|核对|巡检|诊断|分析/.test(s)?'查询':'处理';return '<article><div><strong>'+safeText(s)+'</strong><span>'+type+'</span></div><p>'+safeText(examples[s]||'围绕“'+s+'”核对相关业务数据，整理执行依据、处理建议与待确认事项。')+'</p></article>'}).join('')+'</div></div><footer><button type="button" class="detail-dismiss">关闭</button><button type="button" class="detail-start">开始对话 →</button></footer>';document.body.append(d);d.querySelector('.detail-close').onclick=d.querySelector('.detail-dismiss').onclick=()=>d.close();d.querySelector('.detail-start').onclick=()=>{d.close();startDirectoryConversation(item)};d.onclose=()=>d.remove();d.showModal()};
})();
