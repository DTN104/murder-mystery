# CA ĐÊM — phòng trực 3D, ngồi tại bàn

Ngày: 20/10/2026  
Trạng thái: đã triển khai và kiểm tra; xem `docs/playtest-3d.md`.

## Trải nghiệm đã thống nhất

Người dùng muốn chuyển game sang 3D và chọn ngồi tại bàn. Giữ vòng chơi
điều tra, theo dõi camera và khóa cửa khi có nguy hiểm. Người chơi quay
đầu trong phòng, cúi sát CRT để thao tác, rồi ngẩng lên quan sát cửa.
Chỗ ngồi cố định; không có đi lại, va chạm nhân vật hay nhặt đồ.

Giả định thiết kế: giữ bối cảnh phòng trực tầng hầm, ánh đèn xanh lạnh,
đèn bàn vàng yếu và phong cách kinh dị hiện tại. Không thay cốt truyện
hoặc đáp án.

## Lựa chọn kỹ thuật

Chọn Three.js với JavaScript hiện có. Cách này tạo phối cảnh, vật thể,
ánh sáng và chuyển động camera thật trong trình duyệt, đồng thời tái sử
dụng phần điều tra. Lưu thư viện có phiên bản cố định và giấy phép trong
dự án; không phụ thuộc CDN lúc chơi. Bản phân phối chạy qua HTTP cục bộ
hoặc static hosting, có lệnh khởi chạy được ghi trong README.

Hai hướng khác đã cân nhắc:

- Ảnh toàn cảnh: giữ được hình vẽ hiện tại nhưng không tạo chiều sâu khi
  cúi người; không đáp ứng mục tiêu phòng 3D.
- Chuyển sang engine riêng như Godot: thuận tiện nếu mở rộng thành game
  đi lại nhiều phòng, nhưng phải chuyển cả giao diện và cách phát hành.
  Không cần cho trải nghiệm ngồi tại bàn đã chọn.

## Không gian và điều khiển

- Camera ở tầm mắt người ngồi. CRT ở phía trước, bộ đàm cạnh màn hình,
  cửa và bảng khóa bên phải, bảng ghim bên trái.
- Dựng sàn, tường, trần, bàn, CRT có chiều dày, bàn phím, đèn bàn, kệ,
  bảng ghim, cửa có ô kính và bảng khóa bằng mesh. Vật liệu có độ nhám,
  vết bẩn nhẹ; vật thể được chiếu sáng và che khuất đúng trong không gian.
- Rê chuột về cạnh trái/phải để quay đầu có giới hạn. Dùng phím mũi tên
  để quay khi không thao tác biểu mẫu. Trên cảm ứng, kéo ngang vùng phòng;
  thao tác cuộn hồ sơ không làm quay đầu.
- Bấm CRT hoặc Space để cúi xuống; Escape hoặc nút Ngẩng lên để trở lại.
  Camera tiến về CRT trong khoảng 300 ms, sau đó hiện giao diện hồ sơ/
  camera/bảng kết luận đang có. Trong lúc đọc màn hình không thấy cửa.
- Bấm bảng khóa để khóa/mở; bấm bộ đàm để mở hội thoại. Giữ các nút DOM
  có nhãn và bàn phím cho thao tác tương đương. Vùng bấm trong phòng
  phải theo vị trí chiếu của vật thể, không dùng tọa độ ảnh cũ.
- Chế độ giảm chuyển động bỏ chuyển cảnh cúi người và rung camera.

## Ánh sáng và mối đe dọa

CRT phát sáng xanh; đèn bàn chiếu vàng lên mặt bàn; ánh sáng lạnh yếu
giúp nhận ra cửa. Trạng thái điện, khóa cửa, thư mới và đèn chập chờn
lấy từ trạng thái game hiện có.

Tạo bóng người 3D bằng các phần cơ thể có thể điều khiển: thân áo tối,
tay dài, đầu nghiêng, khuôn mặt nhợt với hốc mắt tối. Bóng người đứng
sau ô kính khi thực thể đến cửa và biến mất khi bị đẩy lùi. Độ nghiêng
đầu và chuyển động thân rất nhỏ, không lặp chuyển động lớn dễ đoán.
Đây là nhân vật dựng hình cho phòng trực, chưa phải model người thật
có rig và hoạt ảnh điện ảnh.

Camera giám sát tiếp tục dùng các cảnh/ảnh hiện tại trên bề mặt CRT.
Phạm vi chuyển đổi này là phòng trực và nhân vật nhìn từ phòng trực;
không dựng lại toàn bộ các địa điểm CCTV thành bản đồ 3D.

Giữ hình mặt gốc cho cú đánh cuối đã được người dùng chọn:

1. Nhiễu kín màn hình 2,5 giây.
2. Đen và im 0,15 giây.
3. Mặt gốc lao sát trong 0,1 giây, giật nhẹ, tổng đoạn mặt 0,28 giây.
4. Cắt đen; hiện màn chơi lại ở khoảng 3,35 giây.

Thời gian này dùng đồng hồ thực, không nhân theo tốc độ demo. Chế độ
giảm kinh dị dùng mặt tĩnh và âm nhẹ. Chơi lại hủy toàn bộ hiệu ứng/âm
đang chờ. Mã nguồn đọc ngày 20/10 hiện dùng lại jumpscare cũ với timer;
cần đối chiếu và khôi phục hành vi đã chốt, không giả định nguồn đang
đúng với bản đã xem trước đó.

## Tổ chức mã và dữ liệu

- `src/room.js` làm cầu nối vòng lặp hiện tại với bộ hiển thị 3D. Tách
  dựng cảnh/vật liệu và điều khiển nhìn vào các module có trách nhiệm rõ.
- `CD.G` tiếp tục là nguồn trạng thái game. Bộ hiển thị đọc `ups`, `door`,
  `ent.at`, `lean`, `light`, `unread`, `reduce`; không tự chạy AI hay tính pin.
- Canvas camera `#cv` cập nhật texture trên CRT. Nếu canvas không thể tải
  lên GPU vì nguồn ảnh, dùng màn hình nhiễu thay thế và báo lỗi có thể hiểu.
- `src/monitor.js` giữ hồ sơ, camera, bảng kết luận, sổ tay; phối hợp với
  chuyển cảnh cúi người. Chuyển cảnh có thể bị hủy bởi chết/chơi lại.
- Bảng ghim trong phòng dùng texture vẽ từ ghi chú, cập nhật khi ghi chú
  đổi. Sổ tay DOM giữ nội dung đọc được và khả năng truy cập.
- `src/game.js` gọi cập nhật phòng, reset góc nhìn khi bắt đầu ca mới,
  dừng tương tác phòng khi có màn kết thúc. Cảnh cúi người vẫn được cập
  nhật cho đến khi giao diện màn hình che kín.
- Đồng bộ `index.html`, `src/markup.html`, CSS và `tools/build.py`; cập nhật
  bản `dist` để chứa đủ thư viện và tài nguyên, không chỉ bản nguồn.

## Hiệu năng và lỗi

Giới hạn pixel ratio tối đa 1,5, dùng hình học đơn giản, tái sử dụng vật
liệu và texture. Chỉ một nguồn đổ bóng chính; tắt bóng động trên thiết
bị yếu. Không dựng lại cảnh hoặc cấp phát texture mỗi khung hình.
Khi quay lại ca mới, dùng lại cảnh và reset trạng thái; không tạo thêm
renderer hoặc vòng lặp.

Nếu thiếu WebGL hoặc mất context, hiện thông báo và nút tải lại thay vì
màn hình đen. Nếu thư viện hoặc tài nguyên bắt buộc không tải được,
chặn bắt đầu với thông báo rõ. Ảnh tùy chọn còn dùng fallback hiện có.

## Kiểm tra hoàn thành

1. Mở được bản nguồn và `dist` qua HTTP; không có lỗi JavaScript hay tài
   nguyên thiếu. Ngắt mạng ngoài vẫn chơi được bằng tài nguyên cục bộ.
2. Ảnh kiểm tra tại hướng bàn, trái, cửa chứng minh phối cảnh thay đổi,
   vật thể có chiều sâu và vùng bấm bám đúng vật thể.
3. Thử chuột, bàn phím, cảm ứng và đổi kích thước; đọc hồ sơ không quay
   phòng ngoài ý muốn, nút khóa và bộ đàm luôn có cách truy cập.
4. Thử cúi/ngẩng nhanh, chết trong chuyển cảnh và chơi lại; không có
   giao diện hoặc chuyển động cũ xuất hiện muộn.
5. Luồng camera → hồ sơ → hỏi bộ đàm → kết luận vẫn hoạt động; ghi chú
   giữ lại khi chơi lại theo quy tắc hiện có.
6. Đưa thực thể ra cửa, khóa cửa, hết pin, thắng/thua: hình ảnh 3D đúng
   trạng thái, logic điện và AI không thay đổi.
7. Kiểm tra jumpscare ở tốc độ demo 1/3/10, chế độ giảm kinh dị và
   prefers-reduced-motion; đối chiếu các mốc thời gian phía trên.
8. Đo khung hình trong ca chơi, ghi rõ môi trường kiểm tra và giới hạn
   nếu trình duyệt kiểm thử dùng GPU phần mềm. Mục tiêu 60 fps desktop,
   30 fps mobile là mục tiêu tối ưu, không tuyên bố đạt khi chưa đo.

## Phạm vi bàn giao

Một bản chơi được trong phòng trực 3D, đầy đủ vòng chơi hiện có; bản
`dist`, hướng dẫn mở game, hình/video xem thử và kết quả kiểm tra.
Không thêm đêm mới, thay lời thoại, đổi đáp án hoặc mở rộng sang di
chuyển tự do. Các lỗi độc lập ngoài phần chuyển đổi được ghi nhận riêng.
