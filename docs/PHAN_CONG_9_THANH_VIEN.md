# Phân công công việc – Surplus Lab (9 thành viên, 6 ngày)

Tài liệu làm việc được biên soạn từ kế hoạch phân công 3 nhóm × 3 người do nhóm cung cấp. `M1`–`M9` là **mã vị trí**, chưa phải tên người. Điền tên, tài khoản GitHub và link PR khi chốt nhân sự. Xem [tiến độ theo ngày](TIEN_DO_6_NGAY.md) để ghi trạng thái thực tế và [hợp đồng module](HOP_DONG_MODULE.md) để thống nhất logic/kiến thức.

## Quyết định áp dụng cho repository hiện tại

| Điểm khác giữa các bản kế hoạch | Cách triển khai trong repository này |
|---|---|
| Bản phân công mới ghi React + Vite + React Router, `src/` | **Giữ Next.js App Router + TypeScript + Tailwind đã khởi tạo và build thành công**. Route nằm trong `app/`, code ở `features/`, UI ở `components/`; không tạo thêm ứng dụng Vite/Router song song. |
| Bản mới yêu cầu Campaign Map | M1 bổ sung vào Landing hoặc route `/campaign` nếu cần; trạng thái nhiệm vụ dùng chung, không tạo một route cho mỗi frame Figma. |
| Bản cũ xếp Sandbox và lưu tiến độ P1; bản phân công từng giao M8 làm từ ngày 1 | **Sandbox và localStorage đều là P1**. M8 làm game state, dữ liệu quiz, nội dung và kiểm thử P0 trước; chỉ bắt đầu P1 sau khi đạt cổng kiểm tra ở cuối tài liệu. |
| Bản mới nhắc Figma “GAME REMASTER 2026” nhưng chưa có link/file | M1/M9 thu thập link, frame và asset hợp lệ ở ngày 1; chưa coi giao diện là đã đối chiếu Figma. |

**Nguồn kiến thức:** [bản diễn giải giáo trình](TRICH_XUAT_GIAO_TRINH_CHUONG_3.md), mapping trong `content/references.ts`. Mỗi người viết nội dung giải thích cho module của mình; M9 kiểm tra chéo, M7 quản lý dữ liệu quiz. Bản trích chưa được đối chiếu sách in gốc.

**Công nghệ chính thức:** Next.js App Router + TypeScript + Tailwind CSS hiện có; Market/Factory Engine chạy client-side và tách khỏi React. Chỉ thêm Zustand khi state chia sẻ thực sự cần. Không dựng Vite, React Router, repository mới hoặc backend API cho MVP. Route `/sandbox` hiện là placeholder P1, không thuộc luồng P0. Nếu Sandbox từng được cam kết với giảng viên là bắt buộc, nhóm cần thống nhất lại phạm vi MVP sáu ngày.

## Danh sách vai trò và thư mục sở hữu

| Nhóm | Mã | Tên / GitHub | Trách nhiệm chính | Thư mục hoặc route chính | Branch gợi ý |
|---|---|---|---|---|---|
| A – Market & Core | M1 | _Chưa điền_ | **P0:** Layout Next.js, navigation, Campaign Map, UI chung, state mở khóa trong phiên. **P1:** hiệu ứng/UX nâng cao | `app/page.tsx`, `app/layout.tsx`, `components/layout/`, `components/ui/`, `features/progress/` | `feature/core-campaign` |
| A – Market & Core | M2 | _Chưa điền_ | **P0:** Market UI 100 bot, controls, chỉ số/biểu đồ cơ bản, kết quả. **P1:** biểu đồ/Inspect Bot nâng cao | `app/learn/chapter-1/`, `components/market/`, `components/charts/` | `feature/market-ui` |
| A – Market & Core | M3 | _Chưa điền_ | **P0:** Market Engine, giao dịch, bất biến, test. **P1:** tối ưu/thống kê nâng cao | `features/market/` | `feature/market-engine` |
| B – Production & Value | M4 | _Chưa điền_ | **P0:** Factory UI, chuẩn bị, timeline 8 giờ, checkpoint/kết quả. **P1:** animation/hotspot nâng cao | `app/learn/chapter-3/`, `components/factory/` | `feature/factory-ui` |
| B – Production & Value | M5 | _Chưa điền_ | **P0:** Factory Engine, c/v/m/G, test. **P1:** tính toán Sandbox | `features/factory/`; P1: `features/sandbox/` | `feature/factory-engine` |
| B – Production & Value | M6 | _Chưa điền_ | **P0:** Labor Power và phân loại c/v/m. **P1:** hiệu ứng nâng cao | `app/learn/chapter-2/`, `app/learn/chapter-4/`, `features/labor/`, `features/value/`, `components/chapters/` | `feature/labor-value` |
| C – Learning & Integration | M7 | _Chưa điền_ | **P0:** Quiz UI/engine, dữ liệu mẫu, điểm/kết quả; ≥10 câu thật trước release. **P1:** ngân hàng/thành tích nâng cao | `app/challenge/`, `features/quiz/`, `content/questions.ts` | `feature/quiz` |
| C – Learning & Integration | M8 | _Chưa điền_ | **P0:** hỗ trợ game state, dữ liệu quiz, tích hợp nội dung, test module. **P1:** Sandbox, localStorage | P0: `content/`, `features/progress/` (phối hợp M1), `tests/`; P1: `app/sandbox/`, `components/sandbox/`, `lib/storage.ts` | `feature/game-data-support` |
| C – Learning & Integration | M9 | _Chưa điền_ | **P0:** tích hợp, QA từ ngày 2, deploy. **P1:** kiểm thử/tối ưu mở rộng | `tests/`, `docs/`, cấu hình deploy; sửa lỗi xuyên module qua PR | `feature/qa-integration` |

`features/market/types.ts` và `features/factory/types.ts` hiện là khung ban đầu, chưa phải API đã chốt. M3/M5 chịu trách nhiệm chốt type với người dùng dữ liệu vào cuối ngày 1. Thay đổi file chung như `app/layout.tsx`, `content/references.ts` hoặc `components/ui/` cần M1 hoặc M9 review.

## Đầu ra và tiêu chí nghiệm thu từng thành viên

### Nhóm A – Market & Core

**M1 – Nền tảng game và điều hướng**

- Hoàn thiện GameLayout/HUD, button, modal, mission card, progress bar, badge, toast, loading; theme và typography theo Figma khi có link.
- Landing giới thiệu game và nút bắt đầu; Campaign Map hiển thị 4 nhiệm vụ cùng trạng thái locked/unlocked/in progress/completed, mục tiêu và huy hiệu.
- Định nghĩa `GameProgress` và API hoàn thành/mở khóa/reset **trong phiên chơi**; M8 hỗ trợ schema/test. Lưu qua refresh là P1. Review thay đổi UI chung và tích hợp route với M9.
- **Nghiệm thu P0:** Đi được Landing → Campaign → từng chương → Quiz; trạng thái mở khóa nhất quán trong phiên và sau reset. Không yêu cầu lưu sau refresh.

**M2 – Giao diện Market Simulation**

- Giải thích H – T – H và T – H – T'; màn setup cho số bot mặc định 100, xác suất, biên giá, tốc độ; màn mô phỏng 100 bot, giao dịch, Start/Pause/Resume/Reset/Finish.
- Dashboard tổng tiền, số hàng, tổng giá trị tham chiếu, giao dịch thành công/thất bại, số lượt và biểu đồ cơ bản. **P1:** biểu đồ nâng cao, Inspect Bot chi tiết (tiền, kho, lịch sử).
- Màn kết quả so sánh trước/sau, kết luận, chơi lại, báo hoàn thành cho M1. Dùng mock theo interface M3 ngày 1–2, nối engine thật ngày 3.
- **Nghiệm thu P0:** Điều khiển cập nhật dữ liệu thật; hiển thị rõ giá giao dịch khác giá trị tham chiếu; tổng lượng tiền/hàng toàn thị trường không bị diễn giải thành giá trị mới.

**M3 – Market Engine**

- Chốt `Bot`, `Commodity`, `Trade`, `MarketConfig`, `MarketState`, `MarketSnapshot` với M2; khởi tạo 100 bot và hai nhóm hàng.
- Viết hàm khởi tạo, chạy một/nhiều lượt, xác suất p, chọn hai bot khác nhau, kiểm tra đủ tiền/hàng, chuyển tiền/hàng, ghi lịch sử, reset và tính thống kê cơ bản. Thống kê/phân phối tài sản nâng cao là P1.
- Unit test bảo toàn tổng tiền, số lượng **từng loại** hàng và tổng giá trị tham chiếu; không có số âm; thử nhiều xác suất/biên giá. Engine thuần TypeScript, không phụ thuộc React.
- **Nghiệm thu P0:** M2 import được API ổn định; giao dịch hợp lệ cập nhật đồng thời; kiểm thử bất biến đạt.

### Nhóm B – Production & Value

**M4 – Giao diện Factory Simulation**

- Màn chuẩn bị bông/máy/sức lao động; cảnh nhà máy 2D và chuyển động cơ bản; timeline 0–8 giờ, điều khiển Start/Pause/Resume/Restart. Hotspot và animation nâng cao là P1.
- Hiển thị c, v, giá trị mới, m, G; dừng tại 4 giờ để hỏi và cho tiếp tục; màn kết quả 8 giờ và sự kiện hoàn thành nhiệm vụ.
- Dùng mock theo `FactoryResult` từ M5 ngày 1–2, nối engine thật ngày 3; phối hợp M6 khi chuyển sang chương 4.
- **Nghiệm thu P0:** Mốc 4 giờ hiển thị giá trị mới 15 USD và m = 0; mốc 8 giờ có G = 136 USD, m = 15 USD; Pause dừng cả đồng hồ và chuyển động cơ bản.

**M5 – Factory & Economic Engine**

- Chốt `FactoryConfig`, `FactoryResult`/snapshot với M4; kiểm tra đầu vào tài nguyên; tính c, v, m, G, thời gian tất yếu/thặng dư và trạng thái 0/4/8 giờ. Mốc trung gian có thể nội suy tuyến tính nhưng phải ghi là giả định mô phỏng.
- **P1 sau cổng:** Thống nhất input/output với M8, viết hàm tính Sandbox, so sánh kịch bản và reset về ví dụ gốc.
- Unit test ví dụ giáo trình: c = 106, v = 15, giá trị mới = 30, m = 15, G = 136 USD; 4 giờ đầu m = 0; 8 giờ gồm 4 giờ tất yếu + 4 giờ thặng dư.
- **Nghiệm thu P0:** Engine thuần TypeScript, M4 gọi được API ổn định; công thức và trường hợp biên đạt test.

**M6 – Labor Power & Anatomy of Value**

- Chương 2: giới thiệu sức lao động, ≥3 tình huống nhân vật, chọn/kiểm tra **hai điều kiện đồng thời**, phản hồi đúng/sai, hai thuộc tính và ba bộ phận của giá trị sức lao động, kết quả chương.
- Chương 4: thẻ bông/máy/sức lao động/giá trị thặng dư, kéo thả hoặc thao tác tương đương bằng bàn phím, phản hồi và sửa thẻ sai, công thức G = c + (v + m), kết quả chương.
- Dùng UI chung M1 và số liệu M5; không sửa Factory Engine; gửi sự kiện hoàn thành cho Game Progress.
- **Nghiệm thu P0:** Người học đi hết hai chương, nhận giải thích cho lựa chọn sai; không phân loại `m` như tư bản ứng trước. Hiệu ứng nâng cao là P1.

### Nhóm C – Learning & Integration

**M7 – Final Challenge**

- Chốt schema `Question` và `QuizResult`; quiz hỗ trợ trắc nghiệm một đáp án, câu số, nộp/kiểm tra, giải thích, chấm điểm, chuyển câu, kết quả và làm lại. Rank/huy hiệu nâng cao là P1.
- Dựng dữ liệu mẫu để phát triển giao diện, sau đó hoàn thiện **ít nhất 10 câu có đáp án và giải thích** trước release, đối chiếu với tài liệu nguồn và M9. M8 hỗ trợ tích hợp dữ liệu và kiểm thử; không cần persistence cho P0.
- **Nghiệm thu P0:** Chấm đúng câu số và trắc nghiệm; làm lại không giữ đáp án/điểm cũ; nội dung cuối không còn placeholder.

**M8 – Hỗ trợ P0; Sandbox & Persistence P1**

- **P0:** Cùng M1 chốt schema `GameProgress` và kiểm tra state trong phiên; cùng M7 chốt `Question`/`QuizResult`, tích hợp dữ liệu mẫu và nội dung cuối; hỗ trợ M9 test từng module, ghi lỗi dữ liệu và kiểm tra luồng câu hỏi. Có phần việc độc lập từ ngày 1, không chờ Sandbox.
- **P1 sau cổng:** Sandbox có slider tổng giờ, giờ tất yếu, giá trị mới/giờ, c; hiển thị c/v/m/G, so sánh/reset và cảnh báo tham số sai. Dùng hàm M5, không sao chép công thức.
- **P1 sau cổng:** Lưu/khôi phục tiến độ, điểm quiz bằng localStorage; kiểm tra dữ liệu sai và reset; tránh lỗi khi render phía server của Next.js.
- **Nghiệm thu P0:** Dữ liệu chương/quiz dùng được và state trong phiên được kiểm tra. **Nghiệm thu P1 nếu làm:** Refresh giữ được tiến độ/điểm, reset đúng dữ liệu, Sandbox chặn giờ tất yếu vượt tổng giờ.

**M9 – Integration, QA & Deployment**

- Kiểm tra export/import, hợp đồng dữ liệu, sự kiện hoàn thành, điều hướng, unlock và dữ liệu khi đổi module; lập checklist, bug report và theo dõi sửa lỗi.
- Test Market, Labor, Factory, Value, Quiz, navigation, desktop và console từ ngày 2; xác nhận số liệu với giáo trình; chạy lint/typecheck/build. Test Sandbox và refresh/localStorage **chỉ nếu P1 được phát hành**.
- Tạo preview trên Vercel khi có quyền triển khai, kiểm tra URL/route trực tiếp/asset; chuẩn bị URL production, smoke test và demo dự phòng.
- **Nghiệm thu:** Có báo cáo test và minh chứng xử lý lỗi Critical/High; site public chạy được khi nhóm quyết định release.

## Lịch giao việc từng ngày

| Ngày | M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 |
|---|---|---|---|---|---|---|---|---|---|
| **1 – P0 độc lập** | Chốt layout/theme, UI chung, routing | Market setup/dashboard mock | Type và khởi tạo 100 bot | Factory scene/timeline mock | Type, công thức và test ví dụ gốc | UI chọn nhân vật/thẻ giá trị | Schema và UI câu hỏi mẫu | Dữ liệu chương/quiz, hỗ trợ schema state trong phiên | Test plan, kiểm tra cấu trúc/Figma |
| **2 – P0 độc lập** | Landing, Campaign, HUD | Bot graph, chỉ số, controls | Giao dịch, xác suất, biên giá | Chuẩn bị tài nguyên, controls, timeline | Giá trị mới theo giờ, v/m/G | Logic chọn nhân vật, kéo-thả | Navigation, submit, scoring | Tích hợp nội dung/quiz mock, test module | Test từng module, ghi bug |
| **3 – P0 gameplay** | Locked/unlocked/completed trong phiên | Nối Market Engine, biểu đồ cơ bản | Thống kê, lịch sử, unit test | Nối Factory Engine, checkpoint 4h, kết quả 8h | Hoàn tất Factory Engine và test | Kéo thả, phản hồi, kết luận | Kết quả, giải thích, làm lại với mock | Hỗ trợ game state, quiz data và test | Test module/công thức, báo bug |
| **4 – P0 tích hợp** | Nối Campaign với các module | Market Result, sửa UI | Sửa lỗi Market | Factory Result, sửa UI | Sửa lỗi Factory | Nối chương 2/4 với Progress | Nối Quiz Result với Progress | Nội dung cuối, trạng thái câu hỏi, test luồng | Test xuyên suốt P0, preview deploy |
| **5 – Sửa P0; P1 có điều kiện** | Sửa layout/UX; P1: hiệu ứng | Sửa Market; P1: Inspect Bot/biểu đồ nâng cao | Sửa bất biến; P1: tối ưu | Sửa timeline; P1: animation/hotspot | Test số liệu; P1: hàm Sandbox | Sửa mini-game; P1: hiệu ứng | QA 10 câu; P1: thành tích | Test P0; P1: Sandbox/localStorage nếu đạt cổng | Regression, xác nhận lỗi nghiêm trọng đã sửa |
| **6 – Release** | Review/merge release | Kiểm tra demo Market UI | Kiểm tra số liệu Market | Kiểm tra demo Factory | Kiểm tra c/v/m/G | Kiểm tra mini-game | Kiểm tra quiz/kết quả | Kiểm tra dữ liệu/state; P1 nếu đã phát hành | Deploy, smoke test, URL và demo |

**Mốc kiểm tra:** Ngày 1–3 phát triển P0 độc lập; ngày 4 tích hợp và kiểm thử luồng P0; ngày 5 sửa P0, chỉ bắt đầu P1 khi đạt cổng bên dưới; ngày 6 regression, deploy và demo, **không thêm tính năng lớn**. Lịch là kế hoạch, không thể hiện công việc đã hoàn thành. Trạng thái thực tế cập nhật tại [TIEN_DO_6_NGAY.md](TIEN_DO_6_NGAY.md).

## Hợp đồng bàn giao và quy tắc phối hợp

| Bàn giao | Chốt trong ngày 1 | Sử dụng từ ngày 3 |
|---|---|---|
| M3 → M2 | `Bot`, `Trade`, `MarketSnapshot`, cấu hình và thống kê | UI thị trường thay mock bằng engine thật |
| M5 → M4 | `FactoryConfig`, `FactoryResult`, checkpoint 4 giờ | Timeline, dashboard và kết quả thật |
| M1 ↔ M8 | `GameProgress`, unlock, reset trong phiên | Hỗ trợ state P0; lưu/khôi phục chỉ ở P1 |
| M7 ↔ M8 | `Question`, `QuizResult`, dữ liệu mẫu/nội dung | Quiz P0, tích hợp dữ liệu và test |
| M5 → M8 (chỉ P1) | Input/output Sandbox, validation | Slider và so sánh nếu đạt cổng P1 |
| M1/M6/M2/M4/M7 → M9 | Sự kiện hoàn thành chương/quiz, route | End-to-end và release |

- Mỗi người làm trên branch `feature/*` của mình, tạo PR vào `develop`; `main` dành cho bản ổn định. Nếu `develop` chưa tồn tại, M1/M9 tạo từ `main` trước khi chia branch.
- Mỗi ngày ít nhất một lần push và cập nhật tình trạng, PR, blocker trong file tiến độ. Khi sửa file chung, báo người sở hữu và yêu cầu review.
- UI có thể dùng mock từ ngày 1–2 nhưng dữ liệu mock phải đúng schema đã chốt; ngày 3 nối engine thật. Không tạo bản sao công thức trong component.
- M9 kiểm tra nội dung, nhưng mỗi người vẫn chịu trách nhiệm nội dung trong module của mình. Quiz cần nội dung thật trước ngày 4 để kịp QA.
- Ưu tiên gameplay, số liệu và luồng học tập; animation phức tạp chỉ làm khi tính năng chính đã ổn định.

## Cổng quyết định có làm P1

Chỉ bắt đầu P1 khi **đồng thời** đạt: (1) Market chạy và test bảo toàn đạt; (2) Factory chạy đủ 8 giờ, c/v/m/G đúng; (3) Labor Power và phân loại hoạt động; (4) Quiz chấm điểm và ra kết quả với dữ liệu mẫu; (5) đi được từ Landing đến màn kết quả trong một phiên; (6) không còn lỗi nghiêm trọng chặn gameplay. Nếu chưa đạt, cả nhóm tiếp tục sửa P0. Có route `/sandbox` dạng placeholder không đồng nghĩa P1 đã hoàn thành.
