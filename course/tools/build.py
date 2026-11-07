"""강의 원본(src/)을 묶어 화면이 읽는 파일(lib/)을 만듭니다.
   사용: python3 tools/build.py   (course 폴더에서)
   - 순서와 장(part)은 tools/spine.py 가 정합니다. 새 강의는 spine.py에 한 줄 넣고 src/<그룹>/<id>.html 로 저장하세요.
"""
import os, re, json, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from spine import PARTS, L

GROUP = {'c': 'common', 'v': 'vet', 's': 'salad', 'a': 'arch', 'f': 'flower'}
out = {}
manifest = []
missing = []
for pkey, ptitle in PARTS:
    for row in L[pkey]:
        nid = row[0]
        grp = GROUP[nid[0]]
        path = os.path.join(ROOT, 'src', grp, nid + '.html')
        if not os.path.exists(path): missing.append(path); continue
        html = open(path, encoding='utf8').read().strip()
        m = re.match(r'<section\s([^>]*)>', html)
        if not m: missing.append(path + ' (section 태그 없음)'); continue
        a = dict(re.findall(r'([\w-]+)="([^"]*)"', m.group(1)))
        if a.get('id') != nid: print('경고: id 불일치', path)
        text = re.sub(r'<[^>]+>', '', html)
        manifest.append({
            'id': nid, 'g': grp, 'part': a.get('data-part', pkey), 'title': a.get('data-title', ''),
            'level': a.get('data-level', 'grow'), 'stage': a.get('data-stage', 'prep takeover operate').split(),
            'biz': a.get('data-biz', '').split(), 'not': a.get('data-biz-not', '').split(), 'ai': a.get('data-ai', ''),
            'kw': re.sub(r'\s+', ' ', ' '.join(re.findall(r'<h[23][^>]*>(.*?)</h[23]>', html)))[:300]
        })
        out.setdefault(grp, []).append(html)
os.makedirs(os.path.join(ROOT, 'lib'), exist_ok=True)
for grp, items in out.items():
    open(os.path.join(ROOT, 'lib', grp + '.html'), 'w', encoding='utf8').write('\n'.join(items) + '\n')
json.dump({'parts': PARTS, 'lessons': manifest}, open(os.path.join(ROOT, 'lib', 'manifest.json'), 'w', encoding='utf8'), ensure_ascii=False)
for p in missing: print('없음:', p)
print('강의 %d개 → lib/ (%s)' % (len(manifest), ', '.join('%s %d' % (g, len(v)) for g, v in out.items())))
