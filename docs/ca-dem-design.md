# CA ĐÊM — Game Design Doc v0.1

*Tên tạm. Lựa chọn khác: "Bàn giao 06:00", "CAM 07". Trạng thái: đêm 1 chơi được với ảnh thật (`index.html`), code đã tách engine / data.*

## 1. Pitch

Game web 2D, một màn hình. Bạn là kỹ thuật viên pháp y số trực **ca đêm một mình** dưới tầng hầm một trụ sở công an quận. Mỗi đêm nhận một gói bằng chứng số (điện thoại nạn nhân, frame camera, log thẻ, lịch sử chuyển khoản…) và phải **nộp kết luận đúng trước 06:00**. Cùng lúc, có một thứ di chuyển trong tòa nhà, và nó đang tiến về phòng bạn.

Góc nhìn thứ nhất trong phòng KTS (FNAF): thấy cửa, bàn, màn hình. **Cúi xuống màn hình** để phá án (HỒ SƠ / CAM / BẢNG KẾT LUẬN) thì không thấy cửa. Nhìn cái này thì mù cái kia.

Anthology **6 đêm = 6 vụ**, mỗi đêm 10 phút thực (chưa tính chết – chơi lại). Vụ nào cũng có hung thủ là người; Nó không bao giờ là đáp án.

## 2. Trụ cột thiết kế

1. **Suy luận công bằng** — mọi ô trên bảng kết luận phải suy ra được từ bằng chứng trong gói; không đoán mò, không cần meta-knowledge.
2. **Sống sót kiểu FNAF** — mối đe dọa di chuyển theo thời gian thực, có đường đi, phòng thủ tốn tài nguyên, fail state là jumpscare.
3. **Một màn hình, hai mục đích** — camera vừa là bằng chứng (recorded) vừa là mắt (live). Căng thẳng sinh ra từ việc *chia thời gian nhìn*.
4. **Data-driven** — 1 đêm = 1 file JSON (bằng chứng, nghi phạm, bảng kết luận, tham số Nó). Thêm vụ không phải thêm code.
5. **Scare có giá** — mỗi jumpscare / dread cue đều để lại một manh mối cho meta-arc; không dọa suông.

## 3. Khung truyện

### Bối cảnh
Phòng Kỹ thuật số (KTS), tầng hầm B1 trụ sở Công an quận (địa danh hư cấu, chưa đặt tên). Tòa nhà đang sửa chữa, ban đêm chạy **điện UPS** vì lịch cắt điện thi công. Quy định: bằng chứng số phải xử lý xong và **bàn giao trước 06:00** cho đội điều tra.

### Người chơi
Kỹ thuật viên KTS mới nhận ca đêm, thay người cũ "nghỉ đột ngột". Không tên, không lời. Liên lạc duy nhất với bên ngoài: **bộ đàm** với điều tra viên hiện trường (ĐTV) — người chuyển gói bằng chứng và hỏi nghi phạm thay bạn.

### Nó — "CAM 07"
Hệ thống cam live của tòa nhà có 6 kênh (CAM 01–06). Đôi lúc trong danh sách xuất hiện **CAM 07** — kênh không có trên sơ đồ. Mở CAM 07 thấy một góc nào đó của tòa nhà, có *một bóng người đứng quay lưng*. Khi CAM 07 biến mất khỏi danh sách là Nó đã rời chỗ và bắt đầu di chuyển.

Nó xuất hiện trong **footage của mọi vụ án** — ở phía xa, trước giờ nạn nhân chết, không ai trong hồ sơ nhắc tới. Người chơi tự nhận ra dần qua các đêm. Design sheet của Nó: `ca-dem-art-prompts.md` mục 2.

### Cấu trúc 6 đêm

| Đêm | Vụ (tên tạm) | Gói bằng chứng | Cơ chế mới |
|---|---|---|---|
| 1 | Chuyển khoản lúc 2:17 | Điện thoại nạn nhân, frame cam hẻm, log cam, biên bản pháp y | Tutorial: màn hình, pin, khóa cửa. Nó cấp 1–2 |
| 2 | Phòng 1204 | Log thẻ thang máy, group chat cư dân, frame cam sảnh | **Loa báo cháy** (lure): phát ở phòng khác để kéo Nó đi |
| 3 | Ca livestream | VOD streamer, chat log, donate log | **Khách** — thứ thứ hai, sống trong footage |
| 4 | Cuốc xe 23:50 | Trip log app xe, GPS, voice memo | **Cắt điện 03:00** — UPS tụt nhanh gấp đôi nửa sau đêm |
| 5 | Ca trước | Hồ sơ cá nhân của kỹ thuật viên ca trước | CAM 07 nằm cố định trong danh sách; Nó không bao giờ đứng yên |
| 6 | 05:59 | Footage của **chính phòng KTS, đêm nay** | Finale: không phòng thủ, chỉ còn giải đúng |

### Meta-arc (bản chất Nó: To be confirmed — mục 9)
Sợi dây: Nó có mặt ở mọi vụ. Đêm 5 lộ ra kỹ thuật viên ca trước cũng đã thấy nó và ghi chép. Đêm 6, gói bằng chứng là footage phòng bạn, timestamp 05:59 *đêm nay* — bằng chứng về một việc chưa xảy ra.

## 4. Luật chơi

### 4.1 Vòng lặp một đêm
- 00:00 → 06:00 in-game = **600 giây thực** (1 giờ in-game = 100s).
- 00:00: ĐTV gửi brief + gói bằng chứng. Nó ở vị trí xuất phát.
- Người chơi tự chia thời gian: đọc hồ sơ / canh cam / khóa cửa / hỏi ĐTV / điền bảng.
- **Thắng**: nộp bảng kết luận đúng 4/4 trước 06:00 → màn "BÀN GIAO". Mở đêm kế.
- **Thua**: Nó vào phòng → jumpscare → "CA TRỰC KẾT THÚC" → chơi lại đêm.
- 06:00 chưa nộp đúng: hết ca, không jumpscare nhưng không qua đêm → chơi lại (giữ bảng ghim).

### 4.2 Căn phòng (view mặc định) và màn hình (lean-in)
- **Phòng**: góc nhìn thứ nhất, pan nhẹ theo chuột. Bàn + màn hình CRT (đang chiếu cam đã chọn, nhỏ), bàn phím, đèn bàn, kệ hộp vật chứng, poster quy định, **bảng ghim** (= sổ tay: mỗi manh mối là một tờ giấy ghim), **cửa sắt B1-07 có ô kính lưới** nhìn ra hành lang, **hộp UPS · KHÓA** cạnh cửa (đồng hồ kim pin + nút khóa), **bộ đàm** trên bàn (chat ĐTV).
- Qua ô kính: Nó ở hành lang → bóng nhỏ phía xa; Nó ở cửa → đầu vai choán kính.
- **Cúi xuống màn hình** (nút dưới hoặc Space) → overlay màn hình CRT, 3 tab: **HỒ SƠ** (danh sách bằng chứng có thumbnail; tin nhắn/app ngân hàng trong khung điện thoại; biên bản là giấy có dấu; ảnh hiện trường là ảnh in), **CAM** (sơ đồ B1 + 6 kênh + feed), **BẢNG KẾT LUẬN** (4 ô dropdown *Ai / Vào bằng cách nào / Khi nào / Vì sao*, nút NỘP). Cột phải: sổ tay dạng list.
- Khi đang cúi xuống không thấy cửa — chỉ nghe tiếng gõ, màn hình rung.
- **Bộ đàm**: tin ĐTV hiện bong bóng cạnh bộ đàm; mở panel để hỏi, mỗi nghi phạm 2 câu, trả lời sau 15–30s.

### 4.3 Tài nguyên: pin UPS
Giá trị khởi điểm để tune, không phải final.

| Trạng thái | Tiêu hao |
|---|---|
| Nền (màn hình, đèn) | 0,04%/s (~24%/đêm) |
| Đang cúi xuống + tab CAM | +0,04%/s |
| Đang phát clip trong HỒ SƠ | +0,06%/s |
| **Khóa cửa** | +0,25%/s |
| Loa báo cháy (từ đêm 2) | 5% / lần |

Pin 0% → đèn tắt, khóa điện mất nguồn (cửa tự mở); Nó đi thẳng tới cửa trong 20–40s (random). Vẫn nộp được bảng nếu đã điền sẵn.

### 4.4 Nó — hành vi
- Sơ đồ B1: `Kho vật chứng (CAM 03) → Hành lang (CAM 02) → Cửa phòng KTS`. Nhánh phụ: `Phòng server (CAM 04) → Cầu thang (CAM 05) → Hành lang`. Nhà vệ sinh (CAM 06) là ngõ cụt.
- **Nhịp di chuyển**: mỗi 45–90s (tùy cấp) tung xúc xắc; cấp AI 0–20 kiểu FNAF. Tăng theo đêm và theo giờ (03:00 +1, 05:00 +1).
- **Bị nhìn thì chậm**: đang mở đúng cam có Nó → xác suất di chuyển giảm 70%. Nhưng xem cam tốn pin và không đọc được hồ sơ.
- **Ở cửa**: Nó đứng ở hành lang trước cửa 6–10s, phát tiếng *gõ tay lên kim loại*. Cửa khóa → Nó quay về Kho vật chứng. Cửa mở → thua.
- **Nộp bảng sai**: Nó +1 cấp ngay lập tức.
- **Khách** (từ đêm 3): không đi trong tòa nhà, nằm trong clip bằng chứng. Phát một clip có Khách trong khung hình **liên tục > 8s** → tab CAM bỗng có Khách ở Hành lang, bỏ qua đường đi, đứng cửa sau 5s. Phòng thủ: tạm dừng / chuyển frame thủ công.

### 4.5 Fail state & chơi lại
- Chuỗi thua: nhiễu 1,5s → tắt đèn 0,5s → mặt Nó choán màn hình + âm 0,8s → cắt đen → "CA TRỰC KẾT THÚC — 03:52".
- Chơi lại: giờ về 00:00, pin 100%, Nó về xuất phát. **Giữ**: bảng ghim, đánh dấu bằng chứng đã xem. **Mất**: câu hỏi ĐTV đã hỏi.
- Lý do giữ sổ tay: game suy luận mà chết là mất hết thì chơi lại chỉ còn đọc lại, chán. Giữ sổ tay thì cái mất là *thời gian* và *nhịp*, đúng chất FNAF.

### 4.6 Scare budget
- Jumpscare thật = **chỉ khi thua** (+ 1 lần scripted ở đêm 3 khi Khách lần đầu "qua"). Không jumpscare ngẫu nhiên lúc đang đọc.
- Dread cue (rẻ, dùng nhiều): gõ kim loại, đèn tuýp chớp, CAM 07 xuất hiện / biến mất, một dòng bộ đàm lạ ("Ai đang ở với em vậy?") mà ĐTV không gửi.
- Toggle **"Giảm kinh dị"**: jumpscare → ảnh tĩnh + không âm lớn; Nó vẫn hoạt động y nguyên.

## 5. Đêm 1 — "Chuyển khoản lúc 2:17"

### Brief (ĐTV gửi 00:00)
> Nạn nhân Lê Thị Hạnh, 52, chủ tiệm bánh "Hạnh Bakery", tầng trệt chung cư Bình An, sống một mình phía sau tiệm. Nhân viên phát hiện 05:40 sáng nay. Pháp y sơ bộ: chấn thương đầu, tử vong khoảng 00:30–01:00. Gói đính kèm: điện thoại nạn nhân (không đặt mã khóa), frame cam hẻm sau do tiệm hoa kế bên cung cấp, ảnh hiện trường. Ba người cần đối chiếu. Bàn giao trước 6h.

### Nhân vật
| | Vai | Liên hệ với nạn nhân |
|---|---|---|
| **Lê Thị Hạnh** (52) | Nạn nhân | Chủ tiệm bánh |
| **Trần Minh Khoa** (24) | Nghi phạm | Thợ bánh ca sáng, có chìa cửa sau |
| **Phạm Quốc Dũng** (45) | Nghi phạm | Em trai, hay vay tiền |
| **Nguyễn Thu Trang** (38) | Nghi phạm | Chủ tiệm hoa kế bên, chung hẻm sau, có cam |

### Sự thật (ẩn — chỉ tác giả biết)
Khoa thụt két 3 tháng (~31 triệu). Tối 17/10 Hạnh nhắn "mai 6h ở lại nói chuyện, két lệch". 00:38 Khoa dùng chìa cửa sau vào, cãi nhau, đánh Hạnh bằng cây cán bột; Hạnh tử vong ~00:50. Khoa ở lại hơn một giờ, lục điện thoại không khóa của Hạnh, thấy Dũng vừa xin vay bị từ chối lúc 21:52. 02:17 mở app ngân hàng — biết PIN 1968 vì Hạnh từng nhờ chuyển tiền nhà cung cấp — chuyển 48 triệu cho Dũng để tạo động cơ giả. 02:24 ra cửa sau, để điện thoại lại. 05:31 quay lại "đi làm" như thường, "phát hiện" xác.

### Bằng chứng (8)
| # | Loại | Nội dung | Cho biết |
|---|---|---|---|
| E1 | Biên bản pháp y (text) | Tử vong 00:30–01:00; chấn thương đầu, vật cứng dài; không dấu hiệu lục lọi | **Khi nào**. Loại trừ cướp |
| E2 | App ngân hàng trên máy nạn nhân | 02:17:06 chuyển 48.000.000 → PHAM QUOC DUNG, nội dung "cho em", xác thực **mã PIN** | Giao dịch *sau* giờ chết → người khác cầm máy, biết PIN |
| E3 | Tin nhắn Hạnh ↔ Dũng | 21:40 Dũng xin vay 50tr · 21:52 Hạnh: "Chị không có, đừng hỏi nữa" · **02:20 Dũng: "Chị chuyển rồi hả?? cảm ơn chị, mai em qua"** · 02:21 "Chị?" · 06:10 "Chị ơi??" + 4 cuộc gọi nhỡ | Red herring chính (động cơ Dũng). Nhưng Dũng bất ngờ khi nhận tiền |
| E4 | Tin nhắn Hạnh ↔ Khoa | 14/07: "Khoa chuyển 12tr cho bên bột giúp chị, **PIN 1968**, xong đổi lại nha" · 17/10 20:15: "Mai 6h em ở lại nói chuyện với chị. **Két lệch 3 tháng rồi**, chị đếm lại hết rồi." · Khoa: "Dạ." | Khoa biết PIN + **Vì sao** |
| E5 | Frame cam hẻm sau (6 frame) | 00:38 bóng hoodie **mở cửa sau bằng chìa** · 00:39 vào · 02:09 frame cuối trước mất tín hiệu *(góc hẻm: một bóng đứng quay lưng — không chú thích)* · 02:10–02:21 NO SIGNAL · 02:24 hoodie ra · 05:31 Khoa (không hoodie) mở cửa sau bằng chìa | **Vào bằng cách nào**. Hoodie có mặt trong tiệm 00:38–02:24, bao trùm cả giờ chết và giờ chuyển khoản |
| E6 | Log cam tiệm hoa (txt) | `02:10:00 CH01 scheduled reboot (daily)` · `02:21:14 CH01 online` · … · `CH07 — not configured` | Giải red herring gap 11 phút. Seed CAM 07 |
| E7 | Ảnh hiện trường ×2 | Két còn nguyên tiền · Sổ tay Hạnh mở trang "Đối chiếu két T7–T9: lệch 31.400.000", gạch dưới ca sáng | Loại trừ cướp; củng cố động cơ |
| E8 | Lời khai qua ĐTV (3 nghi phạm × 2 câu) | Xem bên dưới | Chìa cửa sau chỉ Hạnh + Khoa có |

**Câu hỏi ĐTV (mỗi câu chờ 15–30s):**
- Khoa — *Tối qua em ở đâu?* → "Ở nhà. 5h30 tới tiệm như mọi ngày, cửa sau khóa, em mở vào thì thấy…" · *Ai có chìa cửa sau?* → "Chỉ chị Hạnh với em."
- Dũng — *2h sáng anh làm gì?* → "Ở nhà, thấy tiền vào tưởng chị đổi ý. Tôi không có chìa tiệm." · *Anh biết PIN ngân hàng chị không?* → "Không. Chị ấy không tin tôi chuyện tiền."
- Trang — *Cam chị mất tín hiệu 2h10?* → "Nó tự khởi động lại 2h10 mỗi đêm, tôi cài vậy cho đỡ treo." · *Chị có chìa cửa sau tiệm bánh?* → "Không, cửa sau hai tiệm riêng, chỉ chung hẻm."

### Red herring
1. **Dũng**: xin vay bị từ chối → nhận 48tr lúc 02:17 → có động cơ, có hưởng lợi. Phá bằng: E1 giờ chết + E2 xác thực PIN + E8 Dũng không biết PIN, không có chìa; E3 02:20 phản ứng bất ngờ.
2. **Trang tắt cam 11 phút**: phá bằng E6 (reboot theo lịch) + E8.

### Chuỗi suy luận mong đợi
E1 (chết 00:30–01:00) → E2 (02:17 chuyển tiền *sau* khi chết, bằng PIN) → ai cầm máy và biết PIN? → E4 (Khoa biết PIN; két lệch) → E5 (00:38 vào bằng chìa, ở trong tới 02:24) → E8 (chìa chỉ Hạnh + Khoa) → **Khoa**.

### Bảng kết luận — đáp án
| Ô | Lựa chọn | Đúng |
|---|---|---|
| Ai | Khoa · Dũng · Trang · Người lạ | **Khoa** |
| Vào bằng cách nào | Chìa cửa sau · Cạy cửa trước · Nạn nhân mở cửa · Cửa sổ | **Chìa cửa sau** |
| Khi nào | 00:30–01:00 · 02:10–02:20 · 05:30 · 21:50 | **00:30–01:00** |
| Vì sao | Che giấu thụt két · Không được vay tiền · Tranh chấp mặt bằng · Cướp | **Che giấu thụt két** |

Nộp sai: hiện "x/4 đúng", không nói ô nào; Nó +1 cấp; khóa nút NỘP 30s. *(Có hiện x/4 hay không: open question #2.)*

### Lớp sống sót đêm 1 (tutorial)
- Nó cấp 1 (00:00–03:00), cấp 2 (03:00–06:00). Xuất phát Kho vật chứng.
- Scripted: ~01:30 CAM 07 xuất hiện trong danh sách 20s rồi biến mất. ~03:30 Nó tới Hành lang rồi tới cửa lần đầu → tiếng gõ + nhắc hộp KHÓA đúng một lần.
- Dự kiến Nó tới cửa 1–2 lần cả đêm. Người chơi đọc kỹ xong bảng ~04:30.
- Jumpscare: 0, trừ khi thua.
- Seed meta-arc: frame 02:09 ở E5. Không ai nhắc.

### Nhịp đêm 1 (dự kiến người chơi mới)
| Giờ in-game | Người chơi | Nó |
|---|---|---|
| 00:00–01:00 | Đọc brief, E1, E2 → thấy mâu thuẫn giờ | Đứng yên |
| 01:00–02:30 | E3 (nghi Dũng), E4 (PIN, két) — bắt đầu lật | CAM 07 chớp 20s |
| 02:30–03:30 | E5 kéo frame, E6 giải gap | Nhích ra Hành lang |
| 03:30–04:00 | Gõ cửa → học khóa cửa; hỏi ĐTV 2 câu (chờ) | Ở cửa 8s, quay về |
| 04:00–05:00 | E7, E8 đủ → điền bảng | Nhích lần 2 |
| 05:00–06:00 | NỘP → BÀN GIAO | — |

## 6. Kỹ thuật

- Web, HTML + JS thuần, không engine, không bundler. Phòng và cam vẽ canvas; UI màn hình là DOM/CSS. Chạy thẳng từ `index.html` (file://), chọn đêm bằng hash `#night1`.
- **Engine / nội dung tách riêng**: `src/*.js` không biết gì về vụ án; `nights/nightN.js` chứa toàn bộ nội dung một đêm (brief, bằng chứng, nghi phạm, bảng kết luận, kịch bản Nó). Thêm đêm = thêm một file data. Cấu trúc file: xem `README.md`.
- Loại bằng chứng engine hỗ trợ: `paper`, `bank`, `chat`, `frames`, `log`, `photos`, `ask`. Sự kiện kịch bản: `cam07`, `moveTo`, `say`.
- Ảnh: `assets/*.png` là master; game load `assets/opt/` (JPEG/PNG nén, ~3,6 MB). Thiếu ảnh nào thì phần đó tự vẽ procedural. Vị trí Nó trong từng cam: `NO_POS` trong `src/assets.js`.
- Audio: WebAudio procedural; cần một cú bấm đầu game (màn "Đeo tai nghe") để mở AudioContext + fullscreen.
- `tools/build.py` gộp thành một file (`dist/index.html`) để share hoặc publish.

## 7. Quyết định đã chốt

- Game mới, không liên quan Trạm Thiên Bình.
- Anthology 6 đêm, mỗi đêm 1 vụ ~10 phút thực.
- Khung "Phòng Kỹ thuật số ca đêm": lai hướng A (camera) + B (điện thoại nạn nhân).
- Kinh dị **FNAF-style**: góc nhìn thứ nhất trong phòng, đe dọa thời gian thực, pin UPS, khóa cửa, jumpscare = fail state.
- Vụ án luôn có hung thủ là người; Nó không bao giờ là đáp án.
- Gameplay lõi: soi bằng chứng + bảng kết luận 4 ô; thẩm vấn nhẹ qua bộ đàm.
- Sổ tay (bảng ghim) giữ qua các lần chết.
- Tông màu / art direction như mockup v2 (chi tiết trong `ca-dem-art-prompts.md`); ảnh sẽ gen bằng ChatGPT theo prompt trong đó.

## 8. Recommendation (chưa chốt)

- Tên: **"CA ĐÊM"** ngắn, dễ nhớ; "Bàn giao 06:00" gợi FNAF hơn nhưng dài.
- Thứ tự tiếp theo: (1) chơi thử đêm 1 ở ×1 để tune pin / cấp / thời gian đọc; (2) chốt bản chất Nó (mục 9); (3) viết `nights/night2.js` "Phòng 1204" + loa báo cháy; (4) gen ảnh cho đêm 2.
- Chưa làm Khách (đêm 3) cho tới khi đêm 1–2 chơi được.

## 9. To be confirmed / Open questions

1. **Bản chất của Nó** ở đêm 6 — chọn một:
   - a. *Siêu nhiên thật*: hồn của những nạn nhân chưa được giải oan; giải đúng = cho họ yên; đêm 6 là vụ của chính người chơi.
   - b. *Có lời giải người*: kỹ thuật viên ca trước chưa bao giờ nghỉ — vẫn ở trong tòa nhà, cài CAM 07, tự chèn mình vào footage. Kết kiểu *Her Story*.
   - c. *Mơ hồ có chủ đích*: không trả lời; đêm 6 kết bằng frame 05:59 của phòng bạn với một bóng đứng sau ghế.
2. Nộp sai hiện "x/4 đúng" hay không hiện gì (khó hơn, FNAF hơn)?
3. Chết có mất câu hỏi ĐTV đã hỏi không (đang đề xuất: mất)?
4. Desktop trước hay mobile là mục tiêu chính? Phòng bị ép hẹp trên màn dọc.
5. Tên nhân vật / địa danh: giữ tên Việt thường hay đổi hẳn sang hư cấu để tránh trùng người thật?
