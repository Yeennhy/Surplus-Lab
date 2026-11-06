# Tiến độ Surplus Lab trong 6 ngày

**Cách dùng:** Điền `Ngày thực tế`, tên người, trạng thái (`Chưa làm` / `Đang làm` / `Chờ review` / `Hoàn thành` / `Bị chặn`) và link PR/minh chứng. Mã vai trò M1–M9 theo [file phân công chính thức](PHAN_CONG_9_THANH_VIEN.md); tên người chưa được gán. Ngày 1–4 chỉ làm P0; ngày 5 sửa P0 và chỉ bắt đầu P1 nếu đạt cổng kiểm tra; ngày 6 release, không thêm chức năng lớn. Cập nhật đầu ngày về việc làm/phụ thuộc và cuối ngày về kết quả/lỗi. Không đánh dấu hoàn thành nếu chưa chạy/kiểm tra được.

**Ngày bắt đầu:** _chưa chốt_ · **Repo:** [Yeennhy/Surplus-Lab](https://github.com/Yeennhy/Surplus-Lab) · **Staging:** _chưa có_ · **Production:** _chưa có_

## Ngày 1 – Nền tảng và hợp đồng kỹ thuật

**Ngày thực tế:** ___ · **Mốc:** MS1 Foundation Ready

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Kiểm tra khung Next.js, TypeScript, Tailwind, lint, route, Git; chuẩn bị staging | Project chạy trên máy nhóm; các route mở được; deploy thử | M1 + M9 | Đang làm | Khung project hiện tại; staging chưa có |
| Chốt màu, font, layout desktop và component chung | Figma/wireframe và quy tắc UI được chia sẻ | M1 | Chưa làm | — |
| Chốt `Bot`, `Commodity`, `Trade`, `MarketSnapshot` và thuật toán giao dịch | Interface/pseudocode được UI thị trường chấp nhận | M3 + M2 | Chưa làm | — |
| Phác thảo UI thị trường bằng mock | Bot, controls, dashboard theo schema đã chốt | M2 | Chưa làm | — |
| Chốt flow chương 2 và thẻ chương 4 | ≥3 tình huống, phân loại c/v/m, component skeleton | M6 | Chưa làm | — |
| Chốt Factory Engine và test case | Model và mốc 0/4/8 giờ đối chiếu giáo trình | M5 + M4 | Chưa làm | — |
| Phác thảo nhà máy 2D bằng mock | Scene, timeline, danh sách asset | M4 | Chưa làm | — |
| Chốt cấu trúc quiz và UI câu hỏi mẫu | Schema Question/QuizResult và mock | M7 + M8 | Chưa làm | — |
| Chuẩn hóa dữ liệu chương/quiz, game state trong phiên | Dữ liệu mẫu và schema hỗ trợ M1/M7; không phụ thuộc Sandbox | M8 | Chưa làm | — |
| Test plan, đối chiếu nguồn/Figma và cấu trúc | Danh sách kiểm thử theo module | M9 | Chưa làm | — |

**Checkpoint cuối ngày:** Mọi người chạy được project, hiểu interface dùng chung, có branch riêng; repo, staging, design system và nội dung nền đã sẵn sàng.

## Ngày 2 – Logic nền tảng

**Ngày thực tế:** ___ · **Mốc:** MS2 Engines Ready

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Layout, navigation, Campaign Map và Landing | Đi qua các route chính | M1 | Chưa làm | — |
| Market Engine: 100 bot, 2 hàng hóa, giao dịch và kiểm tra hợp lệ | Nhiều giao dịch chạy được; giao interface cho UI | M3 | Chưa làm | — |
| UI thị trường: bot, Start/Pause/Reset, speed/probability/margin | Controls và network bản đầu | M2 | Chưa làm | — |
| Chương 2: hai điều kiện sức lao động thành hàng hóa | Mini-game đầu tiên | M6 | Chưa làm | — |
| Factory Engine: c, v, m, G theo giờ | Tính đúng số liệu giáo trình; giao interface cho UI | M5 | Chưa làm | — |
| Scene nhà máy: bông, máy, công nhân, sản phẩm | Giao diện 2D bản đầu | M4 | Chưa làm | — |
| Chương 4: phân loại và công thức | Tương tác cơ bản | M6 | Chưa làm | — |
| Quiz: submit, kiểm tra đáp án và điểm | Chạy với dữ liệu mẫu | M7 | Chưa làm | — |
| Tích hợp dữ liệu chương/quiz và test module | Nội dung mẫu dùng được; bug được ghi | M8 + M9 | Chưa làm | — |

**Checkpoint cuối ngày:** Hai engine chạy được và bàn giao API; Landing, mini-game và scene có bản đầu; các module có thể tích hợp.

## Ngày 3 – Tương tác và tích hợp đầu tiên

**Ngày thực tế:** ___ · **Mốc:** MS3 Interactive Demo

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Game state mở khóa trong phiên chơi | Nhiệm vụ locked/unlocked/completed, chưa cần localStorage | M1 + M8 | Chưa làm | — |
| Market Engine: thống kê, bất biến, unit test | Tổng tiền/hàng/giá trị tham chiếu được bảo toàn | M3 | Chưa làm | — |
| Nối Market Engine với UI và biểu đồ cơ bản | Chương 1 mô phỏng trực tiếp | M2 | Chưa làm | — |
| Hoàn thiện chương 2 và 4 | Chơi được, có giải thích và phân loại c/v/m | M6 | Chưa làm | — |
| Factory Engine: tính timeline, test 0/4/8 giờ | Giá trị mới 0/15/30; m tại 4/8 giờ là 0/15 | M5 | Chưa làm | — |
| Nối nhà máy với timeline, chuyển động cơ bản, dashboard | Chương 3 chạy 8 giờ | M4 | Chưa làm | — |
| Quiz kết quả, giải thích và làm lại | Hoạt động với dữ liệu mẫu | M7 | Chưa làm | — |
| Tích hợp nội dung/quiz và test module độc lập | Dữ liệu đúng schema, không đợi Sandbox | M8 | Chưa làm | — |
| QA liên module, đối chiếu công thức và ghi bug | Danh sách lỗi có mức ưu tiên | M9 | Chưa làm | — |

**Checkpoint cuối ngày:** Bốn chương có tương tác; quiz nhận đáp án; mọi module chạy độc lập và ghép được vào layout.

## Ngày 4 – Hoàn thành P0 và đóng phạm vi

**Ngày thực tế:** ___ · **Mốc:** MS4 Feature Complete

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Tích hợp hành trình Landing → Quiz qua Campaign Map | Không kẹt luồng hoặc lỗi runtime, chưa cần lưu sau refresh | M1 + M9 | Chưa làm | — |
| Thống nhất giao diện và responsive desktop cơ bản | UI P0 sử dụng được | M1 | Chưa làm | — |
| Kiểm thử Market Engine: 100 bot, biên tham số, nhiều giao dịch | Bất biến và điều kiện giao dịch đạt | M3 | Chưa làm | — |
| Hoàn thiện chương 1: controls, chỉ số, biểu đồ cơ bản | Chương 1 P0 hoàn chỉnh | M2 | Chưa làm | — |
| Hoàn thiện chương 2/4: hướng dẫn, feedback, kết quả | Chương 2/4 P0 hoàn chỉnh | M6 | Chưa làm | — |
| Kiểm tra công thức và trường hợp biên nhà máy | c=106, v=15, m=15, G=136 tại 8 giờ | M5 | Chưa làm | — |
| Hoàn thiện scene nhà máy và mốc hỏi 4 giờ | Chương 3 P0 hoàn chỉnh | M4 | Chưa làm | — |
| Hoàn thiện quiz và trang kết quả | ≥10 câu có giải thích; làm lại được | M7 + M8 | Chưa làm | — |
| Đối chiếu nội dung, trạng thái câu hỏi, test luồng P0; deploy staging | Báo cáo QA nội dung và URL staging | M8 + M9 | Chưa làm | — |

**Checkpoint cuối ngày:** Tất cả P0 hoạt động trên staging, số liệu được kiểm tra; chưa bắt đầu P1 nếu chưa qua cổng quyết định.

## Ngày 5 – Hoàn thiện P0; P1 có điều kiện

**Ngày thực tế:** ___ · **Mốc:** MS5 Release Candidate

| Việc cần làm | Đầu ra/điều kiện kiểm tra | Người phụ trách | Trạng thái | PR/minh chứng |
|---|---|---|---|---|
| Review, merge, build và kiểm tra deploy P0 | Build không lỗi | M1 + M9 | Chưa làm | — |
| Sửa lỗi giao diện/chuyển chương và responsive P0 | Giao diện đồng nhất, không kẹt luồng | M1 + M2 + M4 + M6 | Chưa làm | — |
| Stress test Market Engine và các bất biến | Unit test đạt | M3 | Chưa làm | — |
| Kiểm tra công thức nhà máy và trường hợp biên | Factory Engine ổn định | M5 | Chưa làm | — |
| Kiểm tra quiz: điểm, làm lại, kết quả và ≥10 câu | Không lỗi nghiêm trọng | M7 + M8 | Chưa làm | — |
| End-to-end, QA nội dung, tổng hợp và xác nhận bug | Báo cáo test; không còn Critical/High | M9 | Chưa làm | — |
| Chỉ sau khi đạt đủ cổng P0: xem xét P1 | M5/M8: Sandbox; M8: localStorage; thành viên khác: nâng cấp nhỏ nếu không ảnh hưởng release | M5 + M8 + M9 | Chưa làm | Ghi kết quả cổng P0 trước khi bắt đầu |

**Cổng P1:** Market chạy và test bảo toàn đạt; Factory đủ 8 giờ với c/v/m/G đúng; Labor Power và phân loại hoạt động; Quiz chấm điểm với dữ liệu mẫu; có luồng Landing → kết quả trong một phiên; không còn lỗi nghiêm trọng chặn gameplay. Nếu thiếu một điều kiện, tiếp tục sửa P0. **Checkpoint cuối ngày:** Có release candidate, danh sách lỗi nhỏ còn lại và người xử lý.

## Ngày 6 – Regression, phát hành và thuyết trình

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

**Quy tắc ngày 6:** Không thêm chức năng lớn; chỉ sửa lỗi, kiểm thử lại, triển khai và chuẩn bị demo. P1 chỉ xuất hiện trong bản phát hành nếu đã hoàn thành và không ảnh hưởng P0.

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
