# 공새로 영업 CRM 기획을 위한 B2B CRM 사례 분석

> 작성일: 2026-11-11 · 목적: 공새로팀 영업 CRM 페이지 기획 레퍼런스
> 근거 표기: **[확인]** 공개 자료로 확인한 내용 · **[미확인]** 공개 자료로 확인하지 못한 내용 · **[제안]** 공새로 적용 제안

---

## 0. 먼저 짚을 점: 아모레퍼시픽 사례는 B2C, 공새로는 B2B

질문의 아모레퍼시픽 사례(홈페이지 가입 → 성별·나이·취향 → 오프라인 매장 구매 이력 → 개인화 추천)는 **B2C 고객 여정 통합(CDP)** 모델이다.

- **[확인]** 아모레퍼시픽이 삼성SDS·LG화학과 함께 세일즈포스를 택했다는 보도는 있다.
- **[미확인]** 구체적인 도입 범위, 연동 시스템, 구축 비용("수억 원"), 전환율 개선 수치는 공개 자료로 확인하지 못했다. 영업 자료의 수치를 그대로 기획서에 인용하면 안 된다.

B2B, 특히 건설 조달 CRM은 분석 단위가 다르다.

| 구분 | B2C (아모레퍼시픽형) | B2B 건설 조달 (공새로형) |
|---|---|---|
| 분석 단위 | 개인 1명 | **회사(Account) → 현장(Project) → 담당자 여러 명** |
| 핵심 속성 | 성별, 나이, 취향 | 시공 능력, 현장 규모, **공정 단계**, 결제 조건, 신용 |
| 구매 결정 | 개인 충동·취향 | 소장·공무·자재담당·본사 구매팀 **복수 결재** |
| 구매 주기 | 불규칙 | **공정표에 따라 예측 가능** (골조 → 마감 → 설비) |
| 개인화 추천 근거 | 비슷한 사람이 산 상품 | **같은 공정 단계의 다른 현장이 다음에 산 자재** |
| 가장 큰 데이터 자산 | 행동 로그 | **견적·발주·단가 거래 이력** |

결론: "개인 360° 뷰"가 아니라 **"현장 360° 뷰 + 공정 기반 다음 수요 예측"**이 공새로 CRM의 핵심이다.

---

## 1. 실제 B2B CRM 사례 분석

### 1-1. Schneider Electric — 흩어진 수백 개 시스템을 단일 고객 뷰로 통합

- **[확인] 문제**: 잦은 인수합병으로 수백 개의 분산 시스템, 낮은 CRM 사용률.
- **[확인] 조치**: 모든 고객 데이터를 하나의 플랫폼으로 통합해 글로벌 영업팀에 고객별 360° 뷰 제공. 이후 AI로 가장 유망한 기회에 영업을 집중시킴.
- **[확인] 성과**: 솔루션 영업 매출 비중 약 10% → 40% 이상, 고객 만족도 개선 (벤더 발표 수치).
- **시사점**: 성과는 AI보다 **"데이터를 한 곳에 모으고 영업이 실제로 쓰게 만든 것"**에서 먼저 나왔다.

### 1-2. L&T Electrical & Automation (Schneider 인도 자회사) — 영업 자동화 수치

- **[확인] 성과**: 영업 자동화로 129시간 이상 절감, CRM에서 수행한 영업 활동량 4배, **경쟁 단가 산출 시간 90% 이상 단축**, 케이스 해결 시간 26% 단축.
- **시사점**: B2B에서 체감 효과가 큰 것은 **견적·단가 산출 자동화**다. 공새로의 "단가 검증" 기능과 직결된다.

### 1-3. CEMEX Go — 건자재 기업의 B2B 디지털 주문 플랫폼 (공새로와 가장 유사)

- **[확인]** 출시 첫해 18개국 2만 고객 확보.
- **[확인]** 2020년 기준 글로벌 매출의 61%를 플랫폼으로 처리(주력 제품 주문 기준 약 53%). 이후 발표에서 반복 구매 고객의 96%가 사용. 발표마다 지표 정의가 달라 수치를 섞어 쓰면 안 된다.
- **시사점**: 주문·배송 추적·인보이스가 한 플랫폼에서 일어나면 **거래 데이터 자체가 CRM 데이터**가 된다. 공새로는 이미 견적·발주 흐름을 갖고 있으므로 별도 대형 CRM 없이도 거래 데이터 기반 CRM을 만들 수 있다.

### 1-4. LafargeHolcim — 건자재 단가 체계화

- **[확인]** Sales Cloud + Salesforce CPQ + Einstein Analytics로 구조화된 가격 정책 수립.
- **시사점**: 건자재 B2B CRM의 1순위 과제는 **"현장별·물량별·지역별로 단가가 제각각인 문제"**다. 단가 이상치 탐지를 CRM 화면에 넣어야 하는 근거.

### 1-5. 산업기계 제조사 (diconium 파트너 사례)

- **[확인]** Sales Cloud + Data Cloud + Einstein AI. 고객·제품 데이터를 통합해 **구매 이력과 실시간 가격을 한 화면**에서 확인.
- **주의**: 파트너사가 발표한 사례로 세일즈포스 공식 사례가 아니다.

### 1-6. 건자재 유통사 (Korcomptenz 파트너 사례)

- **[확인]** 17개 브랜드를 가진 건자재 유통사의 Sales/Service Cloud 재구축. 다른 건자재 유통 사례에서는 수작업 최대 50% 자동화.
- **시사점**: 브랜드·공급사가 많은 유통 구조에서 **공급사 단위 마스터 데이터 정리**가 선행 조건이다.

### 1-7. Ferguson — 미국 최대 배관자재 유통사

- **[확인]** 2021년 세일즈포스 도입 발표.
- **[미확인]** 도입 후 구체적 성과 수치는 공개 자료에서 찾지 못했다.

### 1-8. GC녹십자웰빙 — 국내 B2B 영업 조직, 공공데이터 연동

- **[확인]** 2025년 Sales Cloud 도입. 실적 보고 자동화, **거래처 정보의 회사 자산화**, 심평원·행안부 데이터 연동으로 전국 병의원 현황 관리.
- **[확인]** 도입 1년 만에 월 활성 사용자 비율 95% (목표 90%).
- **시사점**: 국내 사례 중 공새로에 가장 바로 옮길 수 있는 패턴. 병의원 공공데이터 → **건축 인허가·착공 공공데이터**로 바꾸면 "아직 공새로를 안 쓰는 신규 현장" 목록을 자동으로 만들 수 있다.

### 1-9. 국내 기타

- **[확인]** 한샘(인테리어·가구), 두산에너빌리티(AI CRM 수주 역량), LG화학(온·오프라인 채널) 사례 페이지가 존재한다.
- **[미확인]** LX하우시스, KCC, 쌍용C&E, 한일시멘트 등 국내 건자재사의 세일즈포스 도입 사례는 찾지 못했다. 국내 건자재 업계는 아직 CRM 고도화 초기 단계로 보이며, 이것이 공새로의 기회다.

---

## 2. 사례에서 뽑은 공통 패턴 6가지

| # | 패턴 | 근거 사례 | 공새로 적용 [제안] |
|---|---|---|---|
| 1 | 고객 데이터 단일화가 먼저, AI는 그다음 | Schneider | 사업자등록번호를 Account 고유 키로 사용해 중복 제거 |
| 2 | 단가·견적 자동화가 가장 큰 체감 효과 | L&T, LafargeHolcim | 견적 비교 시 시세 대비 단가 편차를 자동 표시 |
| 3 | 거래 플랫폼 = CRM 데이터 원천 | CEMEX Go | 견적·발주·납품 이벤트를 CRM 타임라인에 자동 적재 |
| 4 | 외부 공공데이터로 잠재 고객 모수 확보 | GC녹십자웰빙 | 착공 신고·인허가 데이터로 신규 현장 리드 생성 |
| 5 | 사용률(MAU)이 성패를 결정 | Schneider, GC녹십자웰빙 | 영업사원 입력 최소화, 자동 기록 우선 |
| 6 | 마스터 데이터 정리가 선행 조건 | 건자재 유통사 | 자재 품목 코드·규격 표준화 |

---

## 3. 공새로 영업 CRM 페이지 설계안 [제안]

### 3-1. 데이터 모델 (B2B 계층 구조)

```typescript
// 건설사 (B2B Account) — 사업자등록번호를 고유 키로 사용
interface ConstructionCompany {
  readonly businessRegNo: string;
  readonly name: string;
  readonly contractorGrade: string | null; // 시공능력평가 등급
  readonly paymentTermsDays: number;
  readonly creditRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

// 현장 (Project) — CRM 분석의 핵심 단위
type ConstructionPhase = 'EARTHWORK' | 'FRAME' | 'FINISHING' | 'MEP' | 'COMPLETION';

interface ConstructionSite {
  readonly siteId: string;
  readonly companyBusinessRegNo: string;
  readonly region: string;
  readonly grossFloorAreaM2: number;
  readonly currentPhase: ConstructionPhase;
  readonly startDate: string; // ISO 8601
  readonly expectedEndDate: string;
}

// 현장 담당자 (구매 결정 참여자)
type DecisionRole = 'SITE_MANAGER' | 'ENGINEER' | 'PROCUREMENT' | 'HQ_PURCHASING';

interface SiteContact {
  readonly contactId: string;
  readonly siteId: string;
  readonly role: DecisionRole;
  readonly consentToMarketing: boolean; // 개인정보 수집·이용 동의 여부
}

// 거래 이벤트 — 견적/발주/납품이 타임라인을 구성
type DealEventType = 'RFQ' | 'QUOTE' | 'ORDER' | 'DELIVERY' | 'CLAIM';

interface DealEvent {
  readonly eventId: string;
  readonly siteId: string;
  readonly type: DealEventType;
  readonly materialCode: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly occurredAt: string;
}
```

### 3-2. 화면 구성

1. **현장 360° 뷰** (아모레 "고객 360°"의 B2B 버전)
   - 상단: 건설사 정보, 현장 규모, 현재 공정 단계, 담당자 결재 라인
   - 중앙: 견적 → 발주 → 납품 → 클레임 타임라인
   - 우측: 누적 거래액, 견적 대비 발주 전환율, 평균 결제일
2. **다음 수요 예측 패널** — "골조 공정 현장 80%가 4주 내 단열재·창호를 발주했다" 같은 공정 기반 추천
3. **단가 인사이트** — 품목별 시세 대비 편차, 이상 단가 알림 (단가 검증·이상거래 탐지 에이전트와 연동)
4. **이탈 위험 알림** — 견적 요청은 오는데 발주가 줄어든 현장, 결제 지연 증가 현장
5. **신규 현장 리드** — 공공데이터 기반 착공 예정 현장 중 미거래 현장 목록
6. **영업 파이프라인** — 리드 → 첫 견적 → 첫 발주 → 반복 발주 단계별 전환율

### 3-3. 핵심 지표

| 지표 | 정의 |
|---|---|
| 견적→발주 전환율 | 발주 건수 / 견적 제출 건수 (현장·품목별) |
| 현장 침투율 | 공새로로 발주한 공정 수 / 전체 공정 수 |
| 반복 발주율 | 2회 이상 발주한 현장 비율 |
| 현장당 거래액 | 현장별 누적 발주액 |
| 단가 편차율 | (발주 단가 − 기준 시세) / 기준 시세 |

---

## 4. 에러 가능성·리스크 분석

| 리스크 | 내용 | 대응 |
|---|---|---|
| 개인정보보호법 | 현장 담당자 연락처·행동 데이터를 마케팅에 쓰려면 수집·이용 동의 필요 | `consentToMarketing` 필드로 동의 여부 관리, 미동의자는 추천·발송에서 제외 |
| 데이터 식별 오류 | 같은 건설사가 법인명 표기 차이로 중복 생성 | 사업자등록번호를 고유 키로 사용, 현장은 주소+착공일로 정규화 |
| 공정 단계 오류 | 공정을 수동으로 입력하면 금방 낡은 정보가 됨 | 발주 품목으로 공정을 추정해 자동 갱신 (예: 철근·레미콘 → 골조) |
| 냉시작 | 거래 이력이 적은 신규 현장은 추천 정확도가 낮음 | 초기에는 규칙 기반(공정별 표준 자재표)으로 시작 후 데이터 축적 시 모델 전환 |
| 벤더 수치 과신 | 사례 수치는 대부분 벤더 발표 자료 | 기획서에 인용할 때 출처와 지표 정의를 함께 표기 |
| 낮은 사용률 | 영업사원이 입력하지 않으면 CRM은 실패 | 거래 이벤트 자동 적재, 수동 입력은 메모·통화 기록 정도로 최소화 |

---

## 5. 도입 방식 비교: 세일즈포스 vs 자체 구축

| 항목 | 세일즈포스 (Sales Cloud + Data Cloud) | 공새로 자체 구축 |
|---|---|---|
| 초기 속도 | 빠름 (표준 기능) | 느림 |
| 비용 | 사용자 수 × 라이선스, Data Cloud는 데이터량에 따라 추가 비용 | 개발 인력 비용 |
| 건설 공정 특화 | 커스터마이징 필요 | 처음부터 맞춤 설계 가능 |
| 거래 데이터 연동 | API 연동 개발 필요 | 이미 공새로 DB에 있음 |
| 차별화 | 경쟁사도 같은 도구 사용 가능 | **공정 기반 추천·단가 검증 자체가 해자** |

**권장 [제안]**: 공새로는 CEMEX Go처럼 거래 플랫폼을 이미 가진 구조이므로, **거래 데이터 위에 자체 CRM 화면을 얹는 방식**이 맞다. 영업팀이 10명 이상으로 커지고 파이프라인 관리가 복잡해지면 그때 Sales Cloud 연동을 검토한다.

### 단계별 로드맵

| 단계 | 기간 | 범위 |
|---|---|---|
| 1단계 | 1~2개월 | 건설사·현장·담당자 마스터 정리, 현장 360° 타임라인 |
| 2단계 | 3~4개월 | 견적→발주 전환율 대시보드, 단가 편차 알림 |
| 3단계 | 5~6개월 | 공정 기반 다음 수요 추천 (규칙 기반), 이탈 위험 알림 |
| 4단계 | 7개월~ | 공공데이터 신규 현장 리드, ML 기반 추천 전환 |

---

## 출처

- [inews24 — "고객데이터 확보해야 진정한 DX"…'삼성SDS·아모레·LG화학' 세일즈포스 택했다](https://www.inews24.com/view/1411735)
- [Salesforce — Schneider Electric harness powerful customer insights](https://www.salesforce.com/uk/resources/customer-stories/schneider-electric-harness-powerful-customer-insights/)
- [CasesStudies.com — Schneider Electric uses Salesforce to power its customer experience](https://www.casestudies.com/company/salesforce/case-study/schneider-electric-uses-salesforce-to-power-its-customer-experience)
- [Salesforce — L&T Electrical & Automation customer story](https://www.salesforce.com/in/resources/customer-stories/l-t-electrical-automation/)
- [Business Wire — CEMEX Go reaches 20K customers in 18 countries](https://www.businesswire.com/news/home/20181106005323/en/)
- [Aggregates Business — Six out of ten regular customers use CEMEX Go](https://www.aggbusiness.com/daily-news/six-out-ten-regular-customers-use-cemex-go-platform)
- [Aggregate Research — Cemex completes worldwide deployment of Cemex Go](https://www.aggregateresearch.com/news/cemex-completes-worldwide-deployment-of-cemex-go/)
- [Salesforce EU Blog — Building materials companies digital trends (LafargeHolcim)](https://www.salesforce.com/eu/blog/building-materials-companies-digital-trends/)
- [diconium — Industrial machinery manufacturer success story](https://diconium.com/en/success-stories/a-leading-machine-builder)
- [Korcomptenz — Case Study: Construction Distribution](https://www.korcomptenz.com/?p=104024)
- [Salesforce News — Ferguson selects Salesforce](https://www.salesforce.com/news/?p=44390)
- [Salesforce Korea — 고객 사례 목록 (GC녹십자웰빙, 한샘, 두산에너빌리티)](https://www.salesforce.com/kr/customer-stories/greencrosswb/)
- [Salesforce Korea — 국내기업의 세일즈포스 도입사례집](https://www.salesforce.com/content/dam/web/ko_kr/www/images/DynamicEngine/PDF/%EA%B5%AD%EB%82%B4%EA%B8%B0%EC%97%85%EC%9D%98_%EC%84%B8%EC%9D%BC%EC%A6%88%ED%8F%AC%EC%8A%A4_%EB%8F%84%EC%9E%85%EC%82%AC%EB%A1%80%EC%A7%91.pdf)
