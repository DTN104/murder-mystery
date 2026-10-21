# Đối chiếu văn phong: script đêm 1 trước và sau khi rà theo bộ quy tắc

Cách phân loại: lời thoại (bộ đàm, lời khai, tin nhắn, thông báo) rà theo nhánh có giọng, mỗi nhân vật một giọng. Giấy tờ trong game (biên bản pháp y, nhật ký máy ghi hình, dòng giao dịch) rà theo nhánh trung tính, vì chúng phải đọc như giấy tờ thật. Phần khung của file (tiêu đề mục, chú thích) rà lớp 1 và lớp 4.

Sửa ở `nights/night1.js`, `src/game.js`, `src/markup.html`, `src/monitor.js`, `tools/script.js`, rồi sinh lại `docs/script-dem1.md`. Đáp án, mã cảnh, cấu trúc dữ liệu giữ nguyên; game chạy lại đủ vòng tới màn bàn giao.

## 1. Dấu câu và định dạng

| Mã | Trước | Sau | Lý do |
|---|---|---|---|
| R4.1 | ĐÊM 1 — HẠNH BAKERY | ĐÊM 1 · HẠNH BAKERY | Gạch dài là dấu vết máy; dấu chấm giữa đã dùng khắp giao diện |
| R4.1 | 06:00 — chưa nộp kết luận đúng. Không qua đêm. Bảng ghim được giữ. | 6 giờ rồi mà chưa có kết luận đúng. Không qua được đêm nay. Bảng ghim vẫn giữ. | Bỏ gạch dài, bỏ bị động "được giữ", thêm "mà", "vẫn" |
| R4.1 | Máy không khóa màn hình — ai cầm máy và biết PIN đều chuyển được. | Máy không khóa màn hình, nên ai cầm máy và biết PIN đều chuyển được. | Gạch dài thành liên từ "nên" |
| R4.1 | Chơi lại đêm 1 — giữ bảng ghim | Chơi lại, giữ bảng ghim | Nhãn nút |
| R4.1 | — chưa chọn — | chưa chọn | Giá trị mặc định của ô chọn |
| R4.1 | CAM 07 · — — — | CAM 07 · · · · | Tên kênh ma, đổi ký hiệu để không còn gạch dài |
| R4.4 | **ĐTV:** ..., **Bạn:** → Khoa: ... | ĐTV: ..., Bạn, gửi Khoa: ... | File script bỏ in đậm ở nhãn người nói |
| R4.3 | # CA ĐÊM — Script Đêm 1 | # Kịch bản lời thoại đêm 1 | Tiêu đề viết thường, tiếng Việt |

## 2. Tiếng Anh chen vào câu Việt

| Mã | Trước | Sau | Lý do |
|---|---|---|---|
| R12.3 | frame cam hẻm do tiệm hoa kế bên đưa | Hình cam hẻm sau là tiệm hoa kế bên đưa | "frame" có từ Việt chính xác, ĐTV nói "hình" |
| R12.3 | Bóng áo hoodie tra chìa vào cửa sau | Người mặc áo trùm đầu tra chìa vào ổ khóa cửa sau | Chú thích do ĐTV ghi, ĐTV lớn tuổi không nói "hoodie" |
| R12.3 | App ngân hàng — máy nạn nhân | Ứng dụng ngân hàng trên máy nạn nhân | Tên bằng chứng trong hồ sơ |
| R12.3 | 02:10 scheduled reboot (daily) — gap 11 phút là theo lịch | 02:10 cam tự khởi động lại theo lịch · mất hình 11 phút là bình thường | Đây là ghim tay của người chơi, không chép nguyên dòng log |
| R12.6 | NO SIGNAL — 11 phút. | Mất tín hiệu (NO SIGNAL) trong 11 phút. | Giá trị hệ thống đi sau từ Việt ở lần đầu |
| R12.6 | Dòng scheduled reboot giải thích khoảng trống | Dòng khởi động lại theo lịch (scheduled reboot) giải thích khoảng trống | Như trên |
| R12.6 | Log camera tiệm hoa | Nhật ký (log) camera tiệm hoa | "log" là thuật ngữ, giữ trong ngoặc |
| R12.3 | Script, text, brief, OSD, scene, HUD, hover, feed (phần khung file) | kịch bản lời thoại, chữ, tóm tắt vụ, chữ trên khung hình, mã cảnh, góc màn hình, rê chuột, khung cam | Khung file cũng là tiếng Việt |

Giữ nguyên tiếng Anh: các dòng trong nhật ký NVR (chữ của thiết bị, đọc nguyên văn), nội dung chuyển khoản không dấu (ngân hàng thật hiển thị vậy), mã cảnh `hoodie_door` (mã trong code), CAM, UPS, PIN, KTS, ĐTV.

## 3. Giọng bộ đàm và lời khai (nhánh có giọng)

| Mã | Trước | Sau | Lý do |
|---|---|---|---|
| R10.6, R10.5 | Gói đêm nay gửi rồi. Nạn nhân Lê Thị Hạnh, 52, chủ tiệm bánh Hạnh Bakery. Phát hiện 05:40. Pháp y: chấn thương đầu, tử vong khoảng 00:30–01:00. | Gửi gói rồi đó. Nạn nhân Lê Thị Hạnh, 52 tuổi, chủ tiệm bánh Hạnh Bakery ở tầng trệt chung cư Bình An. Nhân viên phát hiện lúc 5 giờ 40 sáng nay. Pháp y nói bị đánh vào đầu, chết khoảng từ nửa đêm tới 1 giờ. | Bản cũ là dòng ghi chú kiểu biên bản (hai chấm, số giờ máy). Người nói qua bộ đàm nói giờ bằng miệng, có "đó", "nói", "khoảng" |
| R10.6 | Bàn giao trước 6h. | 6 giờ bàn giao, nhớ đó. | Câu lệnh của người thật có đuôi câu |
| R10.6 | Điện thoại không đặt mã khóa, frame cam hẻm do tiệm hoa kế bên đưa. | Điện thoại bà ấy không cài khóa màn hình, em mở thẳng. Hình cam hẻm sau là tiệm hoa kế bên đưa. | Thêm hành động cụ thể "em mở thẳng", xưng hô "bà ấy", "em" |
| R10.6 | Khoa: "Ở nhà. 5h30 tới tiệm như mọi ngày, cửa sau khóa, em mở vào thì thấy chị…" | Khoa nói: "Em ở nhà. Sáng 5 giờ rưỡi em tới tiệm như mọi ngày, cửa sau đang khóa, em mở vào thì thấy chị..." | ĐTV đọc lại lời khai thì mở bằng "Khoa nói", không phải nhãn kịch bản "Khoa:"; "5h30" thành "5 giờ rưỡi" |
| R10.6 | Khoa: "Chỉ chị Hạnh với em." | Khoa nói: "Chỉ chị Hạnh với em thôi." | Thêm "thôi" |
| R10.6 | Dũng: "Ở nhà. Thấy tiền vào tưởng chị đổi ý. Tôi không có chìa tiệm." | Dũng nói: "Tôi ở nhà. Thấy tiền vào, tưởng chị đổi ý. Tôi làm gì có chìa tiệm." | Dũng 45 tuổi, đang bực, phủ định bằng "làm gì có" |
| R10.6 | Dũng: "Không. Chị ấy không tin tôi chuyện tiền." | Dũng nói: "Không. Chuyện tiền bạc chị ấy có tin tôi bao giờ." | Câu hỏi tu từ tự trả lời, đúng giọng người bị nghi oan |
| R10.6 | Trang: "Không, cửa sau hai tiệm riêng, chỉ chung hẻm." | Trang nói: "Không. Cửa sau hai tiệm riêng, chỉ chung cái hẻm." | Thêm "cái" |
| R10.6 | Chị ơi em cần 50tr gấp, cuối tháng em trả. Chị giúp em lần này | Chị ơi em cần 50tr gấp. Cuối tháng em trả chị. Giúp em lần này đi chị | Tin nhắn của người đi vay: câu ngắn, nài bằng "đi chị" |
| R10.6 | HỆ THỐNG: UPS cạn. Đèn tắt. Khóa cửa mất nguồn. | HỆ THỐNG: UPS cạn rồi. Đèn tắt, khóa cửa mất nguồn. | Ba câu cụt đều nhau thành một câu ngắn và một câu dài |
| R10.6 | Nhìn đúng cam có Nó thì Nó chậm lại. Nhưng lúc cúi xuống màn hình, bạn không thấy cửa. | Nhìn đúng cam có Nó thì Nó chậm lại. Mà lúc cúi xuống màn hình thì bạn không thấy cửa. | "Mà", "thì" thay "Nhưng" |
| R10.6 | Chưa có gì. Mở bằng chứng để ghi. | Chưa ghi gì. Mở bằng chứng là có. | Sổ tay trống, giọng gần người hơn |

## 4. Giấy tờ trong game (nhánh trung tính)

| Mã | Trước | Sau | Lý do |
|---|---|---|---|
| R11.7 | Nạn nhân: Lê Thị Hạnh, nữ, 52 tuổi. | Nạn nhân: Lê Thị Hạnh, nữ, sinh năm 1974. | Biên bản thật ghi năm sinh |
| R11.7 | Thời điểm tử vong ước tính: 00:30 – 01:00 ngày 18/10 (độ cứng tử thi, nhiệt độ cơ thể). | Căn cứ độ cứng tử thi và nhiệt độ cơ thể, thời điểm tử vong ước tính từ 00 giờ 30 đến 01 giờ 00 ngày 18/10. | Câu biên bản mở bằng "Căn cứ", giờ viết "00 giờ 30" |
| R11.7 | Điện thoại nạn nhân thu giữ trên bàn bếp, không đặt mã khóa màn hình. | Thu giữ một điện thoại di động của nạn nhân trên bàn bếp. Máy không cài mã khóa màn hình. | Động từ "thu giữ" đứng đầu như biên bản |
| R11.7 | Số 118/BB-PY · 18/10 · 06:40 | Số 118/BB-PY · ngày 18/10 · 06 giờ 40 | Như trên |
| R0.2 | Két tiền còn nguyên (xem ảnh). | Két tiền trong bếp còn nguyên (xem ảnh kèm theo). | Cụ thể hơn một chút, đúng từ của biên bản |

## 5. Chữ trên tờ ghim (tay người chơi viết)

| Mã | Trước | Sau | Lý do |
|---|---|---|---|
| R0.2 | E1 · Tử vong 00:30–01:00 · chấn thương đầu · không lục lọi | E1 · chết khoảng 0h30 tới 1h · bị đánh vào đầu · không lục lọi | Ghi tay thì không chép từ biên bản ("tử vong", "chấn thương") |
| R0.2 | E2 · 02:17 chuyển 48tr → PHAM QUOC DUNG, xác thực bằng PIN | E2 · 02:17 chuyển 48tr cho DŨNG · bằng mã PIN · sau giờ chết | Ghi điều người chơi vừa nhận ra ("sau giờ chết"), không ghi lại dòng giao dịch |
| R0.2 | E5 · 00:38 hoodie mở cửa sau bằng chìa · 02:24 ra · 05:31 Khoa | E5 · 00:38 áo trùm đầu mở cửa sau bằng chìa · 02:24 ra · 05:31 Khoa tới | Bỏ "hoodie" |
| R0.2 | E7 · Két còn nguyên · sổ đối chiếu két lệch 31.400.000 | E7 · két còn nguyên tiền · sổ tay: két lệch 31.400.000, ghi "hỏi lại K." | Ghi luôn chi tiết đáng ngờ nhất trên trang sổ |
| R0.2 | Khoa: tới 05:30, cửa sau đang khóa | Khoa: tới 5h30, cửa sau đang khóa | Giờ viết tay |

## 6. Sửa nội dung phát hiện khi rà (không phải văn phong)

| Chỗ | Trước | Sau |
|---|---|---|
| E2, dòng giao dịch đầu | 17/10 · 02:17:06 | 18/10 · 02:17:06 (2 giờ 17 sáng là đã sang ngày 18) |
| E3, dòng hệ thống | 4 cuộc gọi nhỡ · 06:11 – 06:25 | 4 cuộc gọi nhỡ, 06:11 đến 06:25 |

## 7. Không sửa, và vì sao

- Cấu trúc file script đánh số mục 0 đến 10: đây là tài liệu tra cứu, cấu trúc đều là của thể loại, không phải dấu vết.
- Bốn ô bảng kết luận và các lựa chọn: là dữ liệu game, đổi chữ là đổi đáp án.
- Tin lạ lúc 04:10 "Ai đang ở với em vậy?" và "Xin lỗi, gửi nhầm.": cố ý cụt và vô cảm, giữ nguyên.
- Chữ trên sổ tay của Hạnh ("T7 lệch 8.6", "ca sáng ?? hỏi lại K."): viết tay của nhân vật, đã đúng giọng.
