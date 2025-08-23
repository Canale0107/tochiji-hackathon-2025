import { Post, Event } from "./types";

export const samplePosts: Post[] = [
  {
    id: "1",
    content: "渋谷スクランブル交差点、今日は特別に美しい夕日が見えました！🌅",
    location: { lat: 35.6595, lng: 139.7004 },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2時間前
    author: "さくら",
    language: "ja",
    likes: 15,
    translatedContent: {
      en: "Beautiful sunset at Shibuya Scramble Crossing today! 🌅",
      zh: "今天在涩谷十字路口看到了特别美丽的夕阳！🌅",
      ko: "오늘 시부야 스크램블 교차로에서 특별히 아름다운 석양을 봤어요! 🌅",
    },
  },
  {
    id: "2",
    content:
      "Just discovered an amazing ramen shop near the station! The broth is incredible 🍜",
    location: { lat: 35.658, lng: 139.7016 },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4時間前
    author: "Alex",
    language: "en",
    likes: 8,
    translatedContent: {
      ja: "駅の近くで素晴らしいラーメン店を発見！スープが信じられないほど美味しい 🍜",
      zh: "在车站附近发现了一家很棒的拉面店！汤底令人难以置信 🍜",
      ko: "역 근처에서 놀라운 라멘 가게를 발견했어요! 국물이 믿을 수 없을 정도로 맛있어요 🍜",
    },
  },
  {
    id: "3",
    content: "在忠犬八公像前拍照，这里总是有很多游客 📸",
    location: { lat: 35.659, lng: 139.7 },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6時間前
    author: "李明",
    language: "zh",
    likes: 12,
    translatedContent: {
      ja: "忠犬ハチ公の像の前で写真撮影、ここはいつも観光客でいっぱい 📸",
      en: "Taking photos in front of Hachiko statue, there are always many tourists here 📸",
      ko: "충견 하치코 동상 앞에서 사진 촬영, 여기는 항상 관광객이 많아요 📸",
    },
  },
];

export const sampleEvents: Event[] = [
  {
    id: "1",
    title: "渋谷ポップアップアート展",
    description:
      "若手アーティストによる期間限定のアート展示。渋谷の街を彩る現代アートをお楽しみください。",
    location: { lat: 35.6585, lng: 139.7008 },
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明日から
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1週間後まで
    organizer: "渋谷アート協会",
    category: "exhibition",
    language: "ja",
    translatedTitle: {
      en: "Shibuya Pop-up Art Exhibition",
      zh: "涩谷快闪艺术展",
      ko: "시부야 팝업 아트 전시회",
    },
    translatedDescription: {
      en: "Limited-time art exhibition by young artists. Enjoy contemporary art that colors the streets of Shibuya.",
      zh: "年轻艺术家的限时艺术展览。享受为涩谷街道增色的当代艺术。",
      ko: "젊은 예술가들의 기간 한정 아트 전시회. 시부야 거리를 화려하게 하는 현대 예술을 즐겨보세요.",
    },
  },
  {
    id: "2",
    title: "Limited Edition Street Food Festival",
    description:
      "Experience the best street food from around the world, right here in Shibuya!",
    location: { lat: 35.6575, lng: 139.701 },
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2日後から
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4日後まで
    organizer: "Global Food Network",
    category: "festival",
    language: "en",
    translatedTitle: {
      ja: "限定版ストリートフードフェスティバル",
      zh: "限量版街头美食节",
      ko: "한정판 스트리트 푸드 페스티벌",
    },
    translatedDescription: {
      ja: "世界中の最高のストリートフードを、ここ渋谷で体験しよう！",
      zh: "在涩谷体验来自世界各地的最佳街头美食！",
      ko: "전 세계 최고의 스트리트 푸드를 여기 시부야에서 경험해보세요!",
    },
  },
  {
    id: "3",
    title: "春季特卖会",
    description: "春季新品上市，全场8折起！不要错过这个难得的机会。",
    location: { lat: 35.6588, lng: 139.7002 },
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12時間前から
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3日後まで
    organizer: "时尚购物中心",
    category: "sale",
    language: "zh",
    translatedTitle: {
      ja: "春のセール",
      en: "Spring Sale",
      ko: "봄 세일",
    },
    translatedDescription: {
      ja: "春の新商品入荷、全品20%OFF！この貴重な機会をお見逃しなく。",
      en: "Spring new arrivals, up to 20% off everything! Don't miss this rare opportunity.",
      ko: "봄 신상품 입고, 전품 20% 할인! 이 귀중한 기회를 놓치지 마세요.",
    },
  },
];
