# TẦNG 13 — Cuộc gọi cuối

Bản chơi mới, xây trên thư viện Three.js cục bộ. Người dùng yêu cầu game
trinh thám kinh dị 3D hấp dẫn hơn và đã dặn tự thực hiện, không hỏi lại.
Giữ bản phòng trực cũ ở desk.html; index.html mở bản mới.

## Vòng chơi

Một điều tra viên theo cuộc gọi cuối của Mai đến tầng chung cư bị phong
 tỏa. Tự di chuyển qua sảnh, hành lang, căn 1304, phòng bảo vệ, kho hồ sơ.
Khôi phục điện → khám căn hộ → lấy chìa phòng bảo vệ → đối chiếu lời khai
và nhật ký mất điện → nhập mã kho → cứu Mai và thu lời thú nhận.

Mã kho là giờ mất điện (02:13), khác đồng hồ chết lúc 02:17 trong căn hộ: đồng hồ chạy nhanh 4 phút. Ảnh hiện trường ghi Tuấn rời phòng trực lúc 02:12.
Chỉ dấu đến từ ghi chú và log trong thế giới, không phải đoán số ngẫu nhiên.
Bằng chứng gồm lời nhắn của Mai, ảnh hiện trường, lời khai bảo vệ và log
thẻ ra vào; người chơi chọn nghi phạm và chứng cứ mâu thuẫn ở cuối vụ.
Băng ghi âm trong kho là chứng cứ bổ sung cho kết thúc đầy đủ.

Mỗi mốc thay đổi không gian hoặc nguy hiểm: bật điện mở căn hộ; lấy chìa
làm bóng người xuất hiện; lấy log khởi động săn đuổi; mở kho dẫn tới cứu
người. Thực thể di chuyển và tìm đường; đèn pin và chạy tạo điều kiện
phát hiện, tủ có thể dùng trốn. Âm thanh định hướng, phụ đề và vệt nhiễu
báo nguy hiểm. Không dùng hàng loạt popup ngắt cảnh khi chỉ đi bộ.

Điều khiển: WASD/mũi tên, chuột hoặc kéo để nhìn, E tương tác, F đèn,
Shift chạy, J sổ án. Có điều khiển cảm ứng và giảm chuyển động/kinh dị.
Mục tiêu hiện tại, tương tác và hướng dẫn mở đầu luôn rõ.

## Cấu trúc và thực hiện

- case13/world.js: hình học, vật liệu, vùng đi lại, collider, props,
  vật chứng, ghost, cập nhật đèn và cổng.
- case13/audio.js: WebAudio môi trường, bước chân, truy đuổi, tín hiệu.
- case13/game.js: điều khiển, raycast, di chuyển/collision, AI tìm đường,
  tiến trình, sổ án, keypad, kết thúc và checkpoint.
- case13/style.css + index.html: giao diện ít chữ khi khám phá, sổ án và
  bảng suy luận khi cần; không phụ thuộc dịch vụ mạng.

Thực hiện tuần tự trong chat hiện tại: dựng không gian và giao diện →
nhập liệu/va chạm/tương tác → vụ án và puzzle → AI/trốn/chase → âm/ending
→ kiểm thử toàn bộ luồng và bản dist → ảnh/video và mở bản chơi.

Kiểm tra dùng trình duyệt qua HTTP, cả nguồn/dist; đi qua cửa và va
chạm, nhặt vật chứng, suy ra mã, bị phát hiện/trốn/chơi lại, kết luận
đúng/sai, thay đổi viewport/cảm ứng, tắt chuyển động và thiếu WebGL.
Kiểm tra tự động kết hợp ảnh và chạy toàn vụ. Không đánh giá 'hấp dẫn'
chỉ bằng test; hình ảnh và nhịp chơi phải được xem trực tiếp.
