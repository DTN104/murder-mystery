# HIỆN TRƯỜNG 09 — kiểm tra bản chơi đầu tiên

2026-10-22. Trang chính: `/`; alias `/house09.html`. Hai game cũ: `/floor13.html`, `/desk.html`.

## Các kiểm tra có thể chạy lại

- `node tools/test-house09-state.mjs`: điều kiện mở cửa, thứ tự cầu chì, kết luận, lưu/khôi phục, đóng trang giữa lúc xem ảnh đầu tiên, dữ liệu lưu không nhất quán.
- `node tools/test-house09.cjs`: toàn bộ tuyến chứng cứ, ảnh dấu vết, jumpscare chỉ sau khi đóng hồ sơ, cửa phòng tối, xuống hầm, đường vòng có thể đi được, băng tùy chọn, kết luận sai/đúng, hồ sơ đã khép, bị bắt và thử lại, giao diện mobile. Ghi video và ảnh vào `_preview/house09/`.
- `node tools/test-house09-systems.cjs`: bản đóng gói, cửa chặn di chuyển, máy ảnh cần được nhặt, ma thực sự đi đuổi, tủ trốn dùng được, tường che vật chứng, tạm dừng, giảm giật mình/tắt âm, lưu tạm khi chặn storage, cảm ứng kéo nhìn/đi/chạy, hai game cũ tải được, thông báo khi thiếu WebGL.
- `node tools/test-floor13.cjs`: 13 nhóm kiểm tra hồi quy cho TẦNG 13 ở đường dẫn mới.

Test trình duyệt dùng Chrome/Playwright. Có thể đặt `PLAYWRIGHT_MODULE` tới thư viện có sẵn. Các test điều tra dùng vị trí tiếp cận được chuẩn bị trước để kiểm tra từng tương tác; video là bằng chứng luồng chức năng, không phải lượt chơi của người chưa biết lời giải. Di chuyển, va chạm, kéo nhìn, truy đuổi và đường đi được kiểm tra riêng. Chưa đo thời lượng/độ khó bằng người chơi mới thực tế, chưa thử trên thiết bị di động vật lý.

## Review người mới

Review độc lập qua ảnh desktop/mobile và nhãn điều khiển phát hiện:
- Prompt E gây hiểu nhầm ở dấu vết cần chụp: đổi sang V/X hoặc tên nút cảm ứng.
- Mobile dùng hướng dẫn bàn phím: đổi hướng dẫn đầu game, mục tiêu và máy ảnh theo thiết bị.
- Giữ Chạy khiến không còn ngón xoay nhìn: chuyển thành nút bật/tắt trên mobile.
- Tường lặp và tủ quá khối hộp: biến đổi UV từng đoạn tường, thêm kệ/cánh lệch, lịch cũ, dép và chậu men.

## Giới hạn mỹ thuật

Đây là bản chơi 3D đầu tiên dựng bằng hình học và vật liệu ảnh. Ảnh concept là chuẩn hướng tới; vật thể/ma chưa phải các model 3D được điêu khắc chi tiết. Không dùng ảnh concept làm ảnh chụp giả của game. Truy đuổi dùng đường đi theo va chạm thực, giảm giật mình có tốc độ săn chậm hơn và bỏ ảnh áp sát.
