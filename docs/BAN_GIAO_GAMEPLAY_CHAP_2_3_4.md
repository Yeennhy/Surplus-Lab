# Bàn giao gameplay chương 2, 3, 4

## Đã triển khai

| Chương | Gameplay mới | Luật thuần |
| --- | --- | --- |
| 2 | Mở ba hồ sơ; đánh giá ma trận hai điều kiện; đề cử người phù hợp; lập hồ sơ ba nhóm giá trị sức lao động; chọn hợp đồng 8 giờ và dự đoán nơi giá trị sử dụng bộc lộ. Sai một ô được chỉ đúng chứng cứ và giữ các ô đúng. | `features/labor/index.ts`: `evaluateEvidenceGrid`, `evaluateLaborValueFile`, `evaluateLaborScenario`. |
| 3 | Lập phiếu mẻ 1, bật đường đi bông → tách xơ → con lăn → công nhân → cuộn, chạy thử và đọc nhật ký điểm nghẽn; chạy mẻ 1 tới 4 giờ; thử nhánh dừng m=0; lập phiếu mẻ 2, phát hiện khoản tiền công ghi trùng; chạy tới 8 giờ và đối chiếu hai cuộn 68 USD. Điều tra giờ 2/6 là tùy chọn; có pause, tua nhanh, bỏ qua đoạn đã xem và âm thanh xưởng tùy chọn. | `features/factory/gameplay.ts`: `validateBatchPlan`, `diagnoseLine`, `simulateBatch`, `getShiftLedger`; `engine.ts` giữ snapshot 0–8 giờ. |
| 4 | Truy nguồn bốn khoản bằng chứng cứ từ hợp đồng/sổ mẻ; phân loại c/v/m; tự cân hai tổng 121 và 136; bác bỏ ba báo cáo sai bằng chứng cứ; xếp chuỗi lập luận; xem kết quả theo mẻ, thời gian hoặc nguồn. | `features/value/index.ts`: `evaluateValueEvidence`, `calculatePlacedLedger`, `evaluateAuditEvidence`, `evaluateProofChain`. |

Hợp đồng và sổ hai mẻ được lưu qua `features/progress/artifacts.ts`. Mở trực tiếp chương 3/4 dùng dữ liệu mẫu của đúng ca giáo trình và có nhãn thông báo. Bản nháp từng chương được lưu riêng để refresh khôi phục; ca đang chạy trở về trạng thái tạm dừng sau refresh. Khi trình duyệt chặn local storage, lượt chơi hiện tại vẫn dùng được.

## Cách thử trên giao diện

1. Mở `/learn/chapter-2`. Mở từng hồ sơ. Thử đánh dấu A “thiếu tư liệu” hoặc đề cử A, nộp bảng để thấy chứng cứ mâu thuẫn. Điền bảng đúng (`A: đạt/chưa đạt`, `B: đạt/đạt`, `C: chưa đạt/đạt`) và đề cử B. Ở hồ sơ giá trị, thử chọn máy hoặc bông rồi sửa thành sinh hoạt + đào tạo + nuôi con. Ở hợp đồng, thử “15 USD mỗi 4 giờ”, sau đó chọn 15 USD/8 giờ và “trong nhà máy”.
2. Vào `/learn/chapter-3`. Chọn bông, máy, sức lao động; lập phiếu mẻ 1 `50/3/15`. Trong màn đường đi, chỉ bật tách xơ và cho xơ vào máy rồi chạy thử: nhật ký phải dừng ở trạm công nhân. Bật thêm hai kết nối còn thiếu, chạy thử lại, sản xuất mẻ 1. Dừng/tiếp tục hoặc tua nhanh; tại 4 giờ xem nhánh dừng (`m=0`), trở lại và trả lời “chưa xuất hiện”. Mẻ 2 mặc định có dòng tiền công ghi trùng: giữ `15` và kiểm tra để thấy lỗi, đổi về `0`, cấp `50/3`, chạy đến 8 giờ. Sổ phải là `c106/v15/m15/G136`, ứng trước `121`.
3. Vào `/learn/chapter-4`. Thử gắn “hao mòn máy” với hợp đồng để xem cảnh báo, rồi gắn đúng bốn nguồn: bông → hai phiếu bông, máy → sổ hao mòn, sức lao động → hợp đồng, m → mốc giờ 4–8. Kéo thẻ vào c/v/m. Ở sổ, chọn `121` cho vốn ứng trước và `136` cho sợi. Ở kiểm toán, gắn sổ máy/hợp đồng/mốc giờ 4–8 lần lượt cho ba nhận định. Xếp chuỗi `cũ chuyển vào → lao động tạo mới → phần vượt v thành m`.
4. Refresh giữa từng chương, dùng nhật ký chuyển route, thử màn rộng và màn điện thoại; các dữ liệu hợp đồng/sổ phải giữ đúng. Có nút chơi lại ở màn cuối chương 2/3/4.

## Kiểm tra tự động

- `npm run test`: 13 test đạt, gồm các mốc 4/8 giờ, một hợp đồng cho hai mẻ, chẩn đoán điểm nghẽn, bằng chứng và sổ chương 4.
- `npm run typecheck`: đạt.
- `npm run lint`: đạt.
- `npm run build`: đạt; cả ba route được tạo. HTTP `GET /learn/chapter-2`, `/learn/chapter-3`, `/learn/chapter-4` trả `200` trên server local.

Kiểm thử tương tác bằng ảnh chụp trình duyệt headless chưa thực hiện được trong môi trường chạy hiện tại vì Chrome/Edge không khởi tạo được renderer. Cần duyệt trực quan trong trình duyệt IDE trước khi chốt hình ảnh và cảm giác điều khiển.

## Quy tắc học thuật cần giữ khi sửa tiếp

- `15 USD` là giá trị sức lao động cho một hợp đồng 8 giờ; không chia USD cho ba nhóm nhu cầu khi giáo trình không nêu tỷ lệ.
- Sau 4 giờ: `c=53`, giá trị mới `15`, `m=0`, sợi `68`. Sau 8 giờ: `c=106`, giá trị mới `30`, `v=15`, `m=15`, sợi `136`, vốn ứng trước `121`.
- Máy và bông chuyển giá trị cũ; lao động tạo giá trị mới. Phản hồi hình ảnh và sổ phải tuân theo cùng snapshot.
- Giờ 2/6 là nội suy để mô phỏng. `G=102` ở giờ 6 là sản phẩm đã tạo; `128,5` của frame Figma là minh họa với đầu vào toàn ca, không dùng làm sản lượng thực tế.
