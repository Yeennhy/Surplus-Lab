/** Nguồn ghi ở cuối bản trích do người dùng cung cấp; chưa đối chiếu bản in gốc. */
export const textbookSource = {
  id: "giao-trinh-ktct-2021-chuong-3",
  title: "Giáo trình Kinh tế chính trị Mác – Lênin",
  author: "Bộ Giáo dục và Đào tạo",
  year: 2021,
  publisher: "Nhà xuất bản Chính trị quốc gia Sự thật",
  pages: "77–85",
  localExtract: "docs/TRICH_XUAT_GIAO_TRINH_CHUONG_3.md",
  note: "Bản trích do người dùng cung cấp, được diễn giải lại theo giáo trình; cần đối chiếu bản in trước khi trích dẫn nguyên văn.",
} as const;

export const references = [
  { chapter: 1, section: "I.1.a – Công thức chung của tư bản", sourceId: textbookSource.id },
  { chapter: 2, section: "I.1.b – Hàng hóa sức lao động", sourceId: textbookSource.id },
  { chapter: 3, section: "I.1.c – Sự sản xuất giá trị thặng dư", sourceId: textbookSource.id },
  { chapter: 4, section: "I.1.d – Tư bản bất biến và tư bản khả biến", sourceId: textbookSource.id },
] as const;
