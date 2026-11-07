// 고정지출·근무·휴가·사람 일정 → 구글 캘린더
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

function syncBills() {
  var sh = SpreadsheetApp.getActive().getSheetByName('고정지출');
  var rows = sh.getDataRange().getValues();
  var today = new Date();
  for (var i = 1; i < rows.length; i++) {
    var name = rows[i][0], calName = rows[i][1], day = Number(rows[i][2]);
    var amount = rows[i][3], how = rows[i][4], before = Number(rows[i][5]) || 3, memo = rows[i][6], id = rows[i][7];
    if (!name || !calName || !day || id) continue;
    var cal = CalendarApp.getCalendarsByName(calName)[0];
    if (!cal) { sh.getRange(i + 1, 8).setValue('캘린더 이름 확인'); continue; }
    var start = new Date(today.getFullYear(), today.getMonth(), day);
    if (start < today) start = new Date(today.getFullYear(), today.getMonth() + 1, day);
    var title = '💳 ' + name + (amount ? ' · 약 ' + Number(amount).toLocaleString('ko-KR') + '원' : '');
    var series = cal.createAllDayEventSeries(title, start,
      CalendarApp.newRecurrence().addMonthlyRule(),
      { description: [how ? '결제: ' + how : '', memo || ''].filter(String).join('\n') });
    series.addPopupReminder(Math.max(1, before) * 1440 - 540); // N일 전 오전 9시
    sh.getRange(i + 1, 8).setValue(series.getId());
  }
}

function syncPeople() {
  var ss = SpreadsheetApp.getActive();
  var mail = {};
  ss.getSheetByName('직원').getDataRange().getValues().slice(1).forEach(function (r) {
    if (r[0] && r[10] && r[8] !== '퇴사') mail[r[0]] = String(r[10]).trim();
  });
  var work = CalendarApp.getCalendarsByName('근무·휴가')[0];
  var clinic = CalendarApp.getCalendarsByName('병원 일정')[0];
  if (!work || !clinic) throw new Error('캘린더 이름(근무·휴가, 병원 일정)을 확인하세요');
  function opt(no, desc) {
    var o = { description: desc || '' };
    if (no && mail[no]) { o.guests = mail[no]; o.sendInvites = true; }
    return o;
  }
  function at(day, t) {
    var d = new Date(day);
    if (t instanceof Date) d.setHours(t.getHours(), t.getMinutes(), 0, 0);
    else { var p = String(t).split(':'); d.setHours(Number(p[0]), Number(p[1] || 0), 0, 0); }
    return d;
  }
  // 1) 근무표: 날짜 | 직원번호 | 근무 종류 | 시작 | 끝 | 휴게 | 메모 | 캘린더ID
  var sh = ss.getSheetByName('근무표'), rows = sh.getDataRange().getValues(), i, r, ev;
  for (i = 1; i < rows.length; i++) {
    r = rows[i];
    if (!r[0] || !r[1] || r[2] === '휴무' || !r[3] || !r[4] || r[7]) continue;
    var s = at(r[0], r[3]), e = at(r[0], r[4]);
    if (e <= s) e.setDate(e.getDate() + 1); // 야간당직은 다음 날 끝
    ev = work.createEvent('🩺 ' + r[1] + ' ' + r[2], s, e, opt(r[1], r[6]));
    ev.addPopupReminder(720); // 12시간 전
    sh.getRange(i + 1, 8).setValue(ev.getId());
  }
  // 2) 휴가신청: 날짜 | 직원번호 | 종류 | 상태 | 캘린더ID
  sh = ss.getSheetByName('휴가신청'); rows = sh.getDataRange().getValues();
  for (i = 1; i < rows.length; i++) {
    r = rows[i];
    if (!r[0] || r[3] !== '승인' || r[4]) continue;
    ev = work.createAllDayEvent('🌴 ' + r[1] + ' ' + r[2], new Date(r[0]), opt(r[1]));
    sh.getRange(i + 1, 5).setValue(ev.getId());
  }
  // 3) 사람 일정: 날짜 | 직원번호 | 종류 | 내용 | 며칠 전 알림 | 캘린더ID
  sh = ss.getSheetByName('사람 일정'); rows = sh.getDataRange().getValues();
  for (i = 1; i < rows.length; i++) {
    r = rows[i];
    if (!r[0] || !r[2] || r[5]) continue;
    var invite = (r[2] === '교육' || r[2] === '면담') ? r[1] : null; // 계약·수습은 원장님만
    ev = clinic.createAllDayEvent('👥 ' + r[2] + ' · ' + (r[1] || '모두') + ' ' + (r[3] || ''), new Date(r[0]), opt(invite));
    ev.addPopupReminder(Math.max(1, Number(r[4]) || 7) * 1440 - 540); // N일 전 오전 9시
    sh.getRange(i + 1, 6).setValue(ev.getId());
  }
}
