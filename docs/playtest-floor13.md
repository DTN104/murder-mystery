# TẦNG 13 — xác minh bản chơi

Ngày kiểm tra: 20/10/2026. Trình duyệt: Chrome, Playwright qua HTTP cục bộ. Các yêu cầu HTTPS bên ngoài bị chặn trong lượt kiểm tra, gồm cả bản đóng gói và bản phòng trực cũ.

## Kết quả

- Kiểm tra trạng thái: đạt. Tiến trình, nhặt vật chứng lặp lại, mã sai/đúng, điều kiện xác minh, kết luận đúng/sai, mốc lưu và dữ liệu lưu không hợp lệ.
- 13 nhóm kiểm tra trình duyệt: đạt. Kết quả máy đọc được: `_preview/floor13/results.json`.
- Di chuyển bằng bàn phím, chặn cửa chưa mở, đi xuyên lối cửa đã mở theo đúng hình học.
- Điện → căn 1304 → vật chứng/chìa → phòng bảo vệ → nhật ký/lời khai → khóa kho → băng ghi âm → cứu Mai → thang máy → kết luận đầy đủ.
- Đọc sổ tạm dừng thế giới; cảnh báo sau khi lấy log phát khi người chơi đóng vật chứng.
- Tìm đường giữa các khu vực theo collider và cửa đang mở; phát hiện bằng tầm nhìn và di chuyển đuổi theo người chơi.
- Tủ trốn tắt đèn, bảo vệ khi chưa bị thấy, và kẻ săn trở lại tuần tra sau lúc tìm kiếm.
- Nhập 0217 bị từ chối, 0213 mở sau khi có ảnh/đồng hồ và log.
- Bị bắt ở chế độ giảm kinh dị và chế độ thường; thử lại không mất mốc điều tra.
- Tải lại trình duyệt có nút Tiếp tục làm nút chính và khôi phục mốc gần nhất.
- Màn hình 390 × 844: kéo nhìn, cần di chuyển, sổ án không tràn ngang; xoay ngang 844 × 390 cập nhật khung nhìn.
- Bản dist mở đúng TẦNG 13; desk.html mở được game cũ. Thiếu WebGL có thông báo phục hồi.
- Không ghi nhận lỗi JavaScript hoặc tài nguyên cục bộ bị thiếu trong lượt đạt.

## Bằng chứng

Ảnh ở `_preview/floor13/01-title.png` đến `06-mobile-journal.png`; video `_preview/floor13/playthrough.webm`. Video là lượt kiểm tra tự động: có đặt vị trí người chơi tại các điểm kiểm tra để kiểm tra tương tác và kết thúc. Di chuyển, cửa và tìm đường được xác minh riêng; video không phải lượt đi bộ liên tục hay phản hồi của người chơi độc lập.

Một lượt rà soát riêng từ góc nhìn người mới đã xem giao diện và mã: đã sửa phụ đề bị che khi đọc vật chứng, mục tiêu khi thiếu ảnh, lời khai cần thiết cho kết luận, và tránh ghi đè mốc lưu khi bấm nút chính.

## Giới hạn

Đây là một vụ án ngắn với nội thất dựng từ hình học; tạo hình ma dùng ảnh trước/sau trên bề mặt nhận ánh sáng; âm thanh được tổng hợp cục bộ. Mai được giải cứu theo kịch bản, không có AI nhân vật đồng hành riêng. Chưa đo FPS trên nhiều thiết bị hoặc thực hiện playtest độc lập với người dùng thật. Nên giữ toàn bộ thư mục dist khi chia sẻ; game cần HTTP và WebGL 2.

## Chạy lại

```sh
node tools/test-floor13-state.mjs
PLAYWRIGHT_MODULE=/duong/dan/toi/playwright node tools/test-floor13.cjs
```

Runner dựng máy chủ tạm, mở Chrome, chặn mạng ngoài, kiểm tra cả nguồn và dist, xuất ảnh/video/kết quả vào `_preview/floor13/`.

## Chỉnh điều khiển — 21/10/2026

Bấm vào cảnh để bật nhìn bằng chuột, không cần giữ nút. Trình duyệt không hỗ trợ khóa chuột dùng rê chuột trên cảnh. Q/R và mũi tên quay, C nhìn thẳng, E/Space tương tác. Độ nhạy thấp hơn và chỉnh/lưu được ở Điều khiển. Khi đọc sổ, chuột được thả; đóng bằng nút khôi phục chế độ nhìn, đóng bằng Esc để chuột tự do.

Runner riêng `tools/test-floor13-controls.cjs` xác minh rê chuột đồng thời đi bộ, mở/đóng sổ, Esc tạm dừng, phím quay và nhìn thẳng, độ nhạy lưu qua lần tải trang, Space tương tác, phương án khi không có API khóa chuột, và mở sổ ngay khi đang yêu cầu khóa chuột. Bằng chứng: `_preview/floor13-controls/controls.webm`, `controls.png`, `results.json`. Lượt hồi quy toàn vụ án và cảm ứng vẫn đạt 13 nhóm kiểm tra sau khi đổi điều khiển.
