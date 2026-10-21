# Kiểm tra bản phòng trực 3D

Ngày kiểm tra: 20/10/2026. Thực hiện trên Chrome headless/macOS, WebGL 2.
Bản nguồn và `dist` đều được chạy qua HTTP cục bộ. Các yêu cầu mạng ngoài
bị chặn/thay bằng CSS trống để kiểm tra game dùng tài nguyên cục bộ.

## Kết quả đạt

- Phòng, CRT, đồ vật và bóng ma là hình học 3D. Đã xem ảnh trực tiếp ở
  góc bàn, bảng ghim và cửa để kiểm tra phối cảnh và độ sáng.
- Bấm CRT để cúi vào màn hình, Space/Escape, phím quay và rê cạnh hoạt
  động. Đọc hồ sơ không làm quay đầu ngoài ý muốn.
- Hotspot theo vật thể; nhãn trên nút khóa không còn chặn click.
- Bằng chứng ghi vào sổ tay/bảng ghim; bộ đàm và nộp kết luận đúng chạy.
- Ma hiện sau ô kính khi đến cửa; khóa đẩy ma lui; mất điện mở chốt và
  tắt thiết bị. Ảnh `05-power-out.png` ghi lại trạng thái mất điện.
- Chơi lại giữ ghi chú, reset góc nhìn và hủy cúi người đang dở. Bộ nhớ
  hình học/texture không tăng sau bốn lần reset trong kiểm tra.
- Timer mất điện và lời thoại thuộc ca cũ bị hủy khi bắt đầu ca mới.
- Cảm ứng dùng sự kiện touch thật qua Chrome DevTools: kéo để quay,
  khóa cửa, mở hồ sơ; resize ngang không làm hỏng bố cục.
- Mất WebGL context / thiếu WebGL hiện thông báo và chặn bắt đầu.
- Jumpscare: 2,5 giây nhiễu, 0,15 giây đen/im, 0,28 giây mặt gốc với
  cú lao 0,1 giây, cắt đen, kết thúc ở khoảng 3,35 giây. Kiểm tra tốc
  độ ×1, ×3, ×10; giảm kinh dị, reduced-motion, thiếu ảnh và chơi lại.
- Âm thanh render bằng OfflineAudioContext: RMS khoảng im 2,52–2,63 s
  bằng 0; RMS sau 3 s bằng 0; âm va chạm bình thường khoảng 0,0615,
  giảm kinh dị khoảng 0,0157. Hủy cảnh cho RMS đoạn va chạm bằng 0.
- Không có lỗi JavaScript ngoài các lỗi WebGL chủ động mô phỏng; không
  có tài nguyên cục bộ trả lỗi trong các trang kiểm thử chính.

## Hiệu năng và giới hạn

Trong 120 khung hình lấy mẫu ở viewport 1440 × 900: trung vị khoảng
16,7 ms/khung, p95 khoảng 16,8 ms, tương đương khoảng 60 fps trên máy
kiểm tra. Renderer báo 183 draw calls ở góc bàn, 228 geometry và 13
texture sau khi các góc/nhân vật đã được hiển thị. Đây là phép đo Chrome
headless trên máy hiện tại, không phải cam kết tốc độ cho mọi thiết bị.

Viewport 390 × 844 và 844 × 390 đã được kiểm tra; chưa đo hiệu năng trên
điện thoại vật lý hoặc kiểm tra Safari/Firefox. Nhân vật là model dựng
bằng khối có đầu/tay/thân; không phải nhân vật photoreal có rig. Các
phòng trong CCTV vẫn dùng cảnh ảnh; jumpscare giữ mặt gốc.

## Chạy lại

```sh
python3 tools/build.py
PLAYWRIGHT_MODULE=/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core node tools/test-room-3d.cjs
PLAYWRIGHT_MODULE=/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core node tools/test-jumpscare.cjs
PLAYWRIGHT_MODULE=/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core node tools/test-scare-audio.cjs
```

Có thể bỏ biến PLAYWRIGHT_MODULE nếu dự án đã có package `playwright`.
Test phòng và jumpscare tự mở/đóng HTTP server cùng trình duyệt.

Ảnh và báo cáo máy đọc: `_preview/room-3d/`. `preview.mp4` là video 12
 giây ghi từ chính bản `dist`, trình diễn quay đầu, ma ngoài cửa, khóa
cửa và đọc hồ sơ. Video không có âm thanh; âm trong game vẫn hoạt động.

## Mở để chơi

Bấm đúp `Mở CA ĐÊM.command`, hoặc `python3 tools/play.py --dist`.
Game chỉ mở server trên 127.0.0.1. Giữ cửa sổ chạy server trong lúc chơi.
