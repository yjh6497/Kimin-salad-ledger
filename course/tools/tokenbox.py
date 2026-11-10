"""강의마다 '토큰 아끼기' 상자를 넣어요. (다시 돌려도 이전 상자를 지우고 새로 넣어요)
   사용: python3 tools/tokenbox.py   (course 폴더에서) → 그다음 tools/build.py
   강의 글에 나오는 파일 종류(PDF, 엑셀, 사진 …)를 보고 맞는 요령 2~3개를 골라요.
"""
import os, re, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARK_RE = re.compile(r'\s*<div class="tokenbox"[^>]*data-gen="token".*?</ul></div>\n?', re.S)

TIPS = [
    # (이름, 찾을 말, 요령)
    ('hwp', r'한글\(HWP\)|HWP|HWPX|\.hwp', '한글(HWP) 파일은 MarkItDown이 바로 못 읽어요. 한글에서 <b>PDF나 워드(DOCX)로 저장</b>한 뒤 <code>markitdown 파일.docx -o 파일.md</code>로 바꿔 올려요.'),
    ('pdf', r'PDF|견적서|명세서|계약서|공고문|고시|설명서|보고서|도면', 'PDF는 그대로 올리면 무거워요. <code>markitdown 파일.pdf -o 파일.md</code>로 바꿔 <b>필요한 쪽만</b> 붙여 넣어요. 스캔한 PDF는 그대로 올려요.'),
    ('excel', r'엑셀|xlsx|CSV|스프레드시트|시트', '시트·엑셀은 통째로 말고 <b>필요한 탭·열만 CSV</b>로 내려받아 올려요. 엑셀 파일은 <code>markitdown 파일.xlsx -o 파일.md</code>로 표 글자로 바꿀 수 있어요.'),
    ('word', r'워드|docx|구글 문서|문서 초안', '워드·구글 문서는 <span class="path">파일 → 다운로드 → 마크다운(.md)</span>이나 <code>markitdown 파일.docx -o 파일.md</code>로 바꿔 올리면 가벼워요.'),
    ('ppt', r'파워포인트|pptx|슬라이드|제안서', '발표 자료는 <code>markitdown 자료.pptx -o 자료.md</code>로 글자만 뽑아 올리면 그림까지 읽지 않아 가벼워요.'),
    ('image', r'캡처|사진|이미지|스크린샷|화면을 찍', '캡처는 "어디를 눌러야 하나"처럼 <b>화면 모양이 필요할 때만</b>. 화면의 글자는 복사해서 붙여 넣는 게 훨씬 가벼워요. 사진은 여러 장 대신 꼭 필요한 한두 장만.'),
    ('web', r'웹페이지|홈페이지|URL|링크|공지사항|사이트', '웹페이지는 주소만 주고 "전체 읽어 줘" 대신, 필요한 부분 글자를 복사해 주거나 <code>markitdown 페이지.html -o 페이지.md</code>로 바꿔 줘요.'),
    ('code', r'스크립트|Apps Script|코드|AutoLISP|매크로|VBA', '코드를 고칠 때는 "전체 다시" 대신 <b>"바뀐 함수만"</b> 달라고 해요. 오류는 빨간 줄 몇 줄만 복사해 보내요.'),
    ('long', r'브리핑|월간|요약|분석|리포트|성과', '정기 브리핑·분석은 같은 채팅에 계속 쌓지 말고 <b>달마다 새 채팅</b>. 지난달 요약 10줄만 붙여 이어가요.'),
    ('prompt', r'부탁문', '부탁문 끝에 <b>"표만" "5줄로"</b>처럼 답 길이를 정하면 답도 빠르고 사용량도 줄어요.'),
]
GENERIC = '주제가 바뀌면 <b>새 채팅</b>. 반복해서 쓰는 자료(소개서·규칙)는 프로젝트 파일에 한 번만 넣어 둬요.'

def box(tips):
    lis = ''.join('<li>%s</li>' % t for t in tips)
    return ('\n  <div class="tokenbox" data-gen="token"><div class="tokenbox-h"><b>토큰 아끼기</b>'
            '<a href="#c-b7" class="ref" data-ref="c-b7">강의</a></div><ul>%s</ul></div>\n' % lis)

def text_of(html):
    html = re.sub(r'<pre\b.*?</pre>', ' ', html, flags=re.S)
    html = re.sub(r'<script\b.*?</script>', ' ', html, flags=re.S)
    return re.sub(r'<[^>]+>', ' ', html)

n = 0
for p in sorted(glob.glob(os.path.join(ROOT, 'src', '*', '*.html'))):
    if os.path.basename(p) in ('c-b7.html',):
        continue
    s = open(p, encoding='utf8').read()
    s = MARK_RE.sub('\n', s)
    t = text_of(s)
    picked = []
    for name, pat, tip in TIPS:
        if len(picked) >= 3: break
        if name == 'pdf' and any(x == 'hwp' for x, _ in picked):
            continue
        if re.search(pat, t):
            picked.append((name, tip))
    tips = [tip for _, tip in picked]
    if len(tips) < 3: tips.append(GENERIC)
    tips = tips[:3]
    b = box(tips)
    # 넣을 자리: '추천 커넥터' 앞 → 'AI 비서에 연결' 앞 → '무료로 하기' 앞 → 끝
    for anchor in ('<div class="rec">', '<div class="aib">', '<div class="fp">'):
        i = s.rfind(anchor)
        if i >= 0:
            s = s[:i].rstrip() + b + '  ' + s[i:]
            break
    else:
        i = s.rfind('</section>')
        s = s[:i].rstrip() + b + s[i:]
    open(p, 'w', encoding='utf8').write(s)
    n += 1
print('토큰 아끼기 상자', n, '개')
