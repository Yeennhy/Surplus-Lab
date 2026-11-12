# Kế hoạch thiết kế lại gameplay chương 2, 3, 4

> Trạng thái: **kế hoạch triển khai**, chưa phải tính năng đã hoàn thành. Tài liệu này thay phần chương 2–4 của kế hoạch toàn dự án trước đó. Phạm vi chỉ gồm `/learn/chapter-2`, `/learn/chapter-3`, `/learn/chapter-4` và dữ liệu nối ba chương. Các chương khác, trang chủ và Final Challenge không thuộc đợt này.

## 1. Căn cứ và vấn đề cần giải quyết

- Lý thuyết: [`TRICH_XUAT_GIAO_TRINH_CHUONG_3.md`](./TRICH_XUAT_GIAO_TRINH_CHUONG_3.md), đặc biệt các mục hàng hóa sức lao động, sản xuất giá trị thặng dư, tư bản bất biến và tư bản khả biến.
- Flow và trách nhiệm: [`IDEA.md`](./IDEA.md), [`PHAN_CONG_9_THANH_VIEN.md`](./PHAN_CONG_9_THANH_VIEN.md), [`HOP_DONG_MODULE.md`](./HOP_DONG_MODULE.md), [`BAN_GIAO_M4_M6.md`](./BAN_GIAO_M4_M6.md).
- Mã hiện có: `components/chapters/labor-chapter.tsx`, `components/factory/factory-chapter.tsx`, `components/chapters/value-chapter.tsx`, các module `features/labor`, `features/factory`, `features/value`.
- Hiện trạng: chương 2 chọn một trong ba người rồi đọc giải thích; chương 3 chọn đầu vào, bấm chuỗi công đoạn và chờ đồng hồ với các câu hỏi ở giờ 2/4/6; chương 4 kéo bốn thẻ vào `c/v/m` rồi chọn nhận định. Hình ảnh đã khá hơn, nhưng lựa chọn hiếm khi làm thay đổi mô phỏng. Người chơi có thể qua màn bằng thử nút mà chưa cần tự xây dựng lập luận.

### Tiêu chuẩn của một nhiệm vụ thực sự có gameplay

Mỗi nhiệm vụ chính phải có đủ **mục tiêu quan sát được → thông tin cần điều tra → quyết định có nhiều phương án → quy tắc xử lý → hậu quả thể hiện bằng cảnh và số liệu → cơ hội sửa sai → chứng cứ ghi vào hồ sơ**. Kéo, thả, chạm, phím chỉ là cách nhập quyết định. Không tính số animation hoặc số nút là độ sâu trò chơi.

Nhịp lặp của cả ba chương: **quan sát → dự đoán → lắp phương án → chạy thử → đọc hậu quả → sửa/lý giải → lưu chứng cứ**. Màn giải thích xuất hiện đúng lúc người chơi cần giải quyết mâu thuẫn; tránh mở một trang lý thuyết dài trước khi chơi.

## 2. Cốt truyện chung: “15 USD đi đâu?”

| Chương | Vai trò của người chơi | Câu hỏi cốt lõi | Thứ mang sang chương sau |
| --- | --- | --- | --- |
| 2 — Sức lao động | Điều tra viên tuyển dụng và lập hợp đồng | Ai có thể bán sức lao động, và đã mua gì với 15 USD? | Hồ sơ hai điều kiện, hồ sơ giá trị sức lao động, hợp đồng **8 giờ/15 USD** |
| 3 — Trong nhà máy | Người điều phối và kiểm toán hai mẻ sợi | Làm sao 121 USD ứng trước thành 136 USD sản phẩm, phần 15 USD thêm từ đâu? | Sổ mẻ 1/2, ảnh trạng thái dây chuyền, mốc 4/8 giờ, nguồn của từng dòng giá trị |
| 4 — Giải phẫu giá trị | Kiểm toán viên độc lập | Có thể chứng minh `G = c + (v + m)` từ chính ca đã vận hành không? | Báo cáo giải trình hoàn chỉnh của ba chương |

Ba chương vẫn truy cập trực tiếp được để QA. Nếu chưa có hồ sơ trước đó, cung cấp **bộ dữ liệu mẫu của đúng ca sách giáo trình** và ghi rõ là dữ liệu mẫu; không chặn route. Khi đi theo thứ tự, dùng hồ sơ người chơi đã tạo. Lưu tiến độ ở client theo phiên hoặc local storage qua hợp đồng của M1/M8; không cần backend.

## 3. Rào chắn kiến thức: luật game phải giữ đúng

| Nội dung | Quy tắc phải bảo toàn trong game | Cách tránh hiểu sai |
| --- | --- | --- |
| Điều kiện hàng hóa sức lao động | Người lao động **tự do về thân thể** và **không có tư liệu sản xuất cần thiết**; cần đồng thời cả hai. | Không gắn nhãn đúng chỉ vì nhân vật nghèo, có tay nghề, hoặc đang nhận lương. |
| Giá trị sức lao động | Gắn với tư liệu sinh hoạt cần thiết, chi phí đào tạo, nuôi dưỡng thế hệ người lao động. | 15 USD là giá trị sức lao động trong ví dụ; tài liệu không cho tỷ lệ USD của từng bộ phận, nên chỉ phân tích định tính. |
| Hai thuộc tính | Giá trị sử dụng của sức lao động bộc lộ trong quá trình lao động, có khả năng tạo giá trị mới lớn hơn giá trị bản thân nó. | Không mô tả “mua người” hay “mua sản phẩm 15 USD”; hợp đồng mua quyền sử dụng sức lao động trong ca 8 giờ của mô hình. |
| Lao động cụ thể / trừu tượng | Lao động cụ thể trong quá trình sản xuất giúp **chuyển** giá trị cũ của bông/máy vào sợi; lao động trừu tượng tạo **giá trị mới**. | Máy, bông không tự tạo `m`; hoạt họa dòng giá trị phải đi đúng nguồn. |
| Mẻ 1, giờ 0–4 | 50 USD bông + 3 USD hao mòn + 15 USD giá trị mới = 68 USD sợi; giá trị mới vừa bù `v=15`, `m=0`. | 15 USD hợp đồng đã ứng cho toàn ca, không phải một lần trả cho 4 giờ. |
| Mẻ 2, giờ 4–8 | Thêm 50 USD bông + 3 USD hao mòn, dùng **tiếp** sức lao động trong cùng hợp đồng; thêm 15 USD giá trị mới. | Không thêm một khoản `v=15` thứ hai. Sản phẩm mẻ 2 cũng trị giá 68 USD; phần giá trị mới vượt v của toàn ca là m. |
| Tổng ca | `c=100+6=106`, `v=15`, `m=15`, giá trị mới `30`, vốn ứng trước `121`, giá trị sản phẩm `G=136`. | `121` là vốn ứng trước; `136` là giá trị sản phẩm; không gọi cả hai là doanh thu/lợi nhuận thực nhận. |
| Giờ 2 và 6 | Nếu mở trạm nghiên cứu phụ, số liệu dùng giả định nhịp tạo giá trị đều của mô phỏng. | Không trình bày các mốc nội suy như kết luận riêng của giáo trình. Ở giờ 6, giá trị sản phẩm đã làm ra là 102 USD, còn 128,5 USD là cách minh họa với toàn bộ đầu vào, không được trộn hai đại lượng. |

Không biến năng suất thao tác chuột, tốc độ máy hay nhạc nền thành nguyên nhân tạo `m`. Không thưởng điểm vì “trả công thấp hơn 15” hoặc vi phạm điều kiện lý thuyết. Sai lầm trong trò chơi là sai lầm **phân tích, bố trí đầu vào hoặc đọc sổ**, không phải mô phỏng hành vi xâm hại người lao động.

## 4. Chương 2 — Hồ sơ người lao động: trò suy luận bằng chứng

### 4.1 Mục tiêu, luật và cảm giác chơi

Người chơi nhận ba hồ sơ ứng viên cần kiểm tra để ký hợp đồng cho xưởng sợi: người sản xuất độc lập, người lao động làm thuê, người không tự do như dữ liệu hiện có. Trên bàn điều tra có hai dấu xác nhận: **có quyền tự quyết việc bán sức lao động** và **không sở hữu đủ tư liệu để tự sản xuất**. Màn đầu chỉ lộ tranh và lời kể trung tính; các câu mô tả hiện nay tiết lộ sẵn “tự do/có tư liệu/thiếu tư liệu” phải chuyển thành chứng cứ mở qua điều tra. Không được chọn ứng viên chỉ bằng tranh chân dung; phải gắn chứng cứ phù hợp vào cả hai cột rồi mới trình kết luận. Mỗi hồ sơ có chi tiết trực quan gắn với nghề và hoàn cảnh; các manh mối chính là thông tin có ích để suy luận, không phải trang trí.

Không có đồng hồ đếm ngược. Áp lực là **mâu thuẫn giữa hồ sơ và giả thuyết**, không phải phản xạ. Khi xác nhận sai, nhân vật/cảnh không bị “phạt”; sổ điều tra chỉ rõ chứng cứ nào bác bỏ nhận định, giữ các kết luận đúng, cho chỉnh một ô.

### 4.2 Ba nhiệm vụ liên tiếp

| Nhiệm vụ | Người chơi thực sự quyết định | Quy tắc và hậu quả | Sản phẩm học tập |
| --- | --- | --- | --- |
| A. Kiểm tra ứng viên | Mở chứng cứ trên bàn, điền ma trận 3 người × 2 điều kiện và chọn người phù hợp; mỗi kết luận phải kèm 1 chứng cứ. | Chọn người tự sản xuất được: dấu “có tư liệu” làm giả thuyết sai. Chọn người không tự do bán sức lao động: chứng cứ pháp lý làm giả thuyết sai. Người phù hợp phải đạt cả hai cột. | Hồ sơ lý giải vì sao một người đạt, hai người không. |
| B. Định giá sức lao động | Xây “hồ sơ tái sản xuất sức lao động” từ nhóm sinh hoạt, đào tạo, nuôi con; loại các mảnh bông/máy/lợi nhuận. | Mảnh sai khiến hồ sơ thiếu nhất quán và nêu lý do. Không chia 15 USD thành các phần tự bịa. Sau khi đủ 3 nhóm, hiện 15 USD của ví dụ. | Phân biệt giá trị sức lao động với nguyên liệu, tư liệu sản xuất và sản phẩm. |
| C. Ký hợp đồng có lập luận | Chọn điều khoản **sức lao động dùng trong 8 giờ/15 USD**; dự đoán nơi giá trị sử dụng bộc lộ và liệu 15 USD có giới hạn giá trị mới không. | Chọn “trả 15 USD mỗi 4 giờ” làm báo trước lỗi ngân sách sẽ xuất hiện ở chương 3; cho sửa trước khi chuyển. Chọn “mua thành phẩm” làm cảnh xưởng chưa thể mở. | Một hợp đồng hợp lệ và dự đoán cần kiểm chứng ở chương 3. |

**Bố cục màn:** bản đồ ca nhỏ phía trên; bên trái ba nhân vật khác nhau đang làm việc trong bối cảnh của họ, giữa là bàn chứng cứ, bên phải là ma trận và hồ sơ. Chọn manh mối sẽ chiếu sáng chi tiết trên nhân vật/cảnh, kết nối bằng sợi chỉ điều tra. Khi chốt đúng, con dấu đóng từng điều kiện, giấy hợp đồng đi vào cặp tài liệu của người chơi. Đoạn chuyển sang nhà máy: xe chở bông và người lao động đi qua cùng một đường phố vào cổng xưởng; có thể bỏ qua.

**Gợi ý theo tầng:** lần 1 hỏi “người này có thể tự bán sức lao động không?”; lần 2 hướng tới chứng cứ đang bỏ sót; lần 3 mới nêu cách so đồng thời hai điều kiện. Gợi ý không tự hoàn thành ma trận. Người chơi có thể xem lại chứng cứ bất cứ lúc nào.

**Điều kiện qua chương:** ma trận đúng và có bằng chứng, đủ ba bộ phận định tính của giá trị sức lao động, hợp đồng 8 giờ hợp lệ. Một “thẻ suy luận” cuối màn yêu cầu ghép câu: “15 USD là giá trị ___; khả năng tạo ___ chỉ thấy khi ___”. Có phương án chọn bằng bàn phím và lời giải sau khi nộp.

### 4.3 Luồng trạng thái và ngoại lệ

`briefing → investigate → compare → value-file → contract → prediction → handoff`. Nút quay lại không xóa chứng cứ. Hồ sơ sai dẫn về `investigate` với vị trí ma trận giữ nguyên. Refresh khôi phục trạng thái hợp lệ gần nhất. Mở route chương 3 trực tiếp nhận hợp đồng mẫu, nhãn “dữ liệu mẫu”.

## 5. Chương 3 — Vận hành nhà máy: trò lắp dây chuyền và kiểm toán hai mẻ

### 5.1 Mục tiêu và tài nguyên

Mục tiêu là tạo **hai mẻ sợi hợp lệ trong cùng một ca 8 giờ**, giải thích tại sao giá trị sản phẩm cuối ca 136 USD trong khi vốn ứng trước là 121 USD. Người chơi quản lý sổ ứng trước, hai phiếu mẻ và một dây chuyền gồm kho bông → bộ mở/tách xơ → cặp con lăn kéo sợi → trạm công nhân gia công/quấn sợi → cuộn thành phẩm. Mỗi lần bố trí lại máy hoặc vật tư, kết quả chạy thử phải phản ánh đúng ngay trên cảnh.

Không biến câu đố thành “đặt đúng ba thẻ rồi xem video”. Người chơi phải **thiết kế cấu hình**, chạy một mẻ, đọc báo lỗi vật chất hoặc giá trị, sửa cấu hình, đối chiếu sổ và tự quyết định tiếp tục mẻ 2. Vật tư tiêu thụ trong mẻ 1; hợp đồng lao động có hiệu lực cả ca; máy vẫn thuộc dây chuyền nhưng ghi hao mòn mỗi mẻ. Sổ ghi từng khoản rõ thời điểm.

### 5.2 Cơ chế lõi và phản hồi

| Quy tắc gameplay | Hành động đúng | Thử sai có hậu quả thật | Cách phục hồi |
| --- | --- | --- | --- |
| Lập phiếu mẻ 1 | Cấp 50 USD bông, dự trù 3 USD hao mòn máy, dùng hợp đồng 15 USD/8 giờ. | Cấp thiếu bông: dòng xơ đứt; chọn thành phẩm/thặng dư làm đầu vào: kho báo “chưa tồn tại”; thiếu hợp đồng: công đoạn lao động chưa được kích hoạt. | Mở phiếu, chỉ sửa khoản lỗi; các khoản hợp lệ giữ lại. |
| Ghép dây chuyền | Nối bông vào bộ tách, dải xơ vào con lăn, sợi bán thành phẩm tới công nhân, rồi vào cuộn. | Nối sai thứ tự: vật liệu nằm chờ tại cổng trạm, máy chạy thử không có cuộn sợi; camera soi đúng vị trí nghẽn. | Thay một cổng nối, chạy thử 3–5 giây để xem kết quả. |
| Đọc hai dòng giá trị | Gắn bông/máy vào dòng “giá trị cũ chuyển vào”; gắn hoạt động lao động vào dòng “giá trị mới”. | Gắn máy vào dòng tạo mới: sổ tạm lệch, con lăn quay nhưng `m` không tự tăng; thẻ nguồn sai nhấp màu cảnh báo tại chính trạm máy. | Chuyển thẻ nguồn; sổ tính lại bằng engine. |
| Mốc 4 giờ | Dự đoán `50 + 3 + ? = 68`, kiểm tra giá trị mới 15 bằng v15 và chọn “tiếp tục”. | Nếu cho rằng đã có m, sổ mở hai ngăn so sánh `15−15=0`; lựa chọn **dừng ca ở 4 giờ** cho xem báo cáo nhánh kết thúc với `m=0` rồi cho tiếp tục cùng ca từ checkpoint. | Sửa giả thuyết, quay lại mốc 4 giờ; không chạy lại cả 4 giờ. |
| Lập phiếu mẻ 2 | Cấp thêm 50 USD bông, ghi thêm 3 USD hao mòn; tái sử dụng hợp đồng 8 giờ. | Trả thêm 15 USD cho cùng hợp đồng làm phiếu ứng trước thành 136 USD, hệ thống đánh dấu trùng chứng từ và không cho hợp thức hóa sổ 121. | Hủy đúng dòng trùng, giữ nguyên mẻ 1 và các kết nối. |
| Kết ca 8 giờ | Hai cuộn sợi, mỗi cuộn trị giá 68 USD; sổ tổng `c106/v15/m15/G136`. | Nếu tính m từ máy hay từ lần trả v thứ hai, sổ nguồn không cân: chỉ ra dòng nào không có chứng cứ vật chất/hợp đồng. | Mở lại chứng cứ theo mẻ, chỉnh sổ và chốt. |

### 5.3 Nhịp màn cụ thể, không bắt người chơi chờ đồng hồ

| Trạng thái | Thời lượng tương tác dự kiến | Câu hỏi/việc làm | Hình ảnh và âm thanh có ý nghĩa |
| --- | --- | --- | --- |
| 0. Nhận hợp đồng | 20–40 giây | Xem 15 USD mua sức lao động cho 8 giờ; xem ngân sách và dự đoán điều xưởng cần. | Xe đưa hợp đồng/bông đến kho; máy im, cuộn trống. |
| 1. Phiếu mẻ 1 | 1–2 phút | Chọn đầu vào, phân biệt vốn ứng trước và thành phẩm chưa tồn tại. | Vật tư đi vào đúng vị trí, sổ hóa đơn cộng theo lựa chọn; sai thì kho chỉ ngay món thiếu. |
| 2. Lắp và chạy thử | 1–2 phút | Nối bốn trạm, nhìn điểm nghẽn, tự sửa trước khi sản xuất. | Bông mở thành nhiều dải xơ, con lăn chỉ kéo khi được cấp xơ, công nhân giữ sợi/quấn cuộn. Âm thanh theo trạm hoạt động. |
| 3. Sản xuất mẻ 1 | 20–35 giây hoặc tua nhanh | Quan sát giá trị cũ và mới từ đâu tới; có thể pause/soi. | Dòng bông/máy đi vào cuộn, dòng giá trị mới tăng khi công nhân làm việc; cuộn sợi lớn dần. |
| 4. Bàn kiểm tra 4 giờ | Theo người chơi | Đọc `68`, suy ra `m=0`, chọn xem báo cáo dừng ca hoặc tiếp tục. | Nhà máy giảm âm và đóng băng **cùng** đồng hồ; sổ mẻ hiện trên bàn, cảnh nền vẫn thấy cuộn thứ nhất. |
| 5. Phiếu mẻ 2 | 30–60 giây | Quyết định vật tư cần cấp thêm, phát hiện chứng từ lương trùng. | Xe bông thứ hai đến, máy giữ cấu hình, công nhân tiếp tục cùng ca. |
| 6. Sản xuất mẻ 2 | 20–35 giây hoặc tua nhanh | So sánh hai mẻ; dự đoán phần giá trị mới vượt v. | Cuộn thứ hai hình thành; thanh v đã đủ 15 thì ngừng tăng, thanh m tăng tới 15. |
| 7. Báo cáo cuối ca | Theo người chơi | Tự ghép sổ hai mẻ; chốt kết luận nguồn 15 USD. | Hai cuộn lên bàn cân; 121 và 136 xuất hiện ở **hai nhãn khác nhau**; chuyển sổ sang chương 4. |

Thời gian thực chỉ dành cho hoạt họa ngắn có thông tin. Có nút **tạm dừng, tiếp tục, tua nhanh và bỏ qua đoạn đã xem**. Người chơi không cần chờ 8 × 5 giây mỗi lần thử lại. Trạm giờ 2/6 hiện tại trở thành “soi sâu” tùy chọn từ sổ mẻ; chúng không ngắt nhịp dây chuyền. Giá trị tại giờ lẻ có nhãn “mô phỏng với nhịp đều”.

### 5.4 Cảnh sản xuất phải biểu diễn nguyên nhân, không chạy lặp vô nghĩa

1. **Kho bông:** bông trong giỏ giảm khi mẻ dùng 50 USD; bông bung thành nhiều sợi xơ riêng, không phải một ảnh nguyên khối trượt ngang.
2. **Bộ mở/tách:** xơ rời đi theo các đường riêng; khi thiếu bông, không có hạt xơ mới. Khi nghẽn đầu ra, xơ chờ và cảnh có dấu cảnh báo ở điểm nghẽn.
3. **Máy kéo sợi:** con lăn xoay khi chạy thử nhưng chỉ kéo được sợi khi có xơ và nối đúng cổng. Sợi mảnh dần, không biến bông thẳng thành cuộn thành phẩm.
4. **Trạm công nhân:** nhân vật có chu kỳ tay lấy/kiểm/đưa sợi vào cuộn. Thiếu bước này, cuộn không tăng; ngữ cảnh giải thích lao động cụ thể và giá trị mới. Không mô tả công nhân chỉ đứng cạnh máy.
5. **Cuộn và sổ:** lớp sợi tăng theo tiến độ mẻ; nhãn giá trị lấy từ snapshot engine. Hai tuyến sáng có nhãn rõ: `cũ chuyển vào` từ bông/máy và `mới tạo ra` từ lao động. Chỉ sang phần `m` sau khi v đã được bù.
6. **Đồng bộ:** pause dừng đồng hồ, cảnh, âm thanh và thay đổi sổ bằng cùng state. Tua nhanh thay tốc độ hiển thị, **không** đổi số liệu kinh tế. Tắt nhạc không tắt tín hiệu bằng chữ. Hỗ trợ `prefers-reduced-motion`: thay chuyển động bằng các trạng thái rõ ràng.

### 5.5 Điều kiện thắng và chơi lại

Thắng khi hai mẻ hợp lệ, chứng từ không trùng, dây chuyền tạo hai cuộn, sổ cân `106+15+15=136`, và người chơi chỉ ra `m` gắn với lao động tiếp tục sau giờ 4. Có thể hoàn thành dù đã dùng gợi ý; “thành thạo” chỉ là huy hiệu phụ cho việc tự chẩn đoán ít lỗi. Thử lại cho quay về từng phiếu hoặc về đầu ca, không buộc xem lại animation đã hiểu. Nhánh dừng ở 4 giờ là phép thử giả thuyết hợp lệ, không coi là game over.

## 6. Chương 4 — Kiểm toán giá trị: trò ghép chứng cứ và bác bỏ sai lầm

### 6.1 Mục tiêu và luật

Màn mở bằng **hai cuộn sợi và sổ hai mẻ** của chính chương 3, chưa hiện công thức đầy đủ. Nhiệm vụ là truy vết từng phần của 136 USD và ký báo cáo kiểm toán. Người chơi không thể qua chỉ bằng đặt bốn biểu tượng vào c/v/m: mỗi dòng phải kèm **chứng cứ nguồn** và **giải thích vai trò**. Sổ có tổng phụ; nếu phân loại làm lệch sổ, mâu thuẫn hiện ngay tại dòng tương ứng.

### 6.2 Bốn vòng chơi

| Vòng | Quyết định | Quy tắc xử lý | Kết quả nhìn thấy |
| --- | --- | --- | --- |
| 1. Truy nguồn | Chọn 100 USD bông, 6 USD hao mòn, 15 USD sức lao động, 15 USD thặng dư từ hai mẻ; gắn mỗi khoản với hóa đơn hoặc mốc lao động. | Bông/máy có chứng từ đầu vào; v có hợp đồng; m không có hóa đơn ứng trước mà có chứng cứ giờ 4–8. | Mỗi thẻ sáng về trạm/mốc tương ứng; thẻ không có chứng cứ không được đóng dấu. |
| 2. Dựng sổ | Đặt 100+6 vào c, 15 hợp đồng vào v, 15 mới dôi ra vào m; tự điền `G = __ + (__ + __)`. | Sổ kiểm hai ràng buộc: cũ chuyển vào `106`, mới tạo `30`; vốn ứng trước `c+v=121`, sản phẩm `c+v+m=136`. | Hai thanh tổng 121/136 điền dần; nếu nhầm `m` vào 121, thanh ứng trước báo vượt và chỉ ra nguồn sai. |
| 3. Kiểm toán luận điểm | Xem 3 báo cáo sai: “máy tạo 6 USD giá trị mới”, “phải trả thêm 15 USD ở mẻ 2”, “m đã nằm trong 121 USD ban đầu”; chọn câu sai và gắn bằng chứng để bác bỏ. | Chỉ chọn Sai/Đúng không đủ; phải dùng chứng cứ từ trạm máy, hợp đồng 8 giờ hoặc sổ giờ 4/8. | Báo cáo có dấu đỏ ở luận điểm sai, sau đó đóng dấu xác minh khi chứng cứ phù hợp. |
| 4. Bảo vệ kết luận | Sắp ba mắt xích: cũ được chuyển vào → lao động tạo mới 30 → 15 bù v và 15 thành m. | Thứ tự và từ khóa phải phù hợp; có thể phát biểu bằng các mảnh câu truy cập được bằng bàn phím. | Sơ đồ tổng kết 106/15/15 mở dần, hồ sơ giải trình được ký. |

Cho chuyển đổi ba góc nhìn **theo mẻ, theo thời gian, theo nguồn**; đây là cách kiểm tra cùng một sổ, không phải ba bài lặp. Góc nhìn theo mẻ cho thấy 68+68; theo thời gian cho thấy m=0 ở 4h và m=15 ở 8h; theo nguồn cho thấy c106/v15/m15. Nhấn một dòng trong bất kỳ góc nhìn nào sẽ mở chứng cứ gốc ở chương 2 hoặc 3 mà không xóa tiến độ chương 4.

**Sai và hồi phục:** chuyển bông vào v thì sổ nhắc “thẻ này có hóa đơn vật tư, không phải hợp đồng sức lao động”; chuyển máy vào m thì cảnh máy được soi và cho thấy `m` chỉ bắt đầu sau mốc 4 giờ; phân loại đúng được giữ lại. Gợi ý cấp 1 chỉ nêu tổng phụ nào lệch, cấp 2 chỉ nguồn cần xem, cấp 3 mới trình bày phép tính. Không buộc xem lại bài lý thuyết dài để sửa một dòng.

**Điều kiện qua chương:** cả hai tổng cân, ba báo cáo sai được bác bỏ bằng chứng cứ, kết luận 3 mắt xích đúng. Báo cáo cuối có liên kết tới trích đoạn lý thuyết và ghi rõ giờ 2/6 là nội suy mô phỏng nếu từng bật trạm phụ.

## 7. Một lượt chơi mẫu để kiểm tra độ sâu của cơ chế

1. Người chơi nhìn ba ứng viên, ban đầu chọn người sản xuất độc lập vì người này tự quyết việc làm. Họ gắn chứng cứ “có xưởng và công cụ đủ để tự sản xuất” vào cột tư liệu; ma trận chỉ ra điều kiện thứ hai không đạt. Người chơi sửa **kết luận**, không phải làm lại toàn bộ hồ sơ.
2. Người chơi chọn người lao động làm thuê, tìm chứng cứ tự do ký hợp đồng và thiếu tư liệu, hoàn tất cả hai cột. Ở hồ sơ giá trị sức lao động, họ thử đặt “máy kéo sợi” cạnh sinh hoạt và đào tạo; máy bị trả về kho với lời giải rằng đây là tư liệu sản xuất của nhà máy. Họ bổ sung nhóm nuôi con, nhận hợp đồng 15 USD/8 giờ và dự đoán lao động có thể tạo giá trị mới lớn hơn 15 USD.
3. Vào xưởng, người chơi cấp bông và máy nhưng nối bông thẳng tới cuộn. Chạy thử cho thấy cuộn trống, xơ ùn ở cổng chưa nối. Sau khi nối qua bộ tách, con lăn và trạm công nhân, cảnh mới tạo sợi: bông chia thành xơ, máy kéo thành sợi, tay công nhân gia công rồi cuộn lớn lên. Sổ song song ghi giá trị cũ đang chuyển và giá trị mới đang tạo.
4. Đến 4 giờ, người chơi dự đoán đã có thặng dư vì thấy một cuộn sợi 68 USD. Bàn kiểm tra buộc tách `50+3` giá trị cũ khỏi `15` mới; so `15` mới với `v=15` sẽ cho `m=0`. Người chơi có thể xem báo cáo nếu dừng tại đây, rồi quyết định tiếp tục cùng hợp đồng.
5. Lập mẻ 2, người chơi thử thêm một hóa đơn tiền công 15 USD. Sổ hiển thị hai chứng từ cùng chỉ đến hợp đồng 8 giờ, nên không cân với vốn ứng trước 121. Người chơi xóa chứng từ trùng, cấp thêm 50 bông và 3 hao mòn. Mẻ 2 chạy, thanh v dừng ở 15 còn m tăng tới 15; hai cuộn 68 USD được đưa lên bàn kiểm toán.
6. Ở chương 4, người chơi ghép 100 bông + 6 hao mòn vào c, 15 hợp đồng vào v, 15 giá trị mới dôi ra vào m. Khi báo cáo nói “máy tạo ra 6 USD mới”, họ dùng chứng cứ chuyển giá trị từ trạm máy để bác bỏ. Kết luận tự ghép thành `106 + (15 + 15) = 136`. Họ hoàn thành bằng suy luận qua ba cảnh, chứ không nhấn tiếp trên sáu trang thuyết minh.

Trong playtest, nếu người chơi vẫn có thể bấm ngẫu nhiên để qua mà không nhận ra **điểm nghẽn, khoản trùng, hai dòng giá trị và chứng cứ bác bỏ**, phải sửa điều kiện thắng và phản hồi. Nếu người chơi hiểu đúng nhưng thấy các đoạn chạy máy kéo dài, rút ngắn animation hoặc cho tua; không thêm câu hỏi chặn đường.

## 8. Thiết kế tương tác, hình ảnh và nhịp cảm xúc chung

- Mỗi chương có một **vật thể chính** mang tiến độ: cặp hồ sơ/hợp đồng (2), hai cuộn sợi và phiếu mẻ (3), báo cáo kiểm toán (4). Cảnh chuyển vật thể thật qua màn để người chơi thấy quyết định trước có tác dụng sau.
- Âm thanh ngắn gắn với hành động có nghĩa: lật chứng cứ, đóng dấu hợp đồng, xe vào kho, máy có/thiếu vật liệu, sợi quấn cuộn, sổ cân. Âm thanh mặc định theo chính sách trình duyệt, có nút bật/tắt rõ, không dùng nhạc để che sự đơn giản của cơ chế.
- Phản hồi lỗi hiện tại điểm gây lỗi; overlay chữ nhật chỉ dùng ở mốc lý thuyết quan trọng (4h/8h), không bật sau mọi cú nhấn. Đúng có xác nhận lý do, sai có nguyên nhân và đường sửa. Màu không phải tín hiệu duy nhất.
- Màn hình nhỏ: bàn điều tra, dây chuyền, sổ kiểm toán chia thành tab/viewport có mini-map; không thu cả xưởng xuống kích thước khiến không đọc được. Desktop cho nhìn đồng thời cảnh và sổ.
- Hỗ trợ chuột, touch và bàn phím cho tất cả thao tác nối trạm, chọn bằng chứng, chuyển thẻ. Có nhãn accessible, focus rõ, mô tả trạng thái bằng chữ; `prefers-reduced-motion` và chế độ tắt âm giữ nguyên thông tin.
- Chơi lại để **thử giả thuyết khác**, không chỉ xem lại cảnh. Không dùng thời gian thao tác hoặc số lần nhấn làm điểm. Thưởng “tự tìm ra nguồn sai”, “sổ cân không cần gợi ý” là phụ; hoàn thành kiến thức là chính.

## 9. Thiết kế kỹ thuật và hợp đồng dữ liệu

### 9.1 Nguồn sự thật

`features/*` chứa luật và đánh giá thuần TypeScript; component chỉ hiển thị và gửi hành động. Một reducer/state machine điều phối mỗi chương. Cùng một `FactorySnapshot` và event log điều khiển **số liệu, animation, âm thanh, HUD**. Không có một bộ đếm CSS riêng khiến cuộn sợi vẫn chạy khi snapshot đã pause. Không tính lại công thức kinh tế rải trong JSX.

| Module | Bổ sung dự kiến | Ranh giới |
| --- | --- | --- |
| `features/labor/` | `LaborEvidence`, `CandidateVerdict`, `evaluateEvidenceGrid`, `validateLaborPowerFile`, `validateShiftContract`; trả mã lỗi + chứng cứ mâu thuẫn. | Giữ hai điều kiện, ba bộ phận định tính, hợp đồng 8 giờ. Không lưu UI state. |
| `features/factory/` (M5) | `BatchInput`, `BatchLedger`, `ShiftLedger`, `LineConfiguration`, `ProductionEvent`; hàm `validateBatch`, `simulateBatch`, `getShiftLedger`, `diagnoseLine`. | Giữ API engine hiện có ổn định hoặc có adapter; không tạo số tiền từ animation. Hợp đồng v dùng một lần cho cả ca. |
| `features/value/` | `ValueClaim`, `EvidenceRef`, `LedgerPlacement`, `evaluateLedger`, `evaluateAuditClaim`, `evaluateProofChain`. | Nhận ledger từ M5; không có bảng số liệu hardcode thứ hai. |
| `features/progress/` + nội dung | `ChapterArtifact` gồm hợp đồng, ledger và evidence IDs; sự kiện hoàn thành có payload/phiên bản; định dạng lưu tối thiểu. | M1/M8 tích hợp bản đồ; route trực tiếp dùng artifact mẫu. Nội dung lời giải tách khỏi component để M9 soát lý thuyết. |

Mô hình đầu ra tối thiểu của M5:

```ts
type ShiftLedger = {
  contract: { laborPowerValue: 15; hours: 8 };
  batches: [
    { hours: [0, 4]; cotton: 50; depreciation: 3; newValue: 15; productValue: 68 },
    { hours: [4, 8]; cotton: 50; depreciation: 3; newValue: 15; productValue: 68 },
  ];
  totals: { c: 106; v: 15; m: 15; capitalAdvanced: 121; productValue: 136 };
};
```

Đây là **ví dụ dữ liệu của ca chuẩn**, không phải type literal bắt mã chạy chỉ nhận các con số đó. Engine dùng `number` và validate bất biến. `BatchLedger` phải phân biệt **đã cấp/đã dùng/đã chuyển vào sản phẩm**; tránh hiện vốn ứng trước như sản phẩm đã tạo khi chưa chạy. Event log ví dụ: `CONTRACT_SIGNED`, `COTTON_ALLOCATED`, `LINE_BLOCKED`, `FIBERS_SPLIT`, `MACHINE_SPINNING`, `WORKER_PROCESSING`, `BATCH_COMPLETED`, `CHECKPOINT_REACHED`, `DUPLICATE_WAGE_REJECTED`, `SHIFT_COMPLETED`. UI dùng sự kiện để kể chuyện, không suy diễn từ CSS timer.

### 9.2 Giao diện state machine

- Chương 2: `briefing → investigate → value-file → contract → handoff`; kết luận sai quay về bước đang làm, giữ phần đúng.
- Chương 3: `briefing → batch1-plan → line-build → trial → batch1-run → checkpoint4 → batch2-plan → batch2-run → shift-report`; `paused`, `diagnosis`, `hypothesis-branch` là trạng thái con, không mở một route khác.
- Chương 4: `evidence → ledger → audit → proof → success`; sửa sai đưa về đúng vòng, không reset sổ.
- Mỗi transition có điều kiện rõ, một sự kiện analytics/testable, và khả năng khôi phục sau refresh. Các đoạn animation phát sau transition đã được engine chấp nhận; skip animation không skip điều kiện luật.

## 10. Thứ tự thực hiện, chủ sở hữu và đầu ra bàn giao

| Pha | Việc cụ thể | Chủ trì / phối hợp | Đầu ra có thể review |
| --- | --- | --- | --- |
| 0. Chốt kịch bản | Liệt kê từng quyết định, lỗi, giải thích và asset cho 2/3/4; M9 đối chiếu giáo trình; khóa số liệu 4h/8h. Đối chiếu frame Figma hiện có, thiết kế thêm frame cho bàn chứng cứ, phiếu mẻ, điểm nghẽn, sổ kiểm toán. | M4, M5, M6; M9 duyệt học thuật | Storyboard + bảng luật/đáp án và acceptance cases, không chỉ mockup đẹp. |
| 1. Dữ liệu xuyên chương | Định nghĩa `ChapterArtifact`, schema phiên bản, artifact mẫu, event hoàn thành; thống nhất luật source of truth. | M5, M6; M1/M8 tích hợp | Interface và mẫu JSON; route trực tiếp/chơi nối tiếp đều chạy. |
| 2. Chương 2 | Làm bảng chứng cứ, ma trận hai điều kiện, hồ sơ giá trị, hợp đồng, phản hồi sai và gợi ý tầng. | M6; M5 xác nhận contract input | Người chơi phải lập luận mới nhận hợp đồng; keyboard/touch hoạt động. |
| 3. Engine hai mẻ | Mở rộng engine bằng ledger mẻ, validate vật tư, hợp đồng dùng một lần, chẩn đoán cấu hình, event log; giữ các hàm cũ qua adapter. | **M5** | Unit tests có ý nghĩa cho 4h/8h, trùng v, thiếu đầu vào, pause/resume, thứ tự mẻ; API README. |
| 4. Nhà máy tương tác | Dựng bông tách xơ → con lăn → công nhân → cuộn; phiếu mẻ, chạy thử, điểm nghẽn, mốc 4h, nhánh dừng, mẻ 2, báo cáo. Âm thanh/skip/pause dựa trên state. | M4 + M5 | Demo tương tác 0→4→8, cảnh và sổ cùng snapshot, không còn chờ timer như hoạt động chính. |
| 5. Chương 4 | Tạo truy nguồn, dựng sổ, bác bỏ báo cáo bằng chứng cứ, kết luận 3 mắt xích; ba góc nhìn từ cùng ledger. | M6 + M5 | Người chơi tự lắp 136 và bảo vệ được nguồn 15 USD. |
| 6. Tích hợp và QA | Progress, lưu/khôi phục, direct route fallback, nội dung, responsive, keyboard, motion/audio settings, kiểm tra Figma. | M1/M8/M9; M4/M5/M6 sửa lỗi | Checklist và video 3 luồng: đúng, sai rồi sửa, quay lại/chơi tiếp. |

**Phụ thuộc bắt buộc:** pha 0–1 trước khi khóa component; API M5 và UI M4 có thể làm song song theo contract mẫu; chương 4 chỉ chốt sau khi `ShiftLedger` ổn định. Không mở rộng sang chapter 1, Final Challenge hoặc sandbox trong đợt này. Figma gốc làm nền ngôn ngữ hình ảnh; frame còn thiếu được thiết kế để phục vụ các trạng thái gameplay mới. Frame tham chiếu hiện có: chương 2 `43:1915`, `44:3138`, `55:6991`; chương 3 `55:7339`, `63:11686`, `63:12064`, `63:12805`; chương 4 `55:8047`, `46:4014`, `46:4398`.

## 11. Nghiệm thu: chứng minh game đã thú vị hơn bằng hành vi

1. **Chương 2:** người chơi không qua được bằng cách đoán người rồi bấm tiếp. Họ phải nêu bằng chứng cho cả hai điều kiện, tự loại mảnh không thuộc giá trị sức lao động, ký đúng hợp đồng 8 giờ. Sai một ô không xóa các ô đúng.
2. **Chương 3:** người chơi có thể cố ý nối sai dây chuyền và thấy đúng trạm nghẽn; tự sửa một chỗ là sản xuất chạy. Có hai phiếu mẻ, hai cuộn, một hợp đồng; dừng ở 4h cho `m=0`; cấp lặp 15 USD ở mẻ 2 bị phát hiện; cuối ca `121 → 136` được giải thích từ sổ.
3. **Chương 4:** chỉ kéo thẻ vào c/v/m không đủ qua màn. Người chơi phải truy nguồn, làm cân cả hai tổng, dùng chứng cứ bác bỏ ba khẳng định sai, rồi tự hoàn thành chuỗi lập luận.
4. **Flow:** ba chương nối bằng artifact thật; refresh, back/forward, mở route trực tiếp, pause, skip và replay không gây lệch số liệu hay mất trạng thái bất ngờ. Ở viewport điện thoại vẫn đọc được giá trị và biết trạm nào đang lỗi.
5. **Tính đúng:** test engine giữ các mốc 4/8, không nhân đôi v, không để máy tạo m; test UI kiểm tra một luồng đúng và ít nhất một luồng sai rồi sửa ở từng chương. M9 soát mọi lời giải theo giáo trình. Chạy `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` và kiểm tra trực tiếp trên trình duyệt trước bàn giao.

**Tiêu chí quyết định:** sau khi chơi, một người học chưa thuộc công thức vẫn có thể giải thích bằng chính hồ sơ của mình: **vì sao đã mua sức lao động 15 USD cho 8 giờ, tại sao giờ 4 chưa có m, tại sao giờ 8 có m=15, và 136 USD được cấu thành như thế nào**. Nếu không giải thích được, cần sửa cơ chế hoặc phản hồi trước khi thêm hiệu ứng mới.
