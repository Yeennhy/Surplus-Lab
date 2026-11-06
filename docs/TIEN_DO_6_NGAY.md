# Tiến độ Surplus Lab trong 6 ngày

**Cách dùng:** Điền `Ngày thực tế`, `Người phụ trách`, trạng thái (`Chưa làm` / `Đang làm` / `Chờ review` / `Hoàn thành` / `Bị chặn`) và link PR/minh chứng. Mã M01–M09 trong kế hoạch gốc chỉ là vai trò đề xuất; bảng này chưa gán người. Cập nhật đầu ngày về việc làm và phụ thuộc, cuối ngày về kết quả và lỗi. Không đánh dấu hoàn thành nếu chưa chạy/kiểm tra được.

**Ngày bắt đầu:** _chưa chốt_ · **Repo:** _chưa tạo Git_ · **Staging:** _chưa có_ · **Production:** _chưa có_

## Ngày 1 – Nền tảng và hợp đồng kỹ thuật

**Ngày thực tế:** ___ · **Mốc:** MS1 Foundation Ready

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Khởi tạo Next.js, TypeScript, Tailwind, lint, route, Git và staging | Project chạy trên máy nhóm; các route mở được; deploy thử | — | Đang làm | Khung project hiện tại |
| Chốt màu, font, layout desktop và component chung | Figma/wireframe và quy tắc UI được chia sẻ | — | Chưa làm | — |
| Chốt `Bot`, `Commodity`, `Trade`, `MarketState` và thuật toán giao dịch | Interface/pseudocode được UI thị trường chấp nhận | — | Chưa làm | — |
| Phác thảo UI thị trường | Wireframe bot, controls, dashboard; component skeleton | — | Chưa làm | — |
| Chốt flow chương 2 | ≥3 tình huống, lựa chọn và phản hồi; skeleton | — | Chưa làm | — |
| Chốt Factory Engine và test case | Model và mốc 0/4/8 giờ đối chiếu giáo trình | — | Chưa làm | — |
| Phác thảo nhà máy 2D | Wireframe, timeline, danh sách asset | — | Chưa làm | — |
| Chốt flow chương 4 và cấu trúc quiz | Thẻ c/v/m, công thức, schema câu hỏi | — | Chưa làm | — |
| Chuẩn hóa nội dung bốn chương | Nội dung, câu hỏi đầu tiên, bảng đối chiếu nguồn | — | Chưa làm | — |

**Checkpoint cuối ngày:** Mọi người chạy được project, hiểu interface dùng chung, có branch riêng; repo, staging, design system và nội dung nền đã sẵn sàng.

## Ngày 2 – Logic nền tảng

**Ngày thực tế:** ___ · **Mốc:** MS2 Engines Ready

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Layout, navigation, chapter wrapper | Đi qua các route chính | — | Chưa làm | — |
| Landing và UI chung | Trang chủ hoạt động cơ bản | — | Chưa làm | — |
| Market Engine: 100 bot, 2 hàng hóa, giao dịch và kiểm tra hợp lệ | Nhiều giao dịch chạy được; giao interface cho UI | — | Chưa làm | — |
| UI thị trường: bot, Start/Pause/Reset, speed/probability/margin | Controls và network bản đầu | — | Chưa làm | — |
| Chương 2: hai điều kiện sức lao động thành hàng hóa | Mini-game đầu tiên | — | Chưa làm | — |
| Factory Engine: c, v, m, G theo giờ | Tính đúng số liệu giáo trình; giao interface cho UI | — | Chưa làm | — |
| Scene nhà máy: bông, máy, công nhân, sản phẩm | Giao diện 2D bản đầu | — | Chưa làm | — |
| Chương 4: phân loại và công thức | Tương tác cơ bản | — | Chưa làm | — |
| Nội dung giải thích và bộ quiz | Bản dữ liệu đầu tiên có nguồn đối chiếu | — | Chưa làm | — |

**Checkpoint cuối ngày:** Hai engine chạy được và bàn giao API; Landing, mini-game và scene có bản đầu; các module có thể tích hợp.

## Ngày 3 – Tương tác và tích hợp đầu tiên

**Ngày thực tế:** ___ · **Mốc:** MS3 Interactive Demo

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Tích hợp module và xử lý routing/lỗi chung | Bản tích hợp đầu tiên | — | Chưa làm | — |
| Hoàn thiện Landing, navigation, chuyển cảnh và UI chung | Giao diện nhất quán | — | Chưa làm | — |
| Market Engine: thống kê, bất biến, unit test | Tổng tiền/hàng/giá trị tham chiếu được bảo toàn | — | Chưa làm | — |
| Nối Market Engine với UI và biểu đồ | Chương 1 mô phỏng trực tiếp | — | Chưa làm | — |
| Hoàn thiện chương 2 | Chơi từ đầu đến cuối, có giải thích | — | Chưa làm | — |
| Factory Engine: tính timeline, test 0/4/8 giờ | Giá trị mới 0/15/30; m tại 4/8 giờ là 0/15 | — | Chưa làm | — |
| Nối nhà máy với timeline, animation, dashboard | Chương 3 chạy 8 giờ | — | Chưa làm | — |
| Hoàn thiện chương 4 và lập trình quiz | Phân loại được; có thể trả lời câu hỏi | — | Chưa làm | — |
| QA nội dung chương 1–2 và ghi bug | Danh sách lỗi có mức ưu tiên | — | Chưa làm | — |

**Checkpoint cuối ngày:** Bốn chương có tương tác; quiz nhận đáp án; mọi module chạy độc lập và ghép được vào layout.

## Ngày 4 – Hoàn thành P0 và đóng phạm vi

**Ngày thực tế:** ___ · **Mốc:** MS4 Feature Complete

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Tích hợp hành trình Landing → Quiz | Không kẹt luồng hoặc lỗi runtime | — | Chưa làm | — |
| Thống nhất giao diện và responsive desktop | UI hoàn chỉnh phiên bản đầu | — | Chưa làm | — |
| Kiểm thử Market Engine: 100 bot, biên tham số, nhiều giao dịch | Bất biến và điều kiện giao dịch đạt | — | Chưa làm | — |
| Hoàn thiện chương 1: animation, thống kê, biểu đồ | Chương 1 feature complete | — | Chưa làm | — |
| Hoàn thiện chương 2: hướng dẫn, feedback, kết quả | Chương 2 feature complete | — | Chưa làm | — |
| Kiểm tra công thức và trường hợp biên nhà máy | c=106, v=15, m=15, G=136 tại 8 giờ | — | Chưa làm | — |
| Hoàn thiện scene nhà máy và mốc hỏi 4 giờ | Chương 3 feature complete | — | Chưa làm | — |
| Hoàn thiện chương 4, quiz và trang kết quả | ≥10 câu có giải thích; reset/làm lại được | — | Chưa làm | — |
| Đối chiếu nội dung toàn site với giáo trình; deploy staging | Báo cáo QA nội dung và URL staging | — | Chưa làm | — |

**Checkpoint cuối ngày:** Tất cả P0 hoạt động trên staging, số liệu được kiểm tra; đóng phạm vi tính năng mới.

## Ngày 5 – Kiểm thử và bản phát hành thử

**Ngày thực tế:** ___ · **Mốc:** MS5 Release Candidate

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Review, merge, build và kiểm tra deploy | Build không lỗi | — | Chưa làm | — |
| Polish UI, spacing, typography, responsive | Giao diện đồng nhất | — | Chưa làm | — |
| Stress test Market Engine và các bất biến | Unit test đạt | — | Chưa làm | — |
| Kiểm tra biểu đồ và hiệu năng 100 bot | Chương 1 chạy ổn định | — | Chưa làm | — |
| Thử luồng chương 2, sửa hướng dẫn khó hiểu | Không kẹt luồng | — | Chưa làm | — |
| Kiểm tra công thức nhà máy và trường hợp biên | Factory Engine ổn định | — | Chưa làm | — |
| Tối ưu animation nhà máy | Chương 3 chạy ổn định | — | Chưa làm | — |
| Kiểm tra quiz: điểm, reset, làm lại, kết quả | Không lỗi nghiêm trọng | — | Chưa làm | — |
| End-to-end thủ công, QA nội dung, tổng hợp và xác nhận bug | Báo cáo test; không còn Critical/High | — | Chưa làm | — |
| Nếu P0 đã ổn định: chọn tối đa một P1 | localStorage **hoặc** Sandbox đơn giản | — | Chưa làm | — |

**Checkpoint cuối ngày:** Có release candidate, danh sách lỗi nhỏ còn lại và người xử lý; không còn lỗi Critical/High.

## Ngày 6 – Phát hành và thuyết trình

**Ngày thực tế:** ___ · **Mốc:** MS6 Final Release

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Build cuối, deploy production, kiểm tra URL | Site chính thức truy cập được | — | Chưa làm | — |
| Kiểm tra UI cuối và chụp ảnh | Ảnh cho demo/slide | — | Chưa làm | — |
| Kiểm tra Market Engine và kịch bản dữ liệu mẫu | Mô phỏng ổn định khi trình bày | — | Chưa làm | — |
| Tập thao tác demo chương 1 | Controls, biểu đồ, chỉ số chạy được | — | Chưa làm | — |
| Chuẩn bị trình bày chương 2 | Giải thích hai điều kiện và hai thuộc tính | — | Chưa làm | — |
| Kiểm tra Factory Engine và lời giải thích | Mốc 4/8 giờ, G=136 chính xác | — | Chưa làm | — |
| Tập demo nhà máy | Timeline và animation chạy được | — | Chưa làm | — |
| Kiểm tra chương 4 và quiz | Kết quả và làm lại hoạt động | — | Chưa làm | — |
| Slide, tổng duyệt 7–10 phút, video dự phòng | Slide, video, phân công người nói | — | Chưa làm | — |

**Checkpoint cuối ngày:** Production, GitHub, slide, video dự phòng và người thuyết trình đã sẵn sàng.

## Nhật ký cập nhật

| Ngày | Đầu ngày: việc làm/phụ thuộc/blocker | Cuối ngày: hoàn thành/PR/demo/lỗi | Người cập nhật |
|---|---|---|---|
| Ngày 1 | — | — | — |
| Ngày 2 | — | — | — |
| Ngày 3 | — | — | — |
| Ngày 4 | — | — | — |
| Ngày 5 | — | — | — |
| Ngày 6 | — | — | — |

## Tiêu chuẩn hoàn thành một module

Chạy đúng yêu cầu; không lỗi runtime nghiêm trọng; số liệu/nội dung được đối chiếu; UI sử dụng được; reset/làm lại nếu cần; đã review và merge vào `develop`; chạy trên staging; có người khác thử chức năng.
