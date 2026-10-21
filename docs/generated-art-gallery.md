# CA ĐÊM — Bộ ảnh đã tạo

Ngày: 18/10/2026. Công cụ: image_gen tích hợp trong Codex.

Đã tạo đủ 17 ảnh chính và ảnh phòng KTS tùy chọn theo `ca-dem-art-prompts.md`. Mỗi ảnh là một lần tạo riêng; góc trước/đầu vai của Nó và dáng hoodie đi bộ dùng ảnh trước làm tham chiếu. Prompt thực tế và đường dẫn bản gốc được lưu trong [generated-art-prompts.json](generated-art-prompts.json).

Ảnh trong `assets/` đã chuẩn hóa kích thước bằng resampling, không phải độ phân giải native của công cụ. Bản gốc được giữ nguyên ở đường dẫn ghi trong JSON. Các sprite giữ PNG alpha thật; kiểm tra metadata sau chuẩn hóa xác nhận đủ 6 file có alpha. Đã xem từng kết quả để kiểm tra cảnh trống người, tư thế nhân vật, tông màu và trang sổ trắng.

`index.html` hiện vẫn dùng hình vẽ canvas; bộ ảnh này chưa tích hợp vào gameplay. Ảnh `room.png` là bản tùy chọn: bố cục gần với mô tả nhưng cần căn lại vùng tương tác khi tích hợp (đặc biệt màn CRT và bảng ghim), không coi vị trí phần trăm do model tạo là tọa độ chính xác.

| File | Kích thước bàn giao | Nền trong suốt |
|---|---|---|
| [no_face.png](../assets/no_face.png) | 1920 × 1080 | Không |
| [no_back.png](../assets/no_back.png) | 1024 × 2048 | Có |
| [no_front.png](../assets/no_front.png) | 1024 × 2048 | Có |
| [no_window.png](../assets/no_window.png) | 1024 × 1024 | Có |
| [cam02.png](../assets/cam02.png) | 1920 × 1080 | Không |
| [cam03.png](../assets/cam03.png) | 1920 × 1080 | Không |
| [cam04.png](../assets/cam04.png) | 1920 × 1080 | Không |
| [cam05.png](../assets/cam05.png) | 1920 × 1080 | Không |
| [cam06.png](../assets/cam06.png) | 1920 × 1080 | Không |
| [cam01.png](../assets/cam01.png) | 1920 × 1080 | Không |
| [cam07.png](../assets/cam07.png) | 1920 × 1080 | Không |
| [alley.png](../assets/alley.png) | 1600 × 1200 | Không |
| [hoodie_door.png](../assets/hoodie_door.png) | 1024 × 2048 | Có |
| [hoodie_walk.png](../assets/hoodie_walk.png) | 1024 × 2048 | Có |
| [khoa.png](../assets/khoa.png) | 1024 × 2048 | Có |
| [scene_safe.png](../assets/scene_safe.png) | 1600 × 1200 | Không |
| [scene_notebook.png](../assets/scene_notebook.png) | 1600 × 1200 | Không |
| [room.png](../assets/room.png) | 2560 × 1440 | Không |

## Xem ảnh

### no_face.png

![no_face](../assets/no_face.png)

### no_back.png

![no_back](../assets/no_back.png)

### no_front.png

![no_front](../assets/no_front.png)

### no_window.png

![no_window](../assets/no_window.png)

### cam02.png

![cam02](../assets/cam02.png)

### cam03.png

![cam03](../assets/cam03.png)

### cam04.png

![cam04](../assets/cam04.png)

### cam05.png

![cam05](../assets/cam05.png)

### cam06.png

![cam06](../assets/cam06.png)

### cam01.png

![cam01](../assets/cam01.png)

### cam07.png

![cam07](../assets/cam07.png)

### alley.png

![alley](../assets/alley.png)

### hoodie_door.png

![hoodie_door](../assets/hoodie_door.png)

### hoodie_walk.png

![hoodie_walk](../assets/hoodie_walk.png)

### khoa.png

Bản được duyệt ngày 19/10/2026: hot boy mặc áo ba lỗ xám. Đã cập nhật file chính `assets/khoa.png` từ `khoa-tank-top.png`; bản đầu lưu tại `khoa-original.png`. Prompt hiện hành: [khoa-tank-top-prompt.md](khoa-tank-top-prompt.md).

![khoa](../assets/khoa.png)

### scene_safe.png

![scene_safe](../assets/scene_safe.png)

### scene_notebook.png

![scene_notebook](../assets/scene_notebook.png)

### room.png

![room](../assets/room.png)

