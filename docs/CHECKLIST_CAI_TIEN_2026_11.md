# Checklist cải tiến trải nghiệm học

- [x] Đọc ý tưởng, giáo trình, cấu trúc và luồng trong mã nguồn; rà 51 frame Figma và đối chiếu các màn chính.
- [x] Việt hóa nội dung hiển thị, thương hiệu, nhãn truy cập và tiêu đề trang.
- [x] Làm bản đồ bốn chương; chỉ tô màu chặng đã mở; chặn trực tiếp URL chương và thử thách chưa mở.
- [x] Mở rộng ngân hàng từ 30 lên 47 câu theo bản trích giáo trình; chọn 10 câu và xáo đáp án mỗi lượt.
- [x] Sửa vị trí nhãn biểu đồ; thêm sàn 100 bot, lịch sử, tài sản bot và tiến độ; yêu cầu 8 lượt rồi mới trả lời.
- [x] Câu sai ở thị trường chỉ nhận gợi ý; câu đúng mở màn chuyển chương; xác nhận khi đặt lại.
- [x] Giải thích từng điều kiện sai ở hồ sơ sức lao động và cho tiếp tục học.
- [x] Chỉnh hình công nhân để chân nối đúng thân.
- [x] Làm mới thử thách cuối: đường tiến độ, xáo đáp án, điểm lần đầu, nhật ký 10 câu; dựng khu thử nghiệm và thư viện kiến thức.
- [x] Kiểm tra giao diện desktop, điện thoại; luồng khóa, mô phỏng, phản hồi, kết quả và so sánh kịch bản bằng Chromium.
- [x] Chạy TypeScript, ESLint, 39 bài test và build production.

## Vòng cải tiến giao diện và luồng chơi

- [x] Bỏ nút “Tiếp tục Chương 1” ở phần mở đầu; biến toàn bộ trạm trên bản đồ thành vùng chọn chương, chặng chưa mở giữ màu xám.
- [x] Chuyển nút hoàn thành Chương 1, 2, 3, 4 về bản đồ; chỉ chặng vừa mở mới sáng lên; thử thách cuối vẫn yêu cầu đủ bốn chương.
- [x] Bổ sung bảng số liệu trực tiếp trên sàn 100 bot: lượt hiện tại, số giao dịch, tiền chuyển tay, giá trị hàng toàn sàn và ID từng bot.
- [x] Tự mở câu hỏi nổi sau tám lượt; làm mờ nền; trả lời sai chỉ hiện gợi ý; trả lời đúng mở cảnh chuyển về bản đồ.
- [x] Thay emoji không sát nội dung ở hồ sơ sức lao động bằng minh họa nhân vật; thêm dấu xác minh và ba chứng cứ ở màn hoàn thành.
- [x] Màn giá trị sức lao động: đọc câu hỏi rồi thả năm vật thể tròn bay và lơ lửng; chọn đúng ba mục để kiểm tra.
- [x] Bỏ câu “Dây chuyền đã sẵn sàng! Bông → Xơ → Sợi → Cuộn thành phẩm” và khung xanh trống; tô ba nguồn giá trị bằng ba màu c, v, m, kiểm tra xong mới mở Chương 4.
- [x] Làm phản hồi thử thách thành màn đối chiếu trực quan và lộ trình giải thích; bảng kết quả cho mở từng câu để xem đáp án đã chọn và lời giải.
- [x] Cho truy cập trực tiếp khu thử nghiệm; thêm đường về bản đồ và lưu kết quả trong phiên để quay lại đúng bảng kết quả từ /sandbox.
- [x] Rà trên Chromium: bản đồ, tám lượt bot, phản hồi đúng/sai, mở chặng 2, vật thể lơ lửng, tô sai rồi sửa màu, xem lại câu hỏi và điều hướng sandbox.
- [x] Rà năm trang ở màn hình 390 px: không tràn ngang; chạy lại typecheck, lint, 39 test và build.

Ghi chú: 51 frame Figma là tập trạng thái và minh họa tham chiếu. Phần giao diện được thiết kế lại theo hệ màu, chất liệu và nội dung của đồ án thay vì sao chép từng frame theo pixel.

## Cấu trúc và luồng đã kiểm tra

- `app/` khai báo các trang; `frontend/components/` chứa giao diện tương tác; `backend/domain/` giữ quy tắc mô phỏng; `backend/content/` giữ nội dung học và câu hỏi.
- Người học đi theo thứ tự: bản đồ → thị trường 100 bot → bản đồ → điều tra sức lao động → bản đồ → vận hành xưởng sợi → bản đồ → giải mã c, v, m → bản đồ → 10 câu thử thách. Khu thử nghiệm và thư viện kiến thức là phần hỗ trợ.
- Tiến độ và bản nháp chương được lưu trong trình duyệt. Hiện dự án chưa kết nối một cơ sở dữ liệu riêng; `backend/content/questions.ts` là nguồn dữ liệu câu hỏi đang được ứng dụng đọc trực tiếp.
