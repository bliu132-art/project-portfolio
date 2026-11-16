const GROWTH_KEYS = Object.freeze([
    "maturity", "mouthGrowth", "limbGrowth", "earGrowth", "tailGrowth",
    "crestGrowth", "patternGrowth", "specialFeatureGrowth", "bodyMorph",
    "headMorph", "paletteBlend"
]);

const DAILY_GROWTH_TARGETS = Object.freeze({
    1: { maturity:.05,mouthGrowth:0,limbGrowth:0,earGrowth:.05,tailGrowth:0,crestGrowth:0,patternGrowth:0,specialFeatureGrowth:0,bodyMorph:0,headMorph:0,paletteBlend:0 },
    2: { maturity:.18,mouthGrowth:.4,limbGrowth:.12,earGrowth:.15,tailGrowth:.05,crestGrowth:.05,patternGrowth:.05,specialFeatureGrowth:0,bodyMorph:.1,headMorph:.05,paletteBlend:.08 },
    3: { maturity:.35,mouthGrowth:.75,limbGrowth:.45,earGrowth:.35,tailGrowth:.18,crestGrowth:.15,patternGrowth:.2,specialFeatureGrowth:.05,bodyMorph:.25,headMorph:.2,paletteBlend:.2 },
    4: { maturity:.52,mouthGrowth:1,limbGrowth:.7,earGrowth:.62,tailGrowth:.4,crestGrowth:.4,patternGrowth:.45,specialFeatureGrowth:.25,bodyMorph:.48,headMorph:.4,paletteBlend:.42 },
    5: { maturity:.7,mouthGrowth:1,limbGrowth:.9,earGrowth:.82,tailGrowth:.72,crestGrowth:.65,patternGrowth:.7,specialFeatureGrowth:.55,bodyMorph:.7,headMorph:.65,paletteBlend:.68 },
    6: { maturity:.86,mouthGrowth:1,limbGrowth:1,earGrowth:.95,tailGrowth:.9,crestGrowth:.85,patternGrowth:.9,specialFeatureGrowth:.82,bodyMorph:.88,headMorph:.85,paletteBlend:.88 },
    7: { maturity:1,mouthGrowth:1,limbGrowth:1,earGrowth:1,tailGrowth:1,crestGrowth:1,patternGrowth:1,specialFeatureGrowth:1,bodyMorph:1,headMorph:1,paletteBlend:1 }
});

const GrowthEasing = Object.freeze({
    linear: function (t) { return clamp(t); },
    smoothstep: function (t) { const x=clamp(t); return x*x*(3-2*x); },
    easeInOutCubic: function (t) { const x=clamp(t); return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2; },
    easeOutBack: function (t) { const x=clamp(t),c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); },
    easeOutElastic: function (t) { const x=clamp(t),c=(2*Math.PI)/3; return x===0?0:x===1?1:Math.pow(2,-10*x)*Math.sin((x*10-.75)*c)+1; }
});

function createGrowthState(day=1) {
    return { ...DAILY_GROWTH_TARGETS[Math.round(clamp(day,1,7))] };
}

function interpolateGrowthState(from,to,progress) {
    const result={},bodyT=GrowthEasing.easeInOutCubic(progress),partT=GrowthEasing.easeOutBack(progress),softT=GrowthEasing.smoothstep(progress);
    for(const key of GROWTH_KEYS){
        const t=key==="bodyMorph"||key==="headMorph"?bodyT:(key.endsWith("Growth")?partT:softT);
        result[key]=clamp(from[key]+(to[key]-from[key])*t);
    }
    return result;
}

