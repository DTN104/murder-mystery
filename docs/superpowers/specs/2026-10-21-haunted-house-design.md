# HIỆN TRƯỜNG 09 — Căn nhà còn nhớ

Trạng thái: thiết kế để người dùng duyệt; chưa triển khai game mới.

## Ý định đã thống nhất

Người chơi là thám tử vào căn nhà bỏ hoang để tìm dấu vết án mạng. Khám vật chứng khiến căn nhà tái hiện vụ án, dần đặt người chơi vào vị trí nạn nhân. Có jumpscare gắn với hành động, truy đuổi thật và đường trốn có thể học trước. Mục tiêu: xác định nạn nhân, tìm nơi giấu thi thể, mang chứng cứ ra ngoài.

Người dùng đã chọn hướng này. Các chi tiết dưới đây là đề xuất cụ thể: tên game, nhân vật, độ dài 15–20 phút và cơ chế máy ảnh. Ưu tiên điều khiển dễ, hình ảnh đủ rõ để khám phá, tránh lặp thao tác và tránh chỉ đọc văn bản.

## Phạm vi và phương án

Đây là thay đổi kiến trúc nội dung game: bản đồ riêng, trạng thái vụ án riêng, máy ảnh và bộ điều phối sự kiện mới. Tái dùng Three.js cục bộ, điều khiển chuột đã sửa, va chạm và tìm đường hiện có theo giao diện ổn định.

Ba cách triển khai đã cân nhắc: chuỗi cảnh cố định (rẻ nhưng mất tự do đi lại); nhà nhiều tầng sinh ngẫu nhiên (nhiều biến thể nhưng khó bảo đảm nhịp truyện và đường thoát); nhà nhỏ với sự kiện theo tiến trình (đề xuất, dễ khám phá và dàn dựng hậu quả rõ). Bản đầu dùng một tầng chính và hầm, không tạo hành lang ngẫu nhiên.

## Vụ án và suy luận

Nạn nhân: Lan, người chụp ảnh phục chế được thuê kiểm kê ngôi nhà. Nghi phạm: Huy, chủ nhà; ông Bảy, người trông nhà. Hồ sơ ban đầu ghi Lan bỏ đi, ông Bảy khai rời nhà lúc 21:00. Huy khai không có mặt đêm đó.

Vật chứng bắt buộc:

1. Hồ sơ mất tích và thẻ nghề trong túi máy ảnh: xác nhận Lan.
2. Ảnh phòng khách trước khi nhà bỏ hoang: chỉ cửa thông phòng hiện bị che, cho phép dọn vật cản mở đường vòng.
3. Chùm chìa trong ngăn bàn bếp: mở phòng ngủ.
4. Điện thoại trong tủ: cuộc gọi cầu cứu 21:40 và ảnh Huy mang chiếc nhẫn gia huy. Thu điện thoại làm hiện trường thay đổi, khởi động cảnh áp sát qua máy ảnh.
5. Âm bản phòng tối: xác định nạn nhân bị kéo qua cửa hầm; hiện rõ ba ký hiệu trên hộp cầu chì, theo thứ tự hoa – chim – mắt. Phóng ảnh để xem, không phải đoán mã ngoài game.
6. Biên nhận sửa xe và lời khai ông Bảy: xác minh ông ở tiệm sửa xe lúc 21:35–22:10. Bổ sung đối chiếu nghi phạm, không tự khẳng định biên nhận là bằng chứng tuyệt đối; ảnh và ghi âm là chứng cứ trực tiếp về Huy.
7. Ảnh chụp hốc tường trong hầm: thi thể che bằng vải, thẻ tên Lan, chiếc nhẫn gia huy đánh rơi.
8. Băng ghi âm trong hầm: Huy thừa nhận ngăn Lan mang ảnh ra ngoài và giấu thi thể. Thu băng là mục tiêu tùy chọn tăng rủi ro, hoàn thiện hồ sơ.

Kết luận ở cửa ra đối chiếu danh tính, nơi giấu thi thể và chứng cứ chỉ Huy. Sai lựa chọn được giải thích và cho xem lại sổ án, không xóa tiến trình. Mang ảnh thi thể và điện thoại ra ngoài là kết thúc có chứng cứ; thêm băng là hồ sơ đầy đủ. Không có câu đố phụ bắt người chơi đọc suy nghĩ tác giả.

## Bố cục và nhịp chơi

Sảnh nối phòng khách, hành lang và bếp. Phòng khách có cửa thông sang phòng ngủ; bếp nối phòng tối và lối xuống hầm. Hai đường giữa phòng ngủ và sảnh tạo vòng trốn. Cửa hầm chỉ mở sau khi bật ba cầu chì theo âm bản.

- Phút 0–3: vào nhà, nhận mục tiêu, thử đèn và máy ảnh, thấy ghế chuyển vị trí sau khi quay lưng. Học đường vòng qua ảnh phòng khách. Chưa có kẻ săn.
- Phút 3–7: tìm chìa, khám phòng ngủ, nghe điện thoại trong tủ. Mở tủ chỉ thấy vật chứng. Đóng bảng xem điện thoại rồi mới chạy cảnh kinh dị: máy ảnh lộ người đứng sau, lần giơ máy tiếp theo nó áp sát, đèn tắt và cửa chính phòng đóng. Cửa thông đã mở luôn là đường thoát. Nếu chưa mở đường thông, cảnh chờ; mục tiêu chỉ rõ cần khám ảnh phòng khách.
- Phút 7–12: truy đuổi đầu tiên có khoảng báo hiệu 3 giây; chạy qua đường vòng hoặc trốn sau khi cắt tầm nhìn. Sau khi thoát, có khoảng yên để khám phòng tối. Bật cầu chì thứ ba làm tiếng đập vang dưới sàn và mở hầm, không giết người chơi trong màn hình giải đố.
- Phút 12–17: soi hốc tường bằng máy ảnh, chụp chứng cứ. Thi thể vẫn nằm yên; bóng trong ảnh phía sau người chơi di chuyển. Người chơi chọn lấy băng ở góc hầm hoặc về thẳng. Khi rời hầm, đợt săn cuối bắt đầu và đường ra đã được mở.
- Phút 17–20: mang hồ sơ về sảnh, kết luận và rời nhà. Thời lượng là mục tiêu thiết kế, cần kiểm chứng bằng chơi thử.

## Máy ảnh, tương tác và điều khiển

WASD di chuyển, rê chuột nhìn sau khi bấm vào cảnh; E/Space tương tác, F đèn, Shift chạy, J sổ án, Esc thả chuột/tạm dừng, C nhìn thẳng. Giữ chuột phải giơ máy, chuột trái chụp khi đang giơ; phím V bật/tắt máy ảnh là lựa chọn tương đương không cần giữ chuột. Điện thoại có nút Máy ảnh và Chụp riêng, cần di chuyển và kéo nhìn.

Máy ảnh nhìn thấy các dấu vết vô hình đã được dàn dựng. Chụp hợp lệ cần đúng hướng, đủ gần, không bị tường che; phản hồi rõ khi ảnh chưa đủ. Không giới hạn phim, hồi đèn chớp 2 giây. Chớp máy khi đang bị săn có thể thu hút sự chú ý nhưng không tự triệu hồi kẻ săn bất chấp vị trí. Chỉ nâng máy ảnh không làm hao tài nguyên. Cảnh áp sát là một sự kiện có điều kiện, không xuất hiện mỗi lần chụp.

Tương tác căn cứ khoảng cách và tầm nhìn; nhãn mô tả hành động cụ thể. Vật chứng quan trọng tự ghi vào sổ, không đòi nhớ văn bản. Các bảng đọc/sổ án tạm dừng truy đuổi, sự kiện chỉ bắt đầu sau khi đóng bảng. Không tích lũy nhiều jumpscare trong lúc menu mở.

## Nỗi sợ và công bằng

Ba cao trào chính: bóng áp sát qua máy ảnh, vật thể đổ chắn lối ở giữa lượt săn (luôn còn đường vòng), chạm trán khi mang chứng cứ ra ngoài. Xen giữa là tiếng bước trên trần, bóng xuất hiện ở cửa đã đi qua, vật dụng thay đổi khi không nhìn. Mỗi sự kiện chính có cờ đã chạy, không lặp liên tục khi đi ngang.

Kẻ săn đi trong thế giới, bị tường/cửa chắn, mất dấu khi cắt tầm nhìn; tủ trốn chỉ bảo vệ khi không bị thấy chui vào. Có tín hiệu âm thanh kèm chữ cho người tắt tiếng. Không sinh kẻ săn sát người chơi hoặc trong điểm hồi sinh. Không khóa cả hai lối thoát. Lượt đầu báo rõ “Ra cửa thông phòng khách” và dấu hướng nhẹ khi đứng yên lâu.

Giữ lựa chọn giảm kinh dị/chuyển động: bỏ ảnh áp sát, chớp và rung; thay bằng mất đèn nhẹ, phụ đề và cùng thử thách trốn. Giữ nút tắt âm, chỉnh độ nhạy, hướng dẫn đầu game, checkpoint trước truy đuổi. Hiệu ứng tối không che kín đồ có thể tương tác.

## Hướng hình ảnh để chọn

Bản minh họa đi kèm tại `../../mockups/haunted-house-options.html` có hai phương án dùng nền giấy cũ, hổ phách và xanh đen từ game hiện có:

- A — Nhập vai tối giản (đề xuất): cảnh chiếm trọn màn hình, mục tiêu ngắn ở góc, sổ án chỉ mở khi cần. Máy ảnh làm xuất hiện khung ngắm khi giơ lên.
- B — Hồ sơ hiện trường: cảnh trong khung máy ảnh, bên phải là cột vật chứng và ghi chú luôn hiện. Dễ theo dõi vụ án nhưng giảm cảm giác đứng một mình trong nhà.

Minh họa chỉ quyết định bố cục và ánh sáng chủ đạo; cảnh SVG không phải chất lượng mô hình hoặc ảnh chụp game hoàn thành. Tạo hình sinh vật cần bóng dáng nhất quán giữa khi nhìn từ xa, gần và qua máy ảnh; không dùng đầu hình cầu/mắt vẽ đơn giản. Art hiện có có thể dùng làm mốc ban đầu, không hứa nhân vật 3D điêu khắc mới.

## Tổ chức triển khai dự kiến

Giữ bản cũ ở `floor13.html`, bản bàn trực ở `desk.html`; sau khi bản mới kiểm thử đạt, `index.html` mở game nhà bỏ hoang. Mã mới ở `house09/`: `state.mjs` cho chứng cứ/cổng/save; `world.js` cho phòng/đạo cụ/va chạm; `camera.js` cho khung ngắm và kiểm tra ảnh; `events.js` cho tái hiện/jumpscare một lần; `game.js` kết nối input, giao diện, AI và trạng thái. Tận dụng các mô-đun âm thanh/chuột/tìm đường đã ổn định mà không sửa hành vi game cũ ngoài nhu cầu tương thích rõ ràng.

State là nguồn chuẩn; sự kiện nhận bản chụp state và phát lệnh có tên, không tự sửa sổ án. World cung cấp mục tiêu và va chạm; camera kiểm tra raycast trước khi gửi hành động thu ảnh vào state. Mọi cửa và đường AI cập nhật cùng tiến trình. Mỗi chuyển giai đoạn kiểm tra điều kiện đủ để tránh người chơi nhập sớm ký hiệu bỏ qua vụ án.

Save key riêng `house09-checkpoint-v1`, lưu chứng cứ, cửa mở, cờ sự kiện và checkpoint an toàn. Không lấy save TẦNG 13. Save lỗi bỏ qua có thông báo; localStorage bị chặn vẫn cho chơi và nói rõ không lưu được. Thiếu WebGL hiển thị hướng dẫn; asset tải lỗi phải có thông báo tải lại, không treo nút bắt đầu. Không backend, không API mạng, không cài thêm dependency nếu thư viện cục bộ đủ dùng.

## Tiêu chí nghiệm thu

1. Chơi trọn từ vào nhà đến ra ngoài, cả lấy và bỏ qua băng; kết luận sai có đường sửa.
2. Đường vòng mở trước khi cửa phòng ngủ đóng; không soft-lock khi khám vật chứng khác thứ tự.
3. Máy ảnh phân biệt đủ điều kiện, sai hướng, quá xa, bị chắn; ảnh chỉ thu một lần.
4. Kẻ săn tìm đường thực qua cửa mở, không xuyên tường; trốn, bị bắt, hồi sinh đều chơi tiếp được.
5. Mọi jumpscare chỉ chạy theo điều kiện sau khi đóng bảng, không lặp sau save/load; checkpoint trước sự kiện cho phép thử lại hợp lý.
6. Pointer lock, Esc, bật máy ảnh, đọc vật chứng, độ nhạy và cảm ứng không tranh quyền điều khiển.
7. Kiểm thử save lỗi/không lưu được, giảm kinh dị, tắt âm, thiếu WebGL, asset lỗi; kiểm tra nguồn và bản đóng gói qua HTTP.
8. Ảnh bố cục desktop/mobile và video một chuỗi khám–tái hiện–trốn; phân biệt rõ kiểm thử dùng fixture với lượt đi bộ thực. Một người rà soát riêng từ góc người chơi mới, sửa điểm khó hiểu trước bàn giao.

## Tự rà soát

Đã xác định mục tiêu, manh mối, lối thoát, điều kiện sự kiện, phạm vi máy ảnh, save và tiêu chí đạt. Cần người dùng chọn A/B và duyệt bản thiết kế này trước khi lập kế hoạch triển khai theo quy trình brainstorming. Không coi tài liệu này là game đã làm xong.
