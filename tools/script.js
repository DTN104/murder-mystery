#!/usr/bin/env node
// Xuất toàn bộ lời thoại và chữ trong game của một đêm ra Markdown, theo thứ tự người chơi gặp.
// Dùng: node tools/script.js night1 > docs/script-dem1.md
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const id = process.argv[2] || 'night1';
global.window = {}; global.CD = window.CD = {}; // nights/*.js gán vào window.CD / CD
require(path.join(ROOT, 'nights', id + '.js'));
const N = window.CD.NIGHTS[id];
if (!N) { console.error('Không có đêm ' + id); process.exit(1); }

const strip = s => String(s).replace(/<[^>]+>/g, '');
const L = [];
const h = (lvl, t) => L.push('', '#'.repeat(lvl) + ' ' + t, '');
const p = t => L.push(t, '');
const quote = (who, t) => L.push(`> ${who}: ${strip(t)}`, '>');
const table = (head, rows) => { L.push('| ' + head.join(' | ') + ' |', '|' + head.map(() => '---').join('|') + '|'); rows.forEach(r => L.push('| ' + r.map(x => strip(x).replace(/\|/g, '\\|')).join(' | ') + ' |')); L.push(''); };

L.push(`# Kịch bản lời thoại đêm ${N.num}: "${N.title}"`, '', `Toàn bộ lời thoại và chữ người chơi đọc trong đêm ${N.num}, xếp theo thứ tự gặp. Nguồn gốc là \`nights/${id}.js\`. File này sinh bằng lệnh \`node tools/script.js ${id}\`, muốn sửa câu chữ thì sửa ở file data rồi chạy lại, đừng sửa tay ở đây.`, '');

h(2, '0. Màn mở đầu');
p('CA ĐÊM');
p(N.bootText || '');
p('Đeo tai nghe. Có âm thanh lớn và hình gây giật. Sợ thì bật "Giảm kinh dị" trong bảng demo.');
p('Nút: BẤM ĐỂ BẮT ĐẦU CA TRỰC. Dòng trạng thái: "Đang tải hình… n/18" rồi "Hình đã tải xong."');

h(2, '1. Bộ đàm lúc 00:00, tóm tắt vụ');
(N.brief || []).forEach((t, i) => quote(`ĐTV (${i === 0 ? '00:00' : 'sau ' + (6 * i) + ' giây'})`, t));
L.push('');

h(2, '2. Bảng ghim trên tường');
p(`Tiêu đề bảng: ${N.pinsTitle || ''} (vẽ trên bảng cork khi không có ảnh phòng).`);
p('Mỗi bằng chứng mở lần đầu, mỗi câu bộ đàm được trả lời, và CAM 07 cho một tờ ghim. Chữ trên tờ ghim là chữ của người chơi, viết tắt. Nội dung ghi ở từng mục bên dưới.');

h(2, '3. Hồ sơ, 8 bằng chứng (tab HỒ SƠ)');
N.evidence.forEach(ev => {
  h(3, `${ev.id}. ${ev.title}`);
  p(`Ghim khi mở lần đầu: \`${ev.id} · ${ev.note}\``);
  if (ev.type === 'paper') { p(`Giấy có dấu "${ev.stamp}". ${ev.heading}.`); p(`${ev.meta}`); ev.paragraphs.forEach(x => p(strip(x))); }
  if (ev.type === 'bank') { p(`Điện thoại, ứng dụng ngân hàng. Tài khoản thanh toán ${ev.account}. Số dư khả dụng ${ev.balance}.`); table(['Thời điểm', 'Đối tượng', 'Số tiền', 'Nội dung'], ev.rows.map(r => [r.t, r.to + (r.hot ? ' ★' : ''), r.amt, r.memo])); if (ev.cap) p('Chú thích dưới ảnh: ' + strip(ev.cap)); }
  if (ev.type === 'chat') { p(`Điện thoại, tin nhắn với ${ev.who} (${ev.sub || ''}).`); ev.msgs.forEach(m => { if (m.sys) L.push(`- (${m.sys})`); else L.push(`- ${m.from === 'me' ? 'Hạnh' : ev.who} (${m.t})${m.hot ? ' ★' : ''}: ${m.text}`); }); L.push(''); }
  if (ev.type === 'frames') { p(`Chuỗi hình camera. Chữ trên khung hình: ${ev.osd} · ${ev.date}.`); table(['Giờ', 'Mã cảnh', 'Chú thích', 'Ghim thêm'], ev.frames.map(f => [f.t, f.scene, f.cap || '', f.note || ''])); }
  if (ev.type === 'log') { p('Nhật ký máy ghi hình, chữ kiểu máy, nguyên văn tiếng Anh của thiết bị.'); L.push('```'); ev.lines.forEach(x => L.push(strip(x))); L.push('```', ''); if (ev.cap) p('Chú thích: ' + strip(ev.cap)); }
  if (ev.type === 'photos') { p('Ảnh in, dán lệch.'); ev.photos.forEach(ph => { p(`- Ảnh "${ph.scene}": ${ph.cap || ''}`); if (ph.lines) { L.push('  Chữ viết tay trên trang (dòng ★ gạch đỏ):'); ph.lines.forEach((ln, i) => L.push(`  - ${ln}${i === ph.hotLine ? ' ★' : ''}`)); L.push(''); } }); }
  if (ev.type === 'ask') { p(strip(ev.html || '').replace(/\s+/g, ' ')); }
});

h(2, '4. Bộ đàm, hỏi nghi phạm (mỗi người 2 câu, ĐTV trả lời sau 4 đến 8 giây)');
N.suspects.forEach(s => {
  h(3, s.name);
  s.qs.forEach(q => { L.push(`- Bạn, gửi ${s.name}: ${q.q}`); L.push(`  ĐTV: ${q.a}`); if (q.note) L.push(`  Ghim: \`${q.note}\``); });
  L.push('');
});

h(2, '5. Sự kiện theo giờ trong đêm');
table(['Giờ', 'Sự kiện', 'Chữ hiện ra, hiệu ứng'], N.threat.scripted.map(s => {
  if (s.event === 'cam07') return [s.at, 'CAM 07 chớp lên ' + (s.seconds || 12) + ' giây', 'Danh sách cam có thêm "CAM 07 · · · ·" (nhấp nháy). Mở ra thì ghim: `CAM 07 · kênh không có trên sơ đồ. Có người đứng quay lưng.`'];
  if (s.event === 'moveTo') return [s.at, `Nó đi tới ${s.to}` + (s.ifAt ? ` (nếu đang ở ${s.ifAt})` : ''), s.say ? 'HỆ THỐNG: ' + s.say : ''];
  if (s.event === 'say') return [s.at, 'Tin bộ đàm' + (s.cls === 'odd' ? ' (lạ, chữ đỏ nhạt)' : ''), `${s.from || 'ĐTV'}: "${s.text}"` + (s.then ? ` rồi sau ${(s.then.after || 5000) / 1000} giây: "${s.then.text}"` : '')];
  return [s.at, s.event, ''];
}));
p(`Cấp của Nó theo giờ (00 đến 05): ${(N.threat.levelByHour || []).join(' · ')}. Xuất phát ở ${N.threat.start}.`);

h(2, '6. Thông báo hệ thống qua bộ đàm (nguồn: src/game.js)');
table(['Khi nào', 'Chữ hiện ra'], [
  ['Nó tới cửa, bạn khóa kịp', 'HỆ THỐNG: Tiếng bước chân xa dần, về phía kho.'],
  ['Pin UPS về 0%', 'HỆ THỐNG: UPS cạn rồi. Đèn tắt, khóa cửa mất nguồn.'],
  ['Bấm khóa khi hết pin', 'HỆ THỐNG: Khóa điện không có nguồn.'],
  ['Nộp bảng sai', 'HỆ THỐNG: Kết luận không khớp, x/4 ô đúng. Nó biết bạn đang đoán.'],
  ['Nộp thiếu ô', '(dưới nút) Điền đủ 4 ô.'],
  ['Nộp sai, dưới nút', 'Không khớp, x/4 ô đúng. Rồi: Nộp lại sau 10s'],
]);

h(2, '7. Bảng kết luận');
table(['Ô', 'Lựa chọn', 'Đáp án'], N.board.map(s => [s.label, s.opts.join(' · '), s.ans]));

h(2, '8. Màn kết');
p('Thua (Nó vào phòng): nhiễu, đen, mặt, rồi chữ CA TRỰC KẾT THÚC. Dòng phụ "Cửa không khóa, hh:mm:ss". Nút "Chơi lại, giữ bảng ghim".');
p(`Hết giờ 06:00: chữ HẾT CA. Dòng phụ "${N.end.lose}". Nút "Chơi lại đêm ${N.num}, giữ bảng ghim".`);
p(`Thắng: chữ BÀN GIAO. Dòng phụ "hh:mm:ss. ${N.end.win}". Nút "Chơi lại đêm ${N.num}".`);

h(2, '9. Nhãn cố định trên giao diện (nguồn: src/markup.html)');
table(['Vị trí', 'Chữ'], [
  ['Góc trên phải', `Đêm ${N.num} · B1 · Phòng KTS`],
  ['Góc dưới trái', 'UPS · n%'],
  ['Nút dưới giữa', '▲ Cúi xuống màn hình / ▼ Ngẩng lên'],
  ['Nút góc dưới phải', 'Bộ đàm'],
  ['Điểm bấm trong phòng (rê chuột vào)', 'Màn hình · Khóa cửa / Mở khóa · Bộ đàm'],
  ['Hộp trên tường', 'KHÓA / ĐÃ KHÓA'],
  ['Tab màn hình', 'Hồ sơ · Cam · Bảng kết luận · "KTS-B1 · ca đêm · hh:mm"'],
  ['Danh sách cam', 'CAM 01 Sảnh thang máy · 02 Hành lang B1 · 03 Kho vật chứng · 04 Phòng server · 05 Cầu thang · 06 Nhà vệ sinh · 07 · · ·'],
  ['Dòng gợi ý dưới khung cam', 'Nhìn đúng cam có Nó thì Nó chậm lại. Mà lúc cúi xuống màn hình thì bạn không thấy cửa.'],
  ['Sổ tay trống', 'Chưa ghi gì. Mở bằng chứng là có.'],
  ['Hồ sơ chưa chọn', 'Gói bằng chứng đêm nay. Chọn một mục bên trái. Mở lần đầu thì một tờ được ghim lên bảng.'],
  ['Dưới bảng kết luận', 'Đúng cả 4 ô trước 06:00 là bàn giao. Nộp sai thì chỉ biết số ô đúng, Nó lên một cấp, nút nộp khóa 10 giây.'],
  ['Bộ đàm, tiêu đề', 'Bộ đàm · ĐTV hiện trường'],
  ['Thanh trạng thái điện thoại (giả)', '06:42 · ▂▄▆ 41%'],
]);

h(2, '10. Sự thật ẩn');
p('Chỉ tác giả biết, ghi ở docs/ca-dem-design.md mục 5. Không in ở đây để file này đưa được cho người chơi thử hoặc người đọc lời thoại mà không lộ gì ngoài đáp án ở mục 7.');

process.stdout.write(L.join('\n') + '\n');
