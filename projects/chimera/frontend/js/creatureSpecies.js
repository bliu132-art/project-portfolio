const CREATURE_SPECIES = Object.freeze({
    mossling:{label:"Mossling",skeletonType:"blob",blobTheme:"leaf",weights:{empathy:.4,planning:.3,orderliness:.3},bodyShape:"round",locomotion:"biped",earType:"round",tailType:"leaf",crestType:"sprout",surfaceType:"soft",paletteName:"grove",bodyLength:16,bodyHeight:15,headWidth:13,headHeight:12,legThickness:3,footSize:4,earWidth:5,earAngle:-.25,tailThickness:3,tailTipType:"leaf"},
    tidekin:{label:"Tidekin",skeletonType:"blob",blobTheme:"water",weights:{curiosity:.45,sociability:.3,empathy:.25},bodyShape:"streamlined",locomotion:"four-legs",earType:"fin",tailType:"fish",crestType:"neck-fin",surfaceType:"smooth",paletteName:"tide",bodyLength:19,bodyHeight:10,headWidth:12,headHeight:11,legThickness:2,footSize:3,earWidth:4,earAngle:.2,tailThickness:3,tailTipType:"fork"},
    sparkhorn:{label:"Sparkhorn",skeletonType:"blob",blobTheme:"flame",weights:{riskTaking:.45,independence:.3,planning:.25},bodyShape:"sturdy",locomotion:"four-legs",earType:"point",tailType:"spike",crestType:"horns",surfaceType:"scaled",paletteName:"ember",bodyLength:18,bodyHeight:12,headWidth:12,headHeight:11,legThickness:4,footSize:4,earWidth:3,earAngle:-.15,tailThickness:4,tailTipType:"arrow"},
    cloudlet:{label:"Cloudlet",skeletonType:"blob",blobTheme:"cloud",weights:{empathy:.4,noveltySeeking:.35,sociability:.25},bodyShape:"cloud",locomotion:"floating",earType:"cloud",tailType:"ribbon",crestType:"tuft",surfaceType:"furry",paletteName:"bloom",bodyLength:17,bodyHeight:13,headWidth:13,headHeight:12,legThickness:2,footSize:3,earWidth:6,earAngle:.05,tailThickness:2,tailTipType:"ribbon"},
    moonfeel:{label:"Moonfeel",skeletonType:"blob",blobTheme:"star",weights:{curiosity:.4,independence:.3,noveltySeeking:.3},bodyShape:"droplet",locomotion:"floating",earType:"antenna",tailType:"glow",crestType:"orb",surfaceType:"smooth",paletteName:"mystic",bodyLength:14,bodyHeight:13,headWidth:13,headHeight:13,legThickness:2,footSize:2,earWidth:2,earAngle:.3,tailThickness:2,tailTipType:"orb"},
    hearthop:{label:"Hearthop",skeletonType:"blob",blobTheme:"heart",weights:{sociability:.4,riskTaking:.3,empathy:.3},bodyShape:"compact",locomotion:"hopper",earType:"long",tailType:"fluffy",crestType:"none",surfaceType:"furry",paletteName:"ember",bodyLength:15,bodyHeight:13,headWidth:13,headHeight:12,legThickness:3,footSize:6,earWidth:4,earAngle:-.25,tailThickness:5,tailTipType:"puff"}
});

function scoreCreatureSpecies(profile) {
    return Object.entries(CREATURE_SPECIES).map(function([id,species],stableIndex){
        const score=Object.entries(species.weights).reduce(function(sum,[dimension,weight]){return sum+profileScore(profile,dimension)*weight;},0);
        return {id,score,stableIndex};
    }).sort(function(a,b){return b.score-a.score||a.stableIndex-b.stableIndex;});
}

function selectCreatureSpecies(profile) {
    const ranked=scoreCreatureSpecies(profile);
    return {primarySpecies:ranked[0].id,secondarySpecies:ranked[1].id,speciesScores:Object.fromEntries(ranked.map(x=>[x.id,x.score]))};
}
