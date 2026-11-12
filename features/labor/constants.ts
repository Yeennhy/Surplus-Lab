import type {
  LaborCondition,
  LaborScenario,
  AttributeQuizQuestion,
  ValueComponentDefinition,
} from "./types";

export const LABOR_CONDITIONS: LaborCondition[] = [
  {
    id: "personal_freedom",
    number: 1,
    title: "Người lao động được tự do về thân thể",
    shortName: "Tự do thân thể",
    description:
      "Người lao động phải làm chủ được sức lao động của mình và có quyền tự do đem bán sức lao động đó như một hàng hóa trong một khoảng thời gian nhất định.",
    implications: [
      "Có quyền sở hữu năng lực lao động của chính mình",
      "Có quyền tự do ký kết hợp đồng hoặc thỏa thuận thuê mướn",
      "Chỉ bán quyền sử dụng sức lao động trong thời gian nhất định, không bán thân mình (không biến mình thành nô lệ)",
    ],
    historicalContext:
      "Trong chế độ chiếm hữu nô lệ hoặc phong kiến nông nô, người lao động bị lệ thuộc thân thể vào chủ nô/lãnh chúa nên sức lao động chưa thể trở thành hàng hóa một cách độc lập.",
  },
  {
    id: "lacks_means_of_production",
    number: 2,
    title: "Người lao động không có đủ tư liệu sản xuất cần thiết",
    shortName: "Không có tư liệu sản xuất",
    description:
      "Người lao động bị tước đoạt hoặc không sở hữu tư liệu sản xuất cần thiết để tự kết hợp với sức lao động của mình tạo ra sản phẩm nuôi sống bản thân.",
    implications: [
      "Không có ruộng đất, nhà xưởng, máy móc hay vốn liếng",
      "Không thể tự tiến hành sản xuất hàng hóa độc lập",
      "Muốn tồn tại buộc phải bán sức lao động cho người nắm giữ tư liệu sản xuất",
    ],
    historicalContext:
      "Nếu người lao động có đủ tư liệu sản xuất (như thợ thủ công, nông dân tự canh), họ sẽ tự sản xuất và bán sản phẩm chứ không bán sức lao động của mình.",
  },
];

export const LABOR_SCENARIOS: LaborScenario[] = [
  {
    id: "scenario_factory_worker",
    character: {
      name: "Thomas Higgins",
      role: "Công nhân dệt công nghiệp",
      era: "Thế kỷ 19 (Cách mạng Công nghiệp)",
      location: "Manchester, Anh Quốc",
      avatarIcon: "🏭",
      description:
        "Từng là nông dân bị tước đoạt đất đai sau phong trào 'Rào đất cướp ruộng' (Enclosure Acts), Thomas di cư lên thành phố tìm kế sinh nhai.",
    },
    story:
      "Thomas có toàn quyền tự do về thân thể, không bị ai trói buộc hay quản chế. Tuy nhiên, anh không sở hữu bất kỳ mét đất, xưởng dệt hay khung cửi máy nào. Để gia đình không chết đói, Thomas phải đến gõ cửa nhà máy sợi của nhà tư bản để xin làm thuê theo ca 8–12 giờ.",
    hasPersonalFreedom: true,
    freedomExplanation:
      "Thomas là công dân tự do, có quyền quyết định bán sức lao động của mình theo hợp đồng thời gian.",
    lacksMeansOfProduction: true,
    meansExplanation:
      "Thomas hoàn toàn không có tư liệu sản xuất (đất đai, máy móc, nguyên liệu bông).",
    isCommodity: true,
    overallExplanation:
      "Chính xác! Cả 2 điều kiện lịch sử đều thỏa mãn đồng thời: Thomas tự do về thân thể NHƯNG bị tước đoạt tư liệu sản xuất. Sức lao động của Thomas đã trở thành hàng hóa.",
    historicalNote:
      "Đây là hình mẫu công nhân làm thuê điển hình thời kỳ chủ nghĩa tư bản tự do cạnh tranh được C. Mác phân tích trong Bộ Tư bản.",
  },
  {
    id: "scenario_roman_slave",
    character: {
      name: "Marcus",
      role: "Nô lệ nông nghiệp",
      era: "Thời kỳ Cổ đại (Thế kỷ 1 TCN)",
      location: "Đế chế La Mã",
      avatarIcon: "⛓️",
      description:
        "Bị bắt làm tù binh chiến tranh, Marcus bị đưa vào làm việc tại trang viên nông nghiệp lớn (Latifundium) của một chủ nô La Mã.",
    },
    story:
      "Marcus làm việc cật lực từ sáng tới tối ngoài cánh đồng. Marcus không sở hữu đất đai hay cày bừa. Tuy nhiên, toàn bộ thân thể Marcus thuộc quyền sở hữu tuyệt đối của chủ nô như một 'công cụ biết nói' (instrumentum vocale). Chủ nô có thể bán, đánh đập hay thậm chí giết Marcus.",
    hasPersonalFreedom: false,
    freedomExplanation:
      "Marcus bị tước đoạt hoàn toàn quyền tự do thân thể. Bản thân Marcus là tài sản của chủ nô, không thể tự mình đem bán sức lao động.",
    lacksMeansOfProduction: true,
    meansExplanation:
      "Marcus không có tư liệu sản xuất, mọi công cụ và đất đai đều thuộc về chủ nô.",
    isCommodity: false,
    overallExplanation:
      "Chưa đủ điều kiện! Mặc dù Marcus không có tư liệu sản xuất, nhưng anh KHÔNG có tự do thân thể. Trong chế độ nô lệ, bản thân con người bị mua bán như một vật thể, chứ sức lao động của người đó chưa trở thành hàng hóa độc lập.",
    historicalNote:
      "Giáo trình nhấn mạnh: Sức lao động chỉ thành hàng hóa khi người lao động làm chủ được thân thể mình.",
  },
  {
    id: "scenario_independent_farmer",
    character: {
      name: "Jean Dupont",
      role: "Nông dân tự do canh tác",
      era: "Thế kỷ 18",
      location: "Bordeaux, Pháp",
      avatarIcon: "🌾",
      description:
        "Sở hữu một mảnh vườn nho và xưởng ủ rượu gia truyền nhỏ do ông cha để lại.",
    },
    story:
      "Jean là một công dân tự do, không bị lệ thuộc vào lãnh chúa phong kiến. Anh sở hữu mảnh đất rộng 2 hecta, đàn bò cày và các thùng ủ rượu gỗ sồi. Hằng năm, Jean cùng gia đình tự chăm sóc nho, sản xuất rượu vang và mang ra chợ phiên bán lấy tiền tiêu dùng.",
    hasPersonalFreedom: true,
    freedomExplanation:
      "Jean hoàn toàn tự do về thân thể, tự quyết định hoạt động lao động của mình.",
    lacksMeansOfProduction: false,
    meansExplanation:
      "Jean sở hữu tư liệu sản xuất đầy đủ (đất đai, gia súc, xưởng và công cụ chế biến nho).",
    isCommodity: false,
    overallExplanation:
      "Chưa đủ điều kiện! Jean có tự do thân thể, nhưng vì anh ĐÃ SỞ HỮU tư liệu sản xuất nên anh tự sản xuất ra rượu vang để bán. Cái anh bán ra thị trường là sản phẩm hàng hóa (rượu vang), chứ KHÔNG PHẢI sức lao động của anh.",
    historicalNote:
      "Người sản xuất hàng hóa giản đơn bán sản phẩm mình làm ra theo công thức H - T - H.",
  },
  {
    id: "scenario_guild_master",
    character: {
      name: "Hans Becker",
      role: "Thợ thủ công Phường hội",
      era: "Thời kỳ Trung đại (Thế kỷ 15)",
      location: "Nuremberg, Đức",
      avatarIcon: "🔨",
      description:
        "Nghệ nhân đồ da bậc thầy thuộc phường hội thủ công nghiệp thành phố Nuremberg.",
    },
    story:
      "Hans là thị dân tự do. Anh làm chủ một xưởng thuộc da, có bộ dụng cụ chạm khắc bằng thép tốt và tích trữ sẵn các súc da bò chất lượng. Anh tự thiết kế ủng da, thắt lưng và bán cho các thương lái ghé qua thành phố.",
    hasPersonalFreedom: true,
    freedomExplanation:
      "Hans là công dân tự do của thành thị, được phường hội bảo hộ quyền làm nghề.",
    lacksMeansOfProduction: false,
    meansExplanation:
      "Hans sở hữu xưởng chế tác, công cụ gia công và nguyên liệu.",
    isCommodity: false,
    overallExplanation:
      "Không phải hàng hóa sức lao động! Hans sở hữu tư liệu sản xuất và bán thành phẩm đồ da. Sức lao động của anh kết tinh vào sản phẩm chứ không được đem ra mua bán như hàng hóa.",
  },
  {
    id: "scenario_feudal_serf",
    character: {
      name: "Ivan Morozov",
      role: "Nông nô Nga",
      era: "Thế kỷ 18",
      location: "Tỉnh Tula, Đế quốc Nga",
      avatarIcon: "🪵",
      description:
        "Gia đình nhiều đời gắn chặt với đất đai của Lãnh chúa Bá tước Vorontsov.",
    },
    story:
      "Ivan được lãnh chúa giao cho một mảnh đất nhỏ để canh tác tự túc, nhưng đổi lại anh phải làm công không công (lao dịch) trên lãnh địa của bá tước 4 ngày mỗi tuần. Ivan không được tự ý rời khỏi làng nếu không có giấy phép của lãnh chúa.",
    hasPersonalFreedom: false,
    freedomExplanation:
      "Ivan bị gắn chặt vào đất đai và phụ thuộc thân thể vào lãnh chúa phong kiến.",
    lacksMeansOfProduction: true,
    meansExplanation:
      "Đất đai và quyền canh tác tối cao thuộc về lãnh chúa quý tộc phong kiến.",
    isCommodity: false,
    overallExplanation:
      "Không đủ điều kiện! Ivan thiếu tự do thân thể, quan hệ lao động ở đây là quan hệ bóc lột phong kiến cưỡng bức phi kinh tế, không phải quan hệ mua bán sức lao động trên thị trường.",
  },
  {
    id: "scenario_modern_gig_worker",
    character: {
      name: "Elena Rostova",
      role: "Lập trình viên tự do (Freelancer)",
      era: "Thế kỷ 21",
      location: "Thành phố công nghiệp hiện đại",
      avatarIcon: "💻",
      description:
        "Làm việc theo hợp đồng dịch vụ cho các nền tảng công nghệ toàn cầu.",
    },
    story:
      "Elena có bằng cử nhân công nghệ thông tin. Cô hoàn toàn tự do pháp lý và có quyền ký hợp đồng với bất kỳ công ty nào. Tuy nhiên, cô không sở hữu hạ tầng máy chủ trung tâm dữ liệu, vệ tinh mạng hay vốn tư bản công nghệ để tự mình phát triển các giải pháp thương mại quy mô lớn, mà phải bán kỹ năng lập trình theo giờ công.",
    hasPersonalFreedom: true,
    freedomExplanation:
      "Elena có toàn quyền tự do cá nhân và tự chủ về pháp lý.",
    lacksMeansOfProduction: true,
    meansExplanation:
      "Thiếu tư liệu sản xuất xã hội hóa quy mô lớn và tư bản ứng trước.",
    isCommodity: true,
    overallExplanation:
      "Chính xác! Đây là hình thái hiện đại của hàng hóa sức lao động trong nền kinh tế tri thức: tự do thân thể nhưng vẫn phải bán năng lực trí tuệ cho các tổ chức nắm giữ tư liệu sản xuất xã hội.",
  },
];

export const ATTRIBUTE_QUIZ_QUESTIONS: AttributeQuizQuestion[] = [
  {
    id: "attr_q1",
    attributeType: "value",
    question: "Giá trị của hàng hóa sức lao động được đo lường bằng gì?",
    options: [
      "Bằng số tiền nhà tư bản tùy ý ấn định khi trả lương",
      "Bằng thời gian lao động xã hội cần thiết để sản xuất và tái sản xuất ra sức lao động (thông qua giá trị các tư liệu sinh hoạt cần thiết)",
      "Bằng tổng giá trị sản phẩm mà người công nhân tạo ra trong cả ngày",
      "Bằng trọng lượng và năng suất của máy móc trong nhà xưởng",
    ],
    correctOptionIndex: 1,
    explanation:
      "Giáo trình khẳng định: Giá trị của hàng hóa sức lao động do thời gian lao động xã hội cần thiết để sản xuất và tái sản xuất ra sức lao động quyết định, được đo gián tiếp qua giá trị các tư liệu sinh hoạt nuôi sống công nhân và gia đình họ.",
  },
  {
    id: "attr_q2",
    attributeType: "use_value",
    question:
      "Điểm ĐẶC BIỆT NHẤT trong giá trị sử dụng của hàng hóa sức lao động so với các hàng hóa thông thường là gì?",
    options: [
      "Không bao giờ bị hao mòn hay suy giảm theo thời gian",
      "Có thể chuyển nguyên vẹn giá trị cũ vào sản phẩm mới mà không thay đổi",
      "Khi tiêu dùng (sử dụng), nó có khả năng tạo ra một lượng giá trị mới LỚN HƠN giá trị của bản thân nó",
      "Có thể tự động thay thế hoàn toàn máy móc hiện đại",
    ],
    correctOptionIndex: 2,
    explanation:
      "Đây là hòn đá tảng trong lý luận Mác: Khi nhà tư bản tiêu dùng sức lao động, nó tạo ra một lượng giá trị mới (v + m) lớn hơn bản thân chi phí mua sức lao động (v). Phần dôi ra chính là giá trị thặng dư (m).",
  },
  {
    id: "attr_q3",
    attributeType: "value",
    question:
      "Vì sao nói hàng hóa sức lao động mang 'yếu tố tinh thần và lịch sử'?",
    options: [
      "Vì sức lao động gắn liền với con người sống; nhu cầu sinh hoạt thay đổi theo điều kiện địa lý, văn hóa và trình độ phát triển của mỗi thời kỳ lịch sử",
      "Vì giá cả sức lao động được ghi lại trong sách lịch sử",
      "Vì công nhân chỉ cần đời sống tinh thần mà không cần ăn uống vật chất",
      "Vì nó chỉ tồn tại trong các câu chuyện lịch sử thời xưa",
    ],
    correctOptionIndex: 0,
    explanation:
      "Sức lao động tồn tại trong con người sống, chịu ảnh hưởng của hoàn cảnh lịch sử, truyền thống văn hóa và trình độ văn minh của mỗi quốc gia.",
  },
  {
    id: "attr_q4",
    attributeType: "use_value",
    question:
      "Trong ví dụ nhà máy sợi 8 giờ: Nhà tư bản trả 15 USD tiền công cho 8 giờ. Sau 4 giờ tất yếu, công nhân đã tạo ra giá trị mới bao nhiêu?",
    options: [
      "Đã tạo ra 15 USD giá trị mới (đủ bù đắp đúng giá trị sức lao động)",
      "Đã tạo ra 30 USD giá trị mới",
      "Chưa tạo ra được đồng nào vì sợi chưa bán",
      "Tạo ra 136 USD giá trị",
    ],
    correctOptionIndex: 0,
    explanation:
      "Sau 4 giờ đầu (thời gian lao động tất yếu), công nhân đã tạo ra 15 USD giá trị mới, ngang bằng giá trị sức lao động được trả. 4 giờ sau là lao động thặng dư tạo ra thêm 15 USD (m).",
  },
];

export const VALUE_COMPONENTS: ValueComponentDefinition[] = [
  {
    id: "living_costs",
    badgeNumber: 1,
    title: "Tư liệu sinh hoạt duy trì người lao động",
    description:
      "Giá trị những tư liệu sinh hoạt vật chất và tinh thần cần thiết để duy trì sự sống và phục hồi năng lực làm việc hàng ngày của người lao động.",
    examples: [
      "Lương thực, thực phẩm thiết yếu (bánh mì, thịt, rau củ)",
      "Quần áo, giày dép, tư trang",
      "Tiền thuê nhà ở, điện, nước, sưởi ấm",
      "Chi phí chăm sóc y tế, thuốc men khi ốm đau",
      "Nhu cầu nghỉ ngơi, văn hóa tinh thần tối thiểu",
    ],
    socialSignificance:
      "Đảm bảo công nhân có đủ sức khỏe và năng lượng thể chất để tiếp tục bước vào ca làm việc của ngày hôm sau.",
    colorScheme: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-950",
      icon: "🍞",
    },
  },
  {
    id: "training_costs",
    badgeNumber: 2,
    title: "Phí tổn đào tạo người lao động",
    description:
      "Chi phí cần thiết để người lao động tiếp thu kiến thức, kỹ năng chuyên môn và tay nghề đáp ứng yêu cầu của nền sản xuất phức tạp.",
    examples: [
      "Học phí trường nghề, trường kỹ thuật",
      "Chi phí mua giáo trình, học liệu, công cụ thực hành",
      "Thời gian và chi phí học việc, tập sự nâng cao bậc thợ",
      "Chi phí chứng chỉ chuyên môn, bồi dưỡng công nghệ mới",
    ],
    socialSignificance:
      "Lao động qua đào tạo là lao động phức tạp, trong cùng thời gian tạo ra nhiều giá trị hơn lao động giản đơn; do đó chi phí đào tạo được kết tinh vào giá trị sức lao động.",
    colorScheme: {
      bg: "bg-sky-50",
      border: "border-sky-300",
      text: "text-sky-950",
      icon: "🎓",
    },
  },
  {
    id: "child_rearing",
    badgeNumber: 3,
    title: "Tư liệu sinh hoạt nuôi con của người lao động",
    description:
      "Chi phí để nuôi dưỡng con cái của công nhân nhằm duy trì và tái sản xuất liên tục lực lượng lao động kế cận cho xã hội.",
    examples: [
      "Thực phẩm, sữa và dinh dưỡng cho trẻ nhỏ",
      "Chi phí chăm sóc thai sản và nuôi dưỡng trẻ em",
      "Học phí phổ thông và sinh hoạt của thế hệ con cái",
      "Bảo đảm sự tồn tại của gia đình người công nhân",
    ],
    socialSignificance:
      "Nếu không có khoản này, thế hệ lao động hiện tại già đi và mất đi sẽ khiến thị trường cạn kiệt sức lao động, làm đứt gãy quá trình tái sản xuất xã hội.",
    colorScheme: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-950",
      icon: "👶",
    },
  },
];

export const VALUE_COMPONENT_MATCHING_ITEMS = [
  {
    id: "match_1",
    label: "Chi phí mua thịt bò, khoai tây và tiền thuê căn phòng trọ nhỏ",
    correctComponentId: "living_costs" as const,
    hint: "Phục vụ trực tiếp việc duy trì sự sống của bản thân người công nhân",
  },
  {
    id: "match_2",
    label: "Khoản tiền đóng học phí 2 năm học nghề tiện kim loại chính xác",
    correctComponentId: "training_costs" as const,
    hint: "Giúp người lao động có kỹ năng nghề nghiệp phức tạp",
  },
  {
    id: "match_3",
    label: "Chi phí mua sữa, quần áo ấm và sách vở cho hai đứa con nhỏ",
    correctComponentId: "child_rearing" as const,
    hint: "Bảo đảm thế hệ lao động tương lai thay thế khi cha mẹ về già",
  },
  {
    id: "match_4",
    label: "Chi phí khám chữa bệnh và thuốc cảm sốt sau một tuần làm việc nặng nhọc",
    correctComponentId: "living_costs" as const,
    hint: "Phục hồi thể lực sống của cá nhân người lao động",
  },
  {
    id: "match_5",
    label: "Khoản đầu tư mua sách hướng dẫn vận hành máy dệt hơi nước thế hệ mới",
    correctComponentId: "training_costs" as const,
    hint: "Nâng cao năng lực chuyên môn thích ứng công nghệ",
  },
];
