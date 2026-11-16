const assert = require("assert");
const fs = require("fs");
const vm = require("vm");

const sourceFiles = ["playerModel.js", "creatureGenome.js", "creatureGrowth.js", "creatureSpecies.js", "creatureMapping.js", "creatureEvolution.js", "creatureAnimator.js", "creatureRenderer.js", "data.js"];
let source = sourceFiles.map((file) => fs.readFileSync(`frontend/js/${file}`, "utf8")).join("\n");
source += "\n;globalThis.testApi={PLAYER_DIMENSIONS,createBehaviorHistoryEntry,createNeutralPersonalityProfile,analyzePlayer,gameData,CreatureMapping,CreatureEvolution,CreatureAnimator,selectCreatureSpecies,createGrowthState,GROWTH_KEYS,CREATURE_SPECIES,buildSilhouette};";
const context = {};
vm.createContext(context);
vm.runInContext(source, context);
const api = context.testApi;

const allChoices = [];
for (let day = 1; day <= 7; day += 1) {
    assert(api.gameData[day], `Day ${day} is missing`);
    assert.equal(api.gameData[day].morningActivities.length, 3);
    assert.equal(api.gameData[day].afternoonEvent.choices.length, 3);
    allChoices.push(...api.gameData[day].morningActivities, ...api.gameData[day].afternoonEvent.choices);
}
assert.equal(allChoices.length, 42);
assert.equal(new Set(allChoices.map((choice) => choice.id)).size, 42);
for (const choice of allChoices) {
    assert.equal(Object.keys(choice.behavioralEvidence).length, 8);
    assert(api.PLAYER_DIMENSIONS.filter((dimension) => choice.behavioralEvidence[dimension] !== 0).length >= 2);
    for (const value of Object.values(choice.behavioralEvidence)) assert(value >= -1 && value <= 1);
}

function historyEntry(day, phase, item, event) {
    return api.createBehaviorHistoryEntry({
        id: item.id, day, phase, category: event?.category || item.category,
        context: event?.description || item.description, choiceId: item.choiceId,
        choiceText: item.text || item.title, behavioralEvidence: item.behavioralEvidence,
        importance: item.importance
    });
}

function runRoute(morningIndices, storyIndices) {
    const history = [];
    for (let day = 1; day <= 7; day += 1) {
        const dayData = api.gameData[day];
        history.push(historyEntry(day, "morning", dayData.morningActivities[morningIndices[day - 1]]));
        history.push(historyEntry(day, "afternoon", dayData.afternoonEvent.choices[storyIndices[day - 1]], dayData.afternoonEvent));
    }
    const model = api.analyzePlayer(history);
    const target = api.CreatureMapping.createTargetGenome(model.personalityProfile);
    return { history, model, target };
}

const routes = {
    curiousPlanner: runRoute([0,0,1,0,0,2,0], [0,2,1,2,1,2,1]),
    gentleSocial: runRoute([2,0,1,1,1,1,2], [1,0,1,2,2,1,1]),
    adventurous: runRoute([1,1,2,2,2,2,1], [2,1,0,0,0,0,2])
};

assert.deepStrictEqual(api.analyzePlayer(routes.curiousPlanner.history), api.analyzePlayer(routes.curiousPlanner.history));
assert.notDeepStrictEqual(routes.curiousPlanner.target, routes.gentleSocial.target);
assert.notDeepStrictEqual(routes.gentleSocial.target, routes.adventurous.target);
assert.equal(new Set(Object.values(routes).map((route) => route.target.primarySpecies)).size, 3);
assert.equal(new Set(Object.values(api.CREATURE_SPECIES).map((species) => species.skeletonType)).size, 1);
assert.equal(new Set(Object.values(api.CREATURE_SPECIES).map((species) => species.blobTheme)).size, 6);
for (const route of Object.values(routes)) {
    assert.equal(route.target.skeletonType, "blob");
    assert.equal(route.target.blobTheme, api.CREATURE_SPECIES[route.target.primarySpecies].blobTheme);
}
assert(routes.curiousPlanner.model.dominantTraits.some((trait) => trait.name === "planning"));
assert(routes.gentleSocial.model.dominantTraits.some((trait) => trait.name === "empathy" || trait.name === "sociability"));
assert(routes.adventurous.model.dominantTraits.some((trait) => trait.name === "noveltySeeking" || trait.name === "independence"));

let creature = api.CreatureEvolution.createInitialState();
for (let day = 1; day <= 7; day += 1) creature = api.CreatureEvolution.evolveForDay(creature, routes.curiousPlanner.target, day);
assert.equal(creature.evolutionHistory.length, 7);
assert.deepStrictEqual(creature.currentGenome, routes.curiousPlanner.target);

for(let day=1;day<=7;day++)for(const key of api.GROWTH_KEYS){assert(api.createGrowthState(day)[key]>=0&&api.createGrowthState(day)[key]<=1);if(day>1)assert(api.createGrowthState(day)[key]>=api.createGrowthState(day-1)[key]);}
for(const key of api.GROWTH_KEYS)assert.equal(api.createGrowthState(7)[key],1);

function connectedPixelCount(mask) {
    let start;
    for (let y = 0; y < 24 && !start; y += 1) for (let x = 0; x < 24; x += 1) if (mask[y][x]) { start = [x, y]; break; }
    const seen = new Set(), queue = start ? [start] : [];
    while (queue.length) {
        const [x, y] = queue.shift(), key = `${x},${y}`;
        if (seen.has(key) || x < 0 || x >= 24 || y < 0 || y >= 24 || !mask[y][x]) continue;
        seen.add(key); queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    return seen.size;
}
function maskBounds(mask) {
    const points = [];
    for (let y = 0; y < 24; y += 1) for (let x = 0; x < 24; x += 1) if (mask[y][x]) points.push([x, y]);
    return { width: Math.max(...points.map((p) => p[0])) - Math.min(...points.map((p) => p[0])) + 1,
        height: Math.max(...points.map((p) => p[1])) - Math.min(...points.map((p) => p[1])) + 1 };
}
const neutralAnimation = { fsm: "REST", bodyBob: 0, silhouettePose: "neutral", eyeState: "OPEN", mouthOpen: false, gazeX: 0 };
for (const route of Object.values(routes)) for (let day = 1; day <= 7; day += 1) {
    const mask = api.buildSilhouette(route.target, neutralAnimation, api.createGrowthState(day)).mask;
    const total = mask.flat().filter(Boolean).length;
    assert.equal(connectedPixelCount(mask), total, `Detached ${route.target.primarySpecies} silhouette pixels on day ${day}`);
    const bounds = maskBounds(mask);
    assert(bounds.width <= 10 && bounds.height <= 10, `Oversized ${route.target.primarySpecies} on day ${day}: ${bounds.width}x${bounds.height}`);
}
const aquaticProfile = {};
for (const dimension of api.PLAYER_DIMENSIONS) aquaticProfile[dimension] = { score: .1, confidence: 1 };
aquaticProfile.curiosity.score = 1; aquaticProfile.sociability.score = .9; aquaticProfile.empathy.score = .7;
const tidekinGenome = api.CreatureMapping.createTargetGenome(aquaticProfile);
assert.equal(tidekinGenome.primarySpecies, "tidekin");
assert.equal(tidekinGenome.earFamily, "fin");
assert.equal(tidekinGenome.blobTheme, "water");
for (const route of Object.values(routes)) {
    const centerMask = api.buildSilhouette(route.target, neutralAnimation, api.createGrowthState(7)).mask;
    const centerTotal = centerMask.flat().filter(Boolean).length;
    for (const positionX of [-5, 5]) {
        const movedMask = api.buildSilhouette(route.target, { ...neutralAnimation, positionX }, api.createGrowthState(7)).mask;
        assert.equal(movedMask.flat().filter(Boolean).length, centerTotal, `Clipped ${route.target.primarySpecies} at x=${positionX}`);
        assert.equal(connectedPixelCount(movedMask), centerTotal, `Detached moving ${route.target.primarySpecies}`);
    }
}

// Regression: a Day 3 face is the same child at Day 7, even when later
// behavioral evidence would otherwise select a completely different face.
const earlyDreamyTarget = {
    ...routes.gentleSocial.target,
    colorPalette: { ...routes.gentleSocial.target.colorPalette },
    generatedEyeStyle: "watery",
    earFamily: "floppy",
    silhouetteFamily: "puff",
    blobTheme: "cloud",
    mouthColor: "#3978d6",
    mouthColorName: "ocean blue"
};
const lateTinyTarget = {
    ...routes.adventurous.target,
    colorPalette: { ...routes.adventurous.target.colorPalette },
    generatedEyeStyle: "dot",
    earFamily: "pointed",
    silhouetteFamily: "pointy",
    blobTheme: "star",
    generatedMouthStyle: "pout",
    lashStyle: "single",
    signatureAccessory: "star-mark",
    mouthColor: "#806ff2",
    mouthColorName: "violet"
};
let committedCreature = api.CreatureEvolution.createInitialState();
for (let day = 1; day <= 3; day += 1) committedCreature = api.CreatureEvolution.evolveForDay(committedCreature, earlyDreamyTarget, day);
assert.equal(committedCreature.lockedPhenotype.mouthColor, "#3978d6");
assert.equal(committedCreature.lockedPhenotype.mouthColorLockedDay, 2);
assert.equal(committedCreature.lockedPhenotype.faceLineage, "watery");
for (let day = 4; day <= 7; day += 1) committedCreature = api.CreatureEvolution.evolveForDay(committedCreature, lateTinyTarget, day);
assert.equal(committedCreature.currentGenome.generatedEyeStyle, "watery");
assert.equal(committedCreature.currentGenome.mouthColor, "#3978d6");
assert.equal(committedCreature.lockedPhenotype.faceLockedDay, 3);
assert.equal(committedCreature.currentGenome.earFamily, "pointed");
assert.equal(committedCreature.lockedPhenotype.earLockedDay, 4);
assert.equal(committedCreature.currentGenome.blobTheme, "star");
assert.equal(committedCreature.lockedPhenotype.themeLockedDay, 5);
assert.equal(committedCreature.currentGenome.generatedMouthStyle, "pout");
assert.equal(committedCreature.lockedPhenotype.expressionLockedDay, 6);
assert.equal(committedCreature.currentGenome.signatureAccessory, "star-mark");
assert.equal(committedCreature.lockedPhenotype.accessoryLockedDay, 7);

// Every committed Day 4 ear family gets a second, visible growth step on Day 6.
for (const earFamily of ["round", "pointed", "floppy", "fin", "leaf"]) {
    const earGenome = { ...routes.curiousPlanner.target, earFamily };
    const day5Mask = api.buildSilhouette(earGenome, neutralAnimation, api.createGrowthState(5)).mask;
    const day6Mask = api.buildSilhouette(earGenome, neutralAnimation, api.createGrowthState(6)).mask;
    assert(day6Mask.flat().filter(Boolean).length > day5Mask.flat().filter(Boolean).length, `${earFamily} ears did not grow on Day 6`);
}

const expectedActions = ["BLINK","LOOK_AROUND","SELF_SQUISH","HICCUP","WADDLE","BOUNCE","CHEEK_PUFF","HAPPY","WALK_LEFT","WALK_RIGHT","EAR_CHECK","TINY_TURN","LOOK_BEHIND","BUMP_LEFT","BUMP_RIGHT","CORNER_PEEK","CHASE_SPARK","TRIP_RECOVER","SNEEZE","DOZE","SIT_DOZE","CALL_PLAYER","ACCESSORY_PLAY","MIRROR_PLAYER"];
assert.equal(api.CreatureAnimator.actionDefinitions.map((action) => action.name).join(","), expectedActions.join(","));
for (const action of api.CreatureAnimator.actionDefinitions) {
    const animation = api.CreatureAnimator.createState();
    animation.fsm = action.name; animation.stateDuration = action.duration; animation.stateTime = 0;
    for (let frame = 0; frame < 12; frame += 1) {
        api.CreatureAnimator.update(animation, action.duration / 12, { day: 7, personalityProfile: routes.adventurous.model.personalityProfile });
        assert(Number.isInteger(animation.positionX));
        assert(Number.isInteger(animation.positionY));
        assert(animation.positionX >= -5 && animation.positionX <= 5);
        assert(animation.positionY >= -2 && animation.positionY <= 2);
    }
}

console.log("42 choices, deterministic profiles, 3 routes, and 7 evolution stages passed.");
