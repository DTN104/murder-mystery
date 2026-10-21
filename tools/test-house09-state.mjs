import assert from 'node:assert/strict';
import {freshState,collect,restore,serialize,checkFuse,verdict,doorClosed,checkpointPosition} from '../house09/state.mjs';
const s=freshState();assert.equal(checkFuse(s,['hoa','chim','mat']).ok,false);assert.equal(doorClosed('bedroom',s),true);assert.equal(restore('bad'),null);assert.equal(restore('{"version":8}'),null);assert.equal(collect(s,'unknown'),false);
for(const id of ['badge','photo','key','phone','echo'])collect(s,id);s.routeOpen=s.bedroomOpen=true;
let r=restore(serialize(s));assert.equal(r.haunted,true,'Echo capture must remain resumable even if page closes before scare');assert.equal(doorClosed('bedroom',r),true);assert.deepEqual(checkpointPosition(r),[-6,-10.2]);
s.haunted=s.escaped=true;collect(s,'negative');assert.equal(checkFuse(s,['mat','chim','hoa']).ok,false);assert.equal(checkFuse(s,['hoa','chim','mat']).ok,true);s.basementOpen=true;collect(s,'body');assert.equal(verdict(s,'lan','basement','bay'),false);assert.equal(verdict(s,'lan','basement','huy'),true);s.finalHunt=s.rubble=s.ended=true;r=restore(serialize(s));assert.equal(r.rubble,true);assert.equal(r.ended,true);assert.equal(doorClosed('kitchen-link',r),false);
const corrupt=restore(JSON.stringify({version:1,collected:['body','tape','negative','phone','echo'],basementOpen:true,finalHunt:true,ended:true}));assert.equal(corrupt.collected.has('body'),false);assert.equal(corrupt.ended,false);
console.log('PASS house09 gates, puzzle, verdict, saves, pending scare recovery, invalid save normalization');
