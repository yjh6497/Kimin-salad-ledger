// 태블릿 화면: 접수·동의(kiosk) · 재고 실사(count) · 대기실 안내(sign) · 마감 체크(close)
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

// 태블릿 화면 네 가지를 주소 하나로: ...exec?app=kiosk|count|sign|close&k=키
function doGet(e) {
  var app = (e && e.parameter && e.parameter.app) || 'kiosk';
  if (app === 'count') return countPage(e);
  if (app === 'sign') return signPage(e);
  if (app === 'close') return closePage(e);
  return kioskPage(e);
}

// 태블릿 접수·동의 웹앱 (Code.gs)
var P = PropertiesService.getScriptProperties();

function kioskPage(e) {
  if (!e || !e.parameter || e.parameter.k !== P.getProperty('KIOSK_KEY')) {
    return HtmlService.createHtmlOutput('<p style="font:20px sans-serif;padding:40px">접수 태블릿 주소를 확인해 주세요.</p>');
  }
  var t = HtmlService.createTemplateFromFile('kiosk');
  t.key = e.parameter.k;
  t.big = e.parameter.big === '1'; // 큰 글씨 전용 주소: ...?k=키&big=1
  t.clinic = P.getProperty('CLINIC_NAME') || '우리 동물병원';
  t.terms = JSON.stringify(readTerms());
  return t.evaluate()
    .setTitle(t.clinic + ' 접수')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function readTerms() { // 동의문구 탭: 코드 | 제목 | 전문 | 필수(Y/N)
  var sh = SpreadsheetApp.openById(P.getProperty('SHEET_ID') || SpreadsheetApp.getActive().getId()).getSheetByName('동의문구');
  return sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 4).getValues()
    .filter(function (r) { return r[0]; })
    .map(function (r) { return { id: String(r[0]), title: r[1], body: r[2], required: r[3] === 'Y' }; });
}

function saveIntake(d) {
  if (!d || d.key !== P.getProperty('KIOSK_KEY')) throw new Error('기기 확인 실패');
  var terms = readTerms();
  terms.forEach(function (t) { if (t.required && !d.agree[t.id]) throw new Error('필수 동의가 빠졌어요'); });
  var no = 'R' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd-HHmmss');
  var sign = '';
  if (d.sign && d.sign.indexOf('data:image/png;base64,') === 0) {
    var blob = Utilities.newBlob(Utilities.base64Decode(d.sign.split(',')[1]), 'image/png', no + '.png');
    sign = DriveApp.getFolderById(P.getProperty('SIGN_FOLDER')).createFile(blob).getUrl();
  }
  var photo = '';
  if (d.photo && d.photo.indexOf('data:image/jpeg;base64,') === 0 && P.getProperty('PHOTO_FOLDER')) {
    var pb = Utilities.newBlob(Utilities.base64Decode(d.photo.split(',')[1]), 'image/jpeg', no + '_반려동물.jpg');
    photo = DriveApp.getFolderById(P.getProperty('PHOTO_FOLDER')).createFile(pb).getUrl();
  }
  var sh = SpreadsheetApp.openById(P.getProperty('SHEET_ID') || SpreadsheetApp.getActive().getId()).getSheetByName('접수동의');
  sh.appendRow([new Date(), no, d.owner, "'" + d.phone, d.pet, d.species, d.age, d.reason,
    d.agree.privacy ? 'Y' : 'N', d.agree.ad ? 'Y' : 'N', d.agree.photo ? 'Y' : 'N',
    sign, P.getProperty('TERMS_VER') || '', false, photo, d.big ? '큰 글씨' : '보통']);
  if (P.getProperty('TG_TOKEN')) { // 텔레그램에는 이름·번호 없이 건수만
    UrlFetchApp.fetch('https://api.telegram.org/bot' + P.getProperty('TG_TOKEN') + '/sendMessage', {
      method: 'post', payload: { chat_id: P.getProperty('TG_CHAT'), text: '📝 새 접수 ' + no }, muteHttpExceptions: true });
  }
  return no;
}


// 대기실 안내 화면 (안내화면 시트의 Apps Script)
// 안내화면 탭: 순서 | 켜기(Y/N) | 시작일 | 끝일 | 제목 | 본문 | 이미지(드라이브 파일 ID) | QR 링크 | 초(보여 줄 시간)
var P = PropertiesService.getScriptProperties();

function signPage(e) {
  if (!e || !e.parameter || e.parameter.k !== P.getProperty('SIGN_KEY')) {
    return HtmlService.createHtmlOutput('<p style="font:20px sans-serif;padding:40px">안내 화면 주소를 확인해 주세요.</p>');
  }
  var t = HtmlService.createTemplateFromFile('sign');
  t.key = e.parameter.k;
  t.clinic = P.getProperty('CLINIC_NAME') || '우리 동물병원';
  return t.evaluate().setTitle(t.clinic + ' 안내').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function slides(key) {
  if (key !== P.getProperty('SIGN_KEY')) throw new Error('기기 확인 실패');
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var rows = SpreadsheetApp.getActive().getSheetByName('안내화면').getDataRange().getValues().slice(1);
  var list = rows.filter(function (r) {
    if (r[1] !== 'Y' || !r[4]) return false;
    if (r[2] instanceof Date && r[2] > today) return false;        // 아직 시작 전
    if (r[3] instanceof Date && r[3] < today) return false;        // 기간 지남 → 저절로 숨김
    return true;
  }).sort(function (a, b) { return Number(a[0]) - Number(b[0]); }).map(function (r) {
    var img = '';
    if (r[6]) { // 드라이브 이미지를 화면에 바로 넣어요(공유 설정 없이)
      var blob = DriveApp.getFileById(String(r[6]).trim()).getBlob();
      img = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
    }
    return { title: r[4], body: String(r[5] || ''), img: img, qr: String(r[7] || ''), sec: Number(r[8]) || 12 };
  });
  return { slides: list, today: todayLine() };
}

function todayLine() { // 위쪽 띠: 오늘 진료 시간·휴진 (병원 일정 캘린더에 '휴진'이 있으면 그걸로)
  var s = new Date(); s.setHours(0, 0, 0, 0); var e = new Date(s); e.setDate(e.getDate() + 1);
  var cal = CalendarApp.getCalendarsByName('병원 일정')[0];
  var off = cal ? cal.getEvents(s, e).filter(function (ev) { return ev.getTitle().indexOf('휴진') >= 0; })[0] : null;
  if (off) return '오늘 ' + off.getTitle();
  var day = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];
  return '오늘(' + day + ') 진료 ' + (P.getProperty('HOURS_' + day) || P.getProperty('HOURS') || '');
}


// 마감 체크리스트 (마감 시트의 Apps Script)
// 마감항목 탭: 순서 | 구역 | 항목 | 필수(Y/N) | 입력(체크/숫자) | 최소 | 최대 | 단위 | 요일(비우면 매일, 예: 월수금)
// 마감기록 탭: 날짜 | 시각 | 직원번호 | 구역 | 항목 | 결과 | 값 | 범위 밖 | 메모
var P = PropertiesService.getScriptProperties();

function closePage(e) {
  if (!e || !e.parameter || e.parameter.k !== P.getProperty('CLOSE_KEY')) {
    return HtmlService.createHtmlOutput('<p style="font:20px sans-serif;padding:40px">마감 태블릿 주소를 확인해 주세요.</p>');
  }
  var t = HtmlService.createTemplateFromFile('close');
  t.key = e.parameter.k;
  t.clinic = P.getProperty('CLINIC_NAME') || '우리 동물병원';
  return t.evaluate().setTitle('마감 체크').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function closeItems(key) {
  if (key !== P.getProperty('CLOSE_KEY')) throw new Error('기기 확인 실패');
  var day = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];
  return SpreadsheetApp.getActive().getSheetByName('마감항목').getDataRange().getValues().slice(1)
    .filter(function (r) { return r[2] && (!r[8] || String(r[8]).indexOf(day) >= 0); })
    .sort(function (a, b) { return Number(a[0]) - Number(b[0]); })
    .map(function (r, i) {
      return { id: i, area: r[1], name: r[2], req: r[3] === 'Y', num: r[4] === '숫자',
               min: r[5] === '' ? null : Number(r[5]), max: r[6] === '' ? null : Number(r[6]), unit: r[7] || '' };
    });
}

function saveClose(key, staff, rows, memo) {
  if (key !== P.getProperty('CLOSE_KEY')) throw new Error('기기 확인 실패');
  var sh = SpreadsheetApp.getActive().getSheetByName('마감기록');
  var now = new Date(), d = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd'), t = Utilities.formatDate(now, 'Asia/Seoul', 'HH:mm');
  var miss = [], out = [];
  rows.forEach(function (x) {
    var bad = x.num && x.value !== '' && ((x.min !== null && Number(x.value) < x.min) || (x.max !== null && Number(x.value) > x.max));
    sh.appendRow([d, t, staff, x.area, x.name, x.done ? '완료' : '미완료', x.value, bad ? '범위 밖' : '', x.note || '']);
    if (!x.done) miss.push(x.name + (x.note ? '(' + x.note + ')' : ''));
    if (bad) out.push(x.name + ' ' + x.value + x.unit);
  });
  if (memo) sh.appendRow([d, t, staff, '메모', '마감 메모', '', '', '', memo]);
  var msg = '🔒 마감 ' + t + ' · 직원 ' + staff + ' · ' + (rows.length - miss.length) + '/' + rows.length + ' 완료';
  if (miss.length) msg += '\n⚠️ 미완료: ' + miss.join(', ');
  if (out.length) msg += '\n🌡 범위 밖: ' + out.join(', ');
  if (memo) msg += '\n📝 ' + memo;
  if (P.getProperty('TG_TOKEN')) {
    UrlFetchApp.fetch('https://api.telegram.org/bot' + P.getProperty('TG_TOKEN') + '/sendMessage', {
      method: 'post', payload: { chat_id: P.getProperty('TG_CHAT'), text: msg }, muteHttpExceptions: true });
  }
  return { done: rows.length - miss.length, total: rows.length, miss: miss.length, out: out.length };
}
