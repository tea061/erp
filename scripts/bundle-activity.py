"""Embed the activity view's local CSS and JS so opening it needs no extra document requests."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]/'dist'
html=(root/'activity.html').read_text()
html=re.sub(r'<link\b[^>]*href="([^"?]+\.css)"[^>]*>',lambda m:'<style>'+ (root/m.group(1)).read_text()+'</style>',html)
html=re.sub(r'<script\b[^>]*src="([^"?]+\.js)"[^>]*></script>',lambda m:'<script>'+ (root/m.group(1)).read_text()+'</script>',html)
html=html.replace('sc.src="inventory-compare.js"','sc.textContent='+json.dumps((root/'inventory-compare.js').read_text(),ensure_ascii=False))
p=root/'index.html';s=p.read_text()
block='<!-- activity-bundle:start --><script type="application/json" id="activity-document">'+json.dumps(html,ensure_ascii=False).replace('<','\\u003c')+'</script><script>function initializeActivityFrame(frame){frame.title="工作动态";frame.srcdoc=JSON.parse(document.getElementById("activity-document").textContent)}</script><!-- activity-bundle:end -->'
if '<!-- activity-bundle:start -->' in s:s=re.sub(r'<!-- activity-bundle:start -->.*?<!-- activity-bundle:end -->',lambda m:block,s,flags=re.S)
else:s=s.replace('</head>',block+'</head>',1)
s=s.replace("frame.src='activity.html';",'initializeActivityFrame(frame);')
p.write_text(s)
p=root/'merged-workspace.js';s=p.read_text().replace("f.src='activity.html';",'initializeActivityFrame(f);');p.write_text(s)
