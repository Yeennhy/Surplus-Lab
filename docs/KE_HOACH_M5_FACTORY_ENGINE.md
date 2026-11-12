# Kế hoạch triển khai M5 – Factory & Economic Engine

**Vai trò:** M5, nhóm B – Production & Value. **Nhánh hiện tại:** `feature/factory-engine`.

## 1. Căn cứ và trạng thái ban đầu trước triển khai

- `IDEA.md`: Chương 3 mô phỏng nhà máy sợi, từ chuẩn bị bông/máy/sức lao động đến 8 giờ sản xuất; Chương 4 giải thích `G = c + (v + m)`.
- `PHAN_CONG_9_THANH_VIEN.md`: M5 sở hữu engine TypeScript và kiểm thử P0 trong `features/factory/`; chỉ làm phép tính Sandbox trong `features/sandbox/` khi cả nhóm thông qua cổng P1. M4 sở hữu UI chương 3; M6 sở hữu UI chương 4; M8 sở hữu UI Sandbox P1; M9 kiểm tra tích hợp.
- `HOP_DONG_MODULE.md` và bản trích giáo trình: sau 4 giờ, bông 50 + hao mòn máy 3 + giá trị mới 15 = sản phẩm 68 USD, `m = 0`; sau 8 giờ, `c = 100 + 6 = 106`, `v = 15`, giá trị mới 30, `m = 15`, `G = 136` USD. Nội suy giữa các mốc là giả định mô phỏng.
- Khi lập kế hoạch, repo dùng Next.js App Router + TypeScript + Tailwind; `features/factory/types.ts` mới có hai interface khung với các giá trị dạng literal, chưa có engine, test, `FactoryResult`, hay bộ chạy test. `app/learn/chapter-3/page.tsx` và `app/sandbox/page.tsx` còn là placeholder. Không coi bảng tiến độ là bằng chứng công việc đã hoàn thành.

## 2. Đầu ra và ranh giới

**P0 bắt buộc:** cấu hình ví dụ sợi, xác thực đầu vào, hàm thuần tính snapshot tại giờ bất kỳ trong `[0, 8]`, kết quả 8 giờ, dữ liệu checkpoint 4 giờ, test công thức và trường hợp biên, tài liệu API để M4/M6 dùng. Engine không import React, component, DOM, timer hay storage. Đồng hồ, Start/Pause/Resume/Restart, câu hỏi checkpoint, animation và sự kiện hoàn thành chương là trách nhiệm UI M4/M1; engine phải cung cấp dữ liệu để các hành vi đó chạy đúng.

**P1 có điều kiện:** hàm tính kịch bản Sandbox và so sánh/reset theo hợp đồng chốt với M8. Không triển khai route, slider hay localStorage trong phần việc M5. Chỉ bắt đầu P1 khi sáu điều kiện của cổng P0 trong `PHAN_CONG_9_THANH_VIEN.md` cùng đạt và M9 ghi nhận.

**Không mở rộng phạm vi:** không dựng backend, đổi framework, tự viết lại UI của M4/M6, hoặc sao chép công thức vào component.

## 3. Chuẩn bị trước khi code

1. Xác nhận branch `feature/factory-engine` đi từ `develop` mới nhất, working tree sạch và `npm install` hoàn tất; ghi kết quả lint/typecheck/build nền. Không tự merge hoặc ghi đè công việc của thành viên khác.
2. Đọc lại các mốc số trong bản trích, ghi rõ đây là **ví dụ sợi**, USD là đơn vị giá trị, 8 giờ gồm 4 giờ tất yếu + 4 giờ thặng dư. Nếu nhóm cần trích dẫn nguyên văn, chuyển M9 đối chiếu bản in gốc vì tài liệu repo mới là bản diễn giải.
3. Khi nhận Figma: xác định link file, các frame của setup/timeline/checkpoint/result/Sandbox, trạng thái 0–4–8 giờ, nhãn/đơn vị/độ chính xác số và dữ liệu UI cần. Lập bảng đối chiếu từng thành phần Figma với trường của `FactorySnapshot`/`FactoryResult`; ghi các khác biệt so với tài liệu để thống nhất với M4 trước khi thay logic. Figma chủ yếu quyết định hợp đồng dữ liệu và trạng thái hiển thị của M5; M4 hiện thực giao diện chương 3.
4. Chốt với M4 trong ngày 1: tên type, shape dữ liệu, cách báo cấu hình không hợp lệ, mốc checkpoint, cách reset; đưa ví dụ snapshot 0/4/8 giờ để M4 mock đúng schema trong ngày 1–2. Chốt với M6 trường kết quả cuối cho công thức Chương 4. Báo M9 hợp đồng và các giả định nội suy.

## 4. Hợp đồng API dự kiến để chốt với M4

Đây là đề xuất, **chưa phải API đã khóa**. Không đổi tên trường sau khi M4 bắt đầu tích hợp nếu chưa thông báo và cập nhật mock/test.

| Phần | Dữ liệu/hành vi dự kiến | Người dùng |
|---|---|---|
| `FactoryConfig` | `totalHours`, `necessaryHours`, `cottonValue`, `machineDepreciation`, `laborPowerValue`, `newValueTotal` là `number`; preset giáo trình riêng | M4, M8 P1 |
| `FactorySetup` hoặc input tương đương | Trạng thái bông, máy, sức lao động đã đủ/chưa đủ; tách khỏi trị số kinh tế | M4 |
| `validateFactoryConfig` / `validateFactorySetup` | Trả lỗi có mã, trường và thông báo; chặn số âm, `NaN`, `Infinity`, giờ sai giới hạn, tài nguyên thiếu; quy định quan hệ giữa `v`, tốc độ tạo giá trị mới và giờ tất yếu | M4 |
| `getFactorySnapshot(config, hour)` | Dữ liệu tích lũy: giờ, giai đoạn, giá trị bông/máy đã chuyển, `c` đã chuyển, giá trị mới, phần bù đắp `v`, `m`, `G`; đánh dấu mốc 4/8 giờ | M4 |
| `getFactoryResult(config)` | Tổng `c`, `v`, `m`, `G`, vốn ứng trước, giờ tất yếu/thặng dư và snapshot 4/8 giờ | M4, M6 |

**Quy tắc ngữ nghĩa:** `laborPowerValue = 15` là giá trị sức lao động được ứng trước cho cả 8 giờ. Ở giờ 0 chưa có sản phẩm: `G = 0`, giá trị mới và phần `v` đã được bù đắp đều bằng 0. Vì vậy snapshot phải phân biệt **vốn đã ứng trước** với **phần giá trị sức lao động đã được tái tạo trong sản phẩm**; không cộng `v = 15` vào `G` tại giờ 0. Tại 4 giờ, phần tái tạo `v = 15`, `m = 0`. Tại 8 giờ, `v = 15`, `m = 15`.

**Công thức cho preset P0:** với `h` trong `[0,8]`, nội suy `c(h) = 106 × h/8`, `newValue(h) = 30 × h/8`, `vReproduced(h) = min(newValue(h), 15)`, `m(h) = max(0, newValue(h) - 15)`, `G(h) = c(h) + newValue(h)`. Hai thành phần của `c` được nội suy riêng để UI có thể hiển thị bông và hao mòn máy. Mốc 0/4/8 phải ra số **chính xác**; mọi mốc giữa được gắn nhãn “ước tính để minh họa”. Quy tắc làm tròn chỉ áp dụng ở hiển thị, không làm tròn từng bước tính.

| Giờ | Bông đã chuyển | Máy đã chuyển | `c` | Giá trị mới | `v` đã tái tạo | `m` | `G` |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 50 | 3 | 53 | 15 | 15 | 0 | 68 |
| 8 | 100 | 6 | 106 | 30 | 15 | 15 | 136 |

**Lưu ý mô hình:** Ở mốc 4 giờ, vốn ứng trước là 68 USD (53 tư liệu sản xuất + 15 sức lao động); ở mốc 8 giờ là 121 USD, không ứng thêm 15 USD sức lao động lần nữa. Checkpoint là cờ dữ liệu từ engine; M4 quyết định thời điểm tạm dừng và câu hỏi. `Pause` phải dừng cả đồng hồ và animation ở UI, không phải thao tác trong hàm tính thuần.

## 5. Trình tự thực hiện trong lịch 6 ngày của nhóm

| Mốc | Việc M5 thực hiện | Đầu ra có thể review | Phụ thuộc/bàn giao |
|---|---|---|---|
| **Ngày 1 – chốt hợp đồng** | Kiểm tra môi trường; đối chiếu nguồn; đọc Figma khi có; định nghĩa type, preset, quy tắc validation và ví dụ snapshot; thống nhất API với M4/M6 | `types.ts` rõ nghĩa, ví dụ 0/4/8 giờ và test case đã thống nhất; M4 có mock cùng shape | M4 xác nhận API trước khi code UI phụ thuộc; M9 biết giả định |
| **Ngày 2 – lõi kinh tế** | Viết hàm validate, tính c theo bông/máy, giá trị mới theo giờ, phần bù đắp v, m và G; trả kết quả cuối; tách logic khỏi React | Engine chạy độc lập, số 4/8 giờ đúng; M4 import thử bằng mock/adapter | Bàn giao bản API chạy được cho M4 |
| **Ngày 3 – timeline và test** | Hoàn thiện snapshot mọi giờ, cờ checkpoint, test 0/4/8 và bất biến; hỗ trợ M4 nối engine thật, kiểm tra restart/pause từ phía UI | Test tự động đạt; chương 3 đọc dữ liệu thật; không còn công thức duplicate trong UI | M4 nối timeline, M9 kiểm chứng |
| **Ngày 4 – tích hợp P0** | Sửa lỗi từ M4/M6/M9; kiểm tra số chương 4 với `FactoryResult`; đối chiếu staging và luồng 0 → 4 → 8 giờ | Chương 3/4 dùng chung số đúng; PR P0 và bằng chứng kiểm thử | M9 QA xuyên module, M1/M9 review file chung nếu có |
| **Ngày 5 – ổn định và cổng P1** | Ưu tiên bug và regression P0. Sau khi M9 xác nhận đủ sáu điều kiện, chốt input/output Sandbox với M8 và mới viết hàm P1 nếu còn thời gian | Factory P0 ổn định; nếu P1 được duyệt: hàm tính/so sánh kịch bản có test | M8 dùng API P1; M9 xác nhận cổng |
| **Ngày 6 – bàn giao/release** | Chạy lại test, lint, typecheck, build; kiểm tra demo 4/8 giờ trên bản tích hợp; ghi giới hạn/giả định và hỗ trợ sửa lỗi cuối | PR đã review/merge theo quy trình nhóm; số liệu, script test và kịch bản demo được bàn giao | M9 deploy và smoke test; không thêm tính năng lớn |

Ngày trong bảng là **ngày tương đối của lịch nhóm**, vì `TIEN_DO_6_NGAY.md` chưa có ngày bắt đầu thực tế. Mỗi ngày cập nhật tiến độ đầu/cuối ngày, PR, blocker và minh chứng trong file này cùng nhóm.

## 6. Kiểm thử và tiêu chí nghiệm thu P0

- Thêm bộ chạy unit test phù hợp khi bắt đầu code (ưu tiên dùng hạ tầng test chung của nhóm; nếu chưa có, đề xuất Vitest và script `npm run test`), đặt test gần `features/factory/` hoặc theo quy ước M9. Chỉ test logic thật và rủi ro tích hợp, không viết test lặp lại cấu trúc code.
- Test preset tại 0/4/8 giờ: `0 → G 0`; `4 → c 53, newValue 15, m 0, G 68`; `8 → c 106, v 15, newValue 30, m 15, G 136`; giờ tất yếu/thặng dư bằng 4/4; vốn ứng trước cuối là 121.
- Test bất biến tại nhiều giờ hợp lệ: `G = cTransferred + newValue`, `newValue = vReproduced + m`, `cTransferred = cottonTransferred + machineTransferred`; `m` không âm trước checkpoint; `c`, `newValue`, `G` không giảm khi thời gian tăng; không tính `v` hai lần.
- Test đầu vào thiếu bông/máy/sức lao động; số âm, không hữu hạn, `necessaryHours > totalHours`, giờ ngoài `[0,totalHours]`; thống nhất với M4 lỗi trả về thay vì để UI crash. Test engine không thay đổi input và gọi lại cùng input cho cùng output.
- Test M4 dùng API thật: start → checkpoint 4 giờ → tiếp tục → 8 giờ; Pause dừng đồng hồ/chuyển động, Restart về 0; kết quả hiển thị đúng USD. M6 nhận cùng số `c/v/m/G` cho Chương 4. M9 thử độc lập trên staging.
- Trước PR/release: `npm run test` (sau khi thêm), `npm run lint`, `npm run typecheck`, `npm run build`; lưu kết quả và lỗi còn lại trong PR. M5 không tự nhận hoàn thành chỉ vì unit test đạt nếu UI chưa tích hợp.

## 7. P1: phép tính Sandbox nếu qua cổng

1. Chốt với M8 đơn vị và giới hạn slider: tổng giờ, giờ tất yếu, giá trị mới/giờ, `c`; yêu cầu `0 ≤ necessaryHours ≤ totalHours`, các giá trị tiền không âm và hữu hạn.
2. Dùng **cùng lõi công thức**: `newValue = rate × totalHours`, `v = rate × necessaryHours`, `m = rate × (totalHours - necessaryHours)`, `G = c + v + m`; tách rõ đây là kịch bản giả định, không phải dữ liệu mới của giáo trình.
3. Hàm thuần trả kịch bản hiện tại, kịch bản gốc và chênh lệch; reset trả preset gốc. Test giới hạn `necessaryHours = totalHours` cho `m = 0`, giá trị bằng 0, input không hợp lệ và so sánh/reset. M8 sở hữu slider, biểu đồ và lưu trạng thái nếu được phát hành.

## 8. Bàn giao cụ thể

- PR `feature/factory-engine` → `develop` gồm engine, type, preset, unit test, script test nếu cần và ghi chú công thức/giả định. Thay đổi file chung cần người sở hữu hoặc M9 review.
- Trong mô tả PR: API xuất ra và ví dụ gọi; bảng 0/4/8 giờ; lệnh và kết quả test/lint/typecheck/build; Figma frame được đối chiếu khi có; ảnh/video chương 3 sau khi M4 tích hợp; các quyết định khác tài liệu ban đầu.
- Bàn giao cho M4 dữ liệu checkpoint/result và quy ước validation; cho M6 tổng `c/v/m/G`; cho M8 API P1 nếu có; cho M9 danh sách test và kịch bản demo. Ghi rõ Figma hoặc nguồn nào chưa được xác minh.
- Chỉ đánh dấu hoàn thành khi PR được review/merge, UI dùng engine thật, test đạt, M9 xác nhận không còn lỗi nghiêm trọng và số liệu trên staging khớp 4/8 giờ. Ngày 6 hỗ trợ demo: 4 giờ giải thích `68 = 53 + 15`, chưa có m; 8 giờ giải thích `136 = 106 + (15 + 15)`, vốn ứng trước 121 và m = 15.

## 9. Ghi nhận sau khi nhận Figma

- Đã lọc 51 node người dùng cung cấp. Các frame thuộc Factory P0 là chuẩn bị `55:7339`/`63:11317`, 0 giờ `55:7695`, đang chạy `43:2298`/`63:11686`, checkpoint `44:3500`/`57:8223`/`63:12064`, inspect `63:12435`, 8 giờ `57:8579`, kết quả `44:3861`/`63:12805`. Các frame thẻ c/v/m thuộc M6; `65:14900`/`65:15278` thuộc Sandbox P1 của M8/M5.
- Figma xác nhận ba tài nguyên 100 USD bông, 6 USD hao mòn máy và 15 USD sức lao động; tổng ứng trước 121 USD. Ở 0 giờ chưa có thành phẩm, 4 giờ giá trị mới 15 và thặng dư 0, 8 giờ giá trị mới 30 và thặng dư 15. Engine và test P0 đã triển khai tại `features/factory/`; hướng dẫn API ở `features/factory/README.md`.
- Frame `63:11686` tại giờ thứ 6 hiển thị `c = 106`, `v = 15`, `m = 7,5`, `G = 128,5`. Đây là cách ghép đầu vào **của cả ca** với thặng dư tạm tính. Theo nội suy giá trị **đã chuyển vào sản phẩm** của hợp đồng module, 6 giờ có `c = 79,5`, giá trị mới `22,5`, sản phẩm đến thời điểm đó `G = 102`. Engine trả riêng `illustrativeFullInputValue = 128,5` để M4 có thể hiển thị số theo frame với nhãn “minh họa”, và `productValue = 102` cho sản phẩm thực tế đến giờ 6. Không dùng hai đại lượng này thay thế nhau.
- `npm run test` (7 test), `npm run lint`, `npm run typecheck` và `npm run build` đều đạt trên nhánh M5. Phần còn phụ thuộc nhóm: M4 nối UI chương 3 với engine, M6 lấy kết quả chương 4, M9 xác nhận staging/PR và cổng P1. Chưa đánh dấu nghiệm thu module hoặc triển khai Sandbox.
