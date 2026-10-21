# Murder Mystery

Ba game dùng chung một repo, chạy trên static hosting:

| Game | Trang mở |
| --- | --- |
| HIỆN TRƯỜNG 09 — Người sau tường | `index.html` hoặc `house09.html` |
| TẦNG 13 — Cuộc gọi cuối | `floor13.html` |
| CA ĐÊM | `desk.html` |

## HIỆN TRƯỜNG 09

Bản chơi 3D của vụ án trong căn nhà bỏ hoang: tìm Lan, khám vật chứng, dùng máy ảnh để ghi dấu vết vô hình, mở phòng tối và hầm rồi đưa kết luận ra cửa chính. Có hai đợt truy đuổi, cửa thông, tủ trốn, đường vòng khi hành lang sập và điểm lưu riêng. Băng ghi âm là chứng cứ bổ sung tùy chọn.

**WASD / mũi tên** đi; **chuột** nhìn; **E** khám/trốn; **V** giơ máy; **X** chụp; **F** đèn; **Shift** chạy; **J** hồ sơ; **M** sơ đồ; **Esc** tạm dừng. Điện thoại: giữ mũi tên, kéo cảnh để nhìn, chạm các nút hành động; Chạy là nút bật/tắt. Chế độ giảm giật mình bỏ ảnh áp sát và làm đối tượng săn đuổi chậm hơn. Có tắt âm trong Tạm dừng.

`house09/` chứa cảnh, điều khiển, máy ảnh và tiến trình. Thư viện Three.js, ảnh ma và các mô-đun âm thanh/chuột/tìm đường được dùng chung với TẦNG 13. Cảnh dựng bằng hình học và vật liệu ảnh cục bộ; ảnh minh họa trong `docs/mockups` là chuẩn mỹ thuật, không phải ảnh chụp game.

Kiểm tra: `node tools/test-house09-state.mjs` và `node tools/test-house09.cjs`. Kiểm tra trình duyệt cần Playwright/Chrome. `PLAYWRIGHT_MODULE` cho phép chỉ đường dẫn thư viện có sẵn. Bằng chứng kiểm tra nằm trong `_preview/house09/` (không đưa vào Git).

## TẦNG 13 — Cuộc gọi cuối

Game điều tra kinh dị góc nhìn thứ nhất, chơi trực tiếp trong một khu chung cư bị phong tỏa. Theo cuộc gọi cuối của Mai, khám căn 1304, đối chiếu chứng cứ, mở kho và đưa người mất tích trở về. Manh mối thay đổi khu vực có thể vào và đánh thức thứ đang săn bạn.

## Mở game

Trên Mac, bấm đúp **Mở HIỆN TRƯỜNG 09.command**. Giữ cửa sổ máy chủ mở trong lúc chơi.

Hoặc chạy:

```sh
python3 tools/play.py
```

Trang đầu mở **HIỆN TRƯỜNG 09**. TẦNG 13 nằm ở `floor13.html`. Liên kết **Bản phòng trực cũ** mở game CA ĐÊM trước đó ở `desk.html`. Thư viện, vật liệu và âm thanh của bản mới đều nằm cục bộ; không cần cài npm hoặc kết nối mạng. Cần trình duyệt hỗ trợ WebGL 2 và mở qua HTTP, không mở `index.html` bằng `file://`.

## Điều khiển TẦNG 13

- **WASD** đi lại; bấm vào cảnh rồi rê chuột để nhìn, không cần giữ nút. **Q/R** hoặc **← →** quay; **↑ ↓** tiến/lùi; **C** nhìn thẳng lại.
- **E / Space** hoặc bấm nhãn giữa màn hình để tương tác. Đến gần và hướng mắt về vật.
- **F** bật/tắt đèn; **Shift** chạy; **J** sổ án; **M** sơ đồ; **Escape** thả chuột và tạm dừng. Chỉnh độ nhạy chuột trong phần **Điều khiển**.
- Điện thoại: cần bên trái để đi, kéo vùng trống để nhìn, giữ **Chạy**, chạm nhãn để tương tác.

Đèn và tiếng chạy làm bạn dễ bị phát hiện. Tủ trong căn hộ và phòng bảo vệ là chỗ trốn khi chưa bị nhìn thấy. Pin tự hồi khi tắt đèn. Sổ án, vật chứng và menu tạm dừng thế giới để bạn đọc. Có chế độ **Giảm kinh dị & chuyển động** và nút tắt âm trong phần điều khiển.

Tiến trình lưu trong trình duyệt tại các mốc điều tra; bị bắt có thể thử lại từ mốc gần nhất. Bắt đầu vụ mới sẽ thay mốc cũ. Có ba kết thúc tùy kết luận và chứng cứ mang về.

## Đóng gói

```sh
python3 tools/build.py
python3 tools/play.py --dist
```

Đưa **toàn bộ** thư mục `dist` lên static hosting. `dist/index.html` là HIỆN TRƯỜNG 09; `dist/floor13.html` là TẦNG 13; `dist/desk.html` là phòng trực cũ. Không chỉ tải một file HTML riêng lẻ.

## Kiểm tra

```sh
node tools/test-floor13-state.mjs
node tools/test-floor13-controls.cjs
node tools/test-floor13.cjs
```

Kiểm tra trình duyệt dùng Playwright và Chrome. Có thể đặt `PLAYWRIGHT_MODULE` trỏ tới thư viện Playwright đã cài. Kết quả, ảnh và video nằm trong `_preview/floor13/`. Xem chi tiết ở `docs/playtest-floor13.md`.

## Cấu trúc

- `floor13.html`, `case13/style.css`: giao diện bản mới.
- `case13/world.js`: chung cư 3D, vật chứng, cửa, va chạm và ánh sáng.
- `case13/game.js`: điều khiển, tương tác, truy đuổi, sổ án, mật mã và kết thúc.
- `case13/state.mjs`: vụ án, tiến trình và mốc lưu.
- `case13/pursuer.js`: tạo hình ma chi tiết từ ảnh trước/sau cục bộ, ánh sáng đèn pin và ảnh áp sát.
- `case13/navigation.js`: tìm đường theo vùng đi được và cửa đang mở.
- `case13/audio.js`: âm thanh môi trường, bước chân định hướng, truy đuổi.
- `vendor/three/`: Three.js 0.180.0 cục bộ, giấy phép MIT.
- `desk.html`, `src/`, `css/`, `nights/`, `assets/`: bản phòng trực cũ, được giữ riêng.

Các kiểm thử của phòng trực vẫn chạy qua `tools/test-room-3d.cjs`, `tools/test-jumpscare.cjs` và `tools/test-scare-audio.cjs`.
