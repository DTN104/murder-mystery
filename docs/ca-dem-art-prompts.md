# CA ĐÊM — Art direction & prompt sinh ảnh

*Dùng cho ChatGPT (gpt-image) hoặc tool gen ảnh khác. Prompt viết tiếng Anh vì model gen ảnh bám tiếng Anh chắc hơn; ghi chú tiếng Việt. Mọi chữ trên ảnh (timestamp, biển báo) đều overlay bằng code — **không nhờ model vẽ chữ**. Ảnh xong thả vào `../assets/` đúng tên file.*

## 1. Art direction (đã chốt từ mockup v2)

| | Quyết định |
|---|---|
| Bối cảnh | Tầng hầm trụ sở cơ quan cũ ở Việt Nam, ban đêm. Tường bê tông ẩm, nửa dưới sơn xanh xám, máng cáp lộ thiên, một đèn tuýp duy nhất. |
| Palette | Nền `#07090a` · tường `#23302d` → `#3a4a45` · CRT/phosphor `#a3dbb3` · amber cảnh báo `#e3a63c` · đỏ chỉ dùng cho REC và nguy hiểm `#d8493a` · giấy `#efe6c9` |
| Ánh sáng | Lạnh, xanh lục nhạt từ đèn tuýp; một nguồn ấm duy nhất là đèn bàn. Cam live: tông CCTV xanh lục, nhiễu analog, vignette. |
| Texture | Grain nặng, hơi mờ, như ảnh chụp thiếu sáng / NVR rẻ tiền 480p upscale. |
| Không làm | Ma trắng tóc dài, zombie, máu me, mặt quỷ răng nhọn, chữ trong ảnh, logo, watermark. Kinh dị ở đây là *sai sai* và *đứng yên*, không phải gore. |

### Style anchor — dán vào ĐẦU mọi prompt
```
Found-footage horror game asset. Setting: the basement of an old Vietnamese government office building at night. Damp concrete walls, lower half painted teal-grey, exposed cable trays on the ceiling, a single flickering fluorescent tube is the only light. Color grade: desaturated cold teal-green shadows, pale phosphor-green highlights, occasional amber accent. Heavy film grain, slight lens vignette, low-light photo look. No text, no letters, no watermark, no logo.
```
Mẹo giữ đồng bộ: gen tất cả trong **một cuộc chat**, sau ảnh đầu tiên thêm câu *"Keep exactly the same color grade, grain and lighting as the previous image."* Mỗi asset xin 2–3 biến thể rồi chọn.

## 2. Nhân vật "Nó" — design sheet

Một dáng người **quá cao và quá gầy**, mặc áo khoác dài tối màu trông ẩm ướt như vừa dầm mưa. Đầu hơi nhỏ so với thân, nghiêng nhẹ sang một bên. Tay dài quá gối. **Luôn đứng yên hoàn toàn.** Mặt nhợt, da bóng ướt, không có nét rõ trừ hai hốc mắt sâu tối; miệng chỉ thấy ở cảnh jumpscare — hé mở, hơi rộng quá. Không có răng nhọn, không máu.

Lý do thiết kế: Nó phải đọc được ở **kích thước nhỏ** (bóng xa trong cam, qua ô kính cửa) → silhouette phải đặc trưng: cao, mảnh, đầu nhỏ nghiêng. Jumpscare chỉ cần một mặt duy nhất.

## 3. Danh sách asset theo thứ tự ưu tiên

| # | Asset | File | Kích thước | Thay cho phần nào trong demo |
|---|---|---|---|---|
| 1 | Mặt Nó — jumpscare | `no_face.png` | 1920×1080 | `drawFace()` (hiện vẽ canvas) |
| 2 | Nó — toàn thân, nhìn từ sau | `no_back.png` | 1024×2048, nền trong suốt | `figure()` trong CAM 07 và frame E5 02:09 |
| 3 | Nó — toàn thân, nhìn thẳng | `no_front.png` | 1024×2048, nền trong suốt | `figure()` trong các cam, ô kính cửa |
| 4 | Nó — đầu vai cận, qua kính | `no_window.png` | 1024×1024, nền trong suốt | Ô kính cửa khi Nó ở cửa |
| 5 | CAM 02 Hành lang B1 (trống) | `cam02.png` | 1920×1080 | `corridor()` |
| 6 | CAM 03 Kho vật chứng (trống) | `cam03.png` | 1920×1080 | `storage()` |
| 7 | CAM 04 Phòng server (trống) | `cam04.png` | 1920×1080 | `server()` |
| 8 | CAM 05 Cầu thang (trống) | `cam05.png` | 1920×1080 | `stairs()` |
| 9 | CAM 06 Nhà vệ sinh (trống, có gương) | `cam06.png` | 1920×1080 | `restroom()` |
| 10 | CAM 01 Sảnh thang máy (trống) | `cam01.png` | 1920×1080 | `lobby()` |
| 11 | CAM 07 — hành lang "sai" (trống, tông ấm) | `cam07.png` | 1920×1080 | `corridor({warm})` |
| 12 | Hẻm sau tiệm bánh, cam tiệm hoa (trống, đêm) | `alley.png` | 1600×1200 (4:3) | `alley()` nền — bản bình minh đổi màu bằng code |
| 13 | Người áo hoodie, nghiêng, tay với tới ổ khóa | `hoodie_door.png` | 1024×2048, nền trong suốt | E5 00:38 / 00:39 |
| 14 | Người áo hoodie, nhìn từ sau, đang bước đi | `hoodie_walk.png` | 1024×2048, nền trong suốt | E5 02:24 |
| 15 | Khoa — thanh niên 24t, không hoodie, cầm chìa | `khoa.png` | 1024×2048, nền trong suốt | E5 05:31 |
| 16 | Ảnh hiện trường: két tiền còn nguyên | `scene_safe.png` | 1600×1200 | `photo('safe')` |
| 17 | Ảnh hiện trường: sổ tay mở, **trang trống** | `scene_notebook.png` | 1600×1200 | `photo('notebook')` — chữ overlay bằng code |
| 18 | *(tùy chọn)* Phòng KTS toàn cảnh | `room.png` | 2560×1440 | Toàn bộ `buildStatic()` — xem bố cục bắt buộc ở mục 4.18 |

Các cam **phải trống người**: Nó được ghép vào bằng code (sprite #2/#3) để di chuyển được. Nếu nền trong suốt không gen được, xin nền **xanh lá thuần `#00ff00`** hoặc **tím `#ff00ff`**, key out trong code.

## 4. Prompt từng asset

Mỗi prompt = *[Style anchor]* + đoạn dưới.

**4.1 `no_face.png` — mặt jumpscare**
```
Extreme close-up of a face filling the entire 16:9 frame, so close that the top of the head and the chin are cut off. The face is pale and wet-looking, smooth, almost featureless except two deep black eye hollows and a mouth that is slightly open and a little too wide. Lit only from below by the pale green glow of a CRT monitor. Slight motion blur as if it lunged toward the camera. Horror, uncanny, no teeth visible, no blood.
```

**4.2 `no_back.png` — toàn thân, nhìn từ sau**
```
Full-body character sprite, seen from behind, standing perfectly still, centered, feet at the bottom of the frame. An unnaturally tall and thin humanoid figure in a long dark coat that looks wet, head slightly too small and tilted to one side, arms hanging past the knees. Lit from above by a cold fluorescent light. Transparent background (PNG with alpha), nothing else in the frame, portrait orientation 1:2.
```

**4.3 `no_front.png` — toàn thân, nhìn thẳng**
```
Same character as the previous image, now seen from the front, standing perfectly still facing the viewer, centered, feet at the bottom. Pale smooth face in shadow with two deep black eye hollows, no visible mouth. Long wet dark coat, arms past the knees, head slightly tilted. Transparent background (PNG with alpha), portrait 1:2.
```

**4.4 `no_window.png` — đầu vai qua ô kính**
```
Same character, head and shoulders only, extremely close to the camera as if pressed against a small window, slightly off-center, face turned a few degrees away. Dark, only the pale skin catches a faint green light. Transparent background (PNG with alpha), square.
```

**4.5 `cam02.png` — Hành lang B1**
```
Still frame from a fixed high-angle CCTV camera looking down a long narrow basement corridor toward a grey steel door at the far end. Flickering fluorescent tubes receding along the ceiling, stained walls, cable tray, a fire extinguisher. The corridor is completely EMPTY, no people. Wide-angle lens with slight fisheye distortion, analog video noise, horizontal scanlines, 16:9.
```

**4.6 `cam03.png` — Kho vật chứng**
```
Still frame from a fixed high-angle CCTV camera in a basement evidence storage room: rows of steel shelving stacked with cardboard evidence boxes and sealed bags, one bare bulb, a metal desk with a ledger. Completely EMPTY, no people. Wide-angle, analog video noise, 16:9.
```

**4.7 `cam04.png` — Phòng server**
```
Still frame from a fixed high-angle CCTV camera in a small server room: four black server racks with rows of blinking green and amber LEDs, cables, a humming air conditioner, very dark except the LEDs. Completely EMPTY, no people. Wide-angle, analog video noise, 16:9.
```

**4.8 `cam05.png` — Cầu thang**
```
Still frame from a fixed CCTV camera at the bottom of a concrete basement staircase going up to a landing with one weak light, steel railing, peeling paint. Completely EMPTY, no people. Wide-angle, analog video noise, 16:9.
```

**4.9 `cam06.png` — Nhà vệ sinh**
```
Still frame from a fixed high-angle CCTV camera in an old institutional restroom: cracked white tiles, two sinks, a long mirror above them reflecting the empty room, a dripping tap, one fluorescent tube. Completely EMPTY, no people, nothing in the mirror. Wide-angle, analog video noise, 16:9.
```

**4.10 `cam01.png` — Sảnh thang máy**
```
Still frame from a fixed CCTV camera in a small basement elevator lobby: two closed steel elevator doors, a floor indicator, a plastic bench, a dead potted plant, polished concrete floor. Completely EMPTY, no people. Wide-angle, analog video noise, 16:9.
```

**4.11 `cam07.png` — hành lang "sai"**
```
Still frame from a CCTV camera of a corridor that resembles the basement corridor but is subtly wrong: the light is warm amber instead of green, the corridor is slightly too long, the doors have no handles, and the walls are too clean. Completely EMPTY, no people. Heavier video noise and tearing, 16:9.
```

**4.12 `alley.png` — hẻm sau tiệm bánh**
```
Still frame from a cheap doorbell security camera mounted above a flower shop's back door, looking down a narrow Vietnamese alley (hẻm) at night: on the left, the steel back door of a bakery with a padlock hasp; parked motorbikes under tarps; plastic flower crates; one sodium street lamp at the far end giving an orange glow; wet concrete. Completely EMPTY, no people. 4:3, low resolution, strong noise, slight fisheye.
```

**4.13 `hoodie_door.png` — hoodie với tới ổ khóa**
```
Full-body sprite of a person in a dark hoodie with the hood up, seen from the side at three-quarter angle, leaning slightly forward with one arm extended as if putting a key into a door lock at chest height. Face not visible. Lit by a distant orange street lamp. Transparent background (PNG with alpha), portrait 1:2.
```

**4.14 `hoodie_walk.png` — hoodie đi ra**
```
Full-body sprite of the same hooded person seen from behind, mid-step walking away, hands in the hoodie pocket. Transparent background (PNG with alpha), portrait 1:2.
```

**4.15 `khoa.png` — Khoa**
```
Full-body sprite of a Vietnamese man in his mid-twenties, short hair, no hood, wearing a plain T-shirt and a small backpack, holding a bunch of keys, seen from the side at three-quarter angle, reaching toward a door. Pre-dawn blue-grey light. Transparent background (PNG with alpha), portrait 1:2.
```

**4.16 `scene_safe.png` — két tiền**
```
Crime scene photograph taken with a flash: a small grey steel cash safe in a bakery's back kitchen, door open, stacks of Vietnamese banknotes neatly inside, untouched. Flour on the counter, a rolling pin nearby. Harsh flash, slight overexposure, 4:3. No text.
```

**4.17 `scene_notebook.png` — sổ tay (trang trống)**
```
Crime scene photograph taken with a flash: a worn spiral notebook lying open on a wooden table, pages ruled but completely BLANK, a pen beside it, a coffee ring stain. Harsh flash, slight overexposure, 4:3. No handwriting, no text.
```
*(Chữ "Đối chiếu két T7–T9 … TỔNG LỆCH 31.400.000" vẽ đè bằng canvas.)*

**4.18 `room.png` — phòng KTS (tùy chọn, làm sau)**
Chỉ làm khi đã ưng 1–17. Bố cục phải khớp hotspot trong code, nên nói rõ vị trí:
```
First-person view, eye level, sitting at a desk in a small basement office. Composition, 16:9: a CRT monitor on the desk occupies the center-left (roughly 26% to 52% of the width, 30% to 66% of the height); a cork board with pinned papers on the left wall (3% to 28% width, 13% to 46% height); a grey steel door with a small wired-glass window on the right (69% to 84% width), and next to it on the right a wall-mounted metal panel with a round gauge and a big button (87% to 97% width); steel shelves with evidence boxes between the monitor and the door; a handheld radio on the desk right of the monitor; a desk lamp on the far left. One fluorescent tube on the ceiling, desk lamp warm. No people, no text.
```

## 5. Tích hợp

- Thả file vào `assets/` theo đúng tên ở bảng mục 3. Code sẽ thay `drawImage()` vào từng hàm vẽ, giữ nguyên lớp nhiễu / vignette / flicker để ảnh nào cũng "cùng một hệ thống cam".
- Sprite Nó: code scale theo khoảng cách (xa trong cam = 30% chiều cao khung, ở cửa = tràn khung) và thêm lắc nhẹ; nên gen **một dáng duy nhất**, không gen nhiều pose.
- Ảnh cam nên gen ở độ phân giải thấp hơn ảnh phòng — nhiễu che khuyết điểm, và game load nhẹ.
