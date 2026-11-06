(()=>{
const d=document.getElementById('upload-dialog');if(!d)return;
const template=`---
name: procurement-delivery-summary
description: 汇总待交付采购订单并识别延期风险；用于采购交付跟踪与风险分析。
compatibility: H ERP 业务助手
allowed-tools: ERPQuery
metadata:
  version: "1.0.0"
---
# 采购交付摘要
## 适用场景
用户希望跟踪采购交期或汇总交付风险时使用。
## 输入
组织、日期范围、供应商（可选）。
## 执行步骤
1. 查询当前用户权限范围内的待交付采购订单。
2. 按预计交期识别延期风险，说明判断依据。
3. 输出供应商、采购订单、交期与建议跟进事项。
## 输出
风险摘要与采购订单列表。
## 操作边界
仅查询与分析；如需修改业务数据，必须先请求用户确认。`;
d.classList.add('custom-skill-editor');d.innerHTML=`<header><div><h2 id="upload-title">自定义技能</h2><p>上传 SKILL.md 或使用模板编写，检测通过后保存。</p></div><button type="button" data-close aria-label="关闭技能编辑">×</button></header><form><div class="skill-fields"><label>技能显示名称 *<input name="name" placeholder="例如：采购交付摘要" required maxlength="40"></label><label>来源<span class="skill-source">我的自定义 · 仅自己可编辑</span></label></div><div class="skill-upload"><div><strong>♧ 上传 SKILL.md</strong><small>Markdown 文件 · 最大 200 KB · 仅分析文本，不执行内容</small></div><label class="skill-file-button">选择文件<input type="file" accept=".md,text/markdown" hidden></label><button type="button" data-template>使用模板</button></div><label class="skill-content-label">SKILL.md 内容 *<textarea name="content" required spellcheck="false"></textarea></label><small>YAML 元数据：name、description 必填；正文：适用场景、输入、步骤、输出和边界。metadata 可填写版本等信息。</small><div class="skill-check-heading"><strong>✓ 安全检测</strong><button type="button" data-check>开始检测</button></div><section class="skill-check-result"><p role="status">待检测。上传后自动检测；修改正文后需重新检测。</p><ul>${['格式与必填字段','提示注入与绕过确认','凭据和敏感信息','外联地址与数据外传','危险命令与代码执行','工具权限与业务写操作','路径穿越、脚本及引用文件'].map(x=>'<li>'+x+'</li>').join('')}</ul></section><p class="skill-check-note">当前为静态规则预检演示，不是完整安全认证。正式上线建议增加服务端规则与模型审查、依赖/脚本扫描、沙箱试运行、人工审批和运行时权限校验。allowed-tools 只是声明，不会自动授予权限。</p><footer><button type="button" data-cancel>取消</button><button class="primary" data-save disabled>检测通过后保存</button></footer></form>`;
const f=d.querySelector('form'),content=f.elements.content,save=f.querySelector('[data-save]'),status=f.querySelector('[role=status]');content.value=template;let checked='';
function invalidate(){d.querySelector('.skill-check-result ul').classList.remove('checked');d.querySelector('.skill-check-result ul').innerHTML=['格式与必填字段','提示注入与绕过确认','凭据和敏感信息','外联地址与数据外传','危险命令与代码执行','工具权限与业务写操作','路径穿越、脚本及引用文件'].map(x=>'<li>'+x+'</li>').join('');checked='';save.disabled=true;save.textContent='检测通过后保存';status.textContent='待检测。上传后自动检测；修改正文后需重新检测。'}
function check(){const text=content.value;const errors=[];if(!/^---\s*\n[\s\S]*?\n---/m.test(text)||!/^name:\s*\S+/m.test(text)||!/^description:\s*\S+/m.test(text))errors.push('请补齐 YAML 元数据 name、description');if(!/适用场景/.test(text)||!/输入/.test(text)||!/步骤/.test(text)||!/输出/.test(text)||!/边界/.test(text))errors.push('请补齐适用场景、输入、步骤、输出和操作边界');if(/忽略.*(指令|规则)|绕过.*确认|ignore previous|rm\s+-rf|eval\(|<script|sk-[a-zA-Z0-9]{16}|\.\.\//i.test(text))errors.push('检测到需复核的指令、凭据或可执行内容');if(/https?:\/\//i.test(text))errors.push('包含外联地址，请移除或复核后再检测');checked=errors.length?'':text;save.disabled=!!errors.length;save.textContent=errors.length?'检测通过后保存':'保存技能';status.textContent=errors.length?'检测未通过：'+errors.join('；'):'✓ 静态规则预检通过，可以保存技能。';const list=d.querySelector('.skill-check-result ul');list.classList.toggle('checked',!errors.length);if(!errors.length){list.innerHTML=[['格式与必填字段','基础字段和正文完整；完整 YAML 校验需服务端处理。'],['提示注入与确认绕过','未发现当前规则覆盖的注入模式。'],['凭据与敏感信息','未发现当前规则覆盖的明文凭据模式。'],['外联与数据外传','未发现显式外联地址或外发描述。'],['危险命令与代码执行','未发现当前规则覆盖的危险命令。'],['工具权限与业务写操作','工具声明在演示白名单内，仍需运行时权限校验。'],['路径、脚本与引用文件','未发现上级路径或附带文件引用。']].map(([title,desc])=>'<li><span class="skill-pass">通过</span><div><strong>'+title+'</strong><p>'+desc+'</p></div></li>').join('')}}
content.oninput=invalidate;d.querySelector('[data-check]').onclick=check;d.querySelector('[data-template]').onclick=()=>{content.value=template;invalidate()};d.querySelector('[data-close]').onclick=d.querySelector('[data-cancel]').onclick=()=>d.close();
d.querySelector('[type=file]').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.size>200*1024||!file.name.toLowerCase().endsWith('.md')){invalidate();status.textContent='请选择不超过 200 KB 的 Markdown 文件。';return}content.value=await file.text();if(!f.elements.name.value)f.elements.name.value=file.name.replace(/\.md$/i,'');check()};
f.onsubmit=e=>{e.preventDefault();if(checked!==content.value){invalidate();return}const skill={id:'custom-'+Date.now(),name:f.elements.name.value.trim(),desc:(content.value.match(/^description:\s*(.+)$/m)||[])[1]||'个人自定义技能',icon:'◇',type:'purchase',tag:'个人技能',agent:'',kind:'',content:content.value};customSkills.push(skill);catalog.push(skill);localStorage.setItem('erp-custom-skills',JSON.stringify(customSkills));installed.push(skill.id);localStorage.setItem('erp-installed-skills',JSON.stringify(installed));render();d.close();const toast=document.querySelector('.toast');toast.textContent='自定义技能已保存';toast.style.display='block';setTimeout(()=>toast.style.display='none',2500)};
})();
