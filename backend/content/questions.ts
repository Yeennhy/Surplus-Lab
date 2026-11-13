import type { Question } from "@/backend/domain/quiz/types";

export const questions: Question[] = [
  {
    id: "circulation-forms",
    type: "choice",
    prompt: "Điểm khác nhau cơ bản giữa H – T – H và T – H – T' là gì?",
    choices: [
      { id: "A", text: "H – T – H hướng đến giá trị sử dụng; T – H – T' hướng đến giá trị tăng thêm." },
      { id: "B", text: "Cả hai đều bắt đầu và kết thúc bằng tiền." },
      { id: "C", text: "H – T – H luôn tạo ra giá trị thặng dư." },
      { id: "D", text: "T – H – T' kết thúc bằng một hàng hóa khác." },
    ],
    correctAnswer: "A",
    explanation: [
      "H – T – H bắt đầu và kết thúc bằng hàng hóa, nhằm đáp ứng nhu cầu sử dụng.",
      "T – H – T' bắt đầu bằng tiền và hướng đến thu về lượng giá trị lớn hơn.",
      "Vì vậy, mục đích của hai hình thức lưu thông là khác nhau.",
    ],
  },
  {
    id: "surplus-definition",
    type: "choice",
    prompt: "Trong công thức T' = T + ΔT, phần ΔT biểu thị điều gì?",
    choices: [
      { id: "A", text: "Giá trị tư liệu sản xuất đã chuyển vào hàng hóa." },
      { id: "B", text: "Phần giá trị tăng thêm, gọi là giá trị thặng dư." },
      { id: "C", text: "Toàn bộ số tiền ứng trước ban đầu." },
      { id: "D", text: "Giá trị sử dụng của hàng hóa." },
    ],
    correctAnswer: "B",
    explanation: [
      "T' là số tiền thu về sau quá trình vận động.",
      "ΔT là phần chênh lệch dương so với T ban đầu.",
      "Phần tăng thêm này được gọi là giá trị thặng dư.",
    ],
  },
  {
    id: "exchange-and-value",
    type: "choice",
    prompt: "Theo nội dung chương, vì sao lưu thông thông thường không tạo ra giá trị thặng dư cho toàn xã hội?",
    choices: [
      { id: "A", text: "Vì hàng hóa không có giá trị sử dụng." },
      { id: "B", text: "Vì trao đổi ngang giá luôn làm giảm giá trị hàng hóa." },
      { id: "C", text: "Vì lợi ích khi bán cao hơn giá trị có thể đi kèm thiệt hại khi mua; trao đổi không tự tạo giá trị mới." },
      { id: "D", text: "Vì người mua và người bán không dùng tiền." },
    ],
    correctAnswer: "C",
    explanation: [
      "Trao đổi ngang giá chỉ chuyển hàng hóa và giá trị tương đương giữa các bên.",
      "Nếu bán cao hơn giá trị, người mua chịu thiệt tương ứng; xét toàn xã hội, lưu thông không tự tạo giá trị mới.",
    ],
  },
  {
    id: "labor-power-conditions",
    type: "choice",
    prompt: "Hai điều kiện nào phải đồng thời có để sức lao động trở thành hàng hóa?",
    choices: [
      { id: "A", text: "Người lao động được tự do về thân thể và không có đủ tư liệu sản xuất cần thiết." },
      { id: "B", text: "Người lao động có nhà máy và được trả lương cao." },
      { id: "C", text: "Người lao động có kỹ năng và sở hữu sản phẩm." },
      { id: "D", text: "Người lao động tự quyết định giá bán mọi hàng hóa." },
    ],
    correctAnswer: "A",
    explanation: [
      "Người lao động phải tự do quyết định việc bán sức lao động của mình.",
      "Đồng thời, họ không có đủ tư liệu sản xuất để tự tổ chức sản xuất và phải bán sức lao động.",
    ],
  },
  {
    id: "labor-power-value",
    type: "choice",
    prompt: "Giá trị hàng hóa sức lao động gồm những bộ phận nào?",
    choices: [
      { id: "A", text: "Tư liệu sinh hoạt; chi phí đào tạo; tư liệu sinh hoạt để nuôi con người lao động." },
      { id: "B", text: "Máy móc; nguyên liệu; lợi nhuận." },
      { id: "C", text: "Tiền lương; tiền thuê nhà xưởng; thuế." },
      { id: "D", text: "Chỉ gồm tư liệu sinh hoạt hằng ngày." },
    ],
    correctAnswer: "A",
    explanation: [
      "Giá trị sức lao động được xác định thông qua các tư liệu cần thiết để duy trì và tái sản xuất sức lao động.",
      "Ba bộ phận gồm tư liệu sinh hoạt, phí tổn đào tạo và tư liệu sinh hoạt để nuôi con người lao động.",
    ],
  },
  {
    id: "labor-power-use-value",
    type: "choice",
    prompt: "Đâu là đặc điểm đặc biệt trong giá trị sử dụng của hàng hóa sức lao động?",
    choices: [
      { id: "A", text: "Nó có thể tạo ra giá trị mới lớn hơn giá trị của bản thân sức lao động." },
      { id: "B", text: "Nó làm cho máy móc tự tạo ra giá trị thặng dư." },
      { id: "C", text: "Nó chỉ bảo tồn giá trị cũ, không tạo giá trị mới." },
      { id: "D", text: "Nó luôn làm giá trị sản phẩm giảm xuống." },
    ],
    correctAnswer: "A",
    explanation: [
      "Khi được sử dụng trong sản xuất, sức lao động tạo ra giá trị mới.",
      "Giá trị mới có thể lớn hơn giá trị sức lao động mà nhà tư bản đã ứng ra.",
    ],
  },
  {
    id: "four-hour-checkpoint",
    type: "choice",
    prompt: "Trong ví dụ sản xuất sợi, điều gì xảy ra nếu quá trình dừng sau 4 giờ lao động đầu?",
    choices: [
      { id: "A", text: "Đã có 15 USD giá trị thặng dư." },
      { id: "B", text: "Giá trị sản phẩm bằng tư bản ứng ra cho giai đoạn đó; chưa có giá trị thặng dư." },
      { id: "C", text: "Công nhân chưa tạo ra giá trị mới." },
      { id: "D", text: "Tổng giá trị hàng hóa là 136 USD." },
    ],
    correctAnswer: "B",
    explanation: [
      "Trong 4 giờ đầu, giá trị mới do công nhân tạo ra là 15 USD, bằng giá trị sức lao động v.",
      "Giá trị sản phẩm là 50 USD bông + 3 USD hao mòn máy + 15 USD giá trị mới = 68 USD.",
      "Giá trị sản phẩm bằng số tư bản ứng ra cho giai đoạn này nên m = 0 USD.",
    ],
  },
  {
    id: "constant-variable-capital",
    type: "choice",
    prompt: "Cách phân biệt nào đúng giữa tư bản bất biến c và tư bản khả biến v?",
    choices: [
      { id: "A", text: "c mua sức lao động; v mua nguyên liệu và máy móc." },
      { id: "B", text: "c chuyển giá trị tư liệu sản xuất vào sản phẩm; v gắn với lao động tạo ra giá trị mới." },
      { id: "C", text: "Cả c và v đều trực tiếp tạo ra giá trị thặng dư." },
      { id: "D", text: "c là giá trị thặng dư; v là tổng giá trị hàng hóa." },
    ],
    correctAnswer: "B",
    explanation: [
      "Tư bản bất biến c là giá trị tư liệu sản xuất được bảo toàn và chuyển vào sản phẩm.",
      "Tư bản khả biến v dùng để mua sức lao động; việc sử dụng sức lao động tạo ra giá trị mới.",
      "Không phân loại m như một bộ phận tư bản ứng trước.",
    ],
  },
  {
    id: "total-commodity-value",
    type: "numeric",
    prompt: "Ví dụ sản xuất sợi có c = 106 USD, v = 15 USD và m = 15 USD. Tổng giá trị hàng hóa G là bao nhiêu?",
    correctAnswer: 136,
    unit: "USD",
    explanation: [
      "Áp dụng công thức G = c + (v + m).",
      "G = 106 + (15 + 15) = 136 USD.",
    ],
  },
  {
    id: "surplus-value-calculation",
    type: "numeric",
    prompt: "Sau 8 giờ, tổng giá trị hàng hóa là 136 USD và tư bản ứng trước là 121 USD. Giá trị thặng dư m là bao nhiêu?",
    correctAnswer: 15,
    unit: "USD",
    explanation: [
      "Giá trị thặng dư là phần giá trị mới vượt quá giá trị sức lao động.",
      "Theo số liệu ví dụ: m = 136 − 121 = 15 USD.",
    ],
  },
  {
    id: "labor-power-and-labor",
    type: "choice",
    prompt: "Sức lao động khác lao động như thế nào?",
    choices: [
      { id: "A", text: "Sức lao động là khả năng lao động; lao động là quá trình sử dụng khả năng đó trong sản xuất." },
      { id: "B", text: "Sức lao động là sản phẩm; lao động là tư liệu sản xuất." },
      { id: "C", text: "Hai khái niệm hoàn toàn giống nhau." },
      { id: "D", text: "Lao động là khả năng còn sức lao động chỉ quá trình sản xuất." },
    ],
    correctAnswer: "A",
    explanation: [
      "Sức lao động là tổng thể năng lực thể chất và tinh thần của con người.",
      "Lao động là hoạt động thực tế khi con người sử dụng những năng lực đó để sản xuất.",
    ],
  },
  {
    id: "labor-power-special-commodity",
    type: "choice",
    prompt: "Đặc điểm nào làm cho sức lao động trở thành hàng hóa đặc biệt trong phân tích của chương?",
    choices: [
      { id: "A", text: "Khi được sử dụng, nó có thể tạo ra giá trị mới lớn hơn giá trị của chính nó." },
      { id: "B", text: "Nó có thể được tích trữ như nguyên liệu." },
      { id: "C", text: "Giá trị của nó không liên quan đến điều kiện xã hội." },
      { id: "D", text: "Nó làm cho trao đổi hàng hóa tự tạo ra giá trị mới." },
    ],
    correctAnswer: "A",
    explanation: [
      "Sức lao động gắn với con người và có yếu tố tinh thần, lịch sử.",
      "Điểm đặc biệt quan trọng là việc sử dụng sức lao động có thể tạo ra giá trị mới vượt quá giá trị sức lao động.",
    ],
  },
  {
    id: "necessary-labor-definition",
    type: "choice",
    prompt: "Thời gian lao động tất yếu là khoảng thời gian người lao động cần để…",
    choices: [
      { id: "A", text: "Tạo ra giá trị mới tương đương giá trị sức lao động của mình." },
      { id: "B", text: "Chuyển toàn bộ giá trị máy móc vào sản phẩm." },
      { id: "C", text: "Tạo ra toàn bộ giá trị thặng dư trong ngày." },
      { id: "D", text: "Bán hết sản phẩm trên thị trường." },
    ],
    correctAnswer: "A",
    explanation: [
      "Lao động tất yếu bù đắp giá trị hàng hóa sức lao động.",
      "Phần lao động tiếp tục sau khoảng thời gian này là thời gian lao động thặng dư.",
    ],
  },
  {
    id: "surplus-labor-definition",
    type: "choice",
    prompt: "Thời gian lao động thặng dư bắt đầu khi nào?",
    choices: [
      { id: "A", text: "Sau khi người lao động đã tạo ra giá trị tương đương giá trị sức lao động." },
      { id: "B", text: "Trước khi người lao động bắt đầu sản xuất." },
      { id: "C", text: "Khi máy móc đã chuyển hết giá trị vào sản phẩm." },
      { id: "D", text: "Chỉ khi hàng hóa được bán cao hơn giá trị." },
    ],
    correctAnswer: "A",
    explanation: [
      "Thời gian lao động thặng dư là phần thời gian làm việc sau thời gian lao động tất yếu.",
      "Trong ví dụ, lao động tiếp tục tạo ra giá trị mới vượt quá giá trị sức lao động.",
    ],
  },
  {
    id: "surplus-value-source",
    type: "choice",
    prompt: "Theo phần phân tích trong giáo trình, nguồn gốc của giá trị thặng dư là gì?",
    choices: [
      { id: "A", text: "Phần giá trị mới do sức lao động tạo ra vượt quá giá trị sức lao động." },
      { id: "B", text: "Việc bán mọi hàng hóa cao hơn giá trị." },
      { id: "C", text: "Giá trị máy móc tự tăng lên trong sản xuất." },
      { id: "D", text: "Việc trao đổi ngang giá giữa người mua và người bán." },
    ],
    correctAnswer: "A",
    explanation: [
      "Lưu thông, dù trao đổi ngang giá hay không ngang giá, không tự tạo thêm giá trị cho toàn xã hội.",
      "Giá trị thặng dư hình thành trong sản xuất từ phần giá trị mới vượt quá giá trị sức lao động.",
    ],
  },
  {
    id: "eight-hour-day-structure",
    type: "choice",
    prompt: "Trong ví dụ ngày lao động 8 giờ, cơ cấu thời gian được minh họa như thế nào?",
    choices: [
      { id: "A", text: "4 giờ tất yếu và 4 giờ thặng dư." },
      { id: "B", text: "8 giờ tất yếu, không có thời gian thặng dư." },
      { id: "C", text: "3 giờ tất yếu và 5 giờ thặng dư." },
      { id: "D", text: "4 giờ sản xuất và 4 giờ lưu thông." },
    ],
    correctAnswer: "A",
    explanation: [
      "Bốn giờ đầu tạo ra giá trị mới tương đương v = 15 USD.",
      "Bốn giờ tiếp theo là thời gian lao động thặng dư trong ví dụ.",
    ],
  },
  {
    id: "first-stage-output",
    type: "choice",
    prompt: "Sau 4 giờ đầu trong ví dụ sản xuất sợi, giá trị sản phẩm gồm những khoản nào?",
    choices: [
      { id: "A", text: "50 USD bông + 3 USD hao mòn máy + 15 USD giá trị mới." },
      { id: "B", text: "100 USD bông + 6 USD hao mòn máy + 15 USD tiền công." },
      { id: "C", text: "50 USD bông + 3 USD hao mòn máy + 30 USD giá trị mới." },
      { id: "D", text: "106 USD tư liệu sản xuất + 15 USD giá trị thặng dư." },
    ],
    correctAnswer: "A",
    explanation: [
      "Trong 4 giờ đầu, 50 USD bông và 3 USD hao mòn máy được chuyển vào sản phẩm.",
      "Người lao động tạo ra 15 USD giá trị mới, đúng bằng giá trị sức lao động trong ví dụ.",
    ],
  },
  {
    id: "second-stage-advance",
    type: "choice",
    prompt: "Trong 4 giờ lao động tiếp theo, nhà tư bản phải ứng thêm những khoản nào theo ví dụ?",
    choices: [
      { id: "A", text: "50 USD bông và 3 USD hao mòn máy, không trả thêm 15 USD sức lao động." },
      { id: "B", text: "Chỉ thêm 15 USD tiền sức lao động." },
      { id: "C", text: "50 USD bông, 3 USD hao mòn máy và thêm 15 USD tiền sức lao động." },
      { id: "D", text: "Không cần ứng thêm khoản nào." },
    ],
    correctAnswer: "A",
    explanation: [
      "Sức lao động đã được mua cho toàn bộ ngày làm việc 8 giờ.",
      "Giai đoạn thứ hai cần thêm 50 USD bông và 3 USD hao mòn máy móc.",
    ],
  },
  {
    id: "old-value-transfer",
    type: "choice",
    prompt: "Trong công thức G = c + (v + m), bộ phận c đại diện cho điều gì?",
    choices: [
      { id: "A", text: "Giá trị tư liệu sản xuất đã tiêu dùng và được chuyển vào sản phẩm." },
      { id: "B", text: "Giá trị mới do lao động hiện tại tạo ra." },
      { id: "C", text: "Chỉ phần giá trị thặng dư." },
      { id: "D", text: "Toàn bộ tiền công của người lao động." },
    ],
    correctAnswer: "A",
    explanation: [
      "c là giá trị cũ của nguyên vật liệu, máy móc hao mòn và tư liệu sản xuất khác đã tiêu dùng.",
      "Giá trị mới do lao động tạo ra được biểu diễn bằng v + m.",
    ],
  },
  {
    id: "new-value-composition",
    type: "choice",
    prompt: "Giá trị mới trong giá trị hàng hóa gồm những thành phần nào?",
    choices: [
      { id: "A", text: "v + m: phần bù đắp giá trị sức lao động và phần giá trị thặng dư." },
      { id: "B", text: "c + v: tư liệu sản xuất và tiền công." },
      { id: "C", text: "Chỉ có c: giá trị nguyên liệu, máy móc." },
      { id: "D", text: "G + c: tổng giá trị và tư bản bất biến." },
    ],
    correctAnswer: "A",
    explanation: [
      "Lao động tạo ra giá trị mới gồm phần tương đương giá trị sức lao động v.",
      "Phần vượt quá v là giá trị thặng dư m, do đó giá trị mới = v + m.",
    ],
  },
  {
    id: "machinery-and-surplus-value",
    type: "choice",
    prompt: "Theo nội dung chương, vai trò nào được gán cho máy móc trong quá trình sản xuất?",
    choices: [
      { id: "A", text: "Máy móc chuyển giá trị của nó vào sản phẩm nhưng không tự tạo ra giá trị thặng dư." },
      { id: "B", text: "Máy móc trực tiếp tạo ra toàn bộ giá trị mới." },
      { id: "C", text: "Máy móc làm cho sức lao động không còn cần thiết." },
      { id: "D", text: "Máy móc tạo ra giá trị thặng dư khi sản phẩm được bán." },
    ],
    correctAnswer: "A",
    explanation: [
      "Giá trị tư liệu sản xuất được bảo toàn và chuyển vào sản phẩm nhờ lao động cụ thể.",
      "Máy móc là điều kiện quan trọng của sản xuất nhưng không phải nguồn gốc trực tiếp của giá trị thặng dư.",
    ],
  },
  {
    id: "constant-capital-form",
    type: "choice",
    prompt: "Khoản nào sau đây thuộc tư bản bất biến c trong ví dụ sản xuất sợi?",
    choices: [
      { id: "A", text: "Giá trị bông và phần hao mòn máy móc." },
      { id: "B", text: "Khoản ứng ra để mua sức lao động." },
      { id: "C", text: "Giá trị thặng dư tạo ra sau ngày lao động." },
      { id: "D", text: "Toàn bộ giá trị mới v + m." },
    ],
    correctAnswer: "A",
    explanation: [
      "Bông và hao mòn máy móc là giá trị tư liệu sản xuất được chuyển vào sản phẩm.",
      "Khoản mua sức lao động là tư bản khả biến v, không phải c.",
    ],
  },
  {
    id: "variable-capital-role",
    type: "choice",
    prompt: "Vì sao tư bản khả biến v gắn với việc tạo ra giá trị mới?",
    choices: [
      { id: "A", text: "Vì v được dùng để mua sức lao động, mà việc sử dụng sức lao động tạo ra giá trị mới." },
      { id: "B", text: "Vì v là giá trị máy móc được chuyển vào sản phẩm." },
      { id: "C", text: "Vì v chính là tổng giá trị hàng hóa G." },
      { id: "D", text: "Vì v chỉ hình thành khi hàng hóa được trao đổi." },
    ],
    correctAnswer: "A",
    explanation: [
      "v là tư bản ứng ra để mua hàng hóa sức lao động.",
      "Trong sản xuất, sức lao động tạo ra giá trị mới có thể lớn hơn giá trị sức lao động ban đầu.",
    ],
  },
  {
    id: "capital-advance-distinction",
    type: "choice",
    prompt: "Trong ví dụ sau 8 giờ, phát biểu nào phân biệt đúng tư bản ứng trước và giá trị hàng hóa?",
    choices: [
      { id: "A", text: "Tư bản ứng trước là 121 USD; giá trị hàng hóa là 136 USD." },
      { id: "B", text: "Tư bản ứng trước là 136 USD; giá trị hàng hóa là 121 USD." },
      { id: "C", text: "Cả hai đều là 106 USD." },
      { id: "D", text: "Cả hai đều là 15 USD." },
    ],
    correctAnswer: "A",
    explanation: [
      "Tư bản ứng trước gồm c = 106 USD và v = 15 USD, tổng cộng 121 USD.",
      "Giá trị hàng hóa là G = c + v + m = 136 USD.",
    ],
  },
  {
    id: "concrete-abstract-labor",
    type: "choice",
    prompt: "Trong sản xuất sợi, hai mặt của lao động công nhân có vai trò nào?",
    choices: [
      { id: "A", text: "Lao động cụ thể chuyển giá trị tư liệu sản xuất; lao động trừu tượng tạo ra giá trị mới." },
      { id: "B", text: "Lao động cụ thể tạo ra m; lao động trừu tượng chỉ chuyển giá trị bông." },
      { id: "C", text: "Cả hai mặt chỉ bảo tồn giá trị máy móc." },
      { id: "D", text: "Lao động trừu tượng tạo ra hàng hóa, còn lao động cụ thể tạo ra tiền." },
    ],
    correctAnswer: "A",
    explanation: [
      "Thông qua lao động cụ thể, người công nhân biến bông thành sợi và chuyển giá trị tư liệu sản xuất vào sản phẩm.",
      "Thông qua lao động trừu tượng, người công nhân tạo ra giá trị mới, gồm v + m.",
    ],
  },
  {
    id: "necessary-time-calculation",
    type: "numeric",
    prompt: "Ngày lao động dài 8 giờ, trong đó 4 giờ là thời gian lao động tất yếu. Thời gian lao động thặng dư là bao nhiêu giờ?",
    correctAnswer: 4,
    unit: "giờ",
    explanation: [
      "Thời gian lao động thặng dư bằng tổng thời gian lao động trừ thời gian lao động tất yếu.",
      "8 − 4 = 4 giờ.",
    ],
  },
  {
    id: "first-stage-value-calculation",
    type: "numeric",
    prompt: "Sau 4 giờ đầu, sản phẩm gồm 50 USD giá trị bông, 3 USD hao mòn máy và 15 USD giá trị mới. Tổng giá trị là bao nhiêu USD?",
    correctAnswer: 68,
    unit: "USD",
    explanation: [
      "Cộng giá trị bông, hao mòn máy và giá trị mới: 50 + 3 + 15.",
      "Tổng giá trị sản phẩm sau 4 giờ là 68 USD.",
    ],
  },
  {
    id: "constant-capital-calculation",
    type: "numeric",
    prompt: "Nếu bông có giá trị 100 USD và hao mòn máy móc là 6 USD, c bằng bao nhiêu?",
    correctAnswer: 106,
    unit: "USD",
    explanation: [
      "Tư bản bất biến c gồm giá trị bông và hao mòn máy móc được chuyển vào sản phẩm.",
      "c = 100 + 6 = 106 USD.",
    ],
  },
  {
    id: "new-value-calculation",
    type: "numeric",
    prompt: "Nếu v = 15 USD và m = 15 USD, tổng giá trị mới v + m là bao nhiêu?",
    correctAnswer: 30,
    unit: "USD",
    explanation: [
      "Giá trị mới gồm phần bù đắp sức lao động v và giá trị thặng dư m.",
      "v + m = 15 + 15 = 30 USD.",
    ],
  },
  {
    id: "total-capital-advance-calculation",
    type: "numeric",
    prompt: "Trong ví dụ 8 giờ, c = 106 USD và v = 15 USD. Tổng tư bản ứng trước c + v là bao nhiêu?",
    correctAnswer: 121,
    unit: "USD",
    explanation: [
      "Tư bản ứng trước gồm tư bản bất biến c và tư bản khả biến v.",
      "c + v = 106 + 15 = 121 USD.",
    ],
  },
  { id: "simple-circulation-purpose", type: "choice", prompt: "Một nông dân bán lúa rồi dùng tiền mua áo để mặc. Mục đích cuối của chuỗi H – T – H là gì?", choices: [
    { id: "A", text: "Thu tiền lớn hơn số đã ứng." }, { id: "B", text: "Có hàng hóa đáp ứng nhu cầu sử dụng." }, { id: "C", text: "Tạo giá trị thặng dư trong lưu thông." }, { id: "D", text: "Giữ tiền không tham gia trao đổi." },
  ], correctAnswer: "B", explanation: ["H – T – H bắt đầu bằng một hàng hóa và kết thúc bằng hàng hóa khác.", "Mục đích của lưu thông giản đơn là giá trị sử dụng để đáp ứng nhu cầu."] },
  { id: "capital-formula-delta", type: "numeric", prompt: "Ứng 100 triệu đồng và thu về 120 triệu đồng. ΔT bằng bao nhiêu triệu đồng?", correctAnswer: 20, unit: "triệu đồng", explanation: ["Theo công thức T' = T + ΔT.", "Lấy 120 trừ 100 được 20 triệu đồng giá trị tăng thêm."] },
  { id: "unequal-exchange-transfer", type: "choice", prompt: "Một bot bán hàng cao hơn giá trị tham chiếu 5 USD. Trên phạm vi thị trường đóng, khoản 5 USD đó là gì?", choices: [
    { id: "A", text: "Giá trị mới do máy móc tạo ra." }, { id: "B", text: "Giá trị thặng dư của toàn xã hội." }, { id: "C", text: "Khoản chuyển từ người mua sang người bán." }, { id: "D", text: "Phần tăng của tổng giá trị hàng hóa." },
  ], correctAnswer: "C", explanation: ["Bán trên giá trị có thể làm người bán được lợi và người mua chịu khoản tương ứng.", "Trao đổi không ngang giá chỉ phân phối lại giá trị đã có trên phạm vi toàn xã hội."] },
  { id: "money-becomes-capital", type: "choice", prompt: "Theo giáo trình, tiền trở thành tư bản trong trường hợp nào?", choices: [
    { id: "A", text: "Khi nằm yên trong két sắt." }, { id: "B", text: "Khi chỉ dùng để mua hàng tiêu dùng." }, { id: "C", text: "Khi được đổi sang tiền mệnh giá khác." }, { id: "D", text: "Khi được ứng ra nhằm mang lại giá trị thặng dư." },
  ], correctAnswer: "D", explanation: ["Tư bản là giá trị mang lại giá trị thặng dư.", "Tiền được ứng ra với mục đích thu về T' lớn hơn T mới vận động như tư bản."] },
  { id: "labor-power-vs-labor", type: "choice", prompt: "Câu nào phân biệt đúng sức lao động với lao động?", choices: [
    { id: "A", text: "Sức lao động là năng lực; lao động là quá trình sử dụng năng lực ấy." }, { id: "B", text: "Sức lao động chỉ là thể lực; lao động chỉ là trí lực." }, { id: "C", text: "Sức lao động là sản phẩm; lao động là máy móc." }, { id: "D", text: "Hai khái niệm hoàn toàn giống nhau." },
  ], correctAnswer: "A", explanation: ["Sức lao động gồm năng lực thể chất và tinh thần tồn tại trong con người sống.", "Lao động diễn ra khi con người dùng các năng lực đó trong sản xuất."] },
  { id: "labor-condition-independent", type: "choice", prompt: "Một người có quyền quyết định làm thuê nhưng sở hữu đủ xưởng và công cụ để tự sản xuất. Vì sao hồ sơ này chưa hội đủ điều kiện?", choices: [
    { id: "A", text: "Vì không có quyền quyết định việc làm." }, { id: "B", text: "Vì vẫn có đủ tư liệu sản xuất cần thiết." }, { id: "C", text: "Vì chưa tạo ra sản phẩm sợi." }, { id: "D", text: "Vì chưa bán hàng trên thị trường." },
  ], correctAnswer: "B", explanation: ["Hai điều kiện phải xuất hiện đồng thời: tự do về thân thể và không đủ tư liệu sản xuất.", "Người này đạt điều kiện thứ nhất nhưng chưa thuộc trường hợp thiếu tư liệu để tự sản xuất."] },
  { id: "labor-condition-unfree", type: "choice", prompt: "Người thiếu tư liệu sản xuất nhưng không được tự quyết định bán sức lao động còn thiếu điều kiện nào?", choices: [
    { id: "A", text: "Chi phí đào tạo nghề." }, { id: "B", text: "Giá trị sử dụng của hàng hóa." }, { id: "C", text: "Quyền tự do về thân thể để bán sức lao động." }, { id: "D", text: "Hao mòn máy móc." },
  ], correctAnswer: "C", explanation: ["Thiếu tư liệu sản xuất chỉ là một trong hai điều kiện.", "Người lao động còn phải có quyền tự quyết định bán sức lao động của mình."] },
  { id: "labor-value-training", type: "choice", prompt: "Phí tổn đào tạo nghề được xếp vào bộ phận nào?", choices: [
    { id: "A", text: "Giá trị máy móc hao mòn." }, { id: "B", text: "Giá trị thặng dư m." }, { id: "C", text: "Giá trị bông nguyên liệu." }, { id: "D", text: "Giá trị hàng hóa sức lao động." },
  ], correctAnswer: "D", explanation: ["Giá trị sức lao động gồm tư liệu sinh hoạt cần thiết, phí đào tạo và tư liệu nuôi con.", "Đào tạo giúp người lao động có tri thức và kỹ năng cần thiết."] },
  { id: "labor-value-children", type: "choice", prompt: "Vì sao giá trị tư liệu nuôi con của người lao động được tính vào giá trị sức lao động?", choices: [
    { id: "A", text: "Để duy trì và tái sản xuất thế hệ lao động tiếp theo." }, { id: "B", text: "Để làm máy móc chạy nhanh hơn." }, { id: "C", text: "Để tăng giá bán sản phẩm." }, { id: "D", text: "Để thay bông bằng sợi." },
  ], correctAnswer: "A", explanation: ["Sức lao động phải được tái sản xuất qua các thế hệ.", "Vì thế giáo trình tính cả tư liệu sinh hoạt cần thiết để nuôi con của người lao động."] },
  { id: "labor-use-location", type: "choice", prompt: "Giá trị sử dụng đặc biệt của sức lao động bộc lộ chủ yếu ở đâu?", choices: [
    { id: "A", text: "Ngay lúc hai bên ký hợp đồng." }, { id: "B", text: "Trong quá trình người lao động tham gia sản xuất." }, { id: "C", text: "Trong két tiền của nhà tư bản." }, { id: "D", text: "Khi máy móc được cất kho." },
  ], correctAnswer: "B", explanation: ["Giá trị sử dụng của sức lao động thể hiện khi người mua sử dụng sức lao động.", "Trong sản xuất, lao động có thể tạo ra giá trị mới lớn hơn giá trị sức lao động."] },
  { id: "shift-half-new-value", type: "numeric", prompt: "Trong ví dụ xưởng sợi, 8 giờ tạo 30 USD giá trị mới với tốc độ đều. Sau 4 giờ đầu, giá trị mới là bao nhiêu USD?", correctAnswer: 15, unit: "USD", explanation: ["Bốn giờ đầu là một nửa ca 8 giờ trong ví dụ.", "Giá trị mới của giai đoạn này bằng 15 USD, vừa bù đắp giá trị sức lao động."] },
  { id: "shift-second-cotton", type: "numeric", prompt: "Mẻ sợi thứ hai sử dụng thêm 50 USD bông và 3 USD hao mòn máy. Giá trị c chuyển vào mẻ này là bao nhiêu USD?", correctAnswer: 53, unit: "USD", explanation: ["c gồm giá trị bông và hao mòn máy chuyển vào sản phẩm.", "50 + 3 = 53 USD."] },
  { id: "second-batch-value", type: "numeric", prompt: "Mẻ sợi thứ hai có 50 USD bông, 3 USD hao mòn máy và 15 USD giá trị mới. Giá trị mẻ sợi là bao nhiêu USD?", correctAnswer: 68, unit: "USD", explanation: ["Cộng giá trị c chuyển vào và giá trị mới của mẻ.", "50 + 3 + 15 = 68 USD."] },
  { id: "constant-capital-unchanged", type: "choice", prompt: "Vì sao bông và hao mòn máy thuộc tư bản bất biến c?", choices: [
    { id: "A", text: "Vì chúng trực tiếp tạo ra giá trị mới lớn hơn bản thân." }, { id: "B", text: "Vì chúng là tiền công của công nhân." }, { id: "C", text: "Vì giá trị của chúng được bảo tồn và chuyển vào sản phẩm." }, { id: "D", text: "Vì chúng chỉ xuất hiện khi bán hàng." },
  ], correctAnswer: "C", explanation: ["Tư liệu sản xuất chuyển giá trị cũ vào sản phẩm nhờ lao động cụ thể.", "Bản thân chúng không tạo ra giá trị thặng dư mới."] },
  { id: "abstract-labor-role", type: "choice", prompt: "Trong sản xuất sợi, mặt nào của lao động tạo ra giá trị mới v + m?", choices: [
    { id: "A", text: "Lao động cụ thể." }, { id: "B", text: "Giá trị máy móc." }, { id: "C", text: "Trao đổi hàng hóa." }, { id: "D", text: "Lao động trừu tượng." },
  ], correctAnswer: "D", explanation: ["Lao động cụ thể chuyển giá trị tư liệu sản xuất vào sợi.", "Lao động trừu tượng tạo ra giá trị mới gồm v và m."] },
  { id: "value-formula-application", type: "numeric", prompt: "Một ví dụ có c = 80, v = 20 và m = 10. Theo G = c + (v + m), G bằng bao nhiêu?", correctAnswer: 110, unit: "đơn vị giá trị", explanation: ["Giá trị hàng hóa gồm giá trị cũ chuyển vào và giá trị mới.", "G = 80 + (20 + 10) = 110."] },
  { id: "surplus-not-advanced", type: "choice", prompt: "Khoản nào chưa có sẵn trong số tư bản ứng trước c + v?", choices: [
    { id: "A", text: "Giá trị thặng dư m." }, { id: "B", text: "Giá trị bông tiêu dùng." }, { id: "C", text: "Tiền mua sức lao động." }, { id: "D", text: "Hao mòn máy dự tính." },
  ], correctAnswer: "A", explanation: ["Tư bản ứng trước dùng mua tư liệu sản xuất c và sức lao động v.", "m chỉ hình thành từ lao động thặng dư trong quá trình sản xuất."] },
];
