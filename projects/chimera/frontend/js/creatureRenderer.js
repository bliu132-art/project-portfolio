// 24x24 single-mask creature renderer. Body, ears, arms, feet, and silhouette
// accessories are unioned before drawing, so the pet is always one soft shape.

const SAFE_BODY_ROWS = Object.freeze({
    seed: [2,4,6,6,4],
    tiny: [2,6,8,8,6,4],
    round: [4,8,8,8,8,6],
    pear: [2,6,8,8,8,6],
    squish: [4,8,10,10,8,6],
    puff: [4,8,10,8,10,6],
    pointy: [2,6,8,8,8,6],
    sprout: [4,8,8,8,8,6]
});

function makeMask() { return Array.from({length:24}, function(){return Array(24).fill(false);}); }
function put(mask,x,y){x=Math.round(x);y=Math.round(y);if(x>=0&&x<24&&y>=0&&y<24)mask[y][x]=true;}
function rect(mask,x,y,w,h){for(let yy=0;yy<h;yy+=1)for(let xx=0;xx<w;xx+=1)put(mask,x+xx,y+yy);}
function pixel(ctx,x,y,w=1,h=1,color="#fff"){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}

function growthDay(growth){const cuts=[.12,.3,.44,.61,.78,.94];return 1+cuts.filter(function(c){return growth.maturity>=c;}).length;}

function addRows(mask,rows,top,offsetX,offsetY){
    rows.forEach(function(width,index){const x=Math.floor((24-width)/2)+offsetX;rect(mask,x,top+index+offsetY,width,1);});
}

function addLimbs(mask,day,offsetX,offsetY,pose){
    if(day<2)return;
    if(day===2){
        put(mask,8+offsetX,13+offsetY);put(mask,15+offsetX,13+offsetY);
        put(mask,10+offsetX,16+offsetY);put(mask,13+offsetX,16+offsetY);return;
    }
    const armY=pose==="wave"?12:13;
    put(mask,8+offsetX,armY+offsetY);put(mask,15+offsetX,13+offsetY);
    if(pose==="wave")put(mask,9+offsetX,12+offsetY);
    rect(mask,9+offsetX,16+offsetY,2,1);rect(mask,13+offsetX,16+offsetY,2,1);
}

function addEars(mask,family,day,offsetX,offsetY){
    if(day<3||family==="none")return;
    // Day 4 commits the ear family; Day 6 gives that same family a visible
    // growth spurt without changing its identity.
    const level=day===3?1:(day<6?2:3);
    if(level===1){put(mask,10+offsetX,9+offsetY);put(mask,13+offsetX,9+offsetY);return;}
    if(level===2){
        if(family==="fin"){rect(mask,9+offsetX,10+offsetY,2,1);rect(mask,13+offsetX,10+offsetY,2,1);}
        else if(family==="floppy"){put(mask,9+offsetX,9+offsetY);put(mask,14+offsetX,9+offsetY);put(mask,8+offsetX,10+offsetY);put(mask,15+offsetX,10+offsetY);}
        else if(family==="leaf"){put(mask,9+offsetX,9+offsetY);put(mask,14+offsetX,9+offsetY);put(mask,8+offsetX,9+offsetY);put(mask,15+offsetX,9+offsetY);}
        else {put(mask,10+offsetX,9+offsetY);put(mask,13+offsetX,9+offsetY);}
        rect(mask,10+offsetX,9+offsetY,4,1);
        return;
    }
    if(family==="round"){
        rect(mask,9+offsetX,8+offsetY,2,2);rect(mask,13+offsetX,8+offsetY,2,2);
    }else if(family==="pointed"){
        rect(mask,9+offsetX,8+offsetY,2,2);rect(mask,13+offsetX,8+offsetY,2,2);
        put(mask,9+offsetX,7+offsetY);put(mask,14+offsetX,7+offsetY);
    }else if(family==="floppy"){
        rect(mask,9+offsetX,8+offsetY,2,2);rect(mask,13+offsetX,8+offsetY,2,2);
        rect(mask,8+offsetX,9+offsetY,1,level===2?1:2);rect(mask,15+offsetX,9+offsetY,1,level===2?1:2);
    }else if(family==="fin"){
        rect(mask,8+offsetX,10+offsetY,3,2);put(mask,7+offsetX,11+offsetY);
        rect(mask,13+offsetX,10+offsetY,3,2);put(mask,16+offsetX,11+offsetY);
    }else if(family==="leaf"){
        rect(mask,9+offsetX,8+offsetY,2,2);rect(mask,13+offsetX,8+offsetY,2,2);
        put(mask,8+offsetX,8+offsetY);put(mask,15+offsetX,8+offsetY);
    }else{
        rect(mask,9+offsetX,8+offsetY,2,2);rect(mask,13+offsetX,8+offsetY,2,2);
    }
    // A shared one-pixel crown joins every ear family to the blob. This keeps
    // dramatic ear shapes decorative without turning them into floating parts.
    rect(mask,10+offsetX,9+offsetY,4,1);
}

function addSilhouetteAccent(mask,genome,day,offsetX,offsetY){
    if(day<5)return;
    const theme=genome.blobTheme;
    if(theme==="cloud"){put(mask,7+offsetX,12+offsetY);put(mask,16+offsetX,12+offsetY);}
    else if(theme==="water"){put(mask,8+offsetX,15+offsetY);put(mask,15+offsetX,15+offsetY);}
}

function addAccessory(mask,genome,day,offsetX,offsetY){
    if(day<7)return;
    if(genome.signatureAccessory==="bow"){
        rect(mask,9+offsetX,8+offsetY,2,1);rect(mask,12+offsetX,8+offsetY,2,1);
        put(mask,11+offsetX,8+offsetY);put(mask,11+offsetX,9+offsetY);
    }
}

function buildSilhouette(genome,animation,growth){
    const day=growthDay(growth),mask=makeMask();
    let family=day===1?"seed":(day===2?"tiny":(day<5?"round":genome.silhouetteFamily||"round"));
    let rows=SAFE_BODY_ROWS[family]||SAFE_BODY_ROWS.round;
    let top=day===1?10:10;
    const pose=animation.silhouettePose||((animation.fsm==="HAPPY")?"jump":"neutral");
    const positionX=Math.max(-5,Math.min(5,Math.round(animation.positionX||0)));
    const positionY=Math.max(-3,Math.min(3,Math.round(animation.positionY||0)));
    const offsetX=positionX+(pose==="left"?-1:(pose==="right"?1:0));
    const offsetY=positionY+(pose==="jump"?-1:Math.round((animation.bodyBob||0)*.55));
    if(pose==="squash"&&day>=3){rows=rows.map(function(w,i){return i<2?Math.max(4,w-2):Math.min(12,w+2);});top+=1;}
    addRows(mask,rows,top,offsetX,offsetY);
    addLimbs(mask,day,offsetX,offsetY,pose);
    addEars(mask,genome.earFamily,day,offsetX,offsetY);
    addSilhouetteAccent(mask,genome,day,offsetX,offsetY);
    addAccessory(mask,genome,day,offsetX,offsetY);
    return {mask,day,offsetX,offsetY};
}

function drawUnifiedMask(ctx,mask,palette){
    const outline=makeMask();
    for(let y=0;y<24;y+=1)for(let x=0;x<24;x+=1)if(mask[y][x]){
        for(let dy=-1;dy<=1;dy+=1)for(let dx=-1;dx<=1;dx+=1)if(dx||dy){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<24&&ny>=0&&ny<24&&!mask[ny][nx])outline[ny][nx]=true;}
    }
    for(let y=0;y<24;y+=1)for(let x=0;x<24;x+=1)if(outline[y][x])pixel(ctx,x,y,1,1,palette.outline);
    for(let y=0;y<24;y+=1)for(let x=0;x<24;x+=1)if(mask[y][x])pixel(ctx,x,y,1,1,palette.body);
}

function drawFace(ctx,g,a,state){
    const p=g.colorPalette,day=state.day,ox=state.offsetX,oy=state.offsetY;
    if(a.turned){
        // Readable side profile: one bright eye and a tiny forward mouth.
        pixel(ctx,11+ox,11+oy,3,3,p.eye);pixel(ctx,11+ox,11+oy,1,1,p.white);pixel(ctx,13+ox,12+oy,1,1,p.light);
        pixel(ctx,14+ox,15+oy,1,1,p.accent);return;
    }
    const y=(day===1?12:11)+oy,eyeStyle=g.generatedEyeStyle||"oval",lash=g.lashStyle||"none";
    for(const side of [-1,1]){
        const center=12+side*2+ox;
        if(a.eyeState==="CLOSED")pixel(ctx,center-1,y+1,3,1,p.eye);
        else if(a.eyeState==="SQUINT"){pixel(ctx,center-1,y,2,1,p.eye);pixel(ctx,center,y+1,2,1,p.eye);}
        else if(eyeStyle==="dot"){
            pixel(ctx,center-1,y,2,2,p.eye);pixel(ctx,center-1,y,1,1,p.white);
        }else if(eyeStyle==="watery"){
            pixel(ctx,center-1,y,3,3,p.eye);pixel(ctx,center-1,y,1,1,p.white);pixel(ctx,center,y+2,1,1,p.light);
        }else if(eyeStyle==="droopy"){
            pixel(ctx,center-1,y,3,1,p.deep);pixel(ctx,center,y+1,2,2,p.eye);pixel(ctx,center,y+1,1,1,p.white);
        }else{
            pixel(ctx,center-1,y,3,3,p.eye);pixel(ctx,center-1,y,1,1,p.white);pixel(ctx,center,y+1,1,1,p.light);
        }
        if(lash==="single")pixel(ctx,center+(side>0?2:-1),y-1,1,1,p.eye);
        else if(lash==="lush"){
            pixel(ctx,center,y-1,2,1,p.eye);pixel(ctx,center+(side>0?2:-1),y-1,1,1,p.eye);
        }
    }
    if(day>=2){
        const mouth=g.generatedMouthStyle||"kitten",mx=12+ox,my=15+oy,mouthColor=g.mouthColor||"#ef3f62";
        // The first mouth is deliberately one pixel, but already carries the
        // permanent mouth color selected and locked on Day 2.
        if(day===2){pixel(ctx,mx,my,1,1,mouthColor);}
        else if(a.mouthOpen){pixel(ctx,mx,my,1,1,p.eye);pixel(ctx,mx,my+1,1,1,mouthColor);}
        else if(mouth==="bold-m"){
            pixel(ctx,mx-1,my,1,1,mouthColor);pixel(ctx,mx+1,my,1,1,mouthColor);pixel(ctx,mx,my+1,1,1,mouthColor);
        }else if(mouth==="toothy-pink"){
            pixel(ctx,mx-1,my,3,2,mouthColor);pixel(ctx,mx,my,1,1,p.white);
        }else if(mouth==="down-caret"){
            pixel(ctx,mx-1,my,1,1,mouthColor);pixel(ctx,mx,my+1,1,1,mouthColor);pixel(ctx,mx+1,my,1,1,mouthColor);
        }else if(mouth==="pout"){
            pixel(ctx,mx-1,my,3,1,mouthColor);pixel(ctx,mx,my+1,1,1,p.deep);
        }else{
            pixel(ctx,mx-1,my,1,1,mouthColor);pixel(ctx,mx,my+1,1,1,mouthColor);pixel(ctx,mx+1,my,1,1,mouthColor);
        }
        pixel(ctx,9+ox,15+oy,1,1,p.accent);pixel(ctx,15+ox,15+oy,1,1,p.accent);
    }
}

function drawInnerDesign(ctx,g,state,animation){
    const p=g.colorPalette,day=state.day,ox=state.offsetX,oy=state.offsetY;
    pixel(ctx,10+ox,10+oy,2,1,p.light);pixel(ctx,9+ox,11+oy,1,1,p.shine);
    if(day>=5){
        if(g.blobTheme==="water"){pixel(ctx,9+ox,16+oy,2,1,p.light);pixel(ctx,12+ox,16+oy,3,1,p.deep);}
        else if(g.blobTheme==="leaf"){pixel(ctx,11+ox,10+oy,1,1,p.deep);pixel(ctx,12+ox,10+oy,1,1,p.light);}
        else if(g.blobTheme==="flame"){pixel(ctx,12+ox,10+oy,1,1,p.light);}
        else if(g.blobTheme==="cloud"){pixel(ctx,10+ox,16+oy,5,1,p.light);}
        else if(g.blobTheme==="star"){pixel(ctx,12+ox,10+oy,1,1,p.shine);}
        else if(g.blobTheme==="heart"){pixel(ctx,11+ox,16+oy,1,1,p.accent);pixel(ctx,13+ox,16+oy,1,1,p.accent);pixel(ctx,12+ox,17+oy,1,1,p.accent);}
    }
    if(day>=6&&g.patternType==="spots"){pixel(ctx,9+ox,16+oy,1,1,p.deep);pixel(ctx,15+ox,16+oy,1,1,p.accent);}
    if(day>=7){
        if(g.signatureAccessory==="bow"){const bowColor=animation.accessoryPulse?p.shine:p.accent;pixel(ctx,9+ox,8+oy,2,1,bowColor);pixel(ctx,12+ox,8+oy,2,1,bowColor);pixel(ctx,11+ox,8+oy,1,2,p.shine);}
        else if(g.signatureAccessory==="heart-mark"){pixel(ctx,11+ox,10+oy,1,1,p.accent);pixel(ctx,13+ox,10+oy,1,1,p.accent);pixel(ctx,12+ox,11+oy,1,1,p.accent);}
        else if(g.signatureAccessory==="star-mark"){pixel(ctx,12+ox,10+oy,1,1,p.shine);}
        else if(g.signatureAccessory==="gem"){pixel(ctx,12+ox,9+oy,1,1,p.shine);pixel(ctx,11+ox,10+oy,3,1,p.accent);}
    }
}

function drawParticles(ctx,g,fx){if(!fx||fx.progress<.2||fx.progress>.9)return;const p=g.colorPalette;[[2,5],[21,7],[2,19],[21,18]].forEach(function(v,i){if((Math.floor(fx.progress*10)+i)%2===0)pixel(ctx,v[0],v[1],1,1,i%2?p.shine:p.accent);});}

const CreatureRenderer=Object.freeze({logicalWidth:24,logicalHeight:24,skeletonTypes:["blob"],render:function(ctx,g,a,growth,fx){ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,24,24);const state=buildSilhouette(g,a,growth);pixel(ctx,10+state.offsetX,18,4,1,"rgba(0,0,0,.18)");drawUnifiedMask(ctx,state.mask,g.colorPalette);drawInnerDesign(ctx,g,state,a);drawFace(ctx,g,a,state);if(a.cheekPuff){pixel(ctx,9+state.offsetX,14+state.offsetY,1,1,g.colorPalette.accent);pixel(ctx,15+state.offsetX,14+state.offsetY,1,1,g.colorPalette.accent);}if(a.sparkVisible)pixel(ctx,a.sparkX,a.sparkY,1,1,g.colorPalette.shine);drawParticles(ctx,g,fx);}});
