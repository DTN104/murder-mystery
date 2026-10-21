# Không gian cũ hơn — 21/10/2026

## Bản sửa sau phản hồi “vẫn hơi sang trọng”

Bản hiện tại bỏ gạch bông, ốp gỗ chân tường, phào và chụp đèn. Thay bằng nền xi măng loang mòn, tường bong lớp vôi và vệt ẩm, bóng đèn trần, cửa gỗ xám có mảng vá. Giảm sắc vàng nâu và các bề mặt trang trí. Không đổi vùng va chạm hoặc tiến trình.

Build, kiểm tra cú pháp và 13 nhóm kiểm thử trình duyệt đều đạt. Ảnh hiện tại trong `_preview/derelict-interior/`; lượt xem desktop/mobile không có lỗi JavaScript. Rà soát độc lập xác nhận cảnh bớt sang trọng, đường đi và các vật chứng còn rõ. Các ghi chú bên dưới mô tả bản trước để đối chiếu.

## Bản trước

Theo phản hồi muốn căn nhà bớt hiện đại và cổ hơn một chút, chỉnh cảnh TẦNG 13 đang mở: vôi ngả màu với mảng bong/vết nứt nhỏ, chân tường ốp gỗ, gạch bông hoa bốn cánh bạc màu, đèn chụp kim loại và bóng đèn vàng. Cửa thêm ô gỗ, cửa sổ chia khung gỗ, đồng hồ có hộp gỗ. Giữ số giờ 02:17 và toàn bộ nội dung vật chứng.

Thay đổi trong `case13/world.js`; không đổi bản đồ, vùng va chạm, điều kiện mở cửa, AI hoặc tiến trình. Vật liệu được vẽ cục bộ, không thêm tài nguyên mạng.

Xác minh: cú pháp JavaScript và build đạt; toàn bộ 13 nhóm kiểm tra trình duyệt TẦNG 13 đạt, gồm điều tra, va chạm/cửa, tìm đường, trốn/chase, kết thúc, checkpoint, cảm ứng, nguồn/dist và thiếu WebGL. Sau khi giảm thêm tương phản gạch, build và lượt chụp lại cảnh không có lỗi JavaScript.

Đã xem ảnh sảnh, phòng ngủ, cửa và màn hình hẹp 390×844. Rà soát độc lập xác nhận phong cách cũ hơn, vật chứng và nhãn tương tác vẫn nhận ra được, không có che khuất nghiêm trọng. Ảnh chụp dùng vị trí đặt sẵn để xem cảnh, không phải bằng chứng một lượt đi bộ liên tục.

Ảnh cục bộ trong `_preview/aged-interior/`: `title.png`, `hall.png`, `hall-powered.png`, `apartment.png`, `door.png`, `mobile-hall.png`. Video kiểm thử tiến trình ở `_preview/floor13/playthrough.webm`; các file ghi hình không đưa vào Git.
