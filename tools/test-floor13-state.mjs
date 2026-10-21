import assert from 'node:assert/strict';
import {freshState,collect,objective,checkCode,serialize,restore,verdict,checkpointPosition} from '../case13/state.mjs';
const s=freshState();assert.match(objective(s)[1],/cầu dao/);
assert.equal(checkCode(s,'0217').ok,false);assert.equal(checkCode(s,'0213').ok,false);
s.power=true;assert.match(objective(s)[1],/1304/);
assert.equal(collect(s,'key'),true);assert.equal(collect(s,'key'),false);assert.equal(s.key,true);
s.officeOpen=true;assert.match(objective(s)[1],/nhật ký/);
collect(s,'photo');collect(s,'log');assert.equal(checkCode(s,'0213').ok,true);
assert.match(objective(s)[1],/Đối chiếu/);assert.equal(checkCode(s,'213').ok,false);
s.archiveOpen=true;assert.match(objective(s)[1],/Tìm Mai/);s.rescued=true;
assert.equal(verdict(s,'tuan','log-photo'),true);assert.equal(verdict(s,'mai','log-photo'),false);assert.equal(verdict(s,'tuan','phone-clock'),false);
const restored=restore(serialize(s));assert.deepEqual([...restored.collected],[...s.collected]);assert.equal(restored.rescued,true);assert.deepEqual(checkpointPosition(restored),[0,-27]);
assert.equal(restore('{broken'),null);assert.equal(restore('{}'),null);assert.equal(restore('{"version":2,"collected":[]}'),null);
const untrusted=restore('{"version":1,"collected":["not-a-clue"],"archiveOpen":true,"rescued":true}');assert.equal(untrusted.archiveOpen,false);assert.equal(untrusted.rescued,false);
assert.equal(collect(s,'__proto__'),false); // Unknown input must never become evidence.
console.log('PASS: tiến trình, mã sai/đúng, xác minh chứng cứ, kết luận, mốc lưu, dữ liệu lưu hỏng.');
