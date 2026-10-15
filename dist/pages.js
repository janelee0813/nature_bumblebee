const sources = {
  store: 'https://smartstore.naver.com/sujungbul/products/4937483529',
  blog: 'https://blog.naver.com/naturebul',
  instagram: 'https://www.instagram.com/nature_bumblebee/',
  talk: 'https://talk.naver.com/ct/wc9606',
  family: 'https://blog.naver.com/naturebul/224403321742',
  arrival: 'https://blog.naver.com/naturebul/224226639235',
  tomato: 'https://blog.naver.com/naturebul/224317270965',
  generation: 'https://blog.naver.com/naturebul/224400652582',
  producer: 'https://blog.naver.com/naturebul/224238431952',
};

// Photos come from the brand's official channels; crop tiles are native illustrations.
const images = {
  bee: 'assets/site-bee.jpg',
  product: 'assets/site-product.jpg',
  tomato: 'assets/site-tomato.svg',
  strawberry: 'assets/site-strawberry.svg',
  blueberry: 'assets/site-blueberry.svg',
  melon: 'assets/site-melon.svg',
  orchard: 'assets/site-orchard.svg',
  family: 'assets/brand/generation-1.jpg',
  farm: 'assets/brand/tomato-1.jpg',
  facility: 'assets/brand/producer-4.jpg',
  dispatch: 'assets/brand/arrival-7.jpg',
};

export const crops = [
  {
    id: 'tomato', name: '토마토', english: 'TOMATO', environment: '시설 재배',
    source: 'https://blog.naver.com/naturebul/224212793374', sourceDate: '2026.03.11',
    intro: '꽃이 피는 시기부터, 우리 하우스의 조건에 맞게.',
    summary: '하우스의 개화 상태와 재배 환경을 함께 살펴봅니다.',
    context: '시설 토마토 농가에서는 꽃의 상태와 하우스 환경을 함께 확인하는 것이 상담의 출발점입니다. 현재 개화 상황, 재배 면적, 희망 투입일을 알려주시면 사용할 봉군과 공급 일정을 함께 확인할 수 있습니다.',
    checks: ['현재 꽃이 피는 구역과 개화 상태', '하우스별 재배 면적과 구역 구성', '환기·차광 등 하우스 관리 방식', '최근 사용했거나 사용할 예정인 농약'],
    observe: '꽃에서 벌의 활동이 관찰되는지, 시간대와 하우스 환경에 따라 활동 모습이 어떻게 달라지는지 살펴보세요. 활동이 기대와 다르다면 꽃과 벌통의 상태를 사진이나 영상으로 남겨 상담에 활용할 수 있습니다.',
    story: 'tomato',
  },
  {
    id: 'strawberry', name: '딸기', english: 'STRAWBERRY', environment: '시설 재배',
    source: 'https://blog.naver.com/naturebul/224235424019', sourceDate: '2026.03.31',
    intro: '꽃의 상태와 재배 구역을 먼저 살펴보세요.',
    summary: '개화 상황과 시설 조건을 바탕으로 사용을 상담합니다.',
    context: '딸기 농가의 사용 상담은 재배 면적만으로 결정하지 않습니다. 품종과 개화 상태, 시설의 구역 구성, 예정된 방제 작업을 함께 알려주세요. 농가의 조건에 맞는 사용 가능 여부와 공급 일정을 확인합니다.',
    checks: ['재배 품종과 현재 개화 상황', '재배 면적과 하우스별 구역 구성', '시설의 환기·온도 관리 방식', '방제 예정일과 사용 제품 정보'],
    observe: '꽃 주변에서 벌이 어떻게 활동하는지 관찰하세요. 활동 상태를 상담할 때는 벌통만 촬영하기보다 꽃의 상태와 설치 주변 환경이 함께 보이는 사진을 준비하면 도움이 됩니다.',
  },
  {
    id: 'blueberry', name: '블루베리', english: 'BLUEBERRY', environment: '시설·노지 조건 확인',
    source: 'https://blog.naver.com/naturebul/224243845275', sourceDate: '2026.04.07',
    intro: '재배 환경과 개화 일정에 맞춰 준비합니다.',
    summary: '시설·노지 여부와 품종, 개화 일정을 함께 확인합니다.',
    context: '블루베리는 시설 또는 노지 여부와 품종, 개화 진행 상황을 함께 확인해 상담합니다. 지역과 재배 환경에 따라 준비할 사항이 달라질 수 있으므로, 사용을 계획할 때 농장의 조건부터 알려주세요.',
    checks: ['시설 또는 노지 여부와 재배 지역', '재배 품종과 예상 개화 시기', '재배 면적과 식재 구역', '현장의 바람·비 등 외부 환경과 방제 계획'],
    observe: '개화한 구역에서 벌의 활동을 관찰하고 날씨와 현장 조건을 함께 기록해 보세요. 벌이 잘 보이지 않을 때는 출입구, 먹이 상태, 꽃의 상태를 확인한 뒤 상담으로 연결하세요.',
  },
  {
    id: 'melon', name: '참외', english: 'KOREAN MELON', environment: '시설 재배',
    source: 'https://blog.naver.com/naturebul/224219326974', sourceDate: '2026.03.17',
    intro: '개화와 농장 일정, 두 가지를 함께 맞춥니다.',
    summary: '하우스 운영 일정과 개화 상태를 함께 상담합니다.',
    context: '참외 농가에서는 하우스별 개화 상황과 운영 일정을 정리해 사용을 상담할 수 있습니다. 여러 동의 하우스를 관리한다면 구역별 면적과 희망 투입일을 함께 알려주세요. 필요한 공급 조건을 상담에서 확인합니다.',
    checks: ['하우스별 개화 상태와 운영 일정', '동별 재배 면적과 구역 수', '희망 투입일과 희망 수량', '최근 방제 내역과 앞으로의 방제 계획'],
    observe: '벌통 출입과 꽃 주변 활동을 함께 살펴보세요. 사용 환경이 달라졌거나 활동이 평소와 다르게 보이면 현장 사진과 함께 문의해 주세요. 봉군의 사용 및 교체 판단은 상태를 확인한 뒤 상담합니다.',
  },
  {
    id: 'orchard', name: '과수', english: 'ORCHARD', environment: '작목·환경별 상담',
    source: 'https://blog.naver.com/naturebul/224234584542', sourceDate: '2026.03.30',
    intro: '과수의 종류와 개화 환경부터 알려주세요.',
    summary: '작목과 품종, 시설·노지 여부를 먼저 확인합니다.',
    context: '과수는 작목과 품종, 재배 환경을 구체적으로 확인한 뒤 사용을 검토합니다. 같은 과수라도 개화 일정과 현장 조건이 다를 수 있습니다. 적용 가능 여부와 준비 사항은 작목별 상담으로 확인해 주세요.',
    checks: ['정확한 작목명과 재배 품종', '시설 또는 노지 여부와 재배 지역', '현재 개화 상태와 희망 투입일', '면적·식재 구역 및 방제 계획'],
    observe: '벌통 주변과 개화한 구역을 함께 살펴보고 현장 조건을 기록해 주세요. 날씨 변화나 관리 작업으로 환경이 달라졌다면 그 내용을 포함해 문의하면 사용 상태를 확인하는 데 도움이 됩니다.',
  },
];

export const faqs = [
  {
    id: 'arrival', category: '도착·설치', question: '수정벌이 도착하면 무엇부터 확인하나요?',
    answer: '먼저 포장과 벌통에 손상이 없는지 확인하고, 동봉된 제품 안내를 읽어 주세요. 벌통과 먹이 연결 상태, 출입구 상태를 차례로 확인합니다. 도착 상태가 걱정된다면 사진이나 영상과 주문 정보를 준비해 상담 채널로 문의해 주세요.',
    link: { href: sources.arrival, text: '도착 후 체크리스트 원문 읽기' },
  },
  {
    id: 'location', category: '도착·설치', question: '벌통은 어디에 놓아야 하나요?',
    answer: '설치 위치는 작물과 재배 시설, 주변 환경에 따라 확인해야 합니다. 제품에 동봉된 설치 안내를 우선 따르고, 설치 장소가 애매하면 위치 사진과 시설·노지 여부를 알려주세요. 벌통 주변 환경과 농장의 관리 작업을 함께 확인해 상담합니다.',
  },
  {
    id: 'activity', category: '사용·관리', question: '벌이 벌통 밖으로 나오지 않아요.',
    answer: '출입구가 제품 안내에 맞게 설정되어 있는지, 먹이 연결 상태와 주변 환경에 문제가 없는지 확인해 주세요. 도착 시점과 현재 꽃의 상태도 함께 살펴봅니다. 상태를 임의로 단정하기보다 벌통·출입구·꽃·설치 장소가 보이는 사진을 준비해 문의해 주세요.',
  },
  {
    id: 'observe', category: '사용·관리', question: '활동이 잘되는지 어떻게 확인하나요?',
    answer: '벌통을 드나드는 모습과 꽃 주변에서 활동하는 모습을 함께 관찰해 보세요. 한 번의 관찰만으로 봉군 상태를 판단하기보다 관찰 시간과 현장 조건을 함께 기록하면 상담에 도움이 됩니다. 수확 결과만으로 벌의 활동을 판단하기 어려우므로 사용 과정도 함께 확인합니다.',
  },
  {
    id: 'food', category: '사용·관리', question: '먹이와 꽃가루는 어떻게 관리하나요?',
    answer: '먹이의 연결 방법과 확인 사항은 공급된 제품의 안내를 우선 따르세요. 먹이 상태가 달라 보이거나 추가 공급이 필요한지 궁금하면 제품과 현장 상태를 알려주세요. 임의로 내용물을 바꾸기 전에 공급자에게 확인하는 것이 좋습니다.',
  },
  {
    id: 'pesticide', category: '재배 환경', question: '농약을 사용해야 할 때는 어떻게 하나요?',
    answer: '벌을 사용하는 중에는 방제 계획을 미리 공유해 주세요. 사용할 농약의 정확한 제품명과 사용 방법, 작업 일정을 준비하고, 제품 표시사항과 관련 안전 기준을 확인해야 합니다. 벌통을 다루는 방법과 작업 후 사용 여부는 농약별 조건을 확인한 뒤 상담하세요.',
  },
  {
    id: 'replace', category: '사용·관리', question: '벌통은 언제 교체하나요?',
    answer: '교체 시점은 작물, 개화 상태, 봉군의 상태와 재배 환경을 함께 확인해 판단합니다. 날짜만으로 일괄 안내하기보다 투입일과 현재 활동 상태를 알려주세요. 다음 투입이 필요하다면 희망 일정도 함께 상담할 수 있습니다.',
  },
  {
    id: 'delivery', category: '주문·배송', question: '배송 일정이나 도착 상태에 문제가 있으면 어떻게 하나요?',
    answer: '주문·출고·배송 조건은 주문 전 현재 판매 안내에서 확인해 주세요. 도착 상태에 이상이 있다면 주문 정보, 수령 시점, 포장과 벌통 사진을 준비해 현재 상담 채널로 문의하세요. 처리 가능 여부와 방법은 실제 도착 상태 및 판매 조건을 확인한 뒤 안내받을 수 있습니다.',
  },
];

const stories = [
  {
    id: 'family', tag: '생산자의 이야기', date: '2026.09.07', title: '자연수정벌 가족이 드리는 글',
    summary: '생산자와 다음 세대로 이어지는 자연수정벌의 이야기를 만나보세요.',
    image: images.family, alt: '자연수정벌 사육장 앞에서 벌통과 함께 선 생산자 가족', source: sources.family,
    imageCaption: '자연수정벌 가족과 사육장. <a href="https://blog.naver.com/naturebul/224400652582" target="_blank" rel="noopener noreferrer">공식 블로그의 세대 이야기 사진 ↗</a>',
    paragraphs: [
      '자연수정벌의 공식 블로그에는 심상봉 대표와 가족이 전하는 브랜드 이야기가 담겨 있습니다. 수정벌을 기르고 공급하는 일, 그리고 다음 세대로 이어지는 사업의 맥락을 생산자의 글로 소개합니다.',
      '자연수정벌은 블로그에서 2009년부터 자체 생산·공급해 왔다고 소개합니다. 농가가 제품을 이해하는 데 필요한 사용 안내와 현장 기록도 같은 공간에서 이어가고 있습니다.',
      '생산자의 이야기는 실제 원문에서 확인할 수 있습니다. 처음 사용하는 농가라면 브랜드 이야기와 함께 도착 후 확인 사항, 작물별 상담 안내를 살펴보세요.',
    ],
    related: { href: 'about.html', text: '자연수정벌 소개 보기' },
  },
  {
    id: 'tomato', tag: '농가의 현장', date: '2026.06.16', title: '10년째 함께하는 토마토 농가',
    summary: '오랜 거래를 이어온 토마토 농가의 방문과 배송 기록을 읽습니다.',
    image: images.farm, alt: '자연수정벌 공식 기록에 소개된 토마토 재배 하우스', source: sources.tomato,
    imageCaption: '토마토 농가의 현장. 자연수정벌 공식 블로그의 방문 기록 사진입니다.',
    paragraphs: [
      '공식 블로그의 「10년째 함께하는 토마토 농가」에는 자연수정벌과 오래 거래한 농가의 방문·배송 이야기와 현장 영상이 담겨 있습니다. 실제 농가의 사용 과정을 이해할 수 있는 기록입니다.',
      '현장 이야기를 읽을 때는 작물과 재배 조건, 사용 과정을 함께 살펴보세요. 농가의 경험은 각 현장의 기록이며, 다른 농가의 수확량이나 품질 향상을 그대로 보장하는 수치로 볼 수는 없습니다.',
      '우리 농장에도 사용할 수 있을지 궁금하다면 재배 면적과 시설 조건, 현재 개화 상태를 준비해 상담해 주세요. 토마토 사용 안내에서 상담에 필요한 항목을 먼저 확인할 수 있습니다.',
    ],
    related: { href: 'crops.html?crop=tomato', text: '토마토 사용 안내 보기' },
  },
  {
    id: 'field', tag: '처음 사용하기', date: '2026.03.23', title: '벌이 도착한 날, 5가지 체크리스트',
    summary: '설치와 먹이, 출입구와 환경을 확인하는 첫 사용의 출발점.',
    image: images.product, alt: '자연수정벌 공식 사용 안내에 소개된 벌통', source: sources.arrival,
    imageCaption: '자연수정벌의 실제 벌통. 공식 블로그의 도착 후 안내 사진입니다.',
    paragraphs: [
      '수정벌이 도착한 날에는 제품 상태를 확인하고 설치 안내를 차근차근 읽는 것부터 시작합니다. 공식 블로그의 「도착 후 5가지 체크리스트」는 벌통 설치, 먹이 연결, 출입구와 주변 환경을 살펴보는 안내를 제공합니다.',
      '제품에 동봉된 안내와 현재 상담 내용을 우선 확인해 주세요. 농가별로 설치 조건이 다르므로 정확한 위치나 사용 방법이 궁금하다면 벌통과 주변 환경이 함께 보이는 사진을 준비해 문의할 수 있습니다.',
      '처음 사용하는 농가가 자주 묻는 질문은 FAQ에서도 확인할 수 있습니다. 도착 상태나 활동이 걱정되면 사용 과정의 정보를 남겨 현재 상담 채널로 연결해 주세요.',
    ],
    related: { href: 'faq.html#arrival', text: '도착·설치 질문 보기' },
  },
];

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const external = (href, label, className = 'text-link', channel = '') => `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer" ${channel ? `data-brand-link="${channel}"` : ''}>${label} <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a>`;
const order = (label = '수정벌 구매') => `<button class="btn btn-primary" type="button" data-order>${label} <span aria-hidden="true">↗</span></button>`;
const consult = (crop = '', label = '작물·수량 상담') => `<a class="btn btn-outline" href="contact.html${crop ? `?crop=${crop}` : ''}">${label} <span aria-hidden="true">↗</span></a>`;
const breadcrumbs = (current, parent = null) => `<nav class="breadcrumb" aria-label="현재 위치"><a href="index.html#home">홈</a><span aria-hidden="true">/</span>${parent ? `<a href="${parent.href}">${parent.name}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${current}</span></nav>`;
const heading = (kicker, title, copy) => `<header class="page-heading"><p class="section-kicker">${kicker}</p><h1>${title}</h1><p class="body-copy">${copy}</p></header>`;
const photo = (src, alt, caption = '자연수정벌 공식 채널에 공개된 사진입니다.') => `<figure class="image-frame"><img src="${src}" alt="${alt}" loading="lazy" width="1200" height="900"><figcaption>${caption}</figcaption></figure>`;
const steps = (items, className = '') => `<ol class="guide-grid ${className}">${items.map((item, index) => `<li class="guide-step"><span class="guide-number" aria-hidden="true">0${index + 1}</span><h3>${item.title}</h3><p>${item.copy}</p></li>`).join('')}</ol>`;
const list = items => `<ul class="check-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
const callToAction = (title = '우리 농장에 맞게, 함께 준비해요.', copy = '작물과 재배 조건, 희망 투입일을 알려주세요. 알고 계신 항목부터 상담을 준비할 수 있습니다.', crop = '') => `<section class="page-cta info-panel" aria-labelledby="page-cta-title"><div><p class="section-kicker">LET’S GROW TOGETHER</p><h2 id="page-cta-title" class="section-title">${title}</h2><p class="body-copy">${copy}</p></div><div class="button-row">${order()}${consult(crop)}</div></section>`;

function cropCards(exclude = '') {
  return `<div class="crop-grid">${crops.filter(crop => crop.id !== exclude).map(crop => `<a class="crop-card" href="crops.html?crop=${crop.id}"><div class="crop-card-image"><img src="${images[crop.id]}" alt="${crop.name} 작물 이미지" loading="lazy" width="800" height="600"></div><div class="crop-card-copy"><p class="section-kicker">${crop.english}</p><h3>${crop.name}<span aria-hidden="true">↗</span></h3><p>${crop.summary}</p></div></a>`).join('')}</div>`;
}

function faqItems(items = faqs) {
  return `<div class="faq-list">${items.map((faq, index) => `<details id="${faq.id}" class="faq-item" data-faq-item><summary><span class="faq-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span>${faq.question}</span><span class="faq-plus" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${faq.answer}</p>${faq.link ? external(faq.link.href, faq.link.text) : ''}</div></details>`).join('')}</div>`;
}

function storyCards() {
  return `<div class="editorial-grid story-grid">${stories.map(story => `<article class="story-card"><a class="story-image" href="stories.html?story=${story.id}"><img src="${story.image}" alt="${story.alt}" loading="lazy" width="1000" height="750"></a><div class="story-card-copy"><div class="story-meta"><span class="tag">${story.tag}</span><time datetime="${story.date.replaceAll('.', '-')}">${story.date}</time></div><h2><a href="stories.html?story=${story.id}">${story.title}</a></h2><p>${story.summary}</p><a class="text-link" href="stories.html?story=${story.id}">이야기 읽기 <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div>`;
}

function aboutPage() {
  return `${breadcrumbs('자연수정벌 소개')}${heading('NATURE BUMBLEBEE', '꽃을 잇는 작은 비행,<br>농가와 이어가는 이야기.', '자연수정벌은 경북 청송에서 수정벌을 생산·공급하며<br class="desktop-break"> 작물과 농가의 조건을 함께 살피는 브랜드입니다.')}
    <section class="split-layout page-section" aria-labelledby="about-story-title"><div>${photo(images.bee, '체리꽃에서 꽃가루를 모으는 수정벌', '체리꽃에서 활동하는 수정벌. 자연수정벌 공식 인스타그램에 공개된 사진입니다.')}</div><div><p class="section-kicker">ROOTED IN CHEONGSONG</p><h2 id="about-story-title" class="section-title">기르는 일에서,<br>농가에 닿는 일까지.</h2><p class="body-copy">수정벌의 작은 날갯짓은 꽃과 꽃 사이를 잇습니다. 자연수정벌은 그 비행이 농가의 재배 환경 속에서 이어지도록, 제품 안내와 사용 상담을 함께 연결합니다.</p><p class="body-copy">공식 블로그에서는 2009년부터 이어온 자체 생산·공급의 경험을 소개합니다. 처음 사용하는 농가를 위한 관리 안내부터 오래 함께한 농가의 현장 기록까지, 생산자의 이야기를 전하고 있습니다.</p>${external(sources.family, '생산자와 가족의 이야기 읽기')}</div></section>
    <section class="page-section" aria-labelledby="about-process-title"><div class="section-heading"><p class="section-kicker">CARE, FROM THE BEGINNING</p><h2 id="about-process-title" class="section-title">공급을 준비하며<br>함께 확인하는 것들.</h2><p class="body-copy">우리 농장의 작물과 환경을 알려주시면,<br>제품과 공급 조건부터 사용 안내까지 차례로 확인합니다.</p></div>${steps([
      { title: '작물과 환경', copy: '작물명, 재배 지역, 시설·노지 여부와 개화 상태를 함께 살펴봅니다.' },
      { title: '봉군과 공급 조건', copy: '현재 공급되는 제품의 구성과 맞춤 공급 가능 여부를 확인합니다.' },
      { title: '준비와 일정', copy: '희망 투입일과 수량을 바탕으로 주문·출고 일정을 상담합니다.' },
      { title: '도착과 사용', copy: '동봉 안내와 공식 체크리스트를 바탕으로 처음 사용을 준비합니다.' },
    ])}</section>
    <section class="page-section editorial-grid about-photo-grid" aria-label="자연수정벌 생산과 출고의 모습">${photo(images.facility, '청송의 자연수정벌 뒤영벌 사육장 외관', '청송의 뒤영벌 사육장. <a href="https://blog.naver.com/naturebul/224238431952" target="_blank" rel="noopener noreferrer">공식 블로그의 생산자 기록 ↗</a>')}${photo(images.dispatch, '우체국 앞 운반대에 쌓인 자연수정벌 택배 상자', '농가로 향하는 출고 상자. <a href="https://blog.naver.com/naturebul/224226639235" target="_blank" rel="noopener noreferrer">공식 블로그의 도착 안내 ↗</a>')}</section>
    <section class="split-layout page-section" aria-labelledby="about-people-title"><div>${photo(images.family, '자연수정벌 사육장 앞에서 제품을 든 생산자 가족', '자연수정벌 가족과 사육장. <a href="https://blog.naver.com/naturebul/224400652582" target="_blank" rel="noopener noreferrer">공식 블로그의 세대 이야기 ↗</a>')}</div><div><p class="section-kicker">PEOPLE BEHIND THE WINGS</p><h2 id="about-people-title" class="section-title">한 가족의 정성이,<br>농가의 하루에 닿도록.</h2><p class="body-copy">심상봉 대표와 다음 세대로 이어지는 자연수정벌의 이야기는 공식 블로그에 담겨 있습니다. 생산자의 글과 농가 방문 기록을 통해 브랜드의 시간을 만나보세요.</p><a class="text-link" href="stories.html">농가와 생산자의 이야기 <span aria-hidden="true">↗</span></a></div></section>
    <section class="page-section" aria-labelledby="about-channels-title"><p class="section-kicker">KEEP IN TOUCH</p><h2 id="about-channels-title" class="section-title">더 가까운 자연수정벌.</h2><div class="editorial-grid channel-grid"><article class="channel-card"><h3>상세한 사용 이야기</h3><p>브랜드의 소개와 설치·관리 안내, 농가의 기록을 블로그에서 읽어보세요.</p>${external(sources.blog, '공식 블로그', 'text-link', 'blog')}</article><article class="channel-card"><h3>꽃과 농가의 현장</h3><p>꽃에서 활동하는 벌과 출고·현장의 사진, 영상을 인스타그램에서 만나보세요.</p>${external(sources.instagram, '인스타그램', 'text-link', 'instagram')}</article><article class="channel-card"><h3>구매 전 궁금한 점</h3><p>작물과 재배 조건, 희망 수량과 일정을 정리해 상담을 시작해 보세요.</p>${external(sources.talk, '네이버 톡톡', 'text-link', 'talk')}</article></div></section>${callToAction()}`;
}

function productsPage() {
  return `${breadcrumbs('제품·주문')}${heading('A LITTLE HELP FOR EVERY FLOWER', '우리 작물의 꽃과 함께할<br>자연수정벌.', '대표 제품을 이해하고, 농장에 맞는 공급 조건을 확인하세요.')}
    <section class="split-layout product-detail page-section" aria-labelledby="product-title"><div>${photo(images.product, '자연수정벌 공식 안내에 소개된 실제 벌통', '자연수정벌 공식 사용 안내의 실제 벌통 사진입니다. 현재 출고 규격·구성은 주문 전 확인해 주세요.')}</div><div><p class="section-kicker">NATURE BUMBLEBEE / 대표 제품</p><h2 id="product-title" class="section-title">작물을 위한<br>수정벌 봉군.</h2><p class="body-copy">통 당 130마리 내외로 구성된 고품질 뒤영벌 제품입니다. 작물과 재배 환경에 맞는 사용 여부, 필요한 봉군과 공급 일정은 주문 전에 함께 확인합니다.</p><dl class="product-facts"><div><dt>공급 브랜드</dt><dd>자연수정벌</dd></div><div><dt>생산 지역</dt><dd>경북 청송</dd></div><div><dt>공급 단위</dt><dd>벌통 단위의 봉군</dd></div><div><dt>봉군 구성</dt><dd>고품질 뒤영벌 · 통 당 130마리 내외</dd></div><div><dt>맞춤 공급</dt><dd>작물·수량·희망 일정 상담</dd></div></dl><div class="button-row">${order('수정벌 구매하기')}${consult()}</div><p class="small-note">상품 구성·가격·판매 조건은 현재 판매 안내를 기준으로 확인해 주세요.</p></div></section>
    <section class="page-section" aria-labelledby="product-fit-title"><div class="section-heading"><p class="section-kicker">FIND YOUR CROP</p><h2 id="product-fit-title" class="section-title">먼저, 우리 작물부터.</h2><p class="body-copy">토마토·딸기·블루베리·참외·과수 안내에서<br>상담에 필요한 재배 조건을 확인할 수 있습니다.</p></div>${cropCards()}</section>
    <section class="page-section" aria-labelledby="product-order-title"><p class="section-kicker">ORDER, STEP BY STEP</p><h2 id="product-order-title" class="section-title">주문은 이렇게 준비하세요.</h2>${steps([
      { title: '재배 조건 정리', copy: '작물, 지역, 재배 면적과 단위, 시설·노지 여부를 준비합니다. 알고 계신 항목부터 시작해도 괜찮습니다.' },
      { title: '수량·일정 확인', copy: '개화 상황과 희망 투입일, 희망 수량을 알려주고 공급 가능 조건을 상담합니다.' },
      { title: '판매 조건 확인', copy: '현재 제품 구성과 가격, 주문·배송 조건을 확인한 뒤 구매를 진행합니다.' },
      { title: '도착 후 확인', copy: '포장과 벌통 상태를 살피고, 동봉 안내에 따라 설치와 먹이·출입구 상태를 확인합니다.' },
    ])}</section>
    <section class="split-layout page-section" aria-labelledby="product-delivery-title"><div><p class="section-kicker">BEFORE THE FIRST FLIGHT</p><h2 id="product-delivery-title" class="section-title">도착한 날부터,<br>차근차근.</h2><p class="body-copy">생물이 담긴 제품인 만큼 수령 후 상태를 확인하고 사용 안내를 먼저 읽어 주세요. 설치 장소나 도착 상태가 걱정된다면 사진과 주문 정보를 준비해 상담으로 연결할 수 있습니다.</p>${external(sources.arrival, '도착 후 5가지 체크리스트 읽기')}</div><aside class="info-panel"><h3>주문 전에 함께 확인해요</h3>${list(['현재 출고 규격과 동봉 구성품', '희망 투입일에 맞는 공급 가능 여부', '주문·출고·배송 일정과 수령 조건', '도착 상태에 이상이 있을 때의 연락 방법', '단체 주문에 필요한 서류와 공급 조건'])}<a class="text-link" href="faq.html">자주 묻는 질문 보기 <span aria-hidden="true">↗</span></a></aside></section>${callToAction('수량이 고민이라면,<br>재배 조건부터 알려주세요.', '면적만으로 수량을 단정하지 않습니다. 작물과 개화 상태, 환경을 함께 확인해 상담합니다.')}`;
}

function cropsPage() {
  return `${breadcrumbs('작물별 사용법')}${heading('FIND YOUR CROP', '우리 작물에 맞는<br>사용의 시작.', '작물을 선택하면 재배 조건과 처음 사용하기,<br class="desktop-break"> 상담에 필요한 항목을 함께 확인할 수 있습니다.')}
    <section class="page-section" aria-label="작물 선택">${cropCards()}<p class="image-note">작물 카드는 작물의 모습을 표현한 식물 일러스트입니다.</p></section>
    <section class="split-layout page-section" aria-labelledby="crops-common-title"><div><p class="section-kicker">EVERY FARM IS DIFFERENT</p><h2 id="crops-common-title" class="section-title">같은 작물이어도,<br>농장의 조건은 다릅니다.</h2><p class="body-copy">개화 상태와 재배 환경, 관리 일정에 따라 확인할 사항이 달라집니다. 정해진 수량을 바로 계산하기보다, 농장의 상황을 함께 알려주세요.</p><p class="body-copy">이곳의 안내는 상담을 준비하는 공통 정보입니다. 제품 동봉 안내와 현재 상담 내용을 우선 확인하고, 정확한 사용 기준은 현장 조건에 맞춰 상담해 주세요.</p></div><aside class="info-panel"><h3>처음 상담에 필요한 정보</h3>${list(['작물명과 재배 지역', '재배 면적과 단위', '시설·노지 여부', '개화 상황 또는 희망 투입일', '희망 수량과 필요한 서류'])}<p>모든 항목을 몰라도 괜찮습니다.<br>알고 계신 내용부터 알려주세요.</p></aside></section>${callToAction('찾는 작물이 없나요?', '작물명과 재배 환경을 알려주시면 사용 가능 여부부터 상담할 수 있습니다.')}`;
}

function cropDetailPage(crop) {
  const related = crop.story ? stories.find(story => story.id === crop.story) : null;
  return `${breadcrumbs(crop.name, { href: 'crops.html', name: '작물별 사용법' })}${heading(`CROP GUIDE / ${crop.english}`, `${crop.name},<br>${crop.intro}`, crop.summary)}
    <section class="split-layout crop-detail page-section" aria-labelledby="crop-environment-title"><div>${photo(images[crop.id], `${crop.name} 작물 일러스트`, '작물의 모습을 표현한 식물 일러스트입니다.')}</div><div><span class="tag">${crop.environment}</span><h2 id="crop-environment-title" class="section-title">환경을 살피고,<br>일정을 준비하세요.</h2><p class="body-copy">${crop.context}</p><div class="button-row">${consult(crop.id, `${crop.name} 사용 상담`)}${order()}</div></div></section>
    <section class="split-layout page-section" aria-labelledby="crop-timing-title"><div><p class="section-kicker">BEFORE YOU START</p><h2 id="crop-timing-title" class="section-title">투입 시기는<br>꽃과 일정부터.</h2><p class="body-copy">현재 개화 상황과 앞으로의 농장 작업 일정을 함께 살펴보세요. 희망 투입일이 있다면 주문 전에 공급 가능 여부와 준비 사항을 확인하는 것이 좋습니다.</p><p class="body-copy">작물과 환경에 따라 조건이 달라질 수 있으므로 날짜나 면적만으로 사용량과 시기를 결정하지 않습니다.</p></div><aside class="info-panel"><h3>${crop.name} 상담에서 함께 확인할 내용</h3>${list(crop.checks)}</aside></section>
    <section class="page-section" aria-labelledby="crop-first-title"><p class="section-kicker">THE FIRST DAY</p><h2 id="crop-first-title" class="section-title">벌이 도착했다면,<br>이 순서로 확인하세요.</h2>${steps([
      { title: '도착 상태와 안정화', copy: '포장과 벌통에 손상이 없는지 확인하고, 설치 장소에서 제품 안내에 따라 안정화합니다.' },
      { title: '설치 위치 확인', copy: '직사광선과 습기를 피하고 안정적인 받침대를 사용합니다. 정확한 위치는 농장 환경과 동봉 안내를 함께 확인하세요.' },
      { title: '먹이 연결 확인', copy: '당액통과 필터 연결을 동봉 설명서에 따라 확인합니다. 임의로 내용물을 바꾸기 전에 문의해 주세요.' },
      { title: '출입구와 비행 경로', copy: '출입문 개방 방법을 확인하고, 출입구 앞의 비행 경로가 막히지 않도록 주변을 살펴봅니다.' },
      { title: '농장 환경 점검', copy: '꽃과 하우스 환경, 예정된 방제 작업을 함께 확인합니다. 사용 농약의 제품명과 일정을 준비해 상담하세요.' },
    ])}<div class="section-bottom-link">${external(sources.arrival, '공식 블로그의 도착 후 체크리스트')}</div></section>
    <section class="split-layout page-section" aria-labelledby="crop-activity-title"><div><p class="section-kicker">WATCH THE LITTLE WINGS</p><h2 id="crop-activity-title" class="section-title">활동은 현장과 함께<br>살펴보세요.</h2><p class="body-copy">${crop.observe}</p><a class="text-link" href="faq.html#activity">활동과 관리 질문 보기 <span aria-hidden="true">↗</span></a></div><aside class="info-panel environment-panel"><h3>농장 작업도 함께 알려주세요</h3><p>농약을 사용할 예정이라면 정확한 제품명과 작업 일정을 준비해 주세요. 농약의 표시사항과 관련 기준을 확인하고, 벌통을 다루는 방법은 사용 조건을 확인한 뒤 상담하세요.</p><p>온도·환기·날씨 등 환경이 달라졌을 때도 꽃과 벌의 상태를 함께 살펴보는 것이 좋습니다.</p></aside></section>
    ${related ? `<section class="page-section story-related" aria-labelledby="crop-story-title"><p class="section-kicker">FROM THE FARM</p><h2 id="crop-story-title" class="section-title">함께한 농가의 기록.</h2><article class="info-panel"><span class="tag">${related.tag}</span><h3>${related.title}</h3><p>${related.summary}</p><a class="text-link" href="stories.html?story=${related.id}">이야기 읽기 <span aria-hidden="true">↗</span></a></article></section>` : ''}
    <div class="guide-source-note"><p>공식 작물 안내 게시일 ${crop.sourceDate} · 홈페이지 정리일 2026.10.14</p>${external(crop.source, `${crop.name} 공식 사용 안내 원문`)}<p>특정 수량·투입 시기·농약 사용 기준은 현장 조건과 현재 제품 안내를 확인한 뒤 상담해 주세요.</p></div>${callToAction(`${crop.name} 농장에 맞게,<br>함께 준비해요.`, '작물·지역·면적·재배 환경과 희망 투입일을 알려주세요. 알고 계신 내용부터 상담을 준비할 수 있습니다.', crop.id)}`;
}

function storiesPage() {
  return `${breadcrumbs('농가 이야기')}${heading('PEOPLE, FLOWERS & FARMS', '작은 비행이 이어온<br>사람과 농가의 이야기.', '생산자의 글, 농가의 현장 기록, 처음 사용하는 날의 안내.<br class="desktop-break"> 자연수정벌의 공식 채널에서 이어온 이야기를 만나보세요.')}
    <section class="page-section" aria-label="자연수정벌 이야기">${storyCards()}<p class="image-note">공식 채널에 공개된 사진과 기록을 소개합니다. 전체 글과 현장 영상은 각 원문에서 확인할 수 있습니다.</p></section>
    <section class="split-layout page-section info-panel" aria-labelledby="stories-more-title"><div><p class="section-kicker">ON OUR CHANNELS</p><h2 id="stories-more-title" class="section-title">오늘의 꽃과 현장은<br>공식 채널에서.</h2><p class="body-copy">꽃가루를 채집하는 벌, 출고와 농가 방문의 모습은 인스타그램에 담고 있습니다. 상세한 사용 안내와 생산자의 기록은 블로그에서 이어집니다.</p></div><div class="button-row">${external(sources.instagram, '인스타그램 보기', 'btn btn-primary', 'instagram')}${external(sources.blog, '공식 블로그 읽기', 'btn btn-outline', 'blog')}</div></section>${callToAction()}`;
}

function storyDetailPage(story) {
  return `${breadcrumbs(story.title, { href: 'stories.html', name: '농가 이야기' })}<header class="page-heading story-heading"><p class="section-kicker">${story.tag}</p><h1>${story.title}</h1><div class="story-meta"><time datetime="${story.date.replaceAll('.', '-')}">${story.date}</time><span>자연수정벌 공식 블로그</span></div><p class="body-copy">${story.summary}</p></header>
    <article class="story-article page-section">${photo(story.image, story.alt, story.imageCaption)}<div class="article-body">${story.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('')}<div class="article-source info-panel"><p class="section-kicker">ORIGINAL STORY</p><h2>생산자가 전하는 원문으로 이어집니다.</h2><p>이 페이지는 공식 블로그에 공개된 기록을 소개합니다. 전체 글과 현장 사진·영상은 원문에서 읽을 수 있습니다.</p>${external(story.source, '공식 블로그 원문 읽기')}</div><a class="text-link" href="${story.related.href}">${story.related.text} <span aria-hidden="true">↗</span></a></div></article>
    <section class="page-section"><div class="section-heading"><p class="section-kicker">MORE STORIES</p><h2 class="section-title">다음 이야기.</h2></div><div class="editorial-grid story-grid">${stories.filter(item => item.id !== story.id).map(item => `<article class="story-card"><div class="story-card-copy"><span class="tag">${item.tag}</span><h3><a href="stories.html?story=${item.id}">${item.title}</a></h3><p>${item.summary}</p><a class="text-link" href="stories.html?story=${item.id}">이야기 읽기 <span aria-hidden="true">↗</span></a></div></article>`).join('')}</div></section>${callToAction()}`;
}

function faqPage() {
  return `${breadcrumbs('자주 묻는 질문')}${heading('HERE TO HELP', '처음 만나는 수정벌,<br>함께 알아가요.', '도착과 설치, 활동과 관리, 주문과 배송.<br class="desktop-break"> 사용 전후에 궁금한 내용을 차근차근 확인해 보세요.')}
    <section class="page-section faq-section" aria-label="자주 묻는 질문 목록"><div class="faq-intro"><p>제품에 동봉된 사용 안내를 우선 확인해 주세요.<br>현장 상태가 궁금하다면 사진과 함께 상담할 수 있습니다.</p><a class="text-link" href="contact.html">상담 준비하기 <span aria-hidden="true">↗</span></a></div>${faqItems()}</section>
    <section class="split-layout page-section info-panel" aria-labelledby="faq-source-title"><div><p class="section-kicker">THE FIRST CHECKLIST</p><h2 id="faq-source-title" class="section-title">도착한 날,<br>함께 확인해 주세요.</h2><p class="body-copy">설치와 먹이 연결, 출입구와 주변 환경을 확인하는 자세한 내용은 공식 블로그의 체크리스트에서 읽을 수 있습니다.</p></div><div>${external(sources.arrival, '도착 후 체크리스트 원문', 'btn btn-outline')}</div></section>${callToAction('아직 궁금한 점이 있나요?', '작물과 사용 환경, 벌통과 꽃의 상태를 알려주세요. 현장 사진이 있으면 상담을 준비하는 데 도움이 됩니다.')}`;
}

function contactPage(params) {
  const selectedCrop = crops.find(crop => crop.id === params.get('crop'));
  return `${breadcrumbs('소식·문의')}${heading('LET’S GROW TOGETHER', '우리 농장의 이야기를<br>들려주세요.', '작물과 수량, 투입 일정이 고민이라면<br class="desktop-break"> 알고 계신 재배 조건부터 상담을 준비해 보세요.')}
    <section class="contact-layout page-section" aria-labelledby="consultation-title"><div class="contact-aside"><p class="section-kicker">FOR YOUR FARM</p><h2 id="consultation-title" class="section-title">상담에 필요한 내용을<br>한번에 정리해요.</h2><p class="body-copy">모르는 항목은 비워두어도 괜찮습니다. 작물과 농장 조건을 적어두면 구매 전 상담을 시작하기 편합니다.</p><div class="info-panel"><h3>일반 농가 · 작목반 · 기관</h3><p>처음 사용, 재구매, 여러 농가의 공급 일정과 단체 주문에 필요한 서류까지 함께 문의할 수 있습니다.</p>${external(sources.talk, '네이버 톡톡 상담 열기', 'text-link', 'talk')}</div><p class="small-note">작성한 내용은 이 화면에서만 정리됩니다. 아래 버튼으로 상담 내용을 준비한 후, 복사하여 상담 채널에 직접 보내주세요.</p></div>
    <form class="consultation-form" data-consultation-form aria-describedby="consultation-help"><div class="form-grid"><div class="form-field"><label for="consultation-crop">작물</label><select id="consultation-crop" name="crop"><option value="">작물을 선택하세요</option>${crops.map(crop => `<option value="${crop.name}"${selectedCrop?.id === crop.id ? ' selected' : ''}>${crop.name}</option>`).join('')}<option value="기타 작물">기타 작물</option></select></div><div class="form-field"><label for="consultation-region">재배 지역</label><input id="consultation-region" name="region" type="text" autocomplete="address-level1" placeholder="예: 경북 청송"></div><div class="form-field"><label for="consultation-area">재배 면적</label><input id="consultation-area" name="area" type="number" min="0" step="any" inputmode="decimal" placeholder="면적을 입력하세요"></div><div class="form-field"><label for="consultation-unit">면적 단위</label><select id="consultation-unit" name="unit"><option value="">단위를 선택하세요</option><option value="㎡">㎡</option><option value="평">평</option><option value="ha">ha</option><option value="동">하우스 동</option><option value="기타">기타</option></select></div><fieldset class="form-field form-field-full"><legend>재배 환경</legend><div class="radio-row"><label><input type="radio" name="environment" value="시설">시설</label><label><input type="radio" name="environment" value="노지">노지</label><label><input type="radio" name="environment" value="기타·상담 필요">기타·상담 필요</label></div></fieldset><div class="form-field"><label for="consultation-date">희망 투입일</label><input id="consultation-date" name="date" type="date"><span class="field-hint">미정이면 비워두세요.</span></div><div class="form-field"><label for="consultation-quantity">희망 수량</label><input id="consultation-quantity" name="quantity" type="text" placeholder="예: 수량 상담 필요"></div><div class="form-field form-field-full"><label for="consultation-documents">필요한 서류</label><input id="consultation-documents" name="documents" type="text" placeholder="단체·기관 주문에 필요한 서류가 있으면 알려주세요"></div><div class="form-field form-field-full"><label for="consultation-note">함께 전할 내용</label><textarea id="consultation-note" name="note" rows="5" placeholder="개화 상태, 재배 품종, 방제 예정일, 궁금한 점 등을 적어주세요."></textarea></div></div><p id="consultation-help" class="small-note">상담 내용은 자동 전송되지 않습니다. 연락처 등 개인정보를 입력할 필요가 없습니다.</p><button class="btn btn-primary" type="submit">상담 내용 정리하기 <span aria-hidden="true">↗</span></button><div class="consultation-summary" data-consultation-summary role="status" aria-live="polite" hidden></div></form></section>
    <section class="page-section" aria-labelledby="contact-news-title"><div class="section-heading"><p class="section-kicker">FROM OUR CHANNELS</p><h2 id="contact-news-title" class="section-title">소식과 안내를<br>한곳에서 만나세요.</h2></div>${storyCards()}<p class="image-note">실제 현장 사진과 영상은 각 공식 원문에서 확인할 수 있습니다.</p></section>
    <section class="page-section info-panel channel-panel"><h2 class="section-title">더 가까운 상담과 소식.</h2><div class="button-row">${external(sources.talk, '네이버 톡톡', 'btn btn-primary', 'talk')}${external(sources.blog, '공식 블로그', 'btn btn-outline', 'blog')}${external(sources.instagram, '인스타그램', 'btn btn-outline', 'instagram')}</div></section>`;
}

/** Populate the shared site shell. Returns page metadata for its caller. */
export function renderPage(requestedPage) {
  const page = String(requestedPage || '').replace(/\.html$/, '').replace(/^\//, '');
  const params = new URLSearchParams(window.location.search);
  const root = document.getElementById('page-content');
  if (!root) return null;
  let markup, title, description;
  if (page === 'about') {
    markup = aboutPage(); title = '자연수정벌 소개'; description = '경북 청송에서 이어온 자연수정벌의 생산·공급 이야기와 공식 채널을 소개합니다.';
  } else if (page === 'products') {
    markup = productsPage(); title = '수정벌 제품·주문 안내'; description = '고품질 뒤영벌, 통 당 130마리 내외. 자연수정벌 제품과 작물별 사용 상담, 주문과 도착 후 확인 사항을 안내합니다.';
  } else if (page === 'crops') {
    const crop = crops.find(item => item.id === params.get('crop'));
    markup = crop ? cropDetailPage(crop) : cropsPage(); title = crop ? `${crop.name} 수정벌 사용 안내` : '작물별 수정벌 사용법'; description = crop ? `${crop.name} 농가의 수정벌 사용 상담을 위한 재배 조건과 도착·관리 확인 사항.` : '토마토, 딸기, 블루베리, 참외, 과수의 수정벌 사용 상담을 준비해 보세요.';
  } else if (page === 'stories') {
    const story = stories.find(item => item.id === params.get('story'));
    markup = story ? storyDetailPage(story) : storiesPage(); title = story ? story.title : '생산자와 농가의 이야기'; description = story ? story.summary : '자연수정벌 공식 채널의 생산자 이야기, 토마토 농가 기록, 도착 후 체크리스트.';
  } else if (page === 'faq') {
    markup = faqPage(); title = '수정벌 자주 묻는 질문'; description = '수정벌 도착, 설치, 활동, 먹이, 농약, 교체와 배송에 관한 자주 묻는 질문.';
  } else {
    markup = contactPage(params); title = '작물·수량 상담과 소식'; description = '작물, 면적, 환경과 희망 투입일을 정리해 자연수정벌 상담을 준비하세요.';
  }
  root.innerHTML = `<div class="site-container supporting-page" data-page-kind="${escape(page)}">${markup}</div>`;
  document.title = `${title} | 자연수정벌`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = description;
  const hashId = window.location.hash.slice(1);
  const requestedQuestion = faqs.find(item => item.id === hashId);
  if (requestedQuestion && page === 'faq') {
    const detail = document.getElementById(requestedQuestion.id);
    if (detail) detail.open = true;
  }
  return { page, title, description };
}
