# Hướng dẫn chơi thử — Đêm 1 "Chuyển khoản lúc 2:17"

Mục đích của lượt test này: lấy số để tune **thời gian đọc**, **áp lực của Nó**, **pin UPS** và kiểm tra **suy luận có công bằng** không. Chưa phải test art.

## 1. Chuẩn bị (2 phút)

- Mở `index.html` bằng Chrome / Edge / Safari trên **desktop**, đeo tai nghe, phòng tối càng tốt.
- Bấm **⚙ demo** (góc trên trái) → tốc độ **×1** (10 phút thật = một đêm). Giữ "Giảm kinh dị" **tắt** ở lượt đầu.
- Đóng bảng demo lại và **không dùng nút nào khác trong đó** trong suốt lượt chơi.
- Chơi như người chưa biết đáp án: đọc hết, đừng nộp theo trí nhớ.
- Để sẵn giấy/ghi chú để ghi mốc giờ in-game (đồng hồ góc trên phải, 00:00 → 06:00).

## 2. Nhắc nhanh luật chơi

| Việc | Cách làm |
|---|---|
| Xem hồ sơ / cam / bảng kết luận | Bấm **▲ Cúi xuống màn hình** (hoặc phím **Space**). **Esc** để ngẩng lên. |
| Khi cúi xuống | Không thấy cửa. Nghe **3 tiếng gõ kim loại** là Nó đang ở cửa → ngẩng lên, bấm hộp **KHÓA** cạnh cửa (bên phải). |
| Khóa cửa | Tốn pin 0,25%/s. Nó bỏ đi thì **mở khóa ngay** để tiết kiệm. Pin 0% = khóa mất nguồn. |
| Hỏi nghi phạm | **Bộ đàm** (góc dưới phải hoặc bấm bộ đàm trên bàn), 2 câu / người, chờ vài giây mới có trả lời. |
| Nộp kết luận | Tab **Bảng kết luận**, 4 ô. Sai: chỉ biết số ô đúng, Nó +1 cấp, khóa nộp 10s. |
| Chết | Chơi lại từ 00:00, **bảng ghim giữ**, câu đã hỏi bộ đàm **mất**. |

## 3. Ba lượt chơi

**Lượt A — chơi tự nhiên** (bắt buộc)
Chơi như bình thường, cố gắng thắng. Đây là lượt lấy số chính.

**Lượt B — người chơi lười** (nếu còn sức)
Chỉ mở E1, E2, E5 và hỏi đúng 2 câu bất kỳ rồi nộp. Mục đích: xem có *đoán trúng* được không. Nếu dễ trúng → vụ án quá lộ, cần sửa.

**Lượt C — người chơi sợ** (nhanh, 3–4 phút)
Khóa cửa liên tục từ đầu, không mở. Ghi giờ in-game lúc pin về 0 và chuyện gì xảy ra sau đó.

## 4. Bảng số cần ghi (lượt A)

| # | Đo | Kết quả |
|---|---|---|
| 1 | Giờ in-game lúc mở xong cả 8 bằng chứng | __:__ |
| 2 | Giờ in-game lúc hỏi xong bộ đàm (6 câu) | __:__ |
| 3 | Số lần Nó tới cửa (nghe gõ) cả đêm | ___ |
| 4 | Số lần chết | ___ |
| 5 | Pin UPS lúc nộp đúng | ___% |
| 6 | Giờ in-game lúc nộp đúng | __:__ |
| 7 | Số lần nộp sai trước khi đúng | ___ |
| 8 | Có để ý CAM 07 xuất hiện (khoảng 01:30)? | có / không |
| 9 | Có thấy bóng người ở frame 02:09 (E5)? Có hiểu nó là gì không? | có / không / … |
| 10 | Có thấy bóng Nó qua ô kính cửa khi nó ở hành lang? | có / không |
| 11 | Lượt B: nộp trúng mấy ô / 4? | ___ / 4 |
| 12 | Lượt C: pin về 0 lúc __:__ ; sau đó bao lâu thì chết? | |

## 5. Checklist chức năng (tick ✓ / ghi lỗi)

**Boot & phòng**
- [ ] Bấm "Bắt đầu ca trực" → có tiếng hum, vào fullscreen, hình đã tải (dòng "Hình đã tải xong" trước khi bấm).
- [ ] Di chuột → phòng pan nhẹ; màn hình CRT trên bàn đang chiếu cam đã chọn.
- [ ] Hover màn hình / hộp khóa / bộ đàm → hiện nhãn.

**Cửa & Nó**
- [ ] Bấm hộp KHÓA → thanh chốt ngang cửa, đèn đỏ, chữ "ĐÃ KHÓA", kim UPS tụt nhanh hơn.
- [ ] Nó ở hành lang → bóng nhỏ trong ô kính cửa. Nó ở cửa → mặt nó choán ô kính.
- [ ] Nó ở cửa: tiếng gõ lặp ~2,6s một lần; nếu đang cúi xuống thì màn hình rung.
- [ ] Khóa kịp → bộ đàm báo "bước chân xa dần"; mở khóa lại được.
- [ ] Không khóa → nhiễu kín 2,5s (không lộ ma) → đen/im lặng 0,15s → mặt gốc lao sát trong 0,1s, lệch nhẹ, tổng pha mặt 0,28s → đen/im lặng 0,42s → "CA TRỰC KẾT THÚC". Tiếng rè tắt hẳn ở khoảng đen, tiếng rít khớp cú lao mặt; nút chơi lại hoạt động, bảng ghim còn. Thời lượng cảnh không đổi theo tốc độ demo.

**Màn hình**
- [ ] Tab CAM: 6 kênh + sơ đồ; chọn cam đổi feed; CAM 07 chớp lên rồi tự biến mất.
- [ ] Tab HỒ SƠ: 8 mục có thumbnail; mở lần đầu → một tờ ghim lên bảng (ngẩng lên thấy trên bảng cork).
- [ ] E2/E3/E4 hiện trong khung điện thoại; E5 bấm từng frame đổi ảnh lớn; E7 sổ tay có chữ viết tay.
- [ ] Tab BẢNG: thiếu ô → "Điền đủ 4 ô"; sai → "x/4"; đúng → BÀN GIAO.
- [ ] Để tới 06:00 không nộp → "HẾT CA".

**Bộ đàm**
- [ ] Tin ĐTV mới → bong bóng cạnh bộ đàm + LED nhấp nháy + nút Bộ đàm sáng.
- [ ] Hỏi một câu → vài giây sau có trả lời + tự ghim manh mối.
- [ ] Khoảng 04:10 có dòng lạ "Ai đang ở với em vậy?" rồi "Xin lỗi, gửi nhầm".

**Khác**
- [ ] Bật "Giảm kinh dị" → mặt gốc mờ và tĩnh, không lao/rung, nhiễu nhẹ, âm nhỏ và không tiếng rít. Thiết lập giảm chuyển động của hệ điều hành cũng dùng cảnh này.
- [ ] (Tùy chọn) Mở trên điện thoại: kéo ngón để nhìn sang cửa; cúi xuống → UI dọc dùng được.

## 6. Câu hỏi cảm nhận (mỗi câu 1 dòng)

1. Lúc nào **sợ nhất**? Lúc nào **chán nhất**?
2. Có lúc nào **không biết phải làm gì**? Ở đâu?
3. Bốn ô kết luận: ô nào **chắc chắn**, ô nào **đoán**? Bằng chứng nào **không cần**?
4. Nó tới cửa: **quá thường / vừa / quá hiếm**?
5. 10 phút: **dư / vừa / thiếu**? Nếu đổi, bao nhiêu?
6. Chữ có chỗ nào **khó đọc** (quá nhỏ, mờ vì nhiễu)?
7. Một điều muốn **thêm**, một điều muốn **bỏ**.

## 7. Gửi kết quả

Dán bảng mục 4 + các dòng checklist bị lỗi + câu trả lời mục 6 vào chat. Gặp lỗi thì ghi **đang làm gì → thấy gì**, chụp màn hình; nếu được, mở Console (F12 → Console) và copy dòng đỏ.

Các số này quyết định: độ dài đêm, cấp Nó theo giờ, tốc độ tụt pin, và có phải giấu bớt bằng chứng ở đêm 2 không.
