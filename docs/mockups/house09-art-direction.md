# HIỆN TRƯỜNG 09 — nhà mục nát, ọp ẹp

Ngày 22/10/2026. Người dùng yêu cầu làm lại bản minh họa cho cũ kỹ và ọp ẹp như nhà ma trong phim kinh dị. Hướng mới dùng mái hở, trần mục, vữa bong lộ gạch, màn rách, giường sắt gỉ, tủ lệch cánh và đồ đạc phủ bụi. Hai bố cục A/B được giữ để so sánh; B chuyển hồ sơ sang nền tối.

- Công cụ: image_gen tích hợp, chế độ tạo ảnh mới, nền không trong suốt.
- [Ảnh ý tưởng gốc trong repo](assets/house09-derelict-bedroom-v2.png).
- [Trang minh họa sử dụng ảnh](haunted-house-options.html).
- Đây là ảnh ý tưởng, không phải ảnh gameplay và không phải mô hình 3D đã hoàn thành. Không sửa bản TẦNG 13 trong lần này.

## Prompt đã dùng

```text
Use case: stylized-concept. Asset type: cinematic environment concept background for a Vietnamese first-person haunted-house detective game mockup, not a screenshot of a completed game. Generate one wide landscape 16:9 image, high detail. Primary request: an actually decrepit, ramshackle, abandoned ordinary Vietnamese family house, frightening as a serious haunted-house film. Human eye-level first-person view from a crooked doorway into a cramped old bedroom and connecting dark passage. Sagging partly collapsed timber ceiling with broken laths, roof leak stains, torn plaster exposing irregular red bricks, damp black mildew rising from wall bases, dusty cracked concrete floor with small fallen plaster fragments, one cheap wooden wardrobe with a door hanging crooked from one hinge, a thin filthy mattress on a rusty simple bed frame, torn mosquito net draped loosely, a small battered bedside table with an old phone, an uneven faded family portrait. These should feel lived-in long ago and abandoned for decades, structurally tired, asymmetric and claustrophobic. Wardrobe toward center-right is the interactive focus, a dark half-open passage visible behind it; leave upper left darker with room for HTML mission UI. Cold faint moonlight through broken wooden shutters, a single soft dirty flashlight beam reveals flaking plaster and wardrobe texture, large believable deep shadows but surfaces remain discernible. Desaturated mold green, cold grey, dirty faded brown. Natural imperfect photographic composition, realistic horror film production design, gritty fine material detail, no stylized cartoon or flat vector geometry. No luxury, no mansion, no hotel corridor, no polished wood panelling, no ornate tile floor, no gold trim, no chandelier, no clean symmetry, no warm cozy mood. No people, no visible monster, no gore, no text, no UI, no logos, no watermarks.
```

## Kiểm tra

Đã mở trang qua HTTP bằng Chrome, xem cả A/B ở 1440×1000 và 390×844; ảnh tải đủ, không tràn ngang và không lỗi JavaScript. Ảnh chụp giao diện nằm cục bộ ở `_preview/house09-derelict/`. Nhãn phụ dưới khung ngắm đã bỏ để tránh chồng chữ trên màn hình nhỏ.

## Vật liệu bản chơi — 2026-10-22

Asset: `house09/assets/decay-atlas.png`, tạo bằng công cụ image_gen tích hợp. Bốn vùng của một atlas được ánh xạ trực tiếp bằng UV, không cắt/chỉnh ảnh bằng script. Tường, gỗ, nền xi măng và vải cũ dùng chung atlas này. Cảnh chơi là hình học 3D với vật liệu ảnh; chưa đạt độ chi tiết của ảnh concept.

Prompt đã dùng:

> Use case: stylized-concept. Asset type: a square physically realistic material texture atlas for an actual first person haunted house 3D game. Exactly four equally sized quadrants in a clean 2 by 2 atlas grid, NO borders, NO labels, NO text. Each quadrant is an orthographic straight-on close-up of a flat surface with even diffuse illumination, no perspective, no scene, no cast shadows. Top left quadrant: very old Vietnamese house wall, wet grey-green crumbling lime plaster with naturally irregular patches exposing rough reddish bricks, black mold and damp streaks, dramatic real decay. Top right quadrant: rotten desaturated brown-grey timber boards, chipped paint fragments, cracked fibrous wood grain, uneven knots, old nail heads, dusty and rough, NO polished varnish. Bottom left quadrant: filthy aged concrete floor, hairline cracks, dust, dark water stains, subdued grey green brown, no decorative tiles, no rubble objects. Bottom right quadrant: decayed dirty linen mattress fabric with worn weave, irregular dark water stains, frayed patches, grey-beige. Match all four to an abandoned ramshackle haunted family home from a gritty horror film. Real photographic surface microdetail. Not an elegant mansion, not clean, not stylized, no ornaments, no gold. Image square, large detailed texture sheet.
