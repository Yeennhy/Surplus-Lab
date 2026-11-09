# Kế hoạch cải tiến trải nghiệm nhà máy sợi

## Cơ sở từ giáo trình

- Công nhân dùng **lao động cụ thể** để biến bông thành sợi và bảo toàn, chuyển giá trị bông cùng hao mòn máy vào sản phẩm.
- Cùng quá trình đó, **lao động trừu tượng** tạo giá trị mới. Máy và bông là điều kiện sản xuất, không tự tạo giá trị thặng dư.
- Trong ví dụ 8 giờ: 4 giờ đầu tạo 15 USD để bù giá trị sức lao động; 4 giờ sau tạo thêm 15 USD thành giá trị thặng dư. Giá trị sản phẩm cuối ca là `106 + (15 + 15) = 136 USD`.
- Ở giờ thứ 4, giá trị sản phẩm đã làm ra là 68 USD. Con số 121 USD là tư bản ứng cho **cả ca**; không dùng nó làm giá trị của sản phẩm đã làm ra tại mốc 4 giờ.

## Flow sẽ triển khai

1. **Chuẩn bị:** chọn bông, máy và sức lao động; giải thích vì sao sợi và giá trị thặng dư chưa phải đầu vào.
2. **Tự vận hành:** chọn đúng thứ tự tách xơ bông → kéo sợi → công nhân gia công. Cảnh sản xuất mở dần theo thao tác; chọn sai thì hiện lý do và cho thử lại.
3. **Quan sát sản xuất:** bông đi vào con lăn, sợi được kéo và công nhân cuộn sợi trong một cảnh liên tục. Mỗi trạm có thể bấm để tạm dừng và xem vai trò.
4. **Điều tra ở giờ 2:** người chơi phân biệt hai dòng giá trị: giá trị cũ chuyển vào từ tư liệu sản xuất và giá trị mới do lao động tạo ra. Phản hồi giải thích ngay theo lựa chọn.
5. **Suy luận ở giờ 4:** nhìn giá trị sản phẩm 68 USD, giá trị mới 15 USD và giá trị sức lao động 15 USD; tự trả lời `m` đã xuất hiện chưa rồi mới xem lời giải.
6. **Kiểm tra ở giờ 6:** dưới giả định tốc độ sản xuất đều, tính `m = 22,5 - 15 = 7,5 USD` và giá trị sợi thực tế `G = 79,5 + 22,5 = 102 USD` trước khi chạy hai giờ cuối.
7. **Kết thúc giờ 8:** đối chiếu thời gian, `c`, `v`, `m` và tổng `G`.
8. **Chương 4:** sau khi kéo thả phân loại, kiểm toán ba nhận định về hao mòn máy, tư bản ứng trước và vai trò hai mặt của lao động rồi mới mở màn giải mã.

## Nguyên tắc thực hiện

- Giữ `features/factory` là engine thuần và dùng các snapshot của engine để hiển thị số liệu.
- Chuyển động của cảnh sản xuất dừng khi ca tạm dừng và giảm theo `prefers-reduced-motion`.
- Điều khiển bằng chuột, chạm và bàn phím; trạng thái chọn có phản hồi bằng chữ.
- Kiểm tra build, test engine và đi hết flow trên desktop cùng điện thoại.

## Triển khai và kiểm chứng

- Cảnh sản xuất dùng một SVG liên tục: xơ bông tách thành các dải, đi vào con lăn quay, sợi đi ra và công nhân vận hành, cuộn sợi. Khi tạm dừng, mọi chuyển động của cảnh dừng theo.
- Thời gian mô phỏng tăng lên 5 giây mỗi giờ; người chơi có thể tạm dừng tại từng trạm để đọc vai trò của bông, máy và lao động.
- Nhiệm vụ giờ 2 có hai lượt chọn: bông + máy là nguồn giá trị cũ, rồi công nhân là nguồn giá trị mới. Phản hồi giải thích từng lựa chọn sai.
- Mốc giờ 4 trình bày `68 = 53 + 15` và `v = 15` nhưng chỉ đưa ra kết luận `m = 0` sau khi người chơi trả lời.
- Bảng khi máy chạy chỉ hiện giá trị sản phẩm thực tế tại thời điểm hiện tại; 121 USD được ghi riêng là tư bản ứng trước cho cả ca.
- Thử sai công đoạn hoặc phép tính không làm mất tiến độ; người chơi nhận gợi ý gắn với nguyên lý kinh tế chính trị và thử lại ngay.
- `npm run build`, `npm run lint`, `npm test` đều chạy thành công; luồng desktop và mobile được kiểm tra bằng trình duyệt.
