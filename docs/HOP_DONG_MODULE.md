# Hợp đồng module và tiêu chí kiểm tra

Tài liệu này là điểm thống nhất ban đầu; nhóm có thể chỉnh interface trong ngày 1 trước khi các module triển khai song song.

## Route

`/` → `/learn/chapter-1` → `/learn/chapter-2` → `/learn/chapter-3` → `/learn/chapter-4` → `/challenge` là luồng P0. Campaign Map do M1 xây dựng trên nền Next.js App Router, có thể nằm ở Landing hoặc `/campaign`. `/sandbox` chỉ là route placeholder P1, không chặn luồng P0.

## Ranh giới code

- `features/market`: Bot, Commodity, Trade, MarketConfig, MarketState; hàm khởi tạo, thực hiện một lượt, thống kê và reset. Không phụ thuộc React.
- `features/factory`: thông số đầu vào, trạng thái theo giờ, hàm tính c/v/m/G. Không phụ thuộc React.
- `features/labor`, `features/value`, `features/quiz`: đánh giá đáp án và trạng thái bài học.
- `features/progress`: trạng thái nhiệm vụ **trong phiên chơi** cho P0; lưu/khôi phục bằng localStorage là P1. M1 sở hữu state, M8 hỗ trợ schema và kiểm thử.
- `content`: dữ liệu tình huống, câu hỏi, giải thích và nguồn tham khảo; không chứa logic hiển thị.
- `components`: hiển thị, animation, biểu đồ, điều khiển; chỉ gọi logic qua API của `features`.

Giữ Next.js App Router, TypeScript và Tailwind hiện có. Market/Factory Engine chạy phía client; không cần backend API cho MVP. Dùng Zustand khi việc chia sẻ state thực sự cần, không phải yêu cầu mặc định. M5 chỉ làm công thức Sandbox sau khi P0 đạt [cổng quyết định P1](PHAN_CONG_9_THANH_VIEN.md#cổng-quyết-định-có-làm-p1).

## Bất biến và kiểm tra tối thiểu

| Module | Điều kiện hoàn thành |
|---|---|
| Market | 100 ID riêng; 2 loại hàng; giao dịch không tạo số âm; tổng tiền, số hàng và giá trị tham chiếu giữ nguyên; Start/Pause/Reset và tham số hoạt động |
| Labor | Ít nhất 3 tình huống; hai điều kiện và hai thuộc tính của hàng hóa sức lao động; phản hồi đúng/sai và giải thích |
| Factory | 0 giờ chưa có sản phẩm; 4 giờ giá trị mới 15, m = 0; 8 giờ giá trị mới 30, m = 15, G = 136; dừng hỏi ở mốc 4 giờ |
| Value | Phân loại bông/máy móc/sức lao động/giá trị thặng dư; phản hồi; G = c + (v + m) = 136 |
| Quiz | Ít nhất 10 câu, mỗi câu có đáp án và giải thích; chấm điểm đúng; làm lại không lỗi |

## Nguồn nội dung và giả định mô phỏng

Bản diễn giải giáo trình do người dùng cung cấp được lưu tại [TRICH_XUAT_GIAO_TRINH_CHUONG_3.md](TRICH_XUAT_GIAO_TRINH_CHUONG_3.md). Nguồn ghi trong bản trích: Bộ Giáo dục và Đào tạo (2021), *Giáo trình Kinh tế chính trị Mác – Lênin*, NXB Chính trị quốc gia Sự thật, tr. 77–85. Mapping bốn chương nằm trong `content/references.ts`. Chưa đối chiếu bản in gốc, vì vậy cần kiểm tra số trang và cách diễn đạt trước khi trích dẫn nguyên văn.

- Chương 1: H – T – H, T – H – T', T' = T + ΔT; trao đổi không tự tạo giá trị mới trong phạm vi phân tích của tài liệu. **100 bot, hai loại hàng, xác suất, margin và các bất biến thị trường đóng là thiết kế mô phỏng của dự án**, không phải số liệu trong giáo trình.
- Chương 2: sức lao động khác lao động; hai điều kiện để sức lao động thành hàng hóa; giá trị và giá trị sử dụng, trong đó giá trị gồm ba bộ phận được bản trích nêu rõ.
- Chương 3: ví dụ sợi có hai lượt 4 giờ. Sau 4 giờ: bông 50 + hao mòn 3 + giá trị mới 15 = sản phẩm 68 USD; chưa có m. Sau 8 giờ: bông 100 + hao mòn 6 + sức lao động 15 = ứng trước 121 USD; giá trị mới 30, sản phẩm 136, m = 15 USD. Việc nội suy liên tục giữa các mốc chỉ phục vụ animation.
- Chương 4: c = 106 USD, v = 15 USD, m = 15 USD; G = c + (v + m) = 136 USD. Bông và hao mòn máy móc thuộc c; sức lao động thuộc v; m là phần giá trị mới dôi ra, không phải loại tư bản ứng trước.
