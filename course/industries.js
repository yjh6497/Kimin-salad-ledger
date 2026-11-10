/* 업종 프로필: 강의 글 속 {{토큰}}이 업종에 맞는 말로 바뀝니다.
   새 업종을 추가할 때는 아래 INDUSTRIES에 한 덩어리를 복사해 고치고,
   업종 전용 강의는 src/<업종 id>/ 폴더에 넣은 뒤 tools/build.py를 돌리세요. */
(function () {
  var T = {}; // 공통 기본값(직접 입력 업종에 씀)

  window.INDUSTRIES = {
    vet: {
      name: '동물병원', icon: '🐾', aliases: ['동물병원', '수의사', '수의', '펫', '반려동물', '애견', '고양이', '강아지', '병원'],
      blurb: '진료는 원장님이, 서류·글쓰기·반복 일은 AI가',
      stages: { prep: '신규 개원', takeover: '병원 인수', operate: '운영 중' },
      terms: {
        owner: '원장님', customer: '보호자', place: '병원', biz: '동물병원', open: '개원', shopname: '○○동물병원',
        work: '진료', hours: '진료 시간', staff: '직원', item: '진료', visit: '내원', supplier: '도매상·거래처', stockitem: '약품·소모품',
        ex_post: '강아지 슬개골 탈구, 집에서 먼저 볼 3가지', ex_reel: '귀 청소 15초 따라 하기', ex_review: '접종 때 아이가 덜 무서워했어요',
        ex_revisit: '예방접종·심장사상충 약 주기', ex_faq: '중성화는 몇 개월에 하나요?', ex_season: '진드기 철 산책 후 확인법',
        ex_keyword: '○○동 동물병원', ex_service3: '예방접종 · 건강검진 · 중성화 수술'
      },
      staff: null
    },
    salad: {
      name: '샐러드 가게', icon: '🥗', aliases: ['샐러드', '샐러드 가게', '음식점', '식당', '포케', '도시락', '배달', '카페', '외식', '분식'],
      blurb: '요리와 손님 맞이는 사장님이, 장부와 반복 일은 AI가',
      stages: { prep: '신규 개업', takeover: '가게 인수', operate: '운영 중' },
      terms: {
        owner: '사장님', customer: '손님', place: '가게', biz: '샐러드 가게', open: '개업', shopname: '○○샐러드',
        work: '영업', hours: '영업시간', staff: '직원·알바생', item: '메뉴', visit: '방문', supplier: '식자재 거래처', stockitem: '식자재·포장재',
        ex_post: '단백질 30g 샐러드, 이렇게 골라 드세요', ex_reel: '샐러드 한 그릇 담는 15초', ex_review: '채소가 정말 아삭하고 소스가 맛있어요',
        ex_revisit: '신메뉴 출시·정기 구독 갱신', ex_faq: '드레싱 따로 담아 주실 수 있나요?', ex_season: '여름 한정 냉파스타 샐러드',
        ex_keyword: '○○동 샐러드', ex_service3: '시그니처 샐러드 · 단백질 볼 · 단체 도시락'
      },
      staff: null
    },
    flower: {
      name: '꽃집', icon: '💐', aliases: ['꽃집', '꽃', '플라워', '꽃가게', '화원', '화훼', '꽃다발', '화환', '플로리스트'],
      blurb: '꽃을 고르고 만드는 일은 사장님이, 주문·글쓰기·반복 일은 AI가',
      stages: { prep: '신규 개업', takeover: '꽃집 인수', operate: '운영 중' },
      terms: {
        owner: '사장님', customer: '손님', place: '꽃집', biz: '꽃집', open: '개업', shopname: '○○플라워',
        work: '영업', hours: '영업시간', staff: '직원', item: '꽃다발·화환', visit: '방문', supplier: '화훼 도매시장·거래처', stockitem: '생화·자재',
        ex_post: '졸업식 꽃다발, 예산별로 이렇게 달라져요', ex_reel: '꽃다발 포장 15초', ex_review: '사진보다 실물이 훨씬 예뻤어요',
        ex_revisit: '기념일·생일 하루 전 안내', ex_faq: '당일 배달 되나요?', ex_season: '어버이날 카네이션 예약',
        ex_keyword: '○○동 꽃집', ex_service3: '꽃다발 · 축하·근조 화환 · 정기 꽃 구독'
      },
      staff: null
    },
    arch: {
      name: '건축사사무소', icon: '📐', aliases: ['건축사', '건축사사무소', '설계', '건축', '설계사무소', '인테리어', '사무소'],
      blurb: '도면은 소장님이, 서류와 반복 일은 AI가',
      survey: { id: 'sw', tag: '프로그램', q: '사무소에서 쓰는 프로그램을 모두 골라 주세요', s: '고른 프로그램을 AI와 함께 쓰는 강의만 보여 드려요. 안 고르면 모두 보여요.',
        o: ['오토캐드 등 2D CAD', '스케치업', '레빗·아키캐드 (BIM)', '포토샵', '일러스트레이터', '엑셀', '한글 (HWP)'],
        keys: ['cad', 'sketchup', 'bim', 'ps', 'ai', 'excel', 'hwp'] },
      stages: { prep: '사무소 개설', takeover: '사무소 인수', operate: '운영 중' },
      terms: {
        owner: '소장님', customer: '건축주', place: '사무소', biz: '건축사사무소', open: '개설', shopname: '○○건축사사무소',
        work: '설계', hours: '업무 시간', staff: '직원', item: '설계·감리', visit: '상담 방문', supplier: '협력업체', stockitem: '사무 소모품',
        ex_post: '단독주택 짓기 전, 땅에서 먼저 볼 3가지', ex_reel: '스케치가 투시도가 되기까지 15초', ex_review: '인허가까지 꼼꼼하게 챙겨 주셨어요',
        ex_revisit: '준공 1년 하자 점검', ex_faq: '설계비는 어떻게 정해지나요?', ex_season: '착공 전 겨울 설계 상담',
        ex_keyword: '○○시 건축사사무소', ex_service3: '단독주택 설계 · 근린생활시설 · 감리'
      },
      staff: null
    }
  };

  /* 목록에 없는 업종: 유형을 고르면 호칭이 정해지고, 이름은 입력한 그대로 들어갑니다. */
  window.CUSTOM_TYPES = {
    shop:   { label: '매장 (손님이 찾아와요)', owner: '사장님', customer: '손님', place: '가게', work: '영업', hours: '영업시간', visit: '방문', supplier: '거래처', stockitem: '재료·소모품', open: '개업' },
    clinic: { label: '병·의원·한의원', owner: '원장님', customer: '환자', place: '병원', work: '진료', hours: '진료 시간', visit: '내원', supplier: '거래처', stockitem: '약품·소모품', open: '개원' },
    edu:    { label: '학원·교습소·공방', owner: '원장님', customer: '수강생', place: '학원', work: '수업', hours: '운영 시간', visit: '상담 방문', supplier: '거래처', stockitem: '교재·재료', open: '개원' },
    office: { label: '사무소·전문직', owner: '대표님', customer: '고객', place: '사무소', work: '업무', hours: '업무 시간', visit: '상담 방문', supplier: '협력업체', stockitem: '사무 소모품', open: '개업' }
  };

  window.makeCustomIndustry = function (name, type) {
    var t = window.CUSTOM_TYPES[type] || window.CUSTOM_TYPES.shop;
    var n = (name || '').trim() || '우리 가게';
    return {
      custom: true, name: n, icon: ({ shop: '🏪', clinic: '🏥', edu: '✏️', office: '💼' })[type] || '🏪', aliases: [n], blurb: '본업은 ' + t.owner + '이, 서류·글쓰기·반복 일은 AI가',
      stages: { prep: '신규 ' + t.open, takeover: t.place + ' 인수', operate: '운영 중' },
      terms: {
        owner: t.owner, customer: t.customer, place: t.place, biz: n, open: t.open, shopname: '○○' + n,
        work: t.work, hours: t.hours, staff: '직원', item: '대표 상품·서비스', visit: t.visit, supplier: t.supplier, stockitem: t.stockitem,
        ex_post: n + ' 고르기 전, 먼저 볼 3가지', ex_reel: '우리 ' + t.place + ' 하루 15초', ex_review: '설명이 친절하고 결과가 만족스러웠어요',
        ex_revisit: '다음 방문 시기 안내', ex_faq: '예약 없이 가도 되나요?', ex_season: '이번 달 이벤트',
        ex_keyword: '○○동 ' + n, ex_service3: '대표 서비스 세 가지'
      },
      staff: null
    };
  };
})();
