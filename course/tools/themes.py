#!/usr/bin/env python3
"""업종별 디자인(스킨) → themes.css 생성.

html[data-skin="vet|salad|flower|arch|c-shop|c-clinic|c-edu|c-office"] 에 맞춰
색·글꼴·모서리·배경 무늬·제목 밑 장식·아이콘을 바꿔요.
고치려면 이 파일의 SKINS 를 바꾸고 `python3 tools/themes.py` 를 다시 실행하세요.
"""
from pathlib import Path
from urllib.parse import quote

OUT = Path(__file__).resolve().parent.parent / 'themes.css'


def svg(body, vb):
    s = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='%s'>%s</svg>" % (vb, body)
    return 'url("data:image/svg+xml,%s")' % quote(s, safe="/:=' ,.-")


# ---- 제목 밑 장식 (mask, 색은 --pulse) ----
MOTIF = {
    'ecg': svg("<path d='M0 6h96l6-5 6 9 6-8 5 4h141' fill='none' stroke='black' stroke-width='1.6'/>", '0 0 260 10'),
    'vine': svg("<path d='M0 9C20 3 40 15 60 9s40-6 60 0 40 6 60 0 40-6 80 0' fill='none' stroke='black' stroke-width='1.6'/>"
                "<path d='M60 9c3-6 11-8 16-7-2 6-9 9-16 7zM150 9c3-6 11-8 16-7-2 6-9 9-16 7zM228 9c-3-6-11-8-16-7 2 6 9 9 16 7z'/>", '0 0 260 16'),
    'stem': svg("<path d='M0 11H260' stroke='black' stroke-width='1.2'/>"
                + ''.join("<g transform='translate(%d 7)'><circle cx='0' cy='-3.4' r='2.6'/><circle cx='3.4' cy='0' r='2.6'/><circle cx='0' cy='3.4' r='2.6'/><circle cx='-3.4' cy='0' r='2.6'/></g>" % x for x in (36, 128, 222)),
                '0 0 260 14'),
    'dim': svg("<path d='M1 0v12M259 0v12M1 6h258' stroke='black' stroke-width='1.2' fill='none'/><path d='M1 6l9-3.5v7zM259 6l-9-3.5v7z'/>", '0 0 260 12'),
    'dots': svg("<path d='M0 5h260' stroke='black' stroke-width='2' stroke-dasharray='2 6' stroke-linecap='round' fill='none'/>", '0 0 260 10'),
    'wave': svg("<path d='M0 6q10-6 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0' fill='none' stroke='black' stroke-width='1.6'/>", '0 0 260 12'),
    'rule': svg("<path d='M0 2h260M0 7h260' stroke='black' stroke-width='1.2'/>", '0 0 260 9'),
}

# ---- 강의 머리 오른쪽 아이콘 (mask) ----
MARK = {
    'paw': svg("<ellipse cx='32' cy='42' rx='13' ry='11'/><ellipse cx='15' cy='26' rx='5.5' ry='7'/><ellipse cx='26' cy='16' rx='5.5' ry='7.5'/><ellipse cx='38' cy='16' rx='5.5' ry='7.5'/><ellipse cx='49' cy='26' rx='5.5' ry='7'/>", '0 0 64 64'),
    'bowl': svg("<path d='M6 32h52a26 22 0 0 1-52 0z'/><path d='M33 29c-5-10-1-21 12-24 3 12-3 21-12 24zM29 29c-3-8-11-13-20-11 2 9 11 13 20 11z'/>", '0 0 64 64'),
    'bloom': svg(''.join("<ellipse cx='32' cy='17' rx='8' ry='13' transform='rotate(%d 32 32)'/>" % a for a in (0, 72, 144, 216, 288)), '0 0 64 64'),
    'square': svg("<path fill-rule='evenodd' d='M8 58V6l52 52zM16 48V26l22 22z'/>", '0 0 64 64'),
    'shop': svg("<path d='M6 14h52l4 14H2zM8 30h48v26H8z'/>", '0 0 64 64'),
    'cross': svg("<path d='M24 6h16v18h18v16H40v18H24V40H6V24h18z'/>", '0 0 64 64'),
    'pencil': svg("<path d='M44 6l14 14-30 30-16 4 4-16z'/>", '0 0 64 64'),
    'case': svg("<path fill-rule='evenodd' d='M22 14V8h20v6h16v40H6V14zM28 14h8v-2h-8z'/>", '0 0 64 64'),
}


def pattern_svg(kind, color, op):
    if kind == 'paw':
        g = "<g fill='%s' fill-opacity='%s' transform='rotate(-18 40 40)'><ellipse cx='40' cy='46' rx='7' ry='6'/><circle cx='31' cy='37' r='3'/><circle cx='37' cy='32' r='3'/><circle cx='44' cy='32' r='3'/><circle cx='50' cy='37' r='3'/></g>" % (color, op)
        w = 140
    elif kind == 'petal':
        g = ''.join("<ellipse cx='%d' cy='%d' rx='4' ry='9' transform='rotate(%d %d %d)' fill='none' stroke='%s' stroke-opacity='%s' stroke-width='1.2'/>" % (x, y, r, x, y, color, op)
                    for x, y, r in ((30, 40, 30), (110, 30, -40), (70, 100, 70), (150, 120, 10), (20, 140, -20)))
        w = 170
    else:
        return 'none'
    s = "<svg xmlns='http://www.w3.org/2000/svg' width='%d' height='%d'>%s</svg>" % (w, w, g)
    return 'url("data:image/svg+xml,%s")' % quote(s, safe="/:=' ,.-")


# 색 이름: bg paper sunk ink muted line leaf leaf-soft tomato carrot code shadow pulse tag tag-ink
SKINS = {
    'vet': dict(
        name='동물병원 · 진료실', font="'Gowun Dodum'", hw='400', motif='ecg', mark='paw', pat='paw',
        r='14px', rlg='20px', rsm='10px', pill='999px',
        light=dict(bg='#EDF3F1', paper='#FFFFFF', sunk='#E1EBE7', ink='#16211F', muted='#55635F', line='#C4D2CD',
                   leaf='#1D6B61', leafsoft='#D2EAE3', tomato='#B4432C', carrot='#B97A12', code='#F4F8F7', shadow='rgba(23,33,31,.14)',
                   pulse='#1D6B61', tag='#E9A623', tagink='#3B2A05'),
        dark=dict(bg='#0E1513', paper='#16201D', sunk='#111A17', ink='#E2EAE7', muted='#98A8A3', line='#283733',
                  leaf='#6CC7B8', leafsoft='#17302B', tomato='#F08A6E', carrot='#E5B456', code='#111917', shadow='rgba(0,0,0,.5)',
                  pulse='#6CC7B8', tag='#E5B456', tagink='#2A1E04')),
    'salad': dict(
        name='샐러드 가게 · 주방', font="'Jua'", hw='400', motif='vine', mark='bowl', pat='dots',
        r='16px', rlg='24px', rsm='12px', pill='999px',
        light=dict(bg='#F5F3E6', paper='#FFFFFC', sunk='#ECEAD6', ink='#1F2A1C', muted='#5E6852', line='#D5D6BC',
                   leaf='#2F7A35', leafsoft='#DCEBCB', tomato='#CF4A2E', carrot='#D9821C', code='#F8F8EE', shadow='rgba(40,50,20,.14)',
                   pulse='#2F7A35', tag='#CF4A2E', tagink='#FFFFFF'),
        dark=dict(bg='#10160F', paper='#182217', sunk='#131B12', ink='#E6EEDD', muted='#9EAA92', line='#2D3A29',
                  leaf='#8BCB6E', leafsoft='#1F3219', tomato='#FF8A66', carrot='#F0A94E', code='#121911', shadow='rgba(0,0,0,.5)',
                  pulse='#8BCB6E', tag='#FF8A66', tagink='#2A0F05')),
    'flower': dict(
        name='꽃집 · 작업대', font="'Gowun Batang'", hw='700', motif='stem', mark='bloom', pat='petal',
        r='16px 5px 16px 5px', rlg='26px 7px 26px 7px', rsm='12px 4px 12px 4px', pill='999px',
        light=dict(bg='#FAF3F0', paper='#FFFDFB', sunk='#F3E6E2', ink='#2E1F26', muted='#77636D', line='#E6D0CE',
                   leaf='#9C3A63', leafsoft='#F6DDE6', tomato='#B33A48', carrot='#A9803A', code='#FCF7F5', shadow='rgba(70,30,45,.13)',
                   pulse='#6F8C68', tag='#9C3A63', tagink='#FFFFFF'),
        dark=dict(bg='#170F13', paper='#21161B', sunk='#1A1116', ink='#F1E4E9', muted='#B39CA6', line='#3B2A31',
                  leaf='#E48AAE', leafsoft='#3A1E2A', tomato='#F08A96', carrot='#DDB46A', code='#1A1216', shadow='rgba(0,0,0,.5)',
                  pulse='#9DBB95', tag='#E48AAE', tagink='#2A0A16')),
    'arch': dict(
        name='건축사사무소 · 도면', font="'IBM Plex Sans KR'", hw='600', motif='dim', mark='square', pat='grid',
        r='3px', rlg='4px', rsm='2px', pill='4px',
        light=dict(bg='#EDF1F5', paper='#FFFFFF', sunk='#E3E9F0', ink='#13202F', muted='#536173', line='#BCC7D4',
                   leaf='#1E4F8E', leafsoft='#DBE6F4', tomato='#C2410C', carrot='#E06A12', code='#F5F8FB', shadow='rgba(19,32,47,.14)',
                   pulse='#13202F', tag='#FFFFFF', tagink='#13202F', grid='rgba(30,79,142,.07)', gridmaj='rgba(30,79,142,.12)'),
        dark=dict(bg='#0C1420', paper='#121D2B', sunk='#0F1825', ink='#E2E9F2', muted='#93A2B5', line='#26364A',
                  leaf='#7DB0EE', leafsoft='#17293F', tomato='#FF8A5C', carrot='#FF9A4A', code='#0F1824', shadow='rgba(0,0,0,.5)',
                  pulse='#E2E9F2', tag='#121D2B', tagink='#E2E9F2', grid='rgba(125,176,238,.06)', gridmaj='rgba(125,176,238,.11)')),
    'c-shop': dict(
        name='매장', font="'Gowun Dodum'", hw='400', motif='wave', mark='shop', pat='none',
        r='14px', rlg='20px', rsm='10px', pill='999px',
        light=dict(bg='#F6F0E8', paper='#FFFDF9', sunk='#EDE4D8', ink='#2A2018', muted='#6E6052', line='#DCCDBB',
                   leaf='#9A4E1A', leafsoft='#F2DFCC', tomato='#B8402A', carrot='#C08A1E', code='#FAF6F0', shadow='rgba(60,40,20,.14)',
                   pulse='#9A4E1A', tag='#9A4E1A', tagink='#FFFFFF'),
        dark=dict(bg='#16110C', paper='#201912', sunk='#1A140E', ink='#EFE6DB', muted='#B3A391', line='#3A2E22',
                  leaf='#E7A06A', leafsoft='#3A2615', tomato='#F08A6E', carrot='#E6B65A', code='#18120D', shadow='rgba(0,0,0,.5)',
                  pulse='#E7A06A', tag='#E7A06A', tagink='#2A1405')),
    'c-clinic': dict(
        name='병·의원', font="'Gowun Dodum'", hw='400', motif='ecg', mark='cross', pat='none',
        r='14px', rlg='20px', rsm='10px', pill='999px',
        light=dict(bg='#EEF3F8', paper='#FFFFFF', sunk='#E2EAF2', ink='#16202B', muted='#566474', line='#C5D1DE',
                   leaf='#2D6AA3', leafsoft='#D9E7F5', tomato='#B8442A', carrot='#B9852C', code='#F5F8FB', shadow='rgba(22,32,43,.14)',
                   pulse='#2D6AA3', tag='#2D6AA3', tagink='#FFFFFF'),
        dark=dict(bg='#0E141B', paper='#161F29', sunk='#111921', ink='#E3E9F0', muted='#9AA7B5', line='#29384A',
                  leaf='#7FB4E8', leafsoft='#1A2C40', tomato='#F08A6E', carrot='#E0B05C', code='#111820', shadow='rgba(0,0,0,.5)',
                  pulse='#7FB4E8', tag='#7FB4E8', tagink='#0B1A2A')),
    'c-edu': dict(
        name='학원·공방', font="'Jua'", hw='400', motif='wave', mark='pencil', pat='none',
        r='16px', rlg='22px', rsm='12px', pill='999px',
        light=dict(bg='#F3F2FA', paper='#FFFFFF', sunk='#E7E5F4', ink='#1D1B33', muted='#5D5A78', line='#CFCCE6',
                   leaf='#4A3FC4', leafsoft='#E1DEFA', tomato='#C2412F', carrot='#C99300', code='#F7F6FC', shadow='rgba(29,27,51,.14)',
                   pulse='#C99300', tag='#F2C230', tagink='#2A2000'),
        dark=dict(bg='#100F1C', paper='#191827', sunk='#14131F', ink='#E7E6F4', muted='#A4A1C0', line='#2E2C47',
                  leaf='#A49CFF', leafsoft='#25224A', tomato='#F08A6E', carrot='#F2C230', code='#13121E', shadow='rgba(0,0,0,.5)',
                  pulse='#F2C230', tag='#F2C230', tagink='#2A2000')),
    'c-office': dict(
        name='사무소', font="'Noto Serif KR'", hw='700', motif='rule', mark='case', pat='none',
        r='6px', rlg='8px', rsm='4px', pill='6px',
        light=dict(bg='#F1F2F4', paper='#FFFFFF', sunk='#E6E8EC', ink='#1A2230', muted='#5A6372', line='#C9CED6',
                   leaf='#2F4A6B', leafsoft='#DDE4EE', tomato='#A8432C', carrot='#A57A2A', code='#F6F7F9', shadow='rgba(26,34,48,.14)',
                   pulse='#A57A2A', tag='#2F4A6B', tagink='#FFFFFF'),
        dark=dict(bg='#101318', paper='#181C24', sunk='#13161D', ink='#E4E7EC', muted='#9CA4B1', line='#2C333F',
                  leaf='#93B1D8', leafsoft='#1E2A3B', tomato='#F08A6E', carrot='#D6AE62', code='#12151B', shadow='rgba(0,0,0,.5)',
                  pulse='#D6AE62', tag='#93B1D8', tagink='#0E1828')),
}


def vars_block(sk, pal, kind):
    v = ['--bg:%(bg)s', '--paper:%(paper)s', '--sunk:%(sunk)s', '--ink:%(ink)s', '--muted:%(muted)s', '--line:%(line)s',
         '--leaf:%(leaf)s', '--leaf-soft:%(leafsoft)s', '--tomato:%(tomato)s', '--carrot:%(carrot)s', '--code:%(code)s',
         '--shadow:%(shadow)s', '--pulse:%(pulse)s', '--tag:%(tag)s', '--tag-ink:%(tagink)s']
    out = [x % pal for x in v]
    p = sk['pat']
    if p in ('paw', 'petal'):
        col = pal['leaf'] if p == 'paw' else pal['leaf']
        out.append('--pattern:' + pattern_svg(p, col, '.06' if kind == 'light' else '.09'))
    elif p == 'dots':
        out.append('--pattern:radial-gradient(%s 1.2px, transparent 1.6px)' % ('rgba(47,122,53,.13)' if kind == 'light' else 'rgba(139,203,110,.10)'))
        out.append('--pattern-size:22px 22px')
    elif p == 'grid':
        out.append('--pattern:linear-gradient(%(gridmaj)s 1px, transparent 1px), linear-gradient(90deg, %(gridmaj)s 1px, transparent 1px), linear-gradient(%(grid)s 1px, transparent 1px), linear-gradient(90deg, %(grid)s 1px, transparent 1px)' % pal)
        out.append('--pattern-size:120px 120px, 120px 120px, 24px 24px, 24px 24px')
    if kind == 'dark':
        out.append('color-scheme:dark')
    return ';'.join(out)


def main():
    L = ['/* 자동 생성: tools/themes.py — 손으로 고치지 말고 스크립트를 고치세요. */',
         '/* 업종별 스킨: html[data-skin] 에 따라 색·글꼴·모서리·무늬·장식이 바뀌어요. */',
         ':root { --r: 12px; --r-lg: 18px; --r-sm: 10px; --r-pill: 999px; --pattern: none; --pattern-size: auto; --h-w: 400;',
         '  --motif: %s; --mark: none; }' % MOTIF['ecg']]
    for key, sk in SKINS.items():
        sel = ':root[data-skin="%s"]' % key
        L.append('')
        L.append('/* ── %s ── */' % sk['name'])
        L.append('%s { --f-display: %s, "IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif; --h-w: %s; --r: %s; --r-lg: %s; --r-sm: %s; --r-pill: %s; --motif: %s; --mark: %s; %s }'
                 % (sel, sk['font'], sk['hw'], sk['r'], sk['rlg'], sk['rsm'], sk['pill'], MOTIF[sk['motif']], MARK[sk['mark']], vars_block(sk, sk['light'], 'light')))
        dk = vars_block(sk, sk['dark'], 'dark')
        L.append('@media (prefers-color-scheme: dark) { %s:not([data-theme="light"]) { %s } }' % (sel, dk))
        L.append('%s[data-theme="dark"] { %s }' % (sel, dk))
    L.append(COMMON)
    OUT.write_text('\n'.join(L) + '\n', encoding='utf-8')
    print('themes.css: 스킨 %d개' % len(SKINS))


COMMON = r'''
/* ── 모든 스킨 공통: 변수로 모양 바꾸기 ── */
html[data-skin] body { background-color: var(--bg); background-image: var(--pattern); background-size: var(--pattern-size); background-attachment: fixed; transition: background-color .35s ease; }
html[data-skin] .s-step, html[data-skin] .vis, html[data-skin] .partcard, html[data-skin] .picker, html[data-skin] .s-go { border-radius: var(--r-lg); }
html[data-skin] .box, html[data-skin] .steps > li, html[data-skin] .prompt, html[data-skin] .easy, html[data-skin] .tokenbox, html[data-skin] .lawbox,
html[data-skin] .sv-opts button, html[data-skin] .s-cards button, html[data-skin] .s-types button, html[data-skin] .sv-result:not(:empty), html[data-skin] .sv-banner,
html[data-skin] .s-custom, html[data-skin] .s-search input, html[data-skin] .table-wrap, html[data-skin] .s-head .s-note, html[data-skin] .hub-msg { border-radius: var(--r); }
html[data-skin] .toc ol button { border-radius: var(--r-sm); }
html[data-skin] .s-chip, html[data-skin] .hub-btn, html[data-skin] .s-btn, html[data-skin] .hub-tag, html[data-skin] .lesson-foot button, html[data-skin] .prompt .copy,
html[data-skin] .toc-toggle, html[data-skin] .mbar-toc, html[data-skin] .toc-close, html[data-skin] .p-tabs button, html[data-skin] .ai-switch, html[data-skin] .ai-switch button { border-radius: var(--r-pill); }
html[data-skin] .brand h1, html[data-skin] .s-head h1, html[data-skin] .lesson-head h2, html[data-skin] .partcard .pn { font-family: var(--f-display); font-weight: var(--h-w); }
html[data-skin] .lesson-head h2 { letter-spacing: -.01em; }

/* 제목 밑 장식 */
html[data-skin] .brand h1, html[data-skin] .s-head h1 { position: relative; padding-bottom: 14px; }
html[data-skin] .brand h1::after, html[data-skin] .s-head h1::after { content: ""; position: absolute; left: 0; bottom: 0; width: min(260px, 70%); height: 12px; background: var(--pulse);
  -webkit-mask: var(--motif) left / 100% 100% no-repeat; mask: var(--motif) left / 100% 100% no-repeat; }

/* 강의 머리 오른쪽 업종 아이콘 */
html[data-skin] .lesson-head { position: relative; }
html[data-skin] .lesson-head::after { content: ""; position: absolute; right: 0; top: -4px; width: 84px; height: 84px; background: var(--leaf); opacity: .11; pointer-events: none;
  -webkit-mask: var(--mark) center / contain no-repeat; mask: var(--mark) center / contain no-repeat; }
html[data-skin] .lesson-head > * { position: relative; z-index: 1; }
html[data-skin] .lesson-head h2, html[data-skin] .lesson-head .goal { padding-right: 60px; }
@media (max-width: 640px) { html[data-skin] .lesson-head::after { width: 56px; height: 56px; top: 0; } html[data-skin] .lesson-head h2, html[data-skin] .lesson-head .goal { padding-right: 0; } }

/* 고르는 화면: 업종을 고르면 바로 그 옷으로 */
html[data-skin] .s-head { position: relative; }
html[data-skin] .s-head::after { content: ""; position: absolute; right: 0; top: 0; width: 96px; height: 96px; background: var(--leaf); opacity: .14; pointer-events: none;
  -webkit-mask: var(--mark) center / contain no-repeat; mask: var(--mark) center / contain no-repeat; transition: opacity .3s; }
@media (max-width: 640px) { html[data-skin] .s-head::after { width: 60px; height: 60px; } }
.s-skin { display: none; }
html[data-skin] .s-skin { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 2px; font-size: 13px; color: var(--leaf); font-weight: 600; }

/* ── 동물병원: 진료실 (ECG 선, 이름표 꼬리표, 발자국) ── */
:root[data-skin="vet"] .lesson-head .kicker { background: var(--tag); color: var(--tag-ink); border-radius: 6px 999px 999px 6px; padding: 3px 12px 3px 10px; }
:root[data-skin="vet"] .steps > li:has(> input:checked) { border-color: var(--leaf); }
:root[data-skin="vet"] .easy { border-width: 1.5px; }

/* ── 샐러드 가게: 주방 (가격표 꼬리표, 넉넉한 둥근 카드, 씨앗 점 무늬) ── */
:root[data-skin="salad"] .lesson-head .kicker { background: var(--tag); color: var(--tag-ink); border-radius: 0 8px 8px 0; padding: 4px 14px 4px 22px; clip-path: polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%); font-weight: 600; }
:root[data-skin="salad"] .lesson-head .kicker::before { background: var(--paper); }
:root[data-skin="salad"] .steps > li { box-shadow: 0 2px 0 var(--line); }
:root[data-skin="salad"] .steps > li::before { content: counter(st); display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--leaf-soft); color: var(--leaf); font-weight: 700; padding: 0; text-align: center; }
:root[data-skin="salad"] .easy { border-width: 2px; border-style: solid; }
:root[data-skin="salad"] .easy-row.why { background: color-mix(in srgb, var(--tomato) 10%, var(--paper)); }
:root[data-skin="salad"] .vis { background-image: radial-gradient(color-mix(in srgb, var(--leaf) 16%, transparent) 1.2px, transparent 1.6px); background-size: 18px 18px; }
:root[data-skin="salad"] .s-btn, :root[data-skin="salad"] .lesson-foot .done-btn { box-shadow: 0 3px 0 color-mix(in srgb, var(--leaf) 60%, black); }

/* ── 꽃집: 작업대 (꽃잎 모서리, 리본 꼬리표, 명조 제목, 꽃잎 무늬) ── */
:root[data-skin="flower"] .lesson-head .kicker { background: var(--tag); color: var(--tag-ink); border-radius: 0; padding: 4px 22px 4px 12px; clip-path: polygon(0 0, 100% 0, calc(100% - 9px) 50%, 100% 100%, 0 100%); font-weight: 500; }
:root[data-skin="flower"] .lesson-head .kicker::before { background: var(--paper); border-radius: 50% 0; }
:root[data-skin="flower"] .lesson-head h2 { font-size: clamp(28px, 4.4vw, 40px); }
:root[data-skin="flower"] .easy { border-width: 1px; background: color-mix(in srgb, var(--leaf-soft) 70%, var(--paper)); }
:root[data-skin="flower"] .easy-row > b { color: var(--leaf); }
:root[data-skin="flower"] .easy-row.why { background: color-mix(in srgb, var(--pulse) 13%, var(--paper)); }
:root[data-skin="flower"] .easy-row.why > b { color: color-mix(in srgb, var(--pulse) 75%, var(--ink)); }
:root[data-skin="flower"] .vis { background-image: none; background-color: var(--sunk); }
:root[data-skin="flower"] .steps > li::before { font-family: var(--f-display); font-size: 16px; color: var(--leaf); }
:root[data-skin="flower"] .toc ol button[aria-current="true"] { background: var(--leaf-soft); box-shadow: inset 3px 0 0 var(--leaf); }
:root[data-skin="flower"] .partcard .pn { color: var(--leaf); font-style: italic; }

/* ── 건축사사무소: 도면 (모눈, 치수선, 도곽 꼬리표, 직각 모서리) ── */
:root[data-skin="arch"] .lesson-head { border-top: 3px double var(--ink); padding-top: 14px; }
:root[data-skin="arch"] .lesson-head .kicker { background: var(--tag); color: var(--tag-ink); border: 1.5px solid var(--ink); border-radius: 0; padding: 2px 10px; text-transform: uppercase; letter-spacing: .08em; }
:root[data-skin="arch"] .lesson-head .kicker::before { background: var(--carrot); border-radius: 0; }
:root[data-skin="arch"] .lesson-head h2 { letter-spacing: -.025em; }
:root[data-skin="arch"] .steps > li { border-left: 3px solid var(--leaf); }
:root[data-skin="arch"] .steps > li::before { content: counter(st, decimal-leading-zero); color: var(--leaf); font-weight: 600; }
:root[data-skin="arch"] .easy { border: 1.5px solid var(--ink); background: var(--paper); }
:root[data-skin="arch"] .easy-row + .easy-row { border-top: 1px solid var(--line); }
:root[data-skin="arch"] .easy-row > b { color: var(--ink); font-family: var(--f-num); font-size: 13.5px; letter-spacing: .02em; }
:root[data-skin="arch"] .easy-row.why { background: color-mix(in srgb, var(--carrot) 12%, var(--paper)); }
:root[data-skin="arch"] .easy-row.why > b { color: var(--carrot); }
:root[data-skin="arch"] .toc ol button[aria-current="true"] { background: var(--leaf-soft); box-shadow: inset 3px 0 0 var(--leaf); }
:root[data-skin="arch"] .toc .part { text-transform: none; border-top: 1px solid var(--line); margin-top: 6px; }
:root[data-skin="arch"] .s-n { border-radius: 2px; }
:root[data-skin="arch"] .partcard { border: 1.5px solid var(--ink); }
:root[data-skin="arch"] .partcard .pn { font-family: var(--f-num); font-weight: 500; }
:root[data-skin="arch"] .lawbox { border-color: var(--ink); border-left-color: var(--leaf); }

/* ── 직접 입력 업종 ── */
:root[data-skin^="c-"] .lesson-head .kicker { background: var(--tag); color: var(--tag-ink); border-radius: var(--r-pill); padding: 3px 12px; }
:root[data-skin^="c-"] .lesson-head .kicker::before { background: var(--paper); }
:root[data-skin="c-office"] .lesson-head { border-top: 1px solid var(--ink); padding-top: 12px; }
:root[data-skin="c-edu"] .steps > li::before { color: var(--leaf); font-weight: 700; }

/* ── 그림·캐릭터 (art.js, html[data-art]) ── */
.mascot { display: flex; align-items: flex-end; gap: 6px; }
.mascot .ms-fig { flex: none; width: 112px; line-height: 0; }
.mascot .ms-fig svg { width: 100%; height: auto; display: block; }
.mascot .ms-bubble { position: relative; margin: 0 0 34px; padding: 9px 13px; background: var(--paper); border: 1.5px solid var(--line); border-radius: 16px 16px 16px 4px; font-size: 14px; line-height: 1.45; max-width: 220px; box-shadow: 0 4px 14px var(--shadow); }
.mascot .ms-bubble b { display: block; font-size: 11.5px; color: var(--leaf); font-weight: 700; margin-bottom: 1px; }
.mascot-hero { margin-left: auto; margin-right: 8px; align-self: flex-end; }
.mascot-hero .ms-fig { animation: ms-bob 3.2s ease-in-out infinite; }
@keyframes ms-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
.s-mascot { margin-top: 8px; }
.s-mascot .ms-fig { width: 120px; animation: ms-pop .45s cubic-bezier(.3, 1.5, .5, 1); }
@keyframes ms-pop { from { transform: scale(.6) translateY(10px); opacity: 0; } to { transform: none; opacity: 1; } }
html[data-art] .s-head::after { display: none; }
@media (max-width: 900px) { .mascot-hero { order: -1; margin: 0 0 -6px; width: 100%; } .mascot-hero .ms-fig { width: 84px; } .mascot-hero .ms-bubble { margin-bottom: 22px; font-size: 13.5px; } }
@media (max-width: 640px) { .mascot-hero { display: none !important; } }

html[data-art] .lesson-head::after { display: none; }
html[data-skin] .lesson-head > .lh-art, .lh-art { position: absolute; right: 0; top: -6px; width: 92px; height: 92px; z-index: 0 !important; pointer-events: none; transform: rotate(6deg); filter: drop-shadow(0 4px 6px var(--shadow)); }
.lh-art svg { width: 100%; height: 100%; display: block; }
html[data-art] .lesson-head h2, html[data-art] .lesson-head .goal { padding-right: 96px; }
@media (max-width: 640px) { .lh-art { width: 60px; height: 60px; top: 0; } html[data-art] .lesson-head h2 { padding-right: 58px; } html[data-art] .lesson-head .goal { padding-right: 0; } }

.why-face { display: inline-block; width: 22px; height: 22px; vertical-align: -6px; margin-right: 5px; line-height: 0; }
.why-face svg { width: 100%; height: 100%; }
.easy-row.why > b { white-space: nowrap; }

.part-pic { display: inline-block; width: 18px; height: 18px; vertical-align: -4px; margin-right: 6px; line-height: 0; }
.part-pic svg { width: 100%; height: 100%; }

.cheer { position: fixed; z-index: 120; right: 20px; bottom: 24px; display: flex; align-items: center; gap: 10px; padding: 10px 18px 10px 10px; background: var(--paper); border: 2px solid var(--leaf); border-radius: 999px; box-shadow: 0 10px 30px var(--shadow); font-weight: 600; font-size: 15.5px; transform: translateY(140%); opacity: 0; transition: transform .35s cubic-bezier(.3, 1.4, .5, 1), opacity .25s; pointer-events: none; }
.cheer.on { transform: none; opacity: 1; }
.cheer .ms-fig { width: 46px; height: 46px; line-height: 0; }
.cheer .ms-fig svg { width: 100%; height: 100%; }
.cheer p { margin: 0; }
@media (max-width: 900px) { .cheer { left: 12px; right: 12px; bottom: calc(86px + env(safe-area-inset-bottom, 0px)); justify-content: center; } }
@media (prefers-reduced-motion: reduce) { .mascot-hero .ms-fig, .s-mascot .ms-fig { animation: none; } .cheer { transition: opacity .2s; } }

@media (prefers-reduced-motion: reduce) { html[data-skin] body { transition: none; } }
'''

if __name__ == '__main__':
    main()
