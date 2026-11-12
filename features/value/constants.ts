import type { ValueCard, CategoryZone } from "./types";

export const TEXTBOOK_NUMBERS = {
  COTTON_USD: 100,
  MACHINE_DEPRECIATION_USD: 6,
  LABOR_POWER_USD: 15,
  SURPLUS_VALUE_USD: 15,
  C_TOTAL_USD: 106, // 100 + 6
  V_TOTAL_USD: 15,
  M_TOTAL_USD: 15,
  NEW_VALUE_USD: 30, // v + m = 15 + 15
  ADVANCE_CAPITAL_USD: 121, // c + v = 106 + 15
  TOTAL_PRODUCT_VALUE_G_USD: 136, // c + (v + m) = 106 + 30
};

export const VALUE_CARDS: ValueCard[] = [
  {
    id: "card_cotton",
    name: "100 kg Bông thô",
    description: "Nguyên liệu trực tiếp để kéo thành 100 kg sợi qua 8 giờ sản xuất.",
    valueUSD: TEXTBOOK_NUMBERS.COTTON_USD,
    correctCategory: "c",
    categoryLabel: "Tư bản bất biến (c)",
    icon: "❖",
    isAdvanceCapital: true,
    explanation:
      "Bông là đối tượng lao động (nguyên liệu). Giá trị của bông (100 USD) được lao động cụ thể của người thợ bảo toàn và chuyển dịch nguyên vẹn vào sản phẩm sợi, lượng giá trị không đổi nên thuộc tư bản bất biến (c).",
  },
  {
    id: "card_machine",
    name: "Hao mòn máy móc",
    description: "Khấu hao hao mòn thiết bị máy kéo sợi cơ khí trong ca làm việc 8 giờ.",
    valueUSD: TEXTBOOK_NUMBERS.MACHINE_DEPRECIATION_USD,
    correctCategory: "c",
    categoryLabel: "Tư bản bất biến (c)",
    icon: "⚙",
    isAdvanceCapital: true,
    explanation:
      "Máy móc là tư liệu lao động. Trong quá trình vận hành, máy móc chuyển dần từng phần giá trị hao mòn (6 USD) vào giá trị của sợi thông qua lao động cụ thể, không tự sinh ra giá trị thặng dư nên thuộc tư bản bất biến (c).",
  },
  {
    id: "card_labor",
    name: "Tiền công mua Sức lao động",
    description: "Nhà tư bản ứng trước để mua quyền sử dụng sức lao động trong 8 giờ.",
    valueUSD: TEXTBOOK_NUMBERS.LABOR_POWER_USD,
    correctCategory: "v",
    categoryLabel: "Tư bản khả biến (v)",
    icon: "♟",
    isAdvanceCapital: true,
    explanation:
      "Sức lao động được mua bằng tiền lương (15 USD). Khi tiêu dùng, lao động trừu tượng của công nhân tạo ra một lượng giá trị mới (30 USD) lớn hơn giá trị bản thân sức lao động (15 USD), có sự biến đổi về lượng nên thuộc tư bản khả biến (v).",
  },
  {
    id: "card_surplus",
    name: "Giá trị thặng dư (m)",
    description: "Phần giá trị mới dôi ra do công nhân làm thêm trong 4 giờ lao động thặng dư.",
    valueUSD: TEXTBOOK_NUMBERS.SURPLUS_VALUE_USD,
    correctCategory: "m",
    categoryLabel: "Giá trị thặng dư (m)",
    icon: "✦",
    isAdvanceCapital: false, // CRITICAL: NOT advance capital!
    explanation:
      "LƯU Ý CỐT LÕI: Giá trị thặng dư (m = 15 USD) KHÔNG PHẢI tư bản ứng trước! Nhà tư bản không hề ứng trước khoản tiền này. Nó là kết quả của lao động thặng dư không công của người công nhân tạo ra trong 4 giờ sau.",
  },
];

export const CATEGORY_ZONES: CategoryZone[] = [
  {
    category: "c",
    symbol: "c",
    title: "Tư bản Bất biến",
    subtitle: "Tư liệu sản xuất (Bông + Máy móc)",
    colorScheme: {
      bg: "bg-amber-50/70",
      border: "border-amber-300",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-950",
      borderActive: "border-amber-500",
    },
    expectedCards: ["card_cotton", "card_machine"],
    totalExpectedUSD: TEXTBOOK_NUMBERS.C_TOTAL_USD,
  },
  {
    category: "v",
    symbol: "v",
    title: "Tư bản Khả biến",
    subtitle: "Mua Sức lao động",
    colorScheme: {
      bg: "bg-sky-50/70",
      border: "border-sky-300",
      badgeBg: "bg-sky-100",
      badgeText: "text-sky-950",
      borderActive: "border-sky-500",
    },
    expectedCards: ["card_labor"],
    totalExpectedUSD: TEXTBOOK_NUMBERS.V_TOTAL_USD,
  },
  {
    category: "m",
    symbol: "m",
    title: "Giá trị Thặng dư",
    subtitle: "Giá trị mới dôi ra (Không ứng trước)",
    colorScheme: {
      bg: "bg-rose-50/70",
      border: "border-rose-300",
      badgeBg: "bg-rose-100",
      badgeText: "text-rose-950",
      borderActive: "border-rose-500",
    },
    expectedCards: ["card_surplus"],
    totalExpectedUSD: TEXTBOOK_NUMBERS.M_TOTAL_USD,
  },
];

export const CAPITAL_COMPARISON = [
  {
    criterion: "Căn cứ phân chia",
    constantVsVariable:
      "Dựa vào vai trò khác nhau của các bộ phận tư bản trong việc tạo ra GIÁ TRỊ THẶNG DƯ.",
    fixedVsCirculating:
      "Dựa vào phương thức CHU CHUYỂN GIÁ TRỊ của các bộ phận tư bản vào sản phẩm mới.",
  },
  {
    criterion: "Các bộ phận cấu thành",
    constantVsVariable:
      "• Tư bản bất biến (c): Máy móc, thiết bị, nguyên vật liệu.\n• Tư bản khả biến (v): Tiền mua sức lao động.",
    fixedVsCirculating:
      "• Tư bản cố định: Máy móc, nhà xưởng (chuyển dần từng phần).\n• Tư bản lưu động: Nguyên vật liệu + Sức lao động (chuyển hết một lần).",
  },
  {
    criterion: "Ý nghĩa lý luận",
    constantVsVariable:
      "Vạch rõ nguồn gốc duy nhất của giá trị thặng dư là do tư bản khả biến (lao động của công nhân) tạo ra, tư bản bất biến chỉ là điều kiện.",
    fixedVsCirculating:
      "Giúp nhà tư bản quản lý tốc độ chu chuyển vốn, tính toán thời gian thu hồi vốn và hao mòn thiết bị.",
  },
];
