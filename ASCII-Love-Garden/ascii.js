/* All artwork is rendered as individual monospaced characters. No images,
   textures, or drawn shapes. A depth buffer makes the 3D heart self-occlude. */
(() => {
  const canvas = document.querySelector('#art'), ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width=1000, height=550, last=0, start=performance.now();
  const points=[];
  // Sample the implicit 3D heart surface, preserving two lobes and a cleft.
  const implicit=(x,depth,y)=>(x*x+2.25*depth*depth+y*y-1)**3-x*x*y**3-.1125*depth*depth*y**3;
  for(let x=-1.3;x<=1.3;x+=.014)for(let y=-1.1;y<=1.3;y+=.014){
    if(implicit(x,0,y)>0)continue;
    let low=0,high=1;
    for(let i=0;i<14;i++){const mid=(low+high)/2;if(implicit(x,mid,y)<0)low=mid;else high=mid;}
    for(const side of [-1,1])points.push({x:x*13,y:y*13,z:side*high*13,light:Math.max(0,Math.min(1,.5-x*.25+y*.2))});
  }
  function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);}
  new ResizeObserver(resize).observe(canvas);
  function glyph(ch,x,y,size,alpha=1){ctx.globalAlpha=Math.max(0,Math.min(1,alpha));ctx.font=`${size}px "Courier New",monospace`;ctx.fillText(ch,x,y);}
  function flower(cx,base,h,r,phase,bloom,time){
    const top=base-h, sway=Math.sin(time*.5+phase)*3;
    ctx.fillStyle='#a94875';
    for(let j=0;j<h;j+=7){const x=cx+Math.sin(j/h*3+phase)*7+sway*j/h;glyph(j%3?'|':':',x,base-j,9,.75);}
    // Point-sampled leaves on either side of the stem.
    for(let k=0;k<3;k++){const y=base-h*(.18+k*.19),dir=k%2?-1:1;
      for(let u=0;u<1;u+=.07)for(let v=-1;v<=1;v+=.5){const len=r*.9;glyph(u>.8?'.':':',cx+dir*u*len,y-u*len*.45+v*Math.sin(u*Math.PI)*len*.15,8,.6);}}
    ctx.fillStyle='#e38bb6';
    // Five tapered petals; opening increases their radius, density, and opacity.
    for(let pet=0;pet<5;pet++){
      const a=pet*Math.PI*2/5-Math.PI/2+phase*.15;
      for(let u=.12;u<1;u+=.075)for(let v=-1;v<=1;v+=.22){
        const length=r*(.13+.87*bloom)*u,spread=Math.sin(u*Math.PI)*r*.38*v*bloom;
        const x=cx+sway+Math.cos(a)*length-Math.sin(a)*spread;
        const y=top+Math.sin(a)*length*.85+Math.cos(a)*spread*.8;
        glyph(['.',':','*','@','+'][Math.floor((u*8+Math.abs(v)*3+pet)%5)],x,y,8,.35+.6*bloom);
      }
    }
    glyph('@',cx+sway-3,top+3,11,.95);
  }
  function draw(now){requestAnimationFrame(draw);if(document.hidden||document.querySelector('#garden').hidden||now-last<42)return;last=now;
    const elapsed=(now-start)/1000,t=reduced.matches?3:elapsed;
    ctx.clearRect(0,0,width,height);ctx.textBaseline='middle';
    const mobile=width<650,scale=mobile?6.8:Math.min(10.8,width/100),angle=reduced.matches?.2:t*.12;
    const cy=mobile?165:height*.32, cells=new Map(),cw=mobile?4.8:6,ch=mobile?7:8;
    for(const p of points){const x=p.x*Math.cos(angle)+p.z*Math.sin(angle),z=-p.x*Math.sin(angle)+p.z*Math.cos(angle);const perspective=1+z*.009;
      const col=Math.round((width/2+x*scale*perspective)/cw),row=Math.round((cy-p.y*scale*perspective)/ch),key=col+','+row;
      for(const dx of [0,1]){const k=(col+dx)+','+row;if(!cells.has(k)||cells.get(k).z<z)cells.set(k,{col:col+dx,row,z,light:p.light});}}
    const ramp='.,:;+*#%@';ctx.fillStyle='#f298c3';
    for(const p of cells.values()){const brightness=Math.max(0,Math.min(1,.42+p.z/18+p.light*.25));glyph(ramp[Math.floor(brightness*(ramp.length-1))],p.col*cw,p.row*ch,mobile?8:10,.4+brightness*.6);}
    const bloom=reduced.matches?1:Math.min(1,Math.max(.05,(elapsed-.3)/6));
    const base=height-8;
    if(mobile){flower(width*.04,base,195,32,0,bloom,t);flower(width*.96,base,210,34,2,bloom,t);}
    else{for(const [x,h,r,p] of [[.12,.58,75,0],[.23,.27,40,1],[.29,.39,45,2],[.04,.35,37,3],[.88,.7,78,4],[.74,.38,53,5],[.81,.25,42,6],[.97,.34,40,7]])flower(width*x,base,height*h,r*1.35*Math.min(1,width/1250),p,Math.min(1,bloom*(1+p*.02)),t);}
    ctx.fillStyle='#b95b88';for(let i=0;i<width/7;i++){const x=i*7; if(Math.abs(x-width/2)<(mobile?135:190))continue;const grass=10+17*(.5+.5*Math.sin(i*7));for(let j=0;j<grass;j+=7)glyph(j===0?'+':':',x+Math.sin(i)*j*.2,base-j,8,.55);}
    ctx.fillStyle='#e58eb5';for(let i=0;i<(mobile?20:42);i++){const x=((i*137.5+t*(4+i%4))%(width+30))-15,y=((i*89-t*(6+i%3))%height+height)%height;glyph(['.',"'",'+','*',':'][i%5],x,y,8+(i%3),.15+.38*(.5+.5*Math.sin(t+i)));}
    ctx.globalAlpha=1;
  }
  requestAnimationFrame(draw);
})();
