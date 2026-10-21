// CA ĐÊM, đêm 1: "Chuyển khoản lúc 2:17"
// Toàn bộ nội dung vụ án nằm ở đây. Engine (src/) không biết gì về Hạnh, Khoa hay PIN 1968.
// Viết đêm mới = copy file này, đổi id/num và nội dung. Đáp án bảng kết luận ở cuối file.
// Giọng: ĐTV nói qua bộ đàm, mệt, nói tắt. Ghim trên bảng là chữ của người chơi, viết tắt, không câu đầy đủ.
window.CD = window.CD || {}; CD.NIGHTS = CD.NIGHTS || {};
CD.NIGHTS.night1 = {
  id: 'night1', num: 1, title: 'Chuyển khoản lúc 2:17',
  pinsTitle: 'ĐÊM 1 · HẠNH BAKERY',

  // Bộ đàm gửi lúc 00:00 (mỗi dòng là một tin, cách nhau vài giây)
  brief: [
    'Gửi gói rồi đó. Nạn nhân Lê Thị Hạnh, 52 tuổi, chủ tiệm bánh Hạnh Bakery ở tầng trệt chung cư Bình An. Nhân viên phát hiện lúc 5 giờ 40 sáng nay. Pháp y nói bị đánh vào đầu, chết khoảng từ nửa đêm tới 1 giờ.',
    'Điện thoại bà ấy không cài khóa màn hình, em mở thẳng. Hình cam hẻm sau là tiệm hoa kế bên đưa. Ba người cần đối chiếu: Khoa thợ bánh, Dũng em trai, Trang chủ tiệm hoa. 6 giờ bàn giao, nhớ đó.',
  ],
  bootText: 'Đêm 1, "Chuyển khoản lúc 2:17". Bạn trực một mình ở Phòng Kỹ thuật số, tầng hầm B1. Bàn giao kết luận trước 06:00.',

  // ---------- Bằng chứng ----------
  // note: dòng ghim lên bảng khi mở lần đầu. type quyết định cách hiển thị (xem src/monitor.js).
  evidence: [
    { id: 'E1', title: 'Biên bản pháp y sơ bộ', type: 'paper', note: 'chết khoảng 0h30 tới 1h · bị đánh vào đầu · không lục lọi',
      stamp: 'SƠ BỘ', heading: 'Biên bản khám nghiệm sơ bộ', meta: 'Số 118/BB-PY · ngày 18/10 · 06 giờ 40 · tiệm bánh Hạnh Bakery, tầng trệt chung cư Bình An',
      paragraphs: [
        'Nạn nhân: <b>Lê Thị Hạnh</b>, nữ, sinh năm 1974. Tư thế nằm nghiêng bên trái tại khu bếp phía sau tiệm.',
        'Thương tích: một vết chấn thương vùng thái dương trái, do <b>vật cứng, dài, tiết diện tròn</b> gây ra. Hai bàn tay và cẳng tay không có vết chống đỡ.',
        'Căn cứ độ cứng tử thi và nhiệt độ cơ thể, thời điểm tử vong ước tính từ <span class="hot2">00 giờ 30 đến 01 giờ 00</span> ngày 18/10.',
        'Hiện trường: cửa trước khóa từ bên trong, cửa sau đóng. <b>Không có dấu hiệu lục lọi.</b> Két tiền trong bếp còn nguyên (xem ảnh kèm theo).',
        'Thu giữ một điện thoại di động của nạn nhân trên bàn bếp. Máy <b>không cài mã khóa màn hình</b>.',
      ] },
    { id: 'E2', title: 'Ứng dụng ngân hàng trên máy nạn nhân', type: 'bank', note: '02:17 chuyển 48tr cho DŨNG · bằng mã PIN · sau giờ chết',
      account: 'LE THI HANH · **** 4471', balance: '12.418.000 ₫',
      rows: [
        { t: '18/10 · 02:17:06', to: 'PHAM QUOC DUNG', amt: '-48.000.000', memo: 'cho em · xác thực bằng mã PIN', hot: true },
        { t: '16/10 · 15:02', to: 'CTY TNHH BOT MY TRANG', amt: '-3.200.000', memo: 'bot 50kg · xác thực bằng mã PIN' },
        { t: '16/10 · 09:41', to: 'VO THI LAN', amt: '+1.250.000', memo: 'banh sinh nhat' },
        { t: '15/10 · 18:20', to: 'DIEN LUC TP', amt: '-650.000', memo: 'tien dien T9 · xác thực bằng mã PIN' },
      ],
      cap: 'Giao dịch 02:17 xác thực bằng <span class="hot2">mã PIN</span>, không phải vân tay. Máy không khóa màn hình, nên ai cầm máy và biết PIN đều chuyển được.' },
    { id: 'E3', title: 'Tin nhắn giữa Hạnh và Dũng', type: 'chat', note: 'Dũng xin vay 50tr lúc 21:40, bị từ chối · 02:20 nhắn "chị chuyển rồi hả??"',
      who: 'Dũng', sub: 'em trai · di động',
      msgs: [
        { from: 'them', t: '21:40', text: 'Chị ơi em cần 50tr gấp. Cuối tháng em trả chị. Giúp em lần này đi chị' },
        { from: 'me', t: '21:52', text: 'Chị không có. Đừng hỏi nữa.' },
        { from: 'them', t: '21:53', text: 'Chị...' },
        { from: 'them', t: '02:20', text: 'Chị chuyển rồi hả?? cảm ơn chị, mai em qua', hot: true },
        { from: 'them', t: '02:21', text: 'Chị?' },
        { from: 'them', t: '06:10', text: 'Chị ơi??' },
        { sys: '4 cuộc gọi nhỡ, 06:11 đến 06:25' },
      ] },
    { id: 'E4', title: 'Tin nhắn giữa Hạnh và Khoa', type: 'chat', note: 'Khoa biết PIN 1968 từ 14/07 · tối 17/10 Hạnh nhắn "két lệch 3 tháng"',
      who: 'Khoa', sub: 'thợ bánh · di động',
      msgs: [
        { sys: 'Thứ hai, 14/07' },
        { from: 'me', t: '10:12', text: 'Khoa chuyển 12tr cho bên bột giúp chị, PIN 1968, xong đổi lại nha', hot: true },
        { from: 'them', t: '10:15', text: 'Dạ chuyển rồi chị' },
        { sys: 'Thứ sáu, 17/10' },
        { from: 'me', t: '20:15', text: 'Mai 6h em ở lại nói chuyện với chị. Két lệch 3 tháng rồi, chị đếm lại hết rồi.', hot: true },
        { from: 'them', t: '20:31', text: 'Dạ.' },
      ] },
    { id: 'E5', title: 'Hình cam hẻm sau (tiệm hoa)', type: 'frames', note: '00:38 áo trùm đầu mở cửa sau bằng chìa · 02:24 ra · 05:31 Khoa tới',
      osd: 'CH01 HEM SAU', date: '18/10',
      frames: [
        { t: '00:38:12', scene: 'hoodie_door', cap: 'Người mặc áo trùm đầu tra chìa vào ổ khóa cửa sau. Không có dấu cạy.' },
        { t: '00:39:05', scene: 'hoodie_in', cap: 'Cửa mở, người này vào trong.' },
        { t: '02:09:58', scene: 'empty_watch', cap: 'Hình cuối trước khi mất tín hiệu.', note: '02:09, cuối hẻm có người đứng quay lưng. Không ai trong hồ sơ nhắc tới' },
        { t: '02:10 – 02:21', scene: 'nosignal', cap: 'Mất tín hiệu (NO SIGNAL) trong 11 phút.' },
        { t: '02:24:40', scene: 'hoodie_out', cap: 'Người áo trùm đầu đi ra, kéo cửa lại.' },
        { t: '05:31:20', scene: 'khoa', cap: 'Khoa tới, mở cửa sau bằng chìa. Không mặc áo trùm đầu.' },
      ] },
    { id: 'E6', title: 'Nhật ký (log) camera tiệm hoa', type: 'log', note: '02:10 cam tự khởi động lại theo lịch · mất hình 11 phút là bình thường',
      lines: [
        '# NVR-FLORA-02  event log  17/10 → 18/10',
        '17/10 22:00:00  CH01  motion end',
        '17/10 23:14:31  CH01  motion start (0:12)',
        '18/10 00:38:09  CH01  motion start (1:04)',
        '18/10 02:09:58  CH01  <span class="hot2">scheduled reboot (daily 02:10)</span>',
        '18/10 02:10:00  SYS   power cycle',
        '18/10 02:21:14  CH01  <span class="hot2">online</span>',
        '18/10 02:24:37  CH01  motion start (0:21)',
        '18/10 05:31:18  CH01  motion start (0:40)',
        '', '# channels',
        'CH01  HEM SAU        online', 'CH02  MAT TIEN       online', 'CH03..CH06            not installed',
        '<span class="ghost">CH07  -               not configured</span>',
      ],
      cap: 'Dòng khởi động lại theo lịch (<span class="hot2">scheduled reboot</span>) giải thích khoảng trống 02:10 đến 02:21. Dòng CH07 không ai cấu hình.' },
    { id: 'E7', title: 'Ảnh hiện trường', type: 'photos', note: 'két còn nguyên tiền · sổ tay: két lệch 31.400.000, ghi "hỏi lại K."',
      photos: [
        { scene: 'safe', cap: 'Két tiền trong bếp, còn nguyên.' },
        { scene: 'notebook', cap: 'Sổ tay của Hạnh, mở sẵn trên bàn.',
          lines: ['Đối chiếu két T7 – T9', 'T7   lệch  8.6', 'T8   lệch 10.8', 'T9   lệch 12.0', 'TỔNG  31.400.000', 'ca sáng ?? hỏi lại K.'], hotLine: 4 },
      ] },
    { id: 'E8', title: 'Lời khai', type: 'ask', note: 'hỏi qua bộ đàm',
      html: '<p>Lời khai không nằm trong gói. Muốn hỏi ai thì gửi câu hỏi cho điều tra viên ngoài hiện trường bằng <b>bộ đàm</b> trên bàn (nút góc dưới phải). Mỗi câu chờ vài giây. Mỗi người hỏi được 2 câu.</p><p class="dim">Câu đã hỏi sẽ mất nếu bạn chết, phải hỏi lại từ đầu.</p>' },
  ],

  // ---------- Nghi phạm và câu hỏi qua bộ đàm (ĐTV đọc lại lời khai) ----------
  suspects: [
    { id: 'khoa', name: 'Khoa', qs: [
      { q: 'Tối qua em ở đâu?', a: 'Khoa nói: "Em ở nhà. Sáng 5 giờ rưỡi em tới tiệm như mọi ngày, cửa sau đang khóa, em mở vào thì thấy chị..."', note: 'Khoa: tới 5h30, cửa sau đang khóa' },
      { q: 'Ai có chìa cửa sau?', a: 'Khoa nói: "Chỉ chị Hạnh với em thôi."', note: 'chìa cửa sau: chỉ Hạnh và Khoa có' } ] },
    { id: 'dung', name: 'Dũng', qs: [
      { q: '2 giờ sáng anh làm gì?', a: 'Dũng nói: "Tôi ở nhà. Thấy tiền vào, tưởng chị đổi ý. Tôi làm gì có chìa tiệm."', note: 'Dũng: không có chìa tiệm' },
      { q: 'Anh biết mã PIN ngân hàng của chị không?', a: 'Dũng nói: "Không. Chuyện tiền bạc chị ấy có tin tôi bao giờ."', note: 'Dũng: không biết PIN' } ] },
    { id: 'trang', name: 'Trang', qs: [
      { q: 'Cam của chị mất tín hiệu lúc 2 giờ 10?', a: 'Trang nói: "Nó tự khởi động lại 2 giờ 10 mỗi đêm. Tôi cài vậy cho đỡ treo."', note: 'Trang: cam tự khởi động lại 2h10 mỗi đêm' },
      { q: 'Chị có chìa cửa sau tiệm bánh không?', a: 'Trang nói: "Không. Cửa sau hai tiệm riêng, chỉ chung cái hẻm."', note: 'Trang: không có chìa' } ] },
  ],

  // ---------- Bảng kết luận ----------
  board: [
    { id: 'who', label: 'Ai', opts: ['Khoa', 'Dũng', 'Trang', 'Người lạ'], ans: 'Khoa' },
    { id: 'how', label: 'Vào bằng cách nào', opts: ['Cạy cửa trước', 'Chìa cửa sau', 'Nạn nhân mở cửa', 'Cửa sổ'], ans: 'Chìa cửa sau' },
    { id: 'when', label: 'Khi nào', opts: ['02:10 – 02:20', '21:50', '00:30 – 01:00', '05:30'], ans: '00:30 – 01:00' },
    { id: 'why', label: 'Vì sao', opts: ['Không được vay tiền', 'Tranh chấp mặt bằng', 'Cướp', 'Che giấu thụt két'], ans: 'Che giấu thụt két' },
  ],

  // ---------- Nó ----------
  threat: {
    levelByHour: [1, 1, 1, 2, 2, 2],   // cấp AI theo giờ in-game 00 đến 05
    start: 'cam03',
    // sự kiện kịch bản theo giờ in-game
    scripted: [
      { at: '01:30', event: 'cam07' },                                   // CAM 07 chớp lên 12s
      { at: '03:20', event: 'moveTo', to: 'cam02', ifAt: 'cam03' },
      { at: '03:30', event: 'moveTo', to: 'door', ifAt: 'cam02', say: 'Có tiếng gõ ở cửa. Hộp KHÓA ở cạnh cửa, bên phải.' },
      { at: '04:10', event: 'say', from: 'ĐTV', text: 'Ai đang ở với em vậy?', cls: 'odd', then: { after: 9000, text: 'Xin lỗi, gửi nhầm.' } },
    ],
  },

  end: {
    win: 'Khớp 4/4. Hồ sơ đã chuyển cho đội điều tra. Đêm 2 (Phòng 1204) chưa có.',
    lose: '6 giờ rồi mà chưa có kết luận đúng. Không qua được đêm nay. Bảng ghim vẫn giữ.',
  },
};
