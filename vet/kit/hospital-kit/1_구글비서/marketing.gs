// 글달력: 이번 주 빈 날 알림 · 캘린더로 옮기기
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

function checkWeek() {
  var sh = SpreadsheetApp.getActive().getSheetByName('글달력');
  var rows = sh.getDataRange().getValues();
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  var booked = 0, late = [];
  for (var i = 1; i < rows.length; i++) {
    var d = rows[i][0], ch = rows[i][2], topic = rows[i][3], st = rows[i][5];
    if (!(d instanceof Date)) continue;
    if (d >= now && d <= end && (st === '예약' || st === '게시')) booked++;
    if (d < now && st !== '게시') late.push(Utilities.formatDate(d, 'Asia/Seoul', 'M/d') + ' ' + ch + ' ' + topic);
  }
  if (booked > 0 && late.length === 0) return;
  var body = '다음 7일 예약된 글: ' + booked + '개\n';
  if (late.length) body += '\n날짜가 지났는데 게시되지 않은 글:\n- ' + late.join('\n- ');
  if (P.getProperty('TG_TOKEN')) tg('📅 이번 주 글 점검\n' + body);
  else MailApp.sendEmail(Session.getActiveUser().getEmail(), '[병원 마케팅] 이번 주 글을 확인해 주세요', body);
}

function syncContent() {
  var cal = CalendarApp.getCalendarsByName('SNS·콘텐츠')[0];
  if (!cal) throw new Error("'SNS·콘텐츠' 캘린더가 없어요. 이름을 확인하세요.");
  var sh = SpreadsheetApp.getActive().getSheetByName('글달력');
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var d = rows[i][0], ch = rows[i][2], topic = rows[i][3], st = rows[i][5], id = rows[i][10];
    if (!(d instanceof Date) || !topic) continue;
    var title = (st === '게시' ? '✓ ' : '') + '[' + ch + '] ' + topic + (st && st !== '게시' ? ' (' + st + ')' : '');
    var ev = id ? cal.getEventById(id) : null;
    if (ev) {
      if (ev.getTitle() !== title) ev.setTitle(title);
      var s = ev.getAllDayStartDate();
      if (s.toDateString() !== d.toDateString()) ev.setAllDayDate(d);
    } else {
      ev = cal.createAllDayEvent(title, d, { description: '대표키워드: ' + rows[i][4] });
      ev.addPopupReminder(15 * 60); // 전날 09시쯤 알림
      sh.getRange(i + 1, 11).setValue(ev.getId());
    }
  }
}
