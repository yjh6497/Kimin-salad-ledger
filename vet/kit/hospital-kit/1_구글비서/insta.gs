// 인스타그램 공식 API 자동 게시 (선택: 메뉴 「인스타 연결」 뒤에 켜져요)
// 우리 병원 비서 키트 · 고치지 않아도 돼요. 설정은 시트 메뉴 「🐾 병원 비서」에서 해요.

// 인스타그램 공식 API 자동 게시 (장부 파일의 Apps Script)
// 인스타 탭: 게시일시 | 상태(초안/승인/게시됨/실패) | 종류(사진/캐러셀/릴스) | 캡션 | 이미지 URL(공개 JPEG, 캐러셀은 쉼표로 최대 10) | 영상 URL(릴스) | 결과(미디어 ID) | 메모
// 스크립트 속성: IG_TOKEN(장기 액세스 토큰), IG_ID(인스타 계정 ID), TG_TOKEN·TG_CHAT(선택)
var P = PropertiesService.getScriptProperties();
var IG = 'https://graph.instagram.com/';

function igPost(path, params) {
  params.access_token = P.getProperty('IG_TOKEN');
  var r = UrlFetchApp.fetch(IG + path, { method: 'post', payload: params, muteHttpExceptions: true });
  var j = JSON.parse(r.getContentText());
  if (j.error) throw new Error(j.error.message);
  return j;
}
function igGet(path) {
  var r = UrlFetchApp.fetch(IG + path + (path.indexOf('?') < 0 ? '?' : '&') + 'access_token=' + P.getProperty('IG_TOKEN'), { muteHttpExceptions: true });
  return JSON.parse(r.getContentText());
}
function waitReady(id) { // 영상은 처리 시간이 걸려요. 20초마다 최대 4분
  for (var k = 0; k < 12; k++) {
    var s = igGet(id + '?fields=status_code').status_code;
    if (s === 'FINISHED') return;
    if (s === 'ERROR' || s === 'EXPIRED') throw new Error('미디어 처리 실패: ' + s);
    Utilities.sleep(20000);
  }
  throw new Error('처리 시간이 길어요. 다음 실행 때 다시 시도');
}

function postDue() { // 트리거: 15분마다
  var sh = SpreadsheetApp.getActive().getSheetByName('인스타');
  var rows = sh.getDataRange().getValues(), now = new Date(), me = P.getProperty('IG_ID');
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[1] !== '승인' || r[6] || !(r[0] instanceof Date) || r[0] > now) continue;
    try {
      var cap = String(r[3] || ''), kind = r[2] || '사진', id;
      if (kind === '릴스') {
        id = igPost(me + '/media', { media_type: 'REELS', video_url: r[5], caption: cap }).id;
        waitReady(id);
      } else if (kind === '캐러셀') {
        var kids = String(r[4]).split(',').map(function (u) { return u.trim(); }).filter(String).slice(0, 10)
          .map(function (u) { return igPost(me + '/media', { image_url: u, is_carousel_item: 'true' }).id; });
        id = igPost(me + '/media', { media_type: 'CAROUSEL', children: kids.join(','), caption: cap }).id;
        waitReady(id);
      } else {
        id = igPost(me + '/media', { image_url: String(r[4]).split(',')[0].trim(), caption: cap }).id;
        waitReady(id);
      }
      var media = igPost(me + '/media_publish', { creation_id: id }).id;
      sh.getRange(i + 1, 2).setValue('게시됨');
      sh.getRange(i + 1, 7).setValue(media);
      notify('📸 인스타 게시됨 · ' + cap.split('\n')[0].slice(0, 40));
    } catch (e) {
      sh.getRange(i + 1, 2).setValue('실패');
      sh.getRange(i + 1, 8).setValue(String(e.message).slice(0, 300));
      notify('⚠️ 인스타 게시 실패 · ' + e.message);
    }
    return; // 한 번 실행에 한 건만, 천천히
  }
}

function refreshToken() { // 트리거: 매월 1일. 장기 토큰은 약 60일이라 미리 새로 받아요
  var j = JSON.parse(UrlFetchApp.fetch(IG + 'refresh_access_token?grant_type=ig_refresh_token&access_token=' + P.getProperty('IG_TOKEN')).getContentText());
  if (j.access_token) P.setProperty('IG_TOKEN', j.access_token); else notify('⚠️ 인스타 토큰 갱신 실패: 토큰을 다시 만들어 주세요');
}

function checkLimit() { // 24시간 게시 한도 사용량 확인
  Logger.log(JSON.stringify(igGet(P.getProperty('IG_ID') + '/content_publishing_limit?fields=quota_usage,config')));
}

function notify(t) {
  if (!P.getProperty('TG_TOKEN')) return;
  UrlFetchApp.fetch('https://api.telegram.org/bot' + P.getProperty('TG_TOKEN') + '/sendMessage', {
    method: 'post', payload: { chat_id: P.getProperty('TG_CHAT'), text: t }, muteHttpExceptions: true });
}
