# Surplus Lab – The Factory of Value

Website học tương tác về giá trị thặng dư, triển khai theo [ý tưởng dự án](docs/IDEA.md). Người học đi từ thị trường 100 bot, hàng hóa sức lao động, nhà máy sợi đến cơ cấu giá trị rồi làm thử thách cuối.

## Chạy và kiểm tra

Yêu cầu Node.js 20.9 trở lên.

```bash
npm install
npm run dev
npm run test
npm run typecheck
npm run lint
npm run build
```

## Cấu trúc

```text
app/                         Next.js App Router; page.tsx chỉ nối route với màn hình
  page.tsx                   Trang lộ trình
  learn/chapter-[1-4]/       Bốn chương
  challenge/                 Kiểm tra cuối
  sandbox/                   Phần mở rộng P1
frontend/components/
  chapters/chapter-1/        Mô phỏng thị trường
  chapters/chapter-2/        Điều tra sức lao động
  chapters/chapter-3/        Nhà máy sợi
  chapters/chapter-4/        Phân tích c, v, m
  chapters/game-shell.*      Khung điều hướng dùng chung
  quiz/                      Giao diện thử thách
  layout/                    Hiển thị tiến độ trên lộ trình
backend/content/             Nội dung bài học, câu hỏi, tài liệu tham khảo
backend/domain/              Quy tắc tính toán thuần TypeScript, không phụ thuộc React
  market/                    Logic Chương 1
  labor/                     Logic Chương 2
  factory/                   Logic Chương 3
  value/                     Logic Chương 4
  quiz/, progress/, sandbox/ Logic dùng chung và phần mở rộng
public/fonts/                Be Vietnam Pro, phục vụ trực tiếp từ project
tests/                       Test các quy tắc và bất biến
```

`backend/domain` là lớp nghiệp vụ tách khỏi giao diện; ở bản MVP nó chạy trong trình duyệt. Dự án chưa có API, tài khoản hay database, vì các chương không cần giao tiếp máy chủ. Tiến độ Chương 2–4 và trạng thái hoàn thành được lưu trong `localStorage`; nếu trình duyệt tắt lưu trữ, bài học vẫn chạy trong phiên hiện tại. Chương 1 khởi tạo lại mỗi lần mở trang để kết quả thí nghiệm luôn rõ ràng.

| Route | Vai trò | Kết thúc bằng |
| --- | --- | --- |
| `/` | Lộ trình, vào từng chương | Chọn chương hoặc thử thách |
| `/learn/chapter-1` | Giao dịch giữa 100 bot, kiểm tra bất biến | Câu hỏi về lưu thông → Chương 2 |
| `/learn/chapter-2` | Điều tra điều kiện hàng hóa sức lao động | Hợp đồng 8 giờ → Chương 3 |
| `/learn/chapter-3` | Chuẩn bị và vận hành nhà máy | Báo cáo ca → Chương 4 |
| `/learn/chapter-4` | Phân loại c, v, m và chứng minh G | Tổng kết → thử thách |
| `/challenge` | 10 câu hỏi có giải thích và làm lại | Kết quả |
| `/sandbox` | Chỗ dành cho phần mở rộng P1 | Chưa thuộc luồng học chính |

Logic kinh tế học ở `backend/domain`; UI chỉ điều khiển và hiển thị. Ví dụ giáo trình của ca 8 giờ: tư bản ứng trước `121 USD`, `c = 106`, `v = 15`, giá trị mới `30`, `m = 15`, giá trị sợi `G = 136 USD`. Các giờ giữa mốc 0, 4, 8 dùng nội suy để minh họa. Chương 1 dùng giá trị tham chiếu cố định khi chứng minh tổng tiền và tổng hàng của thị trường đóng được bảo toàn.
