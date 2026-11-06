# PROJECT PROPOSAL: SURPLUS LAB – THE FACTORY OF VALUE

## I. TỔNG QUAN Ý TƯỞNG PROJECT

| Hạng mục | Nội dung chi tiết |
| --- | --- |
| Tên project | SURPLUS LAB – The Factory of Value |
| Chủ đề | Mô phỏng quá trình vận động của tư bản và sự hình thành giá trị thặng dư theo lý luận của C. Mác. |
| Ý tưởng chính | Xây dựng một website tương tác, trong đó người dùng đóng vai người vận hành một nhà máy sản xuất sợi. Thông qua việc mua nguyên liệu, sử dụng máy móc, thuê sức lao động và tổ chức sản xuất, người dùng khám phá cách giá trị thặng dư hình thành. |
| Vấn đề cần giải quyết | Các khái niệm như tư bản, hàng hóa sức lao động, lao động tất yếu, lao động thặng dư, tư bản bất biến và tư bản khả biến khá trừu tượng. Việc chỉ đọc lý thuyết có thể khiến người học khó hình dung được mối liên hệ giữa chúng. |
| Giải pháp | Chuyển các khái niệm thành hoạt động tương tác, tình huống, sơ đồ giá trị, mô phỏng thời gian lao động và bài tập ứng dụng. |
| Điểm nổi bật | Người học không chỉ đọc lý thuyết mà trực tiếp thay đổi biến số, quan sát quá trình tạo ra giá trị, thực hiện nhiệm vụ và nhận phản hồi giải thích. |
| Phạm vi triển khai | Một website gồm trang giới thiệu, bốn chương tương tác, mô phỏng nhà máy, hệ thống câu hỏi kiểm tra và phần tổng kết kiến thức. |
| Định hướng thiết kế | Phong cách nhà máy công nghiệp kết hợp dashboard hiện đại, sử dụng animation 2D và biểu đồ tương tác. |

### Mô tả ý tưởng tổng thể

Người dùng bắt đầu với vai trò là người được giao vận hành một nhà máy sản xuất sợi.
Ban đầu, người chơi chỉ có một lượng tiền nhất định và được giới thiệu hai hình thức vận động của tiền: H – T – H và T – H – T'.

Người chơi thực hiện các hoạt động mua bán để tìm hiểu vì sao việc trao đổi hàng hóa thông thường không tự tạo ra giá trị mới cho toàn xã hội.

Mô phỏng hoạt động trao đổi hàng hóa giữa nhiều chủ thể trong một nền kinh tế thu nhỏ, nhằm minh họa luận điểm của C. Mác rằng lưu thông hàng hóa thông thường không tự tạo ra giá trị tăng thêm trên phạm vi toàn xã hội.

**Ý tưởng triển khai:** Hệ thống tạo khoảng 100 bot giao dịch, mỗi bot sở hữu một lượng tiền và hàng hóa ban đầu. Các bot thực hiện mua bán ngẫu nhiên theo xác suất được thiết lập. Người chơi có thể điều chỉnh xác suất giao dịch, mức tăng hoặc giảm giá bán so với giá trị tham chiếu và tốc độ mô phỏng.

**Các loại hàng hóa:**

- Hàng hóa thiết yếu: Có xác suất được lựa chọn giao dịch cao hơn.
- Hàng hóa không thiết yếu: Có xác suất được lựa chọn giao dịch thấp hơn.

**Cơ chế hoạt động:**

- Khởi tạo 100 bot với tiền và hàng hóa.
- Tại mỗi lượt mô phỏng, hệ thống chọn các cặp bot và loại hàng hóa theo xác suất.
- Thực hiện giao dịch nếu người bán có hàng và người mua có đủ tiền.
- Chuyển tiền và hàng giữa các bot mà không tự tạo thêm tiền hoặc hàng hóa.
- Liên tục cập nhật các chỉ số và biểu đồ.
- Cho phép người học thay đổi tham số và so sánh kết quả.

**Thông tin trực quan hóa:**

- Tổng lượng tiền trong toàn bộ hệ thống.
- Tổng số hàng hóa theo từng loại.
- Tổng giá trị hàng hóa theo giá trị tham chiếu cố định.
- Số lượng giao dịch thành công.
- Sự thay đổi tiền và tài sản của từng bot.
- Phân phối tài sản giữa các bot sau nhiều lượt giao dịch.

**Kiến thức áp dụng từ giáo trình:**

- Công thức chung của tư bản: T – H – T'.
- Phân biệt trao đổi ngang giá và không ngang giá.
- Sự khác biệt giữa lợi ích cá nhân trong giao dịch và giá trị tăng thêm của toàn xã hội.
- Lập luận rằng lưu thông thông thường không tự tạo ra giá trị thặng dư trên phạm vi toàn xã hội.

Tiếp theo, người chơi được giới thiệu hàng hóa sức lao động, tìm hiểu điều kiện để sức lao động trở thành hàng hóa và sự khác biệt giữa giá trị với giá trị sử dụng của nó.
Sau khi chuẩn bị đầy đủ tư liệu sản xuất và sức lao động, người chơi vận hành một nhà máy sợi trong 8 giờ lao động giả định. Thông qua thanh thời gian, người chơi quan sát giá trị mới được tạo ra và nhận thấy sự xuất hiện của giá trị thặng dư sau thời gian lao động tất yếu.
Cuối cùng, người chơi phân tích giá trị sản phẩm thành các bộ phận c, v và m để hiểu vai trò của tư bản bất biến, tư bản khả biến và nguồn gốc giá trị thặng dư.

## II. CẤU TRÚC PROJECT VÀ MỐI LIÊN HỆ VỚI BÀI HỌC

| Module | Tên chức năng | Hoạt động của người dùng | Kiến thức áp dụng từ giáo trình | Mục đích học tập |
| --- | --- | --- | --- | --- |
| Module 0 | Landing Page | Xem giới thiệu, lựa chọn bắt đầu trải nghiệm, theo dõi lộ trình bốn chương. | Tổng quan Chương 3 – Giá trị thặng dư trong nền kinh tế thị trường. | Giúp người học hiểu chủ đề và mục tiêu của project. |
| Module 1 | The Capital Mystery | Tham gia mô phỏng hai hình thức lưu thông H – T – H và T – H – T'. | Công thức chung của tư bản, mục đích của lưu thông, nguồn gốc giá trị thặng dư. | Phân biệt lưu thông hàng hóa giản đơn và lưu thông tư bản. |
| Module 2 | The Special Commodity | Phân tích các tình huống về người lao động, xác định điều kiện để sức lao động trở thành hàng hóa và khám phá hai thuộc tính của nó. | Hàng hóa sức lao động, hai điều kiện hình thành, giá trị và giá trị sử dụng. | Hiểu vì sao sức lao động là hàng hóa đặc biệt. |
| Module 3 | Inside the Factory | Mua nguyên liệu, chuẩn bị máy móc, thuê sức lao động, vận hành nhà máy sợi và quan sát giá trị hình thành theo thời gian. | Sự sản xuất giá trị thặng dư, lao động tất yếu, lao động thặng dư và ví dụ sản xuất sợi trong giáo trình. | Hiểu trực tiếp cách giá trị thặng dư được tạo ra. |
| Module 4 | Anatomy of Value | Phân loại các thành phần giá trị và xây dựng công thức G = c + (v + m). | Tư bản bất biến (c), tư bản khả biến (v), giá trị thặng dư (m). | Phân biệt vai trò của tư liệu sản xuất và sức lao động trong quá trình hình thành giá trị hàng hóa. |
| Module 5 | Final Challenge | Giải quyết các câu hỏi tình huống, bài tập tính toán và câu hỏi phân tích. | Tổng hợp cả bốn nội dung đã học. | Kiểm tra khả năng ghi nhớ, hiểu và vận dụng kiến thức. |
| Module 6 | Economic Sandbox (mở rộng) | Thay đổi các thông số giả định và quan sát kết quả tính toán. | Giá trị mới, thời gian lao động tất yếu, lao động thặng dư và công thức giá trị hàng hóa. | Hiểu sự liên hệ giữa các đại lượng trong mô hình lý luận. |
