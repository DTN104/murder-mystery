# Kế hoạch triển khai CA ĐÊM 3D

Thiết kế: [Phòng trực 3D, ngồi tại bàn](../specs/2026-10-20-seated-3d-design.md).

Trạng thái: người dùng đã cho phép tự triển khai; các bước đã hoàn thành.
Kết quả và giới hạn kiểm tra: `docs/playtest-3d.md`.

## Cách thực hiện đề xuất

Thực hiện tuần tự trong chat hiện tại, bởi cùng một agent. Hoàn thành
các bước bên dưới, sửa lỗi trong phạm vi chuyển đổi, rồi bàn giao bản
chơi được cùng ảnh xem thử. Không cần tạo chat khác hoặc giao agent phụ.

Mỗi bước là một mốc kiểm tra nội bộ, không cần người dùng duyệt lại
từng file. Nếu phát hiện cần thay đổi trải nghiệm đã duyệt, trình bày
thay đổi cụ thể trước khi mở rộng phạm vi.

## 1. Ghi nhận và bảo toàn bản hiện tại

- Đọc lại các file sắp sửa trước khi chỉnh, vì mã nguồn đã thay đổi từ
  lần xem jumpscare trước.
- Lưu bản sao nguồn, CSS, markup, công cụ build và tài nguyên cấu hình
  liên quan vào thư mục tạm có tên riêng. Không ghi đè bản sao cũ.
- Dự án không có Git; không tự tạo repository hoặc tuyên bố đã commit.
- Ghi nhận luồng bắt đầu ca, cúi/ngẩng, khóa cửa, hồ sơ và chơi lại.

Kết quả: có nguồn để đối chiếu và khôi phục riêng từng thay đổi.

## 2. Thêm Three.js và đường khởi chạy cục bộ

File: `vendor/three/`, `src/bootstrap.js`, `index.html`,
`tools/build.py`, `README.md`.

- Dùng Three.js 0.180.0 từ gói phát hành chính thức. Lưu hai file
  `three.module.js`, `three.core.js` và giấy phép MIT trong `vendor/three/`.
  Ghi phiên bản và nguồn trong README của thư viện.
- Tải thư viện bằng ES module, đưa API vào `window.THREE`, rồi tải các
  script CD theo thứ tự phụ thuộc hiện tại. Dùng bootstrap có xử lý lỗi
  tải thư viện để trang báo lỗi rõ ràng.
- Không chuyển ứng dụng sang React hoặc thêm framework.
- Cập nhật build để tạo bản nguồn và bản phân phối tương thích với ES
  module; chép vendor và ảnh vào dist. Bản artifact cũng phải tham chiếu
  đúng tài nguyên và ghi rõ yêu cầu môi trường hỗ trợ module/WebGL.
- Ghi cách mở qua HTTP, ví dụ `python3 -m http.server 8000 --bind 127.0.0.1`.
  Nêu rõ mở trực tiếp file HTML không còn là đường chạy được hỗ trợ.

Kiểm tra: bản nguồn và dist khởi động qua HTTP, không 404; lỗi tải
Three.js hiện thông báo thay vì để người dùng nhìn màn hình đen.

## 3. Dựng căn phòng và nhân vật

File mới: `src/room-scene.js`, `src/room-materials.js`.
File thay đổi: `src/room.js`.

- Tạo vật liệu và texture canvas một lần: tường bê tông bẩn, sàn gạch,
  gỗ bàn, nhãn thiết bị và bảng ghim. Dùng ngẫu nhiên có seed để cảnh
  ổn định giữa các lần chơi và kiểm tra.
- Dựng phòng ở đơn vị mét, ghế nhìn về trục -Z. Bàn/CRT phía trước,
  cửa lệch phải, bảng ghim lệch trái; chọn vị trí để cả hai phía có thể
  quan sát bằng giới hạn quay đầu.
- Dựng cửa bằng nhiều phần, chừa lỗ ô kính thật để nhìn thấy nhân vật
  phía sau. Không đặt mặt phẳng cửa kín che mất toàn bộ nhân vật.
- Dựng CRT bằng vỏ, viền và mặt màn hình; áp CanvasTexture từ `#cv`.
  Chọn màu đầu ra/texture phù hợp để camera không bạc màu.
- Dựng bóng ma bằng nhóm mesh thân, đầu, mắt, tay. Không dùng sprite
  phẳng cho nhân vật ngoài cửa.
- Tạo ánh sáng môi trường thấp, đèn bàn vàng, ánh CRT và nguồn sáng
  lạnh phía cửa. Một nguồn đổ bóng; giới hạn độ phân giải bóng.
- Trả về scene, camera, các điểm tương tác, các đối tượng động và hàm
  giải phóng tài nguyên. Không tham chiếu logic AI từ module dựng hình.

Kiểm tra: chụp hướng chính diện và hướng cửa, xem trực tiếp ảnh để chỉnh
độ sáng, vật thể xuyên nhau, phối cảnh, vị trí mặt ma và độ rõ của CRT.

## 4. Quay đầu, tương tác và cúi người

File mới: `src/room-controls.js`.
File thay đổi: `src/room.js`, `src/monitor.js`, `src/game.js`,
`src/markup.html`, `index.html`, `css/style.css`.

- Giữ giao diện `CD.room` cần bởi game hiện tại; bỏ phép dịch ngang
  `#world` vốn dành cho ảnh 2D.
- Đặt giới hạn góc quay, làm mượt theo thời gian thực và tốc độ độc lập
  fps. Không tự dao động camera khi người chơi đứng yên.
- Điều khiển bằng cạnh màn hình, mũi tên và kéo cảm ứng trên vùng phòng.
  Bỏ qua sự kiện khi focus ở control hoặc đang đọc hồ sơ/bộ đàm/demo.
- Raycast vật thể để xác định tương tác nhìn thấy; cập nhật vị trí và
  khả năng focus của nút DOM từ điểm tương tác được chiếu lên màn hình.
  Không để click xuyên đồ vật hoặc bấm hotspot đã ra ngoài góc nhìn.
- Có nút truy cập thao tác phù hợp trên màn hình nhỏ; giữ nhãn tiếng
  Việt, thứ tự Tab và phản hồi khóa cửa.
- Dùng tiến độ cúi người trong vòng lặp, không dùng timer rời không thể
  hủy. Tiến về CRT khoảng 300 ms rồi hiện overlay. Khi ngẩng, đóng
  overlay và đưa camera về chỗ ngồi/hướng nhìn trước đó.
- `G.lean` phản ánh trạng thái cúi ngay khi bắt đầu để luật quan sát
  camera và điện có thời điểm rõ ràng. Một yêu cầu ngẩng/chết/restart
  hủy mục tiêu cúi cũ ngay lập tức.
- Khi giảm chuyển động, đặt thẳng camera/overlay ở trạng thái đích.

Kiểm tra: thao tác bằng chuột/Tab/Space/Escape/mũi tên, bấm nhanh nhiều
lần, kéo điện thoại, xoay kích thước và mở bộ đàm khi đang đọc hồ sơ.
Không phát sinh vòng lặp render thứ hai.

## 5. Nối trạng thái game vào cảnh

File: `src/room.js`, `src/game.js`, `src/monitor.js`.

- Đọc UPS để tắt CRT, đèn bàn và đèn khóa khi mất điện. Giữ ánh sáng
  môi trường rất yếu để hình học không biến mất vô lý.
- Đọc trạng thái cửa để đổi đèn, nhãn và chốt; `ent.at` quyết định
  nhân vật ngoài cửa. Không thay luật di chuyển, hao điện hoặc thắng/thua.
- Chỉ cập nhật texture bảng ghim khi ghi chú đổi; hiển thị đủ dấu tiếng
  Việt. Sổ tay DOM tiếp tục giữ văn bản đầy đủ.
- Cập nhật CRT khi canvas feed đổi, giới hạn tần suất upload nếu cần.
  Nếu tải texture thất bại, thay bằng texture nhiễu tạo cục bộ và báo
  thông tin lỗi, không lặp exception mỗi frame.
- Reset góc nhìn và chuyển cảnh khi chơi lại; giữ ghi chú theo hành vi
  đã có. Chặn tương tác phòng khi chưa bắt đầu, đã chết hoặc kết thúc.

Kiểm tra: dùng demo đưa ma ra hành lang/cửa, khóa đẩy ma đi, mất điện;
đọc bằng chứng, hỏi bộ đàm, nộp đáp án đúng và thử lại.

## 6. Nối lại jumpscare đã duyệt

File: `src/game.js`; chỉnh `src/scenes.js` và `src/audio.js` chỉ nếu
cần đồng bộ, vì `drawImpact`, `resetScare`, `startApproach`,
`resumeRoom` đã tồn tại.

- Thay các timer trong `jumpscare()` bằng trình tự dựa trên đồng hồ thực:
  0–2,5 s nhiễu; 2,5–2,65 s đen/im; 2,65–2,93 s mặt; 2,93–3,35 s đen;
  sau đó màn chơi lại.
- Dùng `drawImpact` với ảnh mặt gốc, không thay bằng mặt 3D mới.
- Hủy chuyển cảnh cúi, đóng bộ đàm, ngừng cập nhật cảnh không cần thiết.
- Lưu hàm dừng âm thanh; gọi khi hết đoạn mặt hoặc restart. Khôi phục
  hum phòng khi bắt đầu ca mới.
- Kết hợp cờ giảm kinh dị và prefers-reduced-motion.

Kiểm tra: giữ các kiểm tra mốc thời gian, ảnh gốc, tốc độ ×10, ghi chú
và hủy giữa cảnh trong `tools/test-jumpscare.cjs`; bổ sung ×1/×3 và
không có âm đang chờ sau restart.

## 7. Lỗi, hiệu năng và kiểm tra hồi quy

File: `tools/test-room-3d.cjs`, `tools/test-jumpscare.cjs`,
`tools/test-server.cjs` nếu cần dùng chung server kiểm thử.

- Các kiểm tra trình duyệt tự chạy server HTTP trên cổng trống,
  giải phóng server và browser trong finally. Bỏ đường file:// cũ.
- Kiểm tra có scene WebGL thật, mesh phòng/nhân vật, vị trí camera đổi
  khi quay và cúi; vẫn chụp ảnh để đánh giá hình ảnh thực tế.
- Kiểm tra nguồn/dist, phiên desktop và viewport cảm ứng, focus biểu
  mẫu, resize, cúi nhanh, chết lúc cúi, restart và các luồng gameplay.
- Mô phỏng WebGL không khả dụng/mất context; thông báo lỗi có nút tải
  lại, không cho tiếp tục một ca với màn hình hỏng.
- Chặn mạng bên ngoài trong kiểm thử; game vẫn tải các tài nguyên
  bắt buộc từ server cục bộ. Font hệ thống thay thế khi font mạng thiếu.
- Giới hạn pixel ratio 1,5; giảm bóng trên thiết bị yếu. Đo thời gian
  khung hình, số draw call, texture và hình học trước/sau nhiều restart.
  Không đòi ngưỡng fps cứng trên trình duyệt chạy GPU phần mềm.
- Thu thập lỗi JS, phản hồi tài nguyên thất bại và lỗi WebGL; phân biệt
  lỗi game với cảnh báo GPU của môi trường kiểm thử.

Lệnh kiểm tra dự kiến:

```sh
python3 tools/build.py
PLAYWRIGHT_MODULE=/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core node tools/test-room-3d.cjs
PLAYWRIGHT_MODULE=/opt/homebrew/lib/node_modules/@playwright/cli/node_modules/playwright-core node tools/test-jumpscare.cjs
```

Chạy kiểm tra cú pháp cho các script đã sửa. Sau khi kiểm tra đạt, chỉ
chạy lại nhóm liên quan nếu có chỉnh sửa tiếp hoặc phát hiện vấn đề.

## 8. Bàn giao bản chơi

- Build lại `dist`, kiểm tra một lượt từ bản này.
- Cập nhật README và hướng dẫn chơi: cách mở HTTP, điều khiển 3D, yêu
  cầu WebGL, giới hạn CCTV vẫn là cảnh ảnh và chế độ giảm chuyển động.
- Lưu ảnh phòng, hướng cửa và video ngắn quay/cúi vào `_preview/room-3d/`.
- Ghi kết quả kiểm tra, môi trường đo hiệu năng và giới hạn còn lại.
- Mở bản chơi trong trình duyệt nếu môi trường cho phép; đưa người
  dùng đường mở game và ảnh xem trước. Không tự deploy lên dịch vụ ngoài.
