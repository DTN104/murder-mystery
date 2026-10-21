# assets/

Đã tạo đủ 18 ảnh PNG ngày 18/10/2026 bằng image_gen tích hợp trong Codex, đúng tên và kích thước dưới đây. Sáu sprite nhân vật giữ nền alpha trong suốt. Kích thước được chuẩn hóa từ ảnh gốc của công cụ.

Xem ảnh và ghi chú bàn giao: `../docs/generated-art-gallery.md`. Prompt thực tế: `../docs/generated-art-prompts.json`. Danh sách + prompt gốc: `../docs/ca-dem-art-prompts.md`.

Ưu tiên:
1. no_face.png        1920x1080   mặt Nó (jumpscare)
2. no_back.png        1024x2048   Nó toàn thân, nhìn từ sau, nền trong suốt
3. no_front.png       1024x2048   Nó toàn thân, nhìn thẳng, nền trong suốt
4. no_window.png      1024x1024   Nó đầu vai qua ô kính, nền trong suốt
5. cam02.png          1920x1080   Hành lang B1 (trống)
6. cam03.png          1920x1080   Kho vật chứng (trống)
7. cam04.png          1920x1080   Phòng server (trống)
8. cam05.png          1920x1080   Cầu thang (trống)
9. cam06.png          1920x1080   Nhà vệ sinh (trống, có gương)
10. cam01.png         1920x1080   Sảnh thang máy (trống)
11. cam07.png         1920x1080   Hành lang "sai", tông ấm (trống)
12. alley.png         1600x1200   Hẻm sau tiệm bánh, đêm (trống)
13. hoodie_door.png   1024x2048   Hoodie với tới ổ khóa, nền trong suốt
14. hoodie_walk.png   1024x2048   Hoodie đi ra, nhìn từ sau, nền trong suốt
15. khoa.png          1024x2048   Khoa hot boy mặc áo ba lỗ xám, cầm chìa, nền trong suốt (đã duyệt 19/10/2026)
16. scene_safe.png    1600x1200   Két tiền còn nguyên
17. scene_notebook.png 1600x1200  Sổ tay mở, trang TRỐNG
18. room.png          2560x1440   Phòng KTS toàn cảnh (tùy chọn, làm cuối)

Hiện tại index.html chưa đọc thư mục này — mọi hình đang vẽ procedural bằng canvas.

Khoa: bản áo ba lỗ đã được người dùng duyệt và đặt làm `khoa.png`. Giữ các bản `khoa-original.png`, `khoa-hotboy.png`, `khoa-tank-top.png` để đối chiếu. Prompt bản được duyệt: `../docs/khoa-tank-top-prompt.md`.
Khi tích hợp: thay drawImage vào từng hàm vẽ, giữ lớp nhiễu/flicker. Ảnh room.png cần căn lại vùng tương tác theo bố cục thực tế trước khi dùng.
