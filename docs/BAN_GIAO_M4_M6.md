# Bàn giao M4 và M6 – chương 2, 3, 4

## Phạm vi đã hiện thực

| Thành viên | Route | Chức năng |
|---|---|---|
| M6 | `/learn/chapter-2` | Chọn một trong ba nhân vật; kiểm tra đồng thời hai điều kiện để sức lao động thành hàng hóa; phản hồi khi sai và cho chọn lại; giải thích hai thuộc tính và ba bộ phận giá trị sức lao động. |
| M4 | `/learn/chapter-3` | Chuẩn bị bông, máy, sức lao động; chỉ khởi động khi đủ ba thứ; màn 0 giờ; đồng hồ 8 giờ, Pause/Resume/Restart; dừng ở 4 giờ, hỏi và giải thích; inspect bông/máy/lao động; báo cáo 8 giờ từ Factory Engine. |
| M6 | `/learn/chapter-4` | Lý thuyết c/v, bốn thẻ bông/máy/sức lao động/thặng dư; kéo thả thẻ vào vùng c/v/m, chuyển giữa các vùng hoặc kéo về hàng trên; chọn thẻ rồi chọn vùng bằng bàn phím; phản hồi thẻ sai, giữ thẻ đúng để sửa; kết quả `G = c + (v + m)`. |

Giao diện tái sử dụng `components/chapters/game-shell.tsx` và các asset SVG Figma được lưu ở `public/assets/figma/`. Phần logic đánh giá nằm trong `features/labor/` và `features/value/`; Chương 3 gọi `features/factory/` của M5. Không có công thức tính kinh tế sao chép vào component.

## Frame Figma đã đối chiếu

- Chương 2: chọn nhân vật `43:1915`, phản hồi sai `64:13694`, hai điều kiện `44:3138`, hai thuộc tính `55:6991`.
- Chương 3: chuẩn bị `55:7339`/`63:11317`, 0 giờ `55:7695`, đang chạy `63:11686`, tạm dừng/kiểm tra `63:12064` và câu hỏi `44:3500`, inspect `63:12435`, 8 giờ `57:8579`, kết quả `44:3861`/`63:12805`.
- Chương 4: lý thuyết `55:8047`, phân loại `46:4014`, kéo thẻ `64:12962`, sai `64:13339`, thành công `46:4398`.

Các frame là những trạng thái của ba route tương tác, không tạo một route riêng cho từng frame. Ảnh bản đồ, minh họa xưởng, chân dung và nền biểu tượng đều lấy từ asset Figma đã tải về. Frame đang chạy ở giờ 6 dùng `G = 128,5` như **minh họa với đầu vào của cả ca**; giao diện ghi riêng giá trị sản phẩm đã tạo tới giờ 6 là `102 USD` theo nội suy của engine. Hai đại lượng có nhãn khác nhau.

## Hợp đồng với M1/M9

- Khi hoàn tất chương 2, 3 hoặc 4, UI phát `CustomEvent` tên `surplus-lab:chapter-completed`, với `detail.chapter` bằng `2`, `3` hoặc `4`; mã nằm trong `features/progress/events.ts`. M1 có thể lắng nghe để cập nhật Campaign Map trong phiên. Repo hiện chưa có GameProgress do M1 xây dựng, vì vậy event chưa được phản ánh lên bản đồ nhiệm vụ.
- Chương 3 sử dụng đúng các mốc: 0 giờ chưa có sản phẩm; 4 giờ `c = 53`, giá trị mới `15`, `m = 0`, `G = 68`; 8 giờ `c = 106`, `v = 15`, `m = 15`, `G = 136` USD.
- `npm run test` chạy 9 test logic. `npm run lint`, `npm run typecheck`, `npm run build` đã đạt. Kiểm tra trình duyệt desktop đã đi qua lựa chọn đúng/sai chương 2, Pause và checkpoint chương 3, phân loại đúng/sai chương 4; tất cả asset nhìn thấy tải được.

## Kiểm tra nhanh khi tích hợp

1. Mở chương 2, thử A hoặc C để xem điều kiện chưa đạt, sau đó chọn B và đọc hai thuộc tính.
2. Mở chương 3, chuẩn bị sức lao động, chạy ca, Pause khoảng giữa và kiểm tra đồng hồ đứng yên; tiếp tục tới 4 giờ, trả lời câu hỏi, chạy tới 8 giờ và đọc bảng `106/15/15/136`.
3. Mở chương 4, đặt máy vào v để xem giải thích sai; thử lại, chuyển máy sang c, hoàn tất các thẻ và xem công thức.
4. M9 kiểm tra lại trên staging sau khi M1 tích hợp GameProgress. Sandbox và lưu tiến độ sau refresh vẫn thuộc P1 có điều kiện.
