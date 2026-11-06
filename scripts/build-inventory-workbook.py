from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from xml.sax.saxutils import escape
import json
root=Path(__file__).resolve().parents[1]/'dist'
rows=[['TR-001','A100','A100控制器','原料仓','件',320,308],['TR-002','B200','B200电源模块','成品仓','件',120,128]]
rows += [[f'TR-{i+3:03}',f'MAT-{i+1:03}','示例物料'+str(i+1),'原料仓' if i%2==0 else '成品仓','件',100+i,100+i] for i in range(126)]
(root/'inventory-reconciliation-data.js').write_text('window.InventoryReconciliationRows='+json.dumps(rows,ensure_ascii=False)+';\n')
headers=['交易参考','物料编码','物料描述','仓库','单位']
sheets=[('ERP原始数据',[headers+['ERP数量']]+[r[:6] for r in rows]),('WMS原始数据',[headers+['WMS数量']]+[r[:5]+[r[6]] for r in rows]),('差异对比',[headers+['ERP数量','WMS数量','数量差异','对账结果']]+[r+[r[6]-r[5],'数量不一致'] for r in rows if r[5]!=r[6]])]
ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
def col(n):
 out=''
 while n:n,d=divmod(n-1,26);out=chr(65+d)+out
 return out
def sheetxml(data):
 out=[]
 for i,row in enumerate(data,1):
  cells=[]
  for j,v in enumerate(row,1):
   ref=f'{col(j)}{i}'
   if isinstance(v,(int,float)):cells.append(f'<c r="{ref}"><v>{v}</v></c>')
   else:cells.append(f'<c r="{ref}" t="inlineStr"><is><t>{escape(str(v))}</t></is></c>')
  out.append(f'<row r="{i}">'+''.join(cells)+'</row>')
 return f'<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="{ns}"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="9" width="20" customWidth="1"/></cols><sheetData>'+''.join(out)+'</sheetData></worksheet>'
with ZipFile(root/'inventory-reconciliation.xlsx','w',ZIP_DEFLATED) as z:
 z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+''.join(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' for i in range(1,4))+'</Types>')
 z.writestr('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')
 z.writestr('xl/workbook.xml',f'<workbook xmlns="{ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+''.join(f'<sheet name="{name}" sheetId="{i}" r:id="rId{i}"/>' for i,(name,_) in enumerate(sheets,1))+'</sheets></workbook>')
 z.writestr('xl/_rels/workbook.xml.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+''.join(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>' for i in range(1,4))+'</Relationships>')
 for i,(_,data) in enumerate(sheets,1):z.writestr(f'xl/worksheets/sheet{i}.xml',sheetxml(data))
