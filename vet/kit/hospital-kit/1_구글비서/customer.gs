// 재방문 안내 목록 (메일로만 받아요. 텔레그램에는 보내지 않아요)
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

function remindList() {
  var sh = SpreadsheetApp.getActive().getSheetByName('재방문');
  var rows = sh.getDataRange().getValues();
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var limit = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i], due = r[6], ok = String(r[7]).toUpperCase(), done = r[8];
    if (!(due instanceof Date) || ok !== 'Y' || done) continue;
    if (due <= limit) {
      var tag = due < today ? '[지남] ' : '';
      list.push(tag + Utilities.formatDate(due, 'Asia/Seoul', 'M/d') + ' · 고객번호 ' + r[0] + ' · ' + r[1] + ' · ' + r[3] + (String(r[10]).toUpperCase() === 'Y' ? ' · 카톡친구' : ''));
    }
  }
  if (!list.length) return;
  list.sort();
  MailApp.sendEmail(Session.getActiveUser().getEmail(),
    '[재방문] 이번 2주 연락할 아이 ' + list.length + '명',
    '연락 동의(Y)한 분만 모았어요. 번호는 차트에서 찾아 주세요.\n\n- ' + list.join('\n- '));
}
