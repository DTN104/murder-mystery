# Ma riêng của HIỆN TRƯỜNG 09

2026-10-22. Người dùng duyệt nhân vật gầy, tóc che mặt, áo mục và vai lệch; yêu cầu ảnh jumpscare đáng sợ hơn bản chân dung đầu. Ảnh cuối có mắt đục, hàm há lệch và bàn tay lao về ống kính.

Tạo bằng image_gen tích hợp, giữ alpha của hai ảnh toàn thân. Không sửa ảnh bằng script. Các file dùng trong game:

- `house09/assets/apparition-front.png`: mặt trước và bóng hiện qua máy ảnh.
- `house09/assets/apparition-back.png`: sau lưng khi quay đi.
- `house09/assets/apparition-attack.png`: ảnh áp sát cuối cùng.

`house09/pursuer.js` là nhân vật riêng, vẫn dùng bề mặt ảnh có chiếu sáng trong cảnh 3D, không phải model điêu khắc. TẦNG 13 giữ nhân vật cũ. Cảnh áp sát có 120 ms tối trước ảnh và tiếng rít, một chuyển động lao tới không nhấp nháy lặp. Chế độ giảm giật mình bỏ toàn bộ ảnh áp sát.

## Prompt mặt trước

undefined

## Prompt phía sau

undefined

## Prompt áp sát được chọn

Use case: identity-preserve. Asset type: extreme close-up horror-game attack frame. Reference is the same approved adult female apparition, long wet black hair, thin ashen face, rotten grey-brown blouse. Keep her identity and hair. Make this MUCH more frightening than a portrait: she is lunging directly into the camera, face almost touching the lens, head tilted sharply 20 degrees, one cloudy milky eye staring straight at the player through torn strands of hair, the other eye deeply hidden, jaw dropped unnaturally far in an asymmetrical silent scream with a BLACK mouth cavity, only a few ordinary dull teeth visible, no fangs. Her cheeks are deeply hollow and the skin has realistic dry cracked plaster-like texture, no exposed flesh, no blood, no wounds. The near hand reaches in at lower edge as if about to grip the lens, not covering the face. Her face dominates center of frame; both eye and mouth must fit inside central 55 percent width for mobile cropping. A harsh dirty cold flashlight below the lens gives severe unsettling upward shadows and the hair whips toward the viewer. Almost total blackness around the hair, no room visible. Photorealistic practical horror creature makeup, not a pretty portrait, not a cartoon, not a generic zombie, no bright glowing effects. Landscape 4:3, sharp terrifying eye/mouth detail with slight natural motion only in peripheral hair. No text.

## Kiểm tra

`tools/test-house09-apparition.cjs` kiểm tra ảnh trước/sau theo hướng, bóng trong máy ảnh, jumpscare sau bảng chứng cứ, khung dọc mobile, giảm giật mình, thử lại và không tải tài nguyên ma cũ. Ảnh/video trong `_preview/house09-apparition/`. `tools/test-house09.cjs` kiểm tra lại toàn bộ vụ án.

