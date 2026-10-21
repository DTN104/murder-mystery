# Giao diện tối — 21/10/2026

Theo yêu cầu làm giao diện âm u hơn, chỉnh bảng màu của hai bản chơi hiện có: TẦNG 13 và CA ĐÊM. Nền đen than/xanh rêu tối, nút chính đỏ gỉ, chữ xám ngà; giảm các mảng giấy và điện thoại sáng. Giữ nguyên bố cục, nội dung vụ án và cơ chế chơi. Vignette tối ở rìa, phần giữa cảnh vẫn dùng ánh sáng game hiện có.

Thay đổi trong `case13/style.css` và `css/style.css`. Đây là lần chỉnh giao diện hiện có, không triển khai menu chọn game hoặc HIỆN TRƯỜNG 09.

## Xác minh

- Build lại nguồn phân phối bằng `python3 tools/build.py`.
- Chrome: kiểm tra màn hình bắt đầu, hướng dẫn, vào game, mở vật chứng và sổ án TẦNG 13; mở hồ sơ giấy và điện thoại ngân hàng CA ĐÊM.
- Chụp ảnh desktop 1440×900 và mobile 390×844, không tràn ngang. Nội dung hồ sơ CA ĐÊM dài trên điện thoại nằm trong vùng cuộn hiện có.
- Xác nhận cả nguồn và bản `dist` của hai game dùng màu nút chính mới; không có lỗi JavaScript trong lượt kiểm tra.
- Xem trực tiếp ảnh để kiểm tra độ rõ của chữ, nút và vật chứng. Không chạy lại toàn bộ truy đuổi/ending vì chỉ thay CSS.
- Rà soát độc lập từ góc người chơi mới qua tám ảnh: đạt, không có vấn đề cản trở thao tác. Lưu ý nhỏ: giao dịch ngân hàng trên điện thoại cần cuộn để xem hết; vùng cuộn hiện có hỗ trợ việc này.

Ảnh cục bộ ở `_preview/dark-ui/` (không đưa vào Git): `floor-before.png`, `floor-title.png`, `floor-help.png`, `floor-playing.png`, `floor-evidence.png`, `floor-journal.png`, `floor-mobile-title.png`, `floor-mobile-journal.png`, `desk-title.png`, `desk-evidence.png`, `desk-bank.png`, `desk-mobile-bank.png`.
