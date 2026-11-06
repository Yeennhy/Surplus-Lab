# Surplus Lab – The Factory of Value

Đồ án website học tập tương tác cho môn Kinh tế chính trị Mác – Lênin. Người học đi qua bốn chương, sau đó làm Final Challenge. Dự án ưu tiên desktop/laptop và được lên kế hoạch thực hiện trong 6 ngày với 9 thành viên.

## Phạm vi

| Ưu tiên | Module | Mục tiêu |
|---|---|---|
| P0 | Landing | Giới thiệu, lộ trình, bắt đầu học |
| P0 | Chương 1 – The Capital Mystery | Thị trường đóng 100 bot, giao dịch, thống kê và biểu đồ cơ bản |
| P0 | Chương 2 – The Special Commodity | Tình huống về hàng hóa sức lao động và phản hồi |
| P0 | Chương 3 – Inside the Factory | Mô phỏng nhà máy sợi 8 giờ, mốc 4/8 giờ |
| P0 | Chương 4 – Anatomy of Value | Phân loại c, v, m và công thức G = c + (v + m) |
| P0 | Final Challenge | Ít nhất 10 câu có đáp án, giải thích, điểm và làm lại |
| P0 | Content Reference | Nguồn kiến thức tương ứng từng chương |
| P1 | Lưu tiến độ/điểm sau refresh, Economic Sandbox; biểu đồ, Inspect Bot và hiệu ứng nâng cao | Chỉ bắt đầu sau khi đạt [cổng kiểm tra P0](docs/PHAN_CONG_9_THANH_VIEN.md#cổng-quyết-định-có-làm-p1) |

Không nằm trong đợt này: đăng nhập, database, AI chatbot, multiplayer, 3D.

## Chạy dự án

Yêu cầu Node.js 20.9 trở lên. Trong thư mục này:

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Kiểm tra bằng `npm run lint`, `npm run typecheck`, `npm run build`. Các route hiện là khung điều hướng; gameplay và mô phỏng cần được phát triển theo [tiến độ 6 ngày](docs/TIEN_DO_6_NGAY.md).

## Công nghệ và cấu trúc

Giữ Next.js App Router, React, TypeScript và Tailwind CSS hiện có; không chuyển sang Vite hoặc React Router. Market/Factory Engine viết TypeScript chạy phía client và tách khỏi React. Motion, Recharts, Zustand, shadcn/ui và Vitest chỉ được thêm khi module thực sự cần; backend API không bắt buộc cho MVP.

```text
app/                    Route và layout
  learn/chapter-[1-4]/  Bốn chương
  challenge/            Final Challenge
  sandbox/              P1, chưa triển khai
components/             UI chung và UI theo module
features/               Engine và logic theo module, tách khỏi component
content/                Dữ liệu học tập, câu hỏi, tài liệu tham khảo
lib/                    Tiện ích và lưu trữ trình duyệt
public/assets/          Hình ảnh, SVG, âm thanh được phép sử dụng
docs/                   Tiến độ và hợp đồng kỹ thuật
```

Logic tính toán kinh tế đặt trong `features/`; component chỉ hiển thị và xử lý tương tác. Xem [hợp đồng module](docs/HOP_DONG_MODULE.md) trước khi triển khai song song.

Phân công chính thức 3 nhóm × 3 thành viên, việc P0/P1 và lịch bàn giao: [PHAN_CONG_9_THANH_VIEN.md](docs/PHAN_CONG_9_THANH_VIEN.md). Ngày 1–3 phát triển P0 độc lập, ngày 4 tích hợp P0, ngày 5 sửa P0 và chỉ làm P1 khi đạt cổng, ngày 6 release và không thêm tính năng lớn. M8 hỗ trợ game state, dữ liệu quiz, nội dung và kiểm thử P0 trước khi chuyển sang Sandbox/lưu tiến độ P1.

## Quy tắc phối hợp

- Tạo nhánh từ `develop` theo dạng `feature/<module>`, gửi pull request về `develop`; `main` dành cho bản ổn định.
- Mỗi PR mô tả thay đổi, cách kiểm tra, ảnh/video nếu có giao diện. Kiểm tra build và test liên quan trước khi merge.
- Chốt interface của engine trước khi nối UI. Có thể dùng mock trong lúc chờ engine; thay bằng dữ liệu thật trước khi đánh dấu hoàn thành.
- Cập nhật [bảng tiến độ](docs/TIEN_DO_6_NGAY.md) đầu và cuối mỗi ngày. Cột người phụ trách hiện để trống để nhóm phân công sau.
- Cuối ngày 4 kiểm tra luồng P0; ngày 5 ưu tiên sửa lỗi và chỉ cân nhắc P1 khi đạt đầy đủ cổng kiểm tra. Route `/sandbox` hiện chỉ là placeholder, không nằm trong luồng P0.

## Mốc kiến thức cần kiểm chứng

Thị trường đóng chỉ chuyển tiền và hàng giữa bot: tổng tiền, tổng số hàng và tổng giá trị tham chiếu không đổi. Với nhà máy sợi: `c = 100 + 6 = 106`, `v = 15`, giá trị mới sau 4/8 giờ lần lượt `15/30`, `m = 15`, `G = 136` USD. Nội suy giữa các mốc là giả định phục vụ minh họa. Bản [trích xuất giáo trình chương 3](docs/TRICH_XUAT_GIAO_TRINH_CHUONG_3.md) do người dùng cung cấp và mapping tại `content/references.ts` là cơ sở nội dung hiện có; nhóm cần đối chiếu bản in trước khi trích dẫn nguyên văn hoặc phát hành.
