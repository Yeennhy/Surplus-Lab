import type { Question } from "@/features/quiz/types";

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
];