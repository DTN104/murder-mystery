export const CLUES = {
 phone: {title:'Cuộc gọi cuối của Mai', place:'CĂN HỘ 1304 / ĐIỆN THOẠI', text:'“Nếu anh nghe giọng em ngoài hành lang, đừng trả lời. Em đã trốn vào kho. Mã cửa là giờ tầng nhà mất điện, không phải giờ trên đồng hồ trong phòng.”', note:'Mai còn sống. Kho hồ sơ ở cuối hành lang. Mã cửa gồm 4 số HHMM.'},
 photo: {title:'Bức ảnh & đồng hồ chết', place:'CĂN HỘ 1304 / HIỆN TRƯỜNG', text:'Ảnh từ camera hành lang ghi Tuấn rời phòng trực lúc 02:12. Đồng hồ trong căn hộ dừng ở 02:17. Một mảnh giấy dán phía sau ghi: “Đồng hồ này chạy nhanh 4 phút.”', note:'02:17 − 4 phút = 02:13. Tuấn đã rời phòng trực trước khi mất điện.'},
 key: {title:'Chìa khóa BV-01', place:'CĂN HỘ 1304 / BÀN LÀM VIỆC', text:'Chìa khóa phòng bảo vệ nằm dưới một tờ giấy bị vò. Móc khóa khắc BV-01 — cùng mã thẻ của người trực tầng đêm nay.', note:'Mở được phòng bảo vệ, bên phải hành lang.'},
 log: {title:'Nhật ký điện & thẻ ra vào', place:'PHÒNG BẢO VỆ / SỔ TRỰC', text:'02:12 — TUẤN / BV-01: ra khỏi phòng trực.\n02:13 — Cầu dao tầng 13: ngắt thủ công.\n02:19 — Nguồn dự phòng: khôi phục.\n02:24 — Cửa kho: khóa từ bên ngoài.', note:'Giờ mất điện thật: 02:13. Khớp với đồng hồ 02:17 chạy nhanh 4 phút.'},
 statement: {title:'Lời khai của bảo vệ', place:'PHÒNG BẢO VỆ / BIÊN BẢN', text:'Tuấn: “Từ 02:00 đến 02:30 tôi ngồi trong phòng trực. Khi điện mất, tôi không ra ngoài. Tôi không có chìa kho và cũng chưa gặp Mai.”', note:'Lời khai mâu thuẫn với ảnh camera và log thẻ BV-01 lúc 02:12.'},
 tape: {title:'Băng ghi âm trong kho', place:'KHO HỒ SƠ / MÁY GHI ÂM', text:'Tiếng Tuấn: “Tôi chỉ được bảo cắt điện rồi khóa cửa. Tôi tưởng cô ấy đã đi. Sau đó nó đứng ngoài cửa… nói bằng giọng của cô ấy.”\nTiếng Mai, rất khẽ: “Đừng mở nếu nghe chính giọng mình.”', note:'Tuấn đã cắt điện và khóa kho. Thứ săn đuổi đang bắt chước giọng người.'}
};
export function freshState(reduce=false) {
 return {power:false,key:false,officeOpen:false,archiveOpen:false,rescued:false,collected:new Set(),battery:100,stamina:100,flashlight:true,hidden:false,reduce,started:false,ended:false,elapsed:0};
}
export function objective(s) {
 if(s.rescued)return ['05 / ĐƯA MAI RA NGOÀI','Đưa Mai về thang máy ở sảnh. Đừng để nó bắt được bạn.'];
 if(s.archiveOpen)return ['04 / NGƯỜI CÒN SỐNG','Tìm Mai trong kho. Mang theo băng ghi âm nếu có thể.'];
 if(s.collected.has('log')&&!s.collected.has('photo'))return ['03 / DẤU VẾT CÒN THIẾU','Quay lại căn 1304. Khám bức ảnh và đồng hồ trên bàn.'];
 if(s.collected.has('log'))return ['03 / HAI MỐC GIỜ','Đối chiếu đồng hồ và nhật ký. Nhập giờ mất điện vào khóa kho.'];
 if(s.officeOpen)return ['02 / LỜI KHAI KHÔNG KHỚP','Tìm nhật ký điện trên bàn phòng bảo vệ.'];
 if(s.key)return ['02 / NGƯỜI GIỮ CHÌA KHÓA','Dùng chìa BV-01 mở phòng bảo vệ bên phải hành lang.'];
 if(s.power)return ['01 / CUỘC GỌI CUỐI','Vào căn hộ 1304 bên trái. Tìm điện thoại, dấu vết và chìa khóa.'];
 return ['00 / TẦNG NHÀ BỊ KHÓA','Bật cầu dao ở đầu hành lang để mở cửa căn hộ 1304.'];
}
export function collect(s,id){if(!Object.hasOwn(CLUES,id))return false;const isNew=!s.collected.has(id);s.collected.add(id);if(id==='key')s.key=true;return isNew;}
export function checkCode(s,code){
 if(code!=='0213')return {ok:false,message:'Sai mã. Đối chiếu giờ mất điện thật, theo định dạng HHMM.'};
 if(!s.collected.has('photo'))return {ok:false,message:'Còn thiếu vật chứng: quay lại căn 1304, khám bức ảnh và đồng hồ trên bàn.'};
 if(!s.collected.has('log'))return {ok:false,message:'Còn thiếu vật chứng: đọc nhật ký điện trên bàn phòng bảo vệ.'};
 return {ok:true,message:'02:13 — mốc giờ đã được xác minh. Khóa kho đã mở.'};
}
export function verdict(s,suspect,evidence){return s.rescued&&suspect==='tuan'&&evidence==='log-photo';}
export function serialize(s){return JSON.stringify({version:1,power:s.power,key:s.key,officeOpen:s.officeOpen,archiveOpen:s.archiveOpen,rescued:s.rescued,collected:[...s.collected],reduce:s.reduce,elapsed:s.elapsed});}
export function restore(raw){try{const d=JSON.parse(raw);if(d.version!==1||!Array.isArray(d.collected))return null;const s=freshState(Boolean(d.reduce));s.collected=new Set(d.collected.filter(k=>Object.hasOwn(CLUES,k)));s.key=s.collected.has('key');s.power=Boolean(d.power||s.key);s.officeOpen=Boolean(s.key&&d.officeOpen);s.archiveOpen=Boolean(s.officeOpen&&s.collected.has('photo')&&s.collected.has('log')&&d.archiveOpen);s.rescued=Boolean(s.archiveOpen&&d.rescued);s.elapsed=Math.max(0,Number(d.elapsed)||0);return s;}catch{return null;}}
export function checkpointPosition(s){return s.rescued?[0,-27]:s.archiveOpen?[0,-23.2]:s.collected.has('log')?[4,-12.5]:s.key?[-4.5,-6.5]:[0,4.8];}
