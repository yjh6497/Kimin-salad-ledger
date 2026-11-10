/* 업종별 그림·캐릭터 (모두 직접 그린 SVG).
   ART[skin] = { name: 캐릭터 이름, mascot: 큰 캐릭터, face: 작은 얼굴, items: [작은 그림들], hi/cheer/why: 말풍선 문장 }
   course.js 가 상단 인사, 강의 머리 그림, '왜 필요해요' 얼굴, 완료 칭찬, 배경 무늬에 써요. */
(function () {
  var S = 'stroke="#3B2A22" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"';
  function svg(vb, body, label) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" role="img" aria-label="' + (label || '') + '">' + body + '</svg>'; }
  function eyes(x1, x2, y, r) { r = r || 3.6; return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#2A1C14"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#2A1C14"/><circle cx="' + (x1 + 1.2) + '" cy="' + (y - 1.3) + '" r="1.2" fill="#fff"/><circle cx="' + (x2 + 1.2) + '" cy="' + (y - 1.3) + '" r="1.2" fill="#fff"/>'; }
  function smile(x, y, w) { w = w || 8; return '<path d="M' + (x - w / 2) + ' ' + y + 'q' + (w / 2) + ' ' + (w * 0.6) + ' ' + w + ' 0" fill="none" ' + S + '/>'; }
  function cheeks(x1, x2, y, c) { return '<ellipse cx="' + x1 + '" cy="' + y + '" rx="5" ry="3.2" fill="' + (c || '#F28C9B') + '" opacity=".55"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="5" ry="3.2" fill="' + (c || '#F28C9B') + '" opacity=".55"/>'; }

  // ───────── 동물병원: 강아지 '콩이'와 고양이 '나비' ─────────
  var dogHead = function (cx, cy, r) {
    var k = r / 30;
    function p(v) { return (v * k).toFixed(1); }
    return '<g transform="translate(' + (cx - 55 * k) + ' ' + (cy - 64 * k) + ') scale(' + k + ')">' +
      '<ellipse cx="29" cy="60" rx="11" ry="21" fill="#B7793F" ' + S + ' transform="rotate(22 29 60)"/>' +
      '<ellipse cx="81" cy="60" rx="11" ry="21" fill="#B7793F" ' + S + ' transform="rotate(-22 81 60)"/>' +
      '<circle cx="55" cy="64" r="30" fill="#F6DDB6" ' + S + '/>' +
      '<ellipse cx="67" cy="57" rx="10" ry="9" fill="#E2B47E"/>' +
      eyes(45, 66, 61, 4) +
      '<ellipse cx="55" cy="73" rx="6" ry="4.4" fill="#2A1C14"/>' +
      '<path d="M48.5 78q6.5 6 13 0" fill="none" ' + S + '/>' +
      cheeks(37, 73, 73) + '</g>';
  };
  var catHead = function (cx, cy, r) {
    var k = r / 24;
    return '<g transform="translate(' + (cx - 118 * k) + ' ' + (cy - 76 * k) + ') scale(' + k + ')">' +
      '<path d="M97 70L99 44l17 15zM139 70l-2-26-17 15z" fill="#B9BEC7" ' + S + '/>' +
      '<path d="M102 60l1-10 7 6zM134 60l-1-10-7 6z" fill="#F4A9B5"/>' +
      '<circle cx="118" cy="76" r="24" fill="#CDD1D8" ' + S + '/>' +
      '<path d="M112 56v6M118 55v7M124 56v6" ' + S + ' stroke-width="2"/>' +
      '<path d="M106 76q4-5 8 0M122 76q4-5 8 0" fill="none" ' + S + '/>' +
      '<path d="M115.5 83h5l-2.5 3z" fill="#E77C8E" stroke="#3B2A22" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M118 86q-3 4-6 1M118 86q3 4 6 1" fill="none" ' + S + ' stroke-width="2"/>' +
      '<path d="M96 82h-9M96 87l-8 3M140 82h9M140 87l8 3" ' + S + ' stroke-width="1.6"/>' +
      cheeks(103, 133, 85) + '</g>';
  };
  var VET = {
    name: '콩이와 나비',
    mascot: svg('0 0 170 136',
      '<ellipse cx="88" cy="128" rx="74" ry="6" fill="#000" opacity=".08"/>' +
      '<ellipse cx="55" cy="112" rx="25" ry="17" fill="#F6DDB6" ' + S + '/>' +
      '<path d="M34 98q21 10 42 0" fill="none" stroke="#2C8A7C" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="55" cy="108" r="6" fill="#F2B544" ' + S + ' stroke-width="2"/><path d="M55 105v6M52 108h6" stroke="#fff" stroke-width="2"/>' +
      dogHead(55, 64, 30) +
      '<ellipse cx="121" cy="114" rx="20" ry="14" fill="#CDD1D8" ' + S + '/>' +
      '<path d="M139 116q16-4 12-22" fill="none" stroke="#3B2A22" stroke-width="7" stroke-linecap="round"/><path d="M139 116q16-4 12-22" fill="none" stroke="#B9BEC7" stroke-width="3.6" stroke-linecap="round"/>' +
      catHead(121, 84, 22), '강아지 콩이와 고양이 나비'),
    face: svg('0 0 64 64', dogHead(32, 34, 24), '콩이'),
    items: [
      svg('0 0 64 64', dogHead(32, 34, 22), '강아지'),
      svg('0 0 64 64', catHead(32, 36, 19), '고양이'),
      svg('0 0 64 64', '<ellipse cx="23" cy="20" rx="7" ry="17" fill="#FBF7F2" ' + S + '/><ellipse cx="41" cy="20" rx="7" ry="17" fill="#FBF7F2" ' + S + '/><ellipse cx="23" cy="20" rx="3" ry="11" fill="#F4A9B5"/><ellipse cx="41" cy="20" rx="3" ry="11" fill="#F4A9B5"/><circle cx="32" cy="42" r="17" fill="#FBF7F2" ' + S + '/>' + eyes(26, 38, 40, 3) + '<path d="M30 46h4l-2 2.4z" fill="#E77C8E"/><path d="M32 48.4q-2.5 3-5 1M32 48.4q2.5 3 5 1" fill="none" ' + S + ' stroke-width="1.8"/>' + cheeks(21, 43, 47), '토끼'),
      svg('0 0 64 64', '<circle cx="18" cy="20" r="7" fill="#E9A15A" ' + S + '/><circle cx="46" cy="20" r="7" fill="#E9A15A" ' + S + '/><ellipse cx="32" cy="38" rx="22" ry="19" fill="#E9A15A" ' + S + '/><ellipse cx="32" cy="45" rx="13" ry="10" fill="#FFF3E2"/>' + eyes(24, 40, 35, 3.2) + '<circle cx="32" cy="42" r="2.2" fill="#E77C8E"/>' + smile(32, 46, 6) + cheeks(17, 47, 43), '햄스터'),
      svg('0 0 64 64', '<ellipse cx="32" cy="38" rx="17" ry="20" fill="#7CC36A" ' + S + '/><circle cx="32" cy="26" r="13" fill="#F6D65A" ' + S + '/>' + eyes(27, 37, 24, 2.6) + '<path d="M29 29q3 6 6 0z" fill="#F29A3B" ' + S + ' stroke-width="2"/><path d="M18 40q-6 6-2 12M46 40q6 6 2 12" fill="none" ' + S + '/><path d="M28 57l-2 4M36 57l2 4" ' + S + '/>', '앵무새'),
      svg('0 0 64 64', '<g transform="rotate(-30 32 32)"><rect x="17" y="27" width="30" height="10" rx="4" fill="#FFF6E6" ' + S + '/><circle cx="16" cy="27" r="6" fill="#FFF6E6" ' + S + '/><circle cx="16" cy="37" r="6" fill="#FFF6E6" ' + S + '/><circle cx="48" cy="27" r="6" fill="#FFF6E6" ' + S + '/><circle cx="48" cy="37" r="6" fill="#FFF6E6" ' + S + '/><rect x="16" y="28.5" width="32" height="7" fill="#FFF6E6"/></g>', '간식 뼈다귀')
    ],
    hi: ['원장님, 오늘도 같이 해 봐요!', '진료 끝나고 한 강의씩이면 충분해요', '모르는 말은 ? 를 눌러 보세요'],
    cheer: ['잘했어요! 다음 강의로 가요', '멍! 한 칸 더 왔어요', '야옹~ 오늘 몫은 다 했어요']
  };

  // ───────── 꽃집: 튤립 '봉이' ─────────
  function tulip(cx, top, h, col, face) {
    var k = h / 60;
    return '<g transform="translate(' + (cx - 30 * k) + ' ' + top + ') scale(' + k + ')">' +
      '<path d="M30 36v24" stroke="#4E8B4A" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M30 54q-12-4-14-16 12 2 14 14zM30 50q11-3 13-14-11 2-13 12z" fill="#7DB36B" ' + S + ' stroke-width="2"/>' +
      '<path d="M12 18C12 4 20 0 24 8 27 0 33 0 36 8 40 0 48 4 48 18 48 32 40 38 30 38 20 38 12 32 12 18z" fill="' + col + '" ' + S + '/>' +
      '<path d="M24 8q6 10 0 26M36 8q-6 10 0 26" fill="none" stroke="#3B2A22" stroke-width="1.4" opacity=".35"/>' +
      (face ? eyes(24, 36, 22, 2.4) + smile(30, 27, 6) + cheeks(19, 41, 26) : '') + '</g>';
  }
  var FLOWER = {
    name: '봉이',
    mascot: svg('0 0 150 150',
      '<ellipse cx="75" cy="144" rx="52" ry="5" fill="#000" opacity=".08"/>' +
      '<path d="M75 82v40" stroke="#4E8B4A" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M73 104q-22-2-32-22 22-2 32 18zM77 98q22-4 30-24-22 0-30 20z" fill="#7DB36B" ' + S + '/>' +
      '<path d="M44 52C44 22 58 14 64 30 69 12 81 12 86 30 92 14 106 22 106 52 106 74 92 86 75 86 58 86 44 74 44 52z" fill="#EE7EA0" ' + S + '/>' +
      '<path d="M64 30q12 18 0 50M86 30q-12 18 0 50" fill="none" stroke="#B4436A" stroke-width="2" opacity=".35"/>' +
      eyes(64, 86, 56, 4.4) + '<path d="M68 66q7 8 14 0" fill="#B4436A" ' + S + '/>' + cheeks(55, 95, 64) +
      '<path d="M48 120h54l-7 24H55z" fill="#D58E5E" ' + S + '/><path d="M45 114h60v8H45z" fill="#E7A574" ' + S + '/>' +
      '<g transform="translate(110 24)"><circle r="5" fill="#FFF" ' + S + ' stroke-width="1.6"/><circle r="2" fill="#F2C230"/></g>' +
      '<g transform="translate(26 40)"><circle r="4" fill="#FCE1EA" ' + S + ' stroke-width="1.6"/></g>' +
      '<path d="M118 60l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#F7D36B" ' + S + ' stroke-width="1.4"/>', '튤립 봉이'),
    face: svg('0 0 64 64', tulip(32, 4, 58, '#EE7EA0', true), '봉이'),
    items: [
      svg('0 0 64 64', tulip(32, 2, 60, '#F08AA8', false), '튤립'),
      svg('0 0 64 64', '<path d="M32 40v22" stroke="#4E8B4A" stroke-width="3"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<ellipse cx="32" cy="15" rx="6" ry="12" fill="#FFFFFF" ' + S + ' stroke-width="2" transform="rotate(' + a + ' 32 30)"/>'; }).join('') + '<circle cx="32" cy="30" r="8" fill="#F5C531" ' + S + ' stroke-width="2"/>', '데이지'),
      svg('0 0 64 64', [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(function (a) { return '<path d="M32 4q6 10 0 18q-6-8 0-18z" fill="#F7C93C" ' + S + ' stroke-width="1.8" transform="rotate(' + a + ' 32 28)"/>'; }).join('') + '<circle cx="32" cy="28" r="11" fill="#8A5A2B" ' + S + ' stroke-width="2"/><circle cx="29" cy="25" r="1.4" fill="#5A3818"/><circle cx="35" cy="27" r="1.4" fill="#5A3818"/><circle cx="31" cy="31" r="1.4" fill="#5A3818"/><path d="M32 40v22" stroke="#4E8B4A" stroke-width="3"/><path d="M32 52q-10-2-12-10 9 1 12 8z" fill="#7DB36B" ' + S + ' stroke-width="1.6"/>', '해바라기'),
      svg('0 0 64 64', '<path d="M32 38v24" stroke="#4E8B4A" stroke-width="3"/><path d="M32 50q-12 0-15-10 11 0 15 8zM32 46q11-1 14-10-10 0-14 8z" fill="#7DB36B" ' + S + ' stroke-width="1.6"/><circle cx="32" cy="24" r="15" fill="#D9405C" ' + S + '/><path d="M32 24c-4-1-4-6 0-7 6-1 8 6 4 10-5 5-13 1-13-6 0-8 9-12 16-8" fill="none" stroke="#8E1F35" stroke-width="2" stroke-linecap="round"/>', '장미'),
      svg('0 0 64 64', '<circle cx="22" cy="20" r="9" fill="#F08AA8" ' + S + ' stroke-width="2"/><circle cx="42" cy="20" r="9" fill="#F7C93C" ' + S + ' stroke-width="2"/><circle cx="32" cy="12" r="9" fill="#B79AE0" ' + S + ' stroke-width="2"/><path d="M14 26h36L36 60h-8z" fill="#F5E6D3" ' + S + '/><path d="M24 40q8 4 16 0" fill="none" stroke="#C06A8A" stroke-width="3" stroke-linecap="round"/><path d="M30 41l-4 8M34 41l4 8" stroke="#C06A8A" stroke-width="2.4" stroke-linecap="round"/>', '꽃다발'),
      svg('0 0 64 64', '<path d="M32 26v34" stroke="#4E8B4A" stroke-width="3"/>' + [6, 12, 18, 24].map(function (y, i) { return '<ellipse cx="' + (28 + (i % 2) * 8) + '" cy="' + y + '" rx="4" ry="5" fill="#9C7BD6" ' + S + ' stroke-width="1.6"/>'; }).join('') + '<ellipse cx="32" cy="4" rx="3" ry="4" fill="#9C7BD6" ' + S + ' stroke-width="1.6"/><path d="M32 46q-10-2-12-10 9 1 12 8z" fill="#7DB36B" ' + S + ' stroke-width="1.6"/>', '라벤더')
    ],
    hi: ['사장님, 오늘은 어떤 꽃 같은 하루예요?', '꽃 손질 사이사이 한 강의씩 피워 봐요', '어려운 말은 ? 를 눌러 보세요'],
    cheer: ['한 송이 더 피었어요!', '잘했어요, 다음 꽃봉오리로 가요', '오늘 꽃다발이 풍성해졌어요']
  };

  // ───────── 샐러드 가게: 샐러드 그릇 '아삭이'와 채소 친구들 ─────────
  function tomato(cx, cy, r, face) {
    var k = r / 20;
    return '<g transform="translate(' + (cx - 32 * k) + ' ' + (cy - 36 * k) + ') scale(' + k + ')"><circle cx="32" cy="36" r="20" fill="#E8503A" ' + S + '/><path d="M32 18l-4-6 4 3 4-3-4 6 9-2-7 5 7 3-9-1 0 0-9 1 7-3-7-5z" fill="#5BA548" ' + S + ' stroke-width="1.8"/><ellipse cx="24" cy="30" rx="4" ry="2.4" fill="#fff" opacity=".45" transform="rotate(-30 24 30)"/>' +
      (face ? eyes(26, 38, 37, 2.8) + smile(32, 42, 6) + cheeks(20, 44, 41, '#FFB3A7') : '') + '</g>';
  }
  function avocado(cx, cy, s, face) {
    var k = s;
    return '<g transform="translate(' + (cx - 32 * k) + ' ' + (cy - 34 * k) + ') scale(' + k + ')"><path d="M32 6c10 0 14 12 18 24 5 14-3 28-18 28S9 44 14 30C18 18 22 6 32 6z" fill="#4E7D2E" ' + S + '/><path d="M32 12c7 0 10 10 13 19 4 11-2 21-13 21s-17-10-13-21c3-9 6-19 13-19z" fill="#D4E89A"/><circle cx="32" cy="38" r="8" fill="#9A6234" ' + S + ' stroke-width="2"/>' +
      (face ? eyes(27, 37, 25, 2.4) + smile(32, 29, 5) : '') + '</g>';
  }
  var leaf = function (x, y, rot, col) { return '<path transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')" d="M0 0c-10-6-12-18-6-26 2 6 8 4 10 10 6-4 10 2 8 8 6 0 6 8 0 10z" fill="' + (col || '#7CC35C') + '" ' + S + ' stroke-width="2.2"/>'; };
  var SALAD = {
    name: '아삭이',
    mascot: svg('0 0 170 140',
      '<ellipse cx="85" cy="134" rx="66" ry="5" fill="#000" opacity=".08"/>' +
      '<rect x="104" y="14" width="10" height="50" rx="5" fill="#F2913A" ' + S + ' transform="rotate(20 109 40)"/><path d="M110 22h6M106 34h6" stroke="#C86A1C" stroke-width="2" stroke-linecap="round" transform="rotate(20 109 40)"/><path d="M115 12l2-11M117 14l10-6M113 13l-6-9" stroke="#5BA548" stroke-width="3.4" stroke-linecap="round"/>' +
      '<path d="M24 72q2-20 20-17 4-17 22-13 9-15 25-6 13-9 24 4 16-5 22 12 15 2 15 20z" fill="#6DBA4E" ' + S + '/>' +
      '<path d="M44 55q8 6 6 16M66 42q4 12 0 26M91 36q6 14 2 30M115 45q-2 12 4 22" fill="none" stroke="#B9E39A" stroke-width="2.4" stroke-linecap="round"/>' +
      tomato(58, 52, 14, true) +
      '<circle cx="96" cy="56" r="10" fill="#4F9A3A" ' + S + ' stroke-width="2"/><circle cx="96" cy="56" r="6.5" fill="#D9EFB8"/>' +
      '<circle cx="124" cy="62" r="8" fill="#4F9A3A" ' + S + ' stroke-width="2"/><circle cx="124" cy="62" r="5" fill="#D9EFB8"/>' +
      '<circle cx="80" cy="64" r="4" fill="#F5D44B" ' + S + ' stroke-width="1.6"/><circle cx="40" cy="66" r="3.5" fill="#F5D44B" ' + S + ' stroke-width="1.6"/>' +
      '<path d="M18 70h134c0 34-30 60-67 60S18 104 18 70z" fill="#FFFDF5" ' + S + '/>' +
      '<path d="M26 84q59 14 118 0" fill="none" stroke="#7CC35C" stroke-width="5" stroke-linecap="round" opacity=".7"/>' +
      eyes(70, 100, 100, 4.4) + '<path d="M78 108q7 8 14 0" fill="#E8503A" ' + S + '/>' + cheeks(60, 110, 108, '#FFB3A7'), '샐러드 그릇 아삭이'),
    face: svg('0 0 64 64', tomato(32, 34, 24, true), '토마토'),
    items: [
      svg('0 0 64 64', tomato(32, 36, 20, true), '토마토'),
      svg('0 0 64 64', avocado(32, 32, 0.95, true), '아보카도'),
      svg('0 0 64 64', '<path d="M24 22l16 0-6 38q-2 4-4 0z" fill="#F2913A" ' + S + '/><path d="M27 32h6M29 42h4M30 50h3" stroke="#C86A1C" stroke-width="2" stroke-linecap="round"/><path d="M32 22l-6-14M32 22l0-16M32 22l7-13" stroke="#5BA548" stroke-width="3.4" stroke-linecap="round"/>', '당근'),
      svg('0 0 64 64', '<circle cx="32" cy="34" r="24" fill="#7CC35C" ' + S + '/><path d="M14 30q6-14 18-12 12-2 18 12" fill="none" ' + S + ' stroke-width="2"/><path d="M18 42q4-14 14-14 10 0 14 14" fill="#A6DA7E" ' + S + ' stroke-width="2"/><path d="M32 30v26M32 42l-7-6M32 46l7-6" stroke="#E8F5D6" stroke-width="2.2" stroke-linecap="round"/>', '양상추'),
      svg('0 0 64 64', '<circle cx="32" cy="32" r="22" fill="#4F9A3A" ' + S + '/><circle cx="32" cy="32" r="17" fill="#D9EFB8"/>' + [0, 60, 120, 180, 240, 300].map(function (a) { return '<ellipse cx="32" cy="23" rx="1.8" ry="3.4" fill="#A5CF7C" transform="rotate(' + a + ' 32 32)"/>'; }).join(''), '오이'),
      svg('0 0 64 64', '<path d="M28 40h8v18h-8z" fill="#8BC56A" ' + S + '/><circle cx="20" cy="30" r="11" fill="#4E9A3A" ' + S + '/><circle cx="44" cy="30" r="11" fill="#4E9A3A" ' + S + '/><circle cx="32" cy="20" r="13" fill="#5DAE45" ' + S + '/><circle cx="32" cy="34" r="10" fill="#5DAE45"/>', '브로콜리')
    ],
    hi: ['사장님, 오늘도 신선하게 시작해요!', '재료 손질처럼 한 강의씩 차근차근', '어려운 말은 ? 를 눌러 보세요'],
    cheer: ['아삭! 한 그릇 완성했어요', '잘했어요, 다음 재료로 가요', '오늘 샐러드가 푸짐해졌어요']
  };

  window.ART = { vet: VET, flower: FLOWER, salad: SALAD };
})();
