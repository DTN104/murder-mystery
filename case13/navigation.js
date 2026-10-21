// Grid A* in the same collision geometry used by the player. No wall shortcuts.
export function findPath(world,state,start,end){
 const size=.5, key=(x,z)=>`${x},${z}`, cell=p=>[Math.round(p.x/size),Math.round(p.z/size)];
 const [sx,sz]=cell(start),[ex,ez]=cell(end),open=[{x:sx,z:sz,g:0,f:0}],seen=new Map(),came=new Map();
 seen.set(key(sx,sz),0);let last=null;
 for(let n=0;open.length&&n<6000;n++){
  open.sort((a,b)=>b.f-a.f);const current=open.pop(),k=key(current.x,current.z);
  if(current.g>seen.get(k))continue;
  if(Math.abs(current.x-ex)+Math.abs(current.z-ez)<=1){last=current;break;}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
   const x=current.x+dx,z=current.z+dz,nk=key(x,z),g=current.g+1;
   if(x<-18||x>18||z<-61||z>12||world.solidAt(x*size,z*size,state,.19)||g>=(seen.get(nk)??Infinity))continue;
   seen.set(nk,g);came.set(nk,k);open.push({x,z,g,f:g+Math.abs(x-ex)+Math.abs(z-ez)});
  }
 }
 if(!last)return [];
 const path=[];let k=key(last.x,last.z);
 while(k!==key(sx,sz)){const [x,z]=k.split(',').map(Number);path.push({x:x*size,z:z*size});k=came.get(k);if(!k)return [];}
 return path.reverse();
}
