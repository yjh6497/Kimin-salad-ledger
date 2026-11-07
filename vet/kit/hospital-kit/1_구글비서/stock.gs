// 재고: 아침 점검 · 승인된 주문 보내기 · 거래처 메일 모으기 · 태블릿 실사
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

function checkStock() {
  var ss = SpreadsheetApp.getActive();
  var items = {};
  ss.getSheetByName('품목').getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[0]) items[r[0]] = { name: r[1], vendor: r[4] || '거래처 미정', price: r[5], qty: r[7] || 1 };
  });
  var po = ss.getSheetByName('발주'), open = {};
  po.getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[3] && (r[6] === '작성' || r[6] === '주문')) open[r[3]] = true;
  });
  var byVendor = {};
  ss.getSheetByName('재고').getDataRange().getValues().slice(1).forEach(function (r) {
    var code = r[0];
    if (!code || r[4] !== '주문' || open[code] || !items[code]) return;
    (byVendor[items[code].vendor] = byVendor[items[code].vendor] || []).push({ code: code, it: items[code], left: r[2] });
  });
  var today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd'), n = 0;
  Object.keys(byVendor).forEach(function (v) {
    var list = byVendor[v], first = po.getLastRow() + 1;
    list.forEach(function (x) {
      po.appendRow(['PO-' + today + '-' + (++n), new Date(), v, x.code, x.it.qty, x.it.price, '작성', '', '자동']);
    });
    var lines = list.map(function (x) { return x.it.name + ' ' + x.it.qty + ' (남은 ' + x.left + ')'; });
    var order = v + ' 담당자님, ○○동물병원입니다. 주문드립니다.\n' + lines.map(function (l) { return '- ' + l.replace(/ \(남은.*\)/, ''); }).join('\n') + '\n도착 가능일 알려 주세요. 감사합니다.';
    // 승인함으로: 주문함 → 발주 상태 '주문' + 주문 문구가 텔레그램으로, 오늘은 안 함 → '취소'(내일 아침 다시 알림)
    ask('발주 · ' + v, lines.join('\n'), '주문함,오늘은 안 함',
        ss.getId() + '|발주|G' + first + ':G' + po.getLastRow(), '주문,취소', order + '||');
  });
  var soon = [], limit = new Date(); limit.setDate(limit.getDate() + 60);
  ss.getSheetByName('입고').getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[1] && r[4] instanceof Date && r[4] <= limit && r[8] !== true) {
      soon.push((items[r[1]] ? items[r[1]].name : r[1]) + ' 로트 ' + (r[3] || '-') + ' (' + Utilities.formatDate(r[4], 'Asia/Seoul', 'M/d') + ')');
    }
  });
  if (soon.length) tg('⏳ 유효기한 60일 안: ' + soon.join(', '));
}

function dispatchOrders() {
  var ss = SpreadsheetApp.getActive(), P = PropertiesService.getScriptProperties();
  var clinic = P.getProperty('CLINIC_NAME') || '○○동물병원', tel = P.getProperty('CLINIC_TEL') || '';
  var names = {}, manual = {}, vend = {};
  ss.getSheetByName('품목').getDataRange().getValues().slice(1).forEach(function (r) {
    if (!r[0]) return;
    names[r[0]] = r[1] + (r[3] ? ' (' + r[3] + ')' : '');
    if (String(r[11]).indexOf('수동') >= 0) manual[r[0]] = true; // 처방약·마약류 등
  });
  ss.getSheetByName('거래처').getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[0]) vend[r[0]] = { how: String(r[2]).trim(), tel: r[6], mail: r[8], room: r[9], mall: r[10] };
  });
  var po = ss.getSheetByName('발주'), rows = po.getDataRange().getValues(), groups = {};
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[6] !== '주문' || String(r[8]).indexOf('처리:') >= 0) continue;
    var key = manual[r[3]] ? r[2] + '|수동' : r[2];
    (groups[key] = groups[key] || []).push({ row: i + 1, code: r[3], qty: r[4], memo: r[8] });
  }
  var stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'M/d HH:mm');
  Object.keys(groups).forEach(function (key) {
    var v = key.split('|')[0], g = groups[key], info = vend[v] || {};
    if (key.indexOf('|수동') > 0) info = { how: '전화', tel: info.tel }; // 수동 품목은 자동 발송하지 않아요
    var lines = g.map(function (x) { return '- ' + (names[x.code] || x.code) + ' × ' + x.qty; });
    var body = v + ' 담당자님, 안녕하세요. ' + clinic + '입니다.\n아래와 같이 주문드립니다.\n\n' + lines.join('\n') +
      '\n\n도착 가능일을 회신 부탁드립니다. 감사합니다.\n' + clinic + (tel ? ' ' + tel : '');
    var note;
    if (info.how === '메일' && info.mail) {
      var subject = '[주문] ' + clinic + ' ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
      if (P.getProperty('MAIL_MODE') === '자동') {
        GmailApp.sendEmail(info.mail, subject, body, { name: clinic });
        note = '메일 보냄'; tg('📧 ' + v + ' 주문 메일을 보냈어요');
      } else {
        GmailApp.createDraft(info.mail, subject, body, { name: clinic });
        note = '메일 초안'; tg('📧 ' + v + ' 주문 메일 초안을 만들었어요. Gmail 임시보관함에서 확인 후 보내기');
      }
    } else if (info.how === '카톡') {
      tg('💬 카톡 「' + (info.room || v) + '」에 붙여 넣을 주문 문구 ↓');
      tg(body); note = '카톡 문구 보냄';
    } else if (info.how === '온라인몰') {
      tg('🛒 ' + v + ' 온라인몰에서 주문해 주세요' + (info.mall ? '\n' + info.mall : '') + '\n' + lines.join('\n'));
      note = '온라인몰 안내';
    } else {
      tg('📞 ' + v + ' 전화 주문' + (info.tel ? ' ' + info.tel : '') + '\n' + lines.join('\n'));
      note = '전화 안내';
    }
    g.forEach(function (x) { po.getRange(x.row, 9).setValue((x.memo ? x.memo + ' · ' : '') + '처리: ' + note + ' ' + stamp); });
  });
}

function collectVendorMail() {
  var P = PropertiesService.getScriptProperties();
  var folder = DriveApp.getFolderById(P.getProperty('INVOICE_FOLDER'));
  var done = GmailApp.getUserLabelByName('거래처처리됨') || GmailApp.createLabel('거래처처리됨');
  GmailApp.search('label:거래처 -label:거래처처리됨 newer_than:14d').forEach(function (t) {
    var n = 0;
    t.getMessages().forEach(function (m) {
      var d = Utilities.formatDate(m.getDate(), 'Asia/Seoul', 'yyyyMMdd');
      m.getAttachments({ includeInlineImages: false }).forEach(function (a) {
        folder.createFile(a.copyBlob()).setName(d + '_' + a.getName()); n++;
      });
    });
    t.addLabel(done);
    tg('📥 거래처 메일 · ' + t.getFirstMessageSubject() + (n ? ' · 첨부 ' + n + '개 → 명세서 폴더' : ''));
  });
}

// 태블릿 재고 실사 (재고·발주 파일의 Apps Script에 새 파일 Count.gs로)
// 품목 탭 M열 '보관 위치'(예: 약장A, 냉장고, 창고 선반2), 실사 탭이 있어야 해요
var SP = PropertiesService.getScriptProperties();

function countPage(e) {
  if (!e || !e.parameter || e.parameter.k !== SP.getProperty('COUNT_KEY')) {
    return HtmlService.createHtmlOutput('<p style="font:20px sans-serif;padding:40px">실사 태블릿 주소를 확인해 주세요.</p>');
  }
  var t = HtmlService.createTemplateFromFile('count');
  t.key = e.parameter.k;
  return t.evaluate().setTitle('재고 실사').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function stockItems(key) {
  if (key !== SP.getProperty('COUNT_KEY')) throw new Error('기기 확인 실패');
  var ss = SpreadsheetApp.getActive(), now = {};
  ss.getSheetByName('재고').getDataRange().getValues().slice(1).forEach(function (r) { if (r[0]) now[r[0]] = r[2]; });
  return ss.getSheetByName('품목').getDataRange().getValues().slice(1)
    .filter(function (r) { return r[0] && String(r[0]).charAt(0) !== 'N'; }) // 마약류는 금고에서 2인 확인으로 따로
    .map(function (r) { return { code: r[0], name: r[1], unit: r[3], place: r[12] || '위치 미정', sheet: Number(now[r[0]] || 0) }; });
}

function saveCount(key, staff, rows) {
  if (key !== SP.getProperty('COUNT_KEY')) throw new Error('기기 확인 실패');
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName('실사');
  var first = sh.getLastRow() + 1, today = new Date(), diffs = [];
  rows.forEach(function (x) {
    var d = Number(x.count) - Number(x.sheet);
    sh.appendRow([today, x.code, x.name, x.sheet, Number(x.count), d, d === 0 ? '일치' : '대기', staff]);
    if (d !== 0) diffs.push(x.name + ' ' + (d > 0 ? '+' : '') + d);
  });
  var last = sh.getLastRow();
  if (diffs.length && typeof ask === 'function') { // 승인함으로: 조정 승인이면 G열 '승인' → applyCount가 사용 탭에 반영
    ask('재고 실사 차이 ' + diffs.length + '개', diffs.join('\n'), '조정 승인,다시 세기',
        ss.getId() + '|실사|G' + first + ':G' + last, '승인,다시', '');
  }
  return { saved: rows.length, diff: diffs.length };
}

function applyCount() { // 트리거 10분마다: 승인된 차이를 사용 탭에 '실사 조정'으로
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName('실사'), use = ss.getSheetByName('사용');
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[6] !== '승인' || !r[5]) continue;
    use.appendRow([new Date(), r[1], -Number(r[5]), '실사 조정', r[7], '실사 ' + Utilities.formatDate(r[0], 'Asia/Seoul', 'M/d')]);
    sh.getRange(i + 1, 7).setValue('반영');
  }
}
