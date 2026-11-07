"""공통 강의 점검: python3 check.py <파일...>
- 태그 짝이 맞는지
- data-biz="vet"(동물병원 전용) 밖에 동물병원 전용 단어가 남았는지
- 토큰 이름/조사가 올바른지
"""
import sys, re
from html.parser import HTMLParser

VOID = {'input', 'br', 'img', 'hr', 'meta', 'link', 'source', 'wbr', 'col', 'area', 'embed', 'track', 'param'}
VETWORDS = ['진료', '수의', '반려', '강아지', '고양이', '접종', '중성화', '슬개골', '환자', '처방', '약품', '수술', '입원',
            '동물', '펫', '내원', '심장사상충', '진드기', '차트', '보호자', '원장님', '동물병원', '개원', '아이가', '아이를', '아이의', '아이는', '아이와']
TOKENS = {'owner', 'customer', 'place', 'biz', 'open', 'shopname', 'work', 'hours', 'staff', 'item', 'visit', 'supplier', 'stockitem',
          'ex_post', 'ex_reel', 'ex_review', 'ex_revisit', 'ex_faq', 'ex_season', 'ex_keyword', 'ex_service3'}
JOSA = {'이', '가', '은', '는', '을', '를', '과', '와', '으로', '로', '이다', '이에요'}

class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True)
        s.stack = []; s.errors = []; s.skip = 0; s.text = []; s.inscript = False
    def handle_starttag(s, tag, attrs):
        a = dict(attrs)
        if tag in VOID: return
        vet_only = 'vet' in (a.get('data-biz') or '').split() and len((a.get('data-biz') or '').split()) >= 1 and 'data-biz-not' not in a
        s.stack.append((tag, vet_only))
        if vet_only: s.skip += 1
        if tag == 'script': s.inscript = True
    def handle_endtag(s, tag):
        if tag in VOID: return
        if not s.stack: s.errors.append('닫는 태그만 있음: ' + tag); return
        t, v = s.stack.pop()
        if t != tag: s.errors.append('태그 짝 틀림: <%s> 를 </%s> 로 닫음 (줄 %d)' % (t, tag, s.getpos()[0]))
        if v: s.skip -= 1
        if tag == 'script': s.inscript = False
    def handle_data(s, data):
        if s.skip == 0: s.text.append((s.getpos()[0], data, s.inscript))

def check(path):
    src = open(path, encoding='utf8').read()
    p = P(); p.feed(src); p.close()
    out = []
    out += p.errors
    if p.stack: out.append('안 닫힌 태그: ' + ', '.join(t for t, _ in p.stack))
    for m in re.finditer(r'\{\{([^}]*)\}\}', src):
        name, _, josa = m.group(1).partition(':')
        if name not in TOKENS: out.append('모르는 토큰: ' + m.group(0))
        elif josa and josa not in JOSA: out.append('모르는 조사: ' + m.group(0))
    hits = {}
    for ln, data, insc in p.text:
        for w in VETWORDS:
            if w in data:
                hits.setdefault(w, []).append(ln)
    for w, lns in hits.items():
        out.append('동물병원 단어 "%s" 남음: 줄 %s' % (w, ', '.join(map(str, sorted(set(lns))[:12]))))
    print('==', path, '· 문제 없음' if not out else '· %d건' % len(out))
    for o in out: print('  -', o)

for f in sys.argv[1:]: check(f)
