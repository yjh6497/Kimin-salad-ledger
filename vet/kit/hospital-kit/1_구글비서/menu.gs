// 우리 병원 비서 키트 · 메뉴와 처음 설정
// 시트를 열면 위쪽 메뉴에 「🐾 병원 비서」가 생겨요. 위에서부터 차례로 누르면 끝나요.

var KIT_TABS = {
"승인함": [
"ID",
"만든 때",
"종류",
"내용",
"선택지(쉼표)",
"쓸 곳(파일ID|탭|칸)",
"쓸 값(쉼표, 선택지 순서)",
"보낼 글(|| 로 구분)",
"상태",
"결정",
"결정 때",
"메모",
"메시지ID"
],
"글달력": [
"날짜",
"요일",
"채널",
"주제",
"대표키워드",
"상태",
"사진(드라이브)",
"보호자동의",
"게시주소",
"메모",
"캘린더ID"
],
"인스타": [
"게시일시",
"상태(초안/승인/게시됨/실패)",
"종류(사진/캐러셀/릴스)",
"캡션",
"이미지 URL(공개 JPEG, 쉼표로 최대 10)",
"영상 URL(릴스)",
"결과(미디어 ID)",
"메모"
],
"고정지출": [
"항목",
"캘린더(돈 나가는 날/세무·신고)",
"매월 며칠",
"대략 금액",
"결제 방법",
"며칠 전 알림",
"메모",
"캘린더ID"
],
"직원": [
"직원번호",
"이름",
"역할",
"입사일",
"근로형태(정규/파트)",
"주 소정근로시간",
"휴게 규칙",
"PIN",
"상태(재직/퇴사)",
"메모",
"캘린더 초대 메일"
],
"근무표": [
"날짜",
"직원번호",
"근무 종류(주간/야간당직/휴무)",
"시작",
"끝",
"휴게(분)",
"메모",
"캘린더ID"
],
"휴가신청": [
"날짜",
"직원번호",
"종류",
"상태(대기/승인/반려)",
"캘린더ID"
],
"사람 일정": [
"날짜",
"직원번호(원장 00, 모두는 비움)",
"종류(수습종료/계약만료/연차계산/교육/면담/기타)",
"내용",
"며칠 전 알림",
"캘린더ID"
],
"재방문": [
"고객번호",
"종",
"나이(살)",
"항목",
"마지막 날짜",
"주기(일)",
"다음 예정일",
"연락 동의(Y/N)",
"연락한 날",
"결과",
"카톡 친구(Y/N)"
],
"품목": [
"품목코드",
"품목명",
"분류(약/백신·냉장/마약류/소모품/판매용)",
"단위",
"기본 거래처",
"최근 단가",
"발주점",
"주문 수량",
"보관(상온/냉장/잠금)",
"배송 기간(일)",
"과세(면세/과세)",
"메모",
"보관 위치(약장A/냉장고/창고 선반1)"
],
"입고": [
"날짜",
"품목코드",
"수량",
"로트",
"유효기한",
"단가",
"거래처",
"명세서 번호",
"소진(체크)"
],
"사용": [
"날짜",
"품목코드",
"수량",
"사유(진료/판매/파손/폐기/반품)",
"직원번호",
"메모"
],
"재고": [
"품목코드",
"품목명",
"현재고",
"발주점",
"상태",
"가장 빠른 유효기한",
"주문 중"
],
"발주": [
"발주번호",
"날짜",
"거래처",
"품목코드",
"수량",
"단가",
"상태(작성/주문/일부 입고/입고 완료/취소)",
"도착 예정",
"메모"
],
"거래처": [
"거래처",
"취급(약/백신/소모품/사료)",
"주문 방법(메일/카톡/온라인몰/전화)",
"주문 마감 시각",
"배송 요일",
"결제 조건",
"대표 연락처",
"메모",
"주문 메일",
"카톡방 이름",
"온라인몰 주소"
],
"실사": [
"날짜",
"품목코드",
"품목명",
"시트 재고",
"센 수량",
"차이",
"조정 상태(일치/대기/승인/반영/다시)",
"직원번호"
],
"동의문구": [
"코드",
"제목",
"전문",
"필수(Y/N)"
],
"접수동의": [
"접수 시각",
"접수번호",
"보호자 이름",
"연락처",
"반려동물 이름",
"종류",
"나이",
"방문 이유",
"개인정보(필수)",
"광고 수신",
"사진 활용",
"서명",
"동의 문구 버전",
"차트 입력",
"반려동물 사진",
"글씨"
],
"안내화면": [
"순서",
"켜기(Y/N)",
"시작일",
"끝일",
"제목",
"본문",
"이미지(드라이브 파일 ID)",
"QR 링크",
"초(보여 줄 시간)"
],
"마감항목": [
"순서",
"구역",
"항목",
"필수(Y/N)",
"입력(체크/숫자)",
"최소",
"최대",
"단위",
"요일(비우면 매일)"
],
"마감기록": [
"날짜",
"시각",
"직원번호",
"구역",
"항목",
"결과",
"값",
"범위 밖",
"메모"
]
};
var KIT_SAMPLE = {"동의문구": [["privacy", "개인정보 수집·이용 동의", "(우리 병원 문구로 고치기: 수집 항목, 목적, 보관 기간, 거부할 권리와 불이익)", "Y"], ["ad", "광고성 정보 수신 동의", "(이벤트·혜택 안내를 문자·카카오톡으로, 언제든 철회 가능)", "N"], ["photo", "사진·진료 이야기 활용 동의", "(블로그·플레이스·인스타, 보호자 이름·연락처 미사용, 철회 시 삭제)", "N"]], "마감항목": [["1", "입원실", "입원 동물 상태·수액·급식 확인, 야간 메모 작성", "Y", "체크", "", "", "", ""], ["2", "입원실", "입원실 온도", "N", "숫자", "", "", "℃", ""], ["3", "입원실", "야간 담당·비상 연락 확인", "Y", "체크", "", "", "", ""], ["4", "진료실·처치실", "진료대·처치대 소독", "Y", "체크", "", "", "", ""], ["5", "진료실·처치실", "쓴 기구 세척·멸균기에 넣기", "Y", "체크", "", "", "", ""], ["6", "약품·냉장", "백신·약품 냉장고 온도", "Y", "숫자", "2", "8", "℃", ""], ["7", "약품·냉장", "냉장고 문 닫힘·전원 확인", "Y", "체크", "", "", "", ""], ["8", "약품·냉장", "마약류 금고 잠금(2인 확인)", "Y", "체크", "", "", "", ""], ["9", "장비", "산소 밸브 잠금·마취기 끄기", "Y", "체크", "", "", "", ""], ["10", "장비", "방사선 장비 전원 끄기", "Y", "체크", "", "", "", ""], ["11", "장비", "멸균기·초음파·현미경 정리", "N", "체크", "", "", "", ""], ["12", "위생·폐기물", "의료폐기물 전용 용기 밀폐·보관 장소", "Y", "체크", "", "", "", ""], ["13", "위생·폐기물", "대기실·진료실 바닥 청소", "N", "체크", "", "", "", ""], ["14", "결제·서류", "결제 단말기 하루 정산", "Y", "체크", "", "", "", ""], ["15", "결제·서류", "현금 시재", "N", "숫자", "", "", "원", ""], ["16", "결제·서류", "오늘 서류 정리, 접수 태블릿 충전", "N", "체크", "", "", "", ""], ["17", "시설·보안", "창문·뒷문 잠금", "Y", "체크", "", "", "", ""], ["18", "시설·보안", "냉난방·조명 끄기(입원실 제외)", "N", "체크", "", "", "", ""], ["19", "시설·보안", "출입문 잠금·경비 켜기", "Y", "체크", "", "", "", ""], ["20", "내일 준비", "내일 예약·수술 확인, 준비물 꺼내 두기", "N", "체크", "", "", "", ""], ["21", "데이터", "차트 백업 확인", "N", "체크", "", "", "", "금"]], "안내화면": [["1", "Y", "", "", "어서 오세요", "접수대에서 이름을 말씀해 주세요", "", "", "12"]], "거래처": [["예시약품", "약", "메일", "15:00", "월수금", "월말", "000-0000-0000", "예시 줄이에요. 지우고 쓰세요", "order@example.com", "", ""]]};

var KIT_CALS = ['근무·휴가', '진료 예약·수술', '돈 나가는 날', '세무·신고', '병원 일정', 'SNS·콘텐츠'];

// 자동 실행 목록: [함수, 설명, 방법]
var KIT_JOBS = [
  ['pollTelegram', '텔레그램 명령·버튼 확인', 'min1', 'TG'],
  ['morningReport', '아침 8시 오늘 요약 → 텔레그램', 'day8', 'TG'],
  ['checkStock', '아침 7시 재고 점검 → 발주 승인 요청', 'day7', 'TG'],
  ['dispatchOrders', '승인된 주문 보내기(메일 초안·카톡 문구·전화 안내)', 'min10', 'TG'],
  ['applyCount', '태블릿 실사 차이 반영', 'min10', ''],
  ['collectVendorMail', '거래처 메일 첨부 모으기', 'hour1', 'TG'],
  ['syncContent', '글달력 → SNS·콘텐츠 캘린더', 'day6', ''],
  ['syncBills', '고정지출 → 돈 나가는 날 캘린더', 'day6', ''],
  ['syncPeople', '근무·휴가·사람 일정 → 캘린더 (밤 9시)', 'day21', ''],
  ['checkWeek', '월요일 아침 이번 주 글 점검', 'mon8', ''],
  ['remindList', '월요일 재방문 연락 목록 → 메일', 'mon9', ''],
  ['postDue', '인스타 승인 글 자동 게시', 'min15', 'IG'],
  ['refreshToken', '인스타 토큰 새로 받기(매월 1일)', 'month1', 'IG']
];

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🐾 병원 비서')
    .addItem('① 처음 설정 (탭·캘린더·폴더 만들기)', 'kitSetup')
    .addItem('② 병원 정보 넣기', 'kitClinic')
    .addItem('③ 텔레그램 연결', 'kitTelegram')
    .addItem('④ 자동 실행 켜기', 'kitTriggersOn')
    .addSeparator()
    .addSubMenu(ui.createMenu('지금 한 번 해 보기')
      .addItem('텔레그램 시험 메시지', 'testSend')
      .addItem('오늘 요약 보내기', 'morningReport')
      .addItem('재고 점검', 'checkStock')
      .addItem('승인된 주문 보내기', 'dispatchOrders')
      .addItem('글달력 → 캘린더', 'syncContent')
      .addItem('고정지출 → 캘린더', 'syncBills')
      .addItem('근무·휴가·사람 일정 → 캘린더', 'syncPeople')
      .addItem('이번 주 글 점검', 'checkWeek')
      .addItem('재방문 목록 메일', 'remindList'))
    .addItem('태블릿 주소 보기', 'kitTabletUrls')
    .addItem('인스타 연결 (선택)', 'kitInsta')
    .addSeparator()
    .addItem('상태 보기', 'kitStatus')
    .addItem('자동 실행 끄기', 'kitTriggersOff')
    .addToUi();
}

function kitProps() { return PropertiesService.getScriptProperties(); }
function kitKey() { return Utilities.getUuid().replace(/-/g, '').slice(0, 16); }

function kitSetup() {
  var ss = SpreadsheetApp.getActive(), P = kitProps(), made = [];
  Object.keys(KIT_TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (sh) return;
    sh = ss.insertSheet(name);
    var h = KIT_TABS[name];
    sh.getRange(1, 1, 1, h.length).setValues([h]).setFontWeight('bold').setBackground('#eef3ef');
    sh.setFrozenRows(1);
    var rows = KIT_SAMPLE[name];
    if (rows && rows.length) {
      rows = rows.map(function (r) { r = r.slice(0, h.length); while (r.length < h.length) r.push(''); return r; });
      sh.getRange(2, 1, rows.length, h.length).setValues(rows);
    }
    made.push(name);
  });
  // 재고 탭 수식: 품목 탭을 따라 자동으로 채워져요
  var st = ss.getSheetByName('재고');
  if (st && !st.getRange('A2').getFormula()) {
    var f = [];
    for (var r = 2; r <= 300; r++) {
      f.push(['=IF(품목!A' + r + '="","",품목!A' + r + ')',
        '=IFERROR(VLOOKUP(A' + r + ',품목!A:B,2,FALSE),"")',
        '=IF(A' + r + '="","",SUMIF(입고!B:B,A' + r + ',입고!C:C)-SUMIF(사용!B:B,A' + r + ',사용!C:C))',
        '=IFERROR(VLOOKUP(A' + r + ',품목!A:G,7,FALSE),"")',
        '=IF(A' + r + '="","",IF(C' + r + '<=D' + r + ',"주문",""))',
        '=IFERROR(MIN(FILTER(입고!E$2:E,입고!B$2:B=A' + r + ',입고!I$2:I<>TRUE,입고!E$2:E<>"")),"")',
        '=IF(A' + r + '="","",SUMIFS(발주!E:E,발주!D:D,A' + r + ',발주!G:G,"주문"))']);
    }
    st.getRange(2, 1, f.length, 7).setFormulas(f);
    st.getRange('F2:F300').setNumberFormat('yyyy-mm-dd');
  }
  var first = ss.getSheetByName('시트1') || ss.getSheetByName('Sheet1');
  if (first && ss.getSheets().length > 1 && first.getLastRow() === 0) ss.deleteSheet(first);
  // 캘린더
  var cals = [];
  KIT_CALS.forEach(function (n) { if (!CalendarApp.getCalendarsByName(n)[0]) { CalendarApp.createCalendar(n); cals.push(n); } });
  // 드라이브 폴더
  var root = P.getProperty('KIT_FOLDER') ? DriveApp.getFolderById(P.getProperty('KIT_FOLDER')) : DriveApp.createFolder('우리 병원 비서 파일');
  P.setProperty('KIT_FOLDER', root.getId());
  [['INVOICE_FOLDER', '거래처 명세서'], ['SIGN_FOLDER', '접수 서명'], ['PHOTO_FOLDER', '반려동물 사진']].forEach(function (x) {
    if (!P.getProperty(x[0])) P.setProperty(x[0], root.createFolder(x[1]).getId());
  });
  // 이 시트 하나가 승인함·재고·접수를 모두 맡아요
  var id = ss.getId();
  P.setProperties({ APPROVE_ID: id, STOCK_ID: id, SHEET_ID: id });
  ['COUNT_KEY', 'KIOSK_KEY', 'SIGN_KEY', 'CLOSE_KEY'].forEach(function (k) { if (!P.getProperty(k)) P.setProperty(k, kitKey()); });
  if (!P.getProperty('TERMS_VER')) P.setProperty('TERMS_VER', Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd'));
  if (!P.getProperty('MAIL_MODE')) P.setProperty('MAIL_MODE', '초안');
  SpreadsheetApp.getUi().alert('처음 설정 끝 ✅\n\n새 탭 ' + made.length + '개' + (made.length ? ': ' + made.join(', ') : '') +
    '\n새 캘린더 ' + cals.length + '개' + (cals.length ? ': ' + cals.join(', ') : '') +
    '\n드라이브 폴더: 우리 병원 비서 파일\n\n다음: ② 병원 정보 넣기');
}

function kitAsk(title, msg, def) {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt(title, msg + (def ? '\n(지금 값: ' + def + ')' : ''), ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return null;
  var v = r.getResponseText().trim();
  return v || def || '';
}

function kitClinic() {
  var P = kitProps();
  var name = kitAsk('병원 이름', '예: 해솔동물병원', P.getProperty('CLINIC_NAME')); if (name === null) return;
  var tel = kitAsk('병원 전화번호', '주문 메일 끝에 붙어요. 예: 033-123-4567', P.getProperty('CLINIC_TEL')); if (tel === null) return;
  var hours = kitAsk('진료 시간 (대기실 화면 위쪽 띠)', '예: 09:30~19:00 (점심 13~14시)', P.getProperty('HOURS')); if (hours === null) return;
  var mode = kitAsk('주문 메일', '"초안" = Gmail 임시보관함에 만들기(추천), "자동" = 바로 보내기', P.getProperty('MAIL_MODE') || '초안'); if (mode === null) return;
  P.setProperties({ CLINIC_NAME: name, CLINIC_TEL: tel, HOURS: hours, MAIL_MODE: mode === '자동' ? '자동' : '초안' });
  SpreadsheetApp.getUi().alert('저장했어요 ✅\n다음: ③ 텔레그램 연결');
}

function kitTelegram() {
  var ui = SpreadsheetApp.getUi(), P = kitProps();
  var token = kitAsk('텔레그램 봇 토큰', '텔레그램에서 @BotFather → /newbot 으로 만든 뒤 받은 긴 글자를 붙여 넣으세요.\n예: 7123456789:AAH...', '');
  if (!token) return;
  P.setProperty('TG_TOKEN', token);
  var me = api('getMe', {});
  if (!me.ok) { P.deleteProperty('TG_TOKEN'); ui.alert('토큰이 맞지 않아요. 다시 복사해 주세요.'); return; }
  var ok = ui.alert('봇 @' + me.result.username + ' 확인 ✅',
    '이제 휴대폰 텔레그램에서 @' + me.result.username + ' 를 찾아 「시작」을 누르고 "안녕"이라고 보내세요.\n보냈으면 확인을 누르세요.', ui.ButtonSet.OK_CANCEL);
  if (ok !== ui.Button.OK) return;
  var ups = api('getUpdates', {}).result || [], chat = null, last = 0;
  ups.forEach(function (u) { last = u.update_id; if (u.message && u.message.chat && u.message.chat.type === 'private') chat = u.message.chat.id; });
  if (!chat) { ui.alert('메시지를 못 찾았어요. 봇에게 "안녕"을 보낸 뒤 ③을 다시 눌러 주세요.'); return; }
  P.setProperties({ TG_CHAT: String(chat), TG_OFFSET: String(last + 1) });
  tg('연결됐어요 ✅ 이제 "오늘", "대기", "재고"라고 보내 보세요. (자동 실행을 켜야 답해요)');
  ui.alert('텔레그램 연결 끝 ✅\n휴대폰에 메시지가 왔는지 보세요.\n\n다음: ④ 자동 실행 켜기');
}

function kitTriggersOff(silent) {
  var names = KIT_JOBS.map(function (j) { return j[0]; });
  ScriptApp.getProjectTriggers().forEach(function (t) { if (names.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  if (silent !== true) SpreadsheetApp.getUi().alert('자동 실행을 모두 껐어요.');
}

function kitTriggersOn() {
  var P = kitProps(), on = [], skip = [];
  kitTriggersOff(true);
  KIT_JOBS.forEach(function (j) {
    if (j[3] === 'TG' && !P.getProperty('TG_CHAT')) { skip.push(j[1] + ' (텔레그램 연결 뒤)'); return; }
    if (j[3] === 'IG' && !P.getProperty('IG_TOKEN')) { skip.push(j[1] + ' (인스타 연결 뒤)'); return; }
    var b = ScriptApp.newTrigger(j[0]).timeBased(), w = j[2];
    if (w === 'min1') b.everyMinutes(1);
    else if (w === 'min10') b.everyMinutes(10);
    else if (w === 'min15') b.everyMinutes(15);
    else if (w === 'hour1') b.everyHours(1);
    else if (w.indexOf('day') === 0) b.everyDays(1).atHour(Number(w.slice(3)));
    else if (w.indexOf('mon') === 0 && w !== 'month1') b.onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(Number(w.slice(3)));
    else if (w === 'month1') b.onMonthDay(1).atHour(5);
    b.inTimezone('Asia/Seoul').create();
    on.push(j[1]);
  });
  SpreadsheetApp.getUi().alert('자동 실행 켰어요 ✅\n\n• ' + on.join('\n• ') + (skip.length ? '\n\n나중에 켜져요:\n• ' + skip.join('\n• ') : '') +
    '\n\n연결을 더 하면 ④를 한 번 더 누르세요.');
}

function kitTabletUrls() {
  var P = kitProps(), url = '';
  try { url = ScriptApp.getService().getUrl() || ''; } catch (e) {}
  var ui = SpreadsheetApp.getUi();
  if (!url) {
    ui.alert('아직 태블릿 주소가 없어요.\n\n터미널 키트로 올렸다면 자동으로 배포돼요. 직접 하려면: 확장 프로그램 → Apps Script → 배포 → 새 배포 → 웹 앱(실행: 나, 액세스: 모든 사용자) → 배포. 그 뒤 이 메뉴를 다시 누르세요.');
    return;
  }
  var u = url.replace(/\/dev$/, '/exec');
  var lines = [
    '접수·동의: ' + u + '?app=kiosk&k=' + P.getProperty('KIOSK_KEY'),
    '접수·동의(큰 글씨): ' + u + '?app=kiosk&big=1&k=' + P.getProperty('KIOSK_KEY'),
    '재고 실사: ' + u + '?app=count&k=' + P.getProperty('COUNT_KEY'),
    '대기실 안내: ' + u + '?app=sign&k=' + P.getProperty('SIGN_KEY'),
    '마감 체크: ' + u + '?app=close&k=' + P.getProperty('CLOSE_KEY')];
  var html = HtmlService.createHtmlOutput('<div style="font:14px sans-serif;line-height:1.6">' +
    '<p>태블릿 크롬(사파리)에서 열고 「홈 화면에 추가」하세요. 주소는 직원끼리만 나눠요.</p>' +
    lines.map(function (l) { var p = l.split(': '); return '<p><b>' + p[0] + '</b><br><input style="width:100%;font:12px monospace" onclick="this.select()" value="' + p.slice(1).join(': ') + '"></p>'; }).join('') +
    '</div>').setWidth(560).setHeight(430);
  ui.showModalDialog(html, '태블릿 주소');
}

function kitInsta() {
  var P = kitProps();
  var t = kitAsk('인스타 장기 액세스 토큰', '인스타 자동 게시 강의의 순서대로 만든 토큰을 붙여 넣으세요.', ''); if (!t) return;
  var id = kitAsk('인스타 계정 ID (숫자)', '토큰과 함께 받은 계정 ID', P.getProperty('IG_ID')); if (!id) return;
  P.setProperties({ IG_TOKEN: t, IG_ID: id });
  SpreadsheetApp.getUi().alert('인스타 연결 저장 ✅\n④ 자동 실행 켜기를 한 번 더 누르면 자동 게시가 켜져요.\n「인스타」 탭에서 상태를 "승인"으로 바꾼 글만 올라가요.');
}

function kitStatus() {
  var P = kitProps().getProperties();
  var on = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); });
  var line = function (ok, t) { return (ok ? '✅ ' : '⬜ ') + t; };
  SpreadsheetApp.getUi().alert('우리 병원 비서 상태',
    [line(P.APPROVE_ID, '처음 설정'), line(P.CLINIC_NAME, '병원 정보' + (P.CLINIC_NAME ? ' · ' + P.CLINIC_NAME : '')),
     line(P.TG_CHAT, '텔레그램'), line(P.IG_TOKEN, '인스타 (선택)'),
     line(on.length, '자동 실행 ' + on.length + '개'), '', '주문 메일: ' + (P.MAIL_MODE || '초안')].join('\n'),
    SpreadsheetApp.getUi().ButtonSet.OK);
}
