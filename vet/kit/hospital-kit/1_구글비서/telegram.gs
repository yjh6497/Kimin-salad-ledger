// 텔레그램 알림·승인함 봇 (강의: 텔레그램 승인함)
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

var P = PropertiesService.getScriptProperties();
function api(method, body) {
  var r = UrlFetchApp.fetch('https://api.telegram.org/bot' + P.getProperty('TG_TOKEN') + '/' + method, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body), muteHttpExceptions: true });
  return JSON.parse(r.getContentText());
}
function tg(text, chatId) { if (!P.getProperty('TG_TOKEN')) return {}; return api('sendMessage', { chat_id: chatId || P.getProperty('TG_CHAT'), text: String(text).slice(0, 4000) }); }
function testSend() { tg('연결됐어요 ✅'); }
function findMyChatId() { // 봇에게 말을 한 번 보낸 뒤 실행
  (api('getUpdates', {}).result || []).forEach(function (u) {
    if (u.message) Logger.log(u.message.chat.id + ' ' + (u.message.chat.title || u.message.chat.first_name)); });
}
function trim(x) { return String(x).trim(); }
function box() { return SpreadsheetApp.openById(P.getProperty('APPROVE_ID') || SpreadsheetApp.getActive().getId()).getSheetByName('승인함'); }

// 승인함: A ID | B 만든 때 | C 종류 | D 내용 | E 선택지 | F 쓸 곳 | G 쓸 값 | H 보낼 글 | I 상태 | J 결정 | K 결정 때 | L 메모 | M 메시지ID
function sendPending() {
  var sh = box(), rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[3] || r[12] || (r[8] && r[8] !== '대기')) continue;
    var id = r[0] || ('R' + Date.now().toString(36) + i);
    var opts = String(r[4] || '확인').split(',').map(trim).filter(String);
    var btn = function (o, k) { return { text: o, callback_data: id + '|' + k }; };
    var kb = opts.length > 3 ? opts.map(function (o, k) { return [btn(o, k)]; }) : [opts.map(btn)];
    var res = api('sendMessage', { chat_id: P.getProperty('TG_CHAT'), text: '🗳 ' + (r[2] || '확인') + '\n' + String(r[3]).slice(0, 3500),
      reply_markup: { inline_keyboard: kb } });
    if (res.ok) {
      sh.getRange(i + 1, 1, 1, 2).setValues([[id, r[1] || new Date()]]);
      sh.getRange(i + 1, 9).setValue('대기');
      sh.getRange(i + 1, 13).setValue(res.result.message_id);
    }
  }
}
function decide(cb) {
  var id = cb.data.split('|')[0], k = Number(cb.data.split('|')[1]);
  var sh = box(), rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (String(r[0]) !== id) continue;
    if (r[8] !== '대기' && r[8] !== '수정 요청') { api('answerCallbackQuery', { callback_query_id: cb.id, text: '이미 처리됐어요' }); return; }
    var choice = String(r[4] || '확인').split(',').map(trim)[k];
    var val = String(r[6] || '').split(',').map(trim)[k];
    var reply = String(r[7] || '').split('||')[k];
    var when = new Date();
    sh.getRange(i + 1, 9, 1, 3).setValues([['완료', choice, when]]);
    if (r[5] && val) { var t = String(r[5]).split('|'); SpreadsheetApp.openById(t[0]).getSheetByName(t[1]).getRange(t[2]).setValue(val); }
    api('answerCallbackQuery', { callback_query_id: cb.id, text: choice + ' 기록했어요' });
    api('editMessageText', { chat_id: cb.message.chat.id, message_id: cb.message.message_id,
      text: cb.message.text + '\n→ ' + choice + ' (' + Utilities.formatDate(when, 'Asia/Seoul', 'M/d HH:mm') + ')' });
    if (reply && reply.trim()) tg(reply.trim()); // 고른 글을 복사하기 좋게 따로 보내요
    return;
  }
}
function memo(m) { // 버튼 메시지에 '답장'으로 쓴 글 → 메모
  var sh = box(), rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (Number(rows[i][12]) !== m.reply_to_message.message_id) continue;
    sh.getRange(i + 1, 12).setValue(m.text);
    if (rows[i][8] === '대기') sh.getRange(i + 1, 9).setValue('수정 요청');
    tg('메모 남겼어요 · ' + rows[i][2]); return true;
  }
  return false;
}
function pendingList() {
  var rows = box().getDataRange().getValues().slice(1).filter(function (r) { return r[8] === '대기' || r[8] === '수정 요청'; });
  return rows.length ? '기다리는 결정 ' + rows.length + '개\n' + rows.map(function (r) { return '• ' + r[2] + (r[8] === '수정 요청' ? ' (수정 요청)' : ''); }).join('\n') : '기다리는 결정이 없어요 👍';
}
function pollTelegram() {
  var owner = P.getProperty('TG_CHAT');
  var ups = api('getUpdates', { offset: Number(P.getProperty('TG_OFFSET') || 0) }).result || [];
  ups.forEach(function (u) {
    P.setProperty('TG_OFFSET', String(u.update_id + 1));
    if (u.callback_query) { if (String(u.callback_query.from.id) === owner) decide(u.callback_query); return; }
    var m = u.message;
    if (!m || !m.text || String(m.chat.id) !== owner) return; // 원장님만
    if (m.reply_to_message && memo(m)) return;
    var t = m.text.trim();
    if (t === '오늘') tg(todayReport());
    else if (t === '대기') tg(pendingList());
    else if (typeof extraCommand === 'function' && extraCommand(t)) return; // 재고 강의에서 더해요
    else tg('보낼 수 있는 말: 오늘 / 대기' + (typeof extraHelp === 'function' ? extraHelp() : ''));
  });
  sendPending();
}
function todayReport() {
  var s = new Date(); s.setHours(0, 0, 0, 0);
  var e = new Date(s); e.setDate(e.getDate() + 1);
  var lines = [Utilities.formatDate(new Date(), 'Asia/Seoul', 'M/d(E)')];
  ['근무·휴가', '진료 예약·수술', '돈 나가는 날', '세무·신고', '병원 일정'].forEach(function (n) {
    var c = CalendarApp.getCalendarsByName(n)[0];
    if (c) c.getEvents(s, e).forEach(function (ev) { lines.push('• ' + ev.getTitle()); });
  });
  lines.push(pendingList());
  return lines.join('\n');
}

// ask('휴가 신청', '직원 05 · 11/18 연차', '승인,반려,보류', 파일ID + '|휴가신청|D7', '승인,반려,', '')
function ask(kind, text, options, target, values, replies) {
  var id = PropertiesService.getScriptProperties().getProperty('APPROVE_ID') || SpreadsheetApp.getActive().getId();
  SpreadsheetApp.openById(id).getSheetByName('승인함').appendRow(
    ['', new Date(), kind, text, options, target || '', values || '', replies || '', '대기', '', '', '', '']);
}

function extraHelp() { return ' / 재고 / 재고 품목코드'; }

function extraCommand(t) {
  if (t.indexOf('재고') !== 0) return false;
  var ss = SpreadsheetApp.getActive();
  var rows = ss.getSheetByName('재고').getDataRange().getValues().slice(1);
  var code = t.replace('재고', '').trim().toUpperCase();
  if (code) {
    var r = rows.filter(function (x) { return x[0] === code; })[0];
    tg(r ? r[1] + ': ' + r[2] + ' 남음 (발주점 ' + r[3] + ', 주문 중 ' + (r[6] || 0) + ')' : code + ' 품목이 없어요');
  } else {
    var need = rows.filter(function (x) { return x[4] === '주문'; }).map(function (x) { return x[1] + ' ' + x[2] + (x[6] ? ' (주문 중)' : ''); });
    tg(need.length ? '주문할 것·주문 중\n' + need.join('\n') : '발주점 아래 품목이 없어요 👍');
  }
  return true;
}

function morningReport() { tg(todayReport()); }
