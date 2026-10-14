// 퀴즈 데이터 (PRD 4.1 스키마). file:// 에서도 동작하도록 JSON 대신 전역 상수로 번들.
window.QUESTIONS = [
  // 모드 1: 인물 이름 맞추기
  {
    id: 1, type: "PERSON",
    question: "물맷돌 하나로 블레셋의 거인 장수를 쓰러뜨린 이스라엘의 왕은 누구일까요?",
    image: "assets/david_goliath.svg",
    answer: "다윗", options: ["다윗", "솔로몬", "사울", "삼손"],
    hint: "이새의 막내아들, 양을 치던 목동"
  },
  {
    id: 2, type: "PERSON",
    question: "하나님의 명령으로 방주를 지어 홍수에서 가족과 동물들을 구한 사람은?",
    image: "assets/noah_ark.svg",
    answer: "노아", options: ["노아", "아브라함", "모세", "요셉"],
    hint: "비가 그친 뒤 비둘기를 날려 보냈어요"
  },
  {
    id: 3, type: "PERSON",
    question: "지팡이를 들어 홍해를 가르고 이스라엘 백성을 이끈 지도자는?",
    image: "assets/moses_sea.svg",
    answer: "모세", options: ["모세", "여호수아", "엘리야", "아론"],
    hint: "갈대 상자에 담겨 나일강에 띄워졌던 아기"
  },
  {
    id: 4, type: "PERSON",
    question: "니느웨로 가라는 명령을 피해 도망치다 큰 물고기 뱃속에서 사흘을 보낸 선지자는?",
    image: "assets/jonah_fish.svg",
    answer: "요나", options: ["요나", "베드로", "바울", "다니엘"],
    hint: "다시스로 가는 배를 탔어요"
  },
  {
    id: 5, type: "PERSON",
    question: "하루 세 번 기도하다 사자굴에 던져졌지만 무사히 살아 나온 사람은?",
    image: "assets/daniel_lions.svg",
    answer: "다니엘", options: ["다니엘", "요셉", "다윗", "엘리야"],
    hint: "바벨론 포로로 끌려간 유다의 소년"
  },

  // 모드 2: 초성 퀴즈
  {
    id: 6, type: "INITIAL",
    question: "믿음의 조상, 100세에 아들 이삭을 얻은 사람",
    initial: "ㅇㅂㄹㅎ", answer: "아브라함",
    hint: "원래 이름은 아브람"
  },
  {
    id: 7, type: "INITIAL",
    question: "채색옷을 입었고, 형들에게 팔려갔다가 애굽의 총리가 된 사람",
    initial: "ㅇㅅ", answer: "요셉",
    hint: "야곱이 가장 사랑한 아들"
  },
  {
    id: 8, type: "INITIAL",
    question: "머리카락에 힘의 비밀이 숨겨져 있던 사사",
    initial: "ㅅㅅ", answer: "삼손",
    hint: "들릴라에게 비밀을 털어놓았어요"
  },
  {
    id: 9, type: "INITIAL",
    question: "갈릴리의 어부 출신, 예수님의 수제자",
    initial: "ㅂㄷㄹ", answer: "베드로",
    hint: "원래 이름은 시몬"
  },
  {
    id: 10, type: "INITIAL",
    question: "갈멜산에서 바알 선지자 450명과 대결한 선지자",
    initial: "ㅇㄹㅇ", answer: "엘리야",
    hint: "불 수레를 타고 하늘로 올라갔어요"
  },

  // 모드 3: 빈칸 채우기 (1문장 1빈칸)
  {
    id: 11, type: "BLANK",
    verseTemplate: "태초에 하나님이 [ ]를 창조하시니라 (창 1:1)",
    answer: "천지", options: ["천지", "인간", "에덴", "만물"],
    hint: "하늘과 땅"
  },
  {
    id: 12, type: "BLANK",
    verseTemplate: "여호와는 나의 [ ]시니 내게 부족함이 없으리로다 (시 23:1)",
    answer: "목자", options: ["목자", "반석", "왕", "방패"],
    hint: "양을 돌보는 사람"
  },
  {
    id: 13, type: "BLANK",
    verseTemplate: "하나님이 세상을 이처럼 [ ]하사 독생자를 주셨으니 (요 3:16)",
    answer: "사랑", options: ["사랑", "축복", "긍휼", "용서"],
    hint: "고린도전서 13장의 주제"
  },
  {
    id: 14, type: "BLANK",
    verseTemplate: "그러므로 [ ] 일을 위하여 염려하지 말라 (마 6:34)",
    answer: "내일", options: ["내일", "오늘", "세상", "먹을"],
    hint: "오늘의 다음 날"
  },
  {
    id: 15, type: "BLANK",
    verseTemplate: "항상 [ ]하라 쉬지 말고 기도하라 범사에 감사하라 (살전 5:16-18)",
    answer: "기뻐", options: ["기뻐", "찬양", "감사", "전도"],
    hint: "슬퍼의 반대"
  }
];
