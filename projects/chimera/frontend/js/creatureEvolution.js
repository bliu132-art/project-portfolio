// Preserves creature identity while moving the current genome toward the
// personality-derived target over seven visible growth stages.

const DAILY_EVOLUTION_RATES = Object.freeze({
    1: 0,
    2: 0.15,
    3: 0.20,
    4: 0.30,
    5: 0.40,
    6: 0.60,
    7: 1
});

const NUMERIC_GENOME_KEYS = Object.freeze([
    "bodyWidth", "bodyHeight", "headSize", "earLength", "tailLength",
    "legLength", "eyeSize", "finSize", "neckFinSize", "bodyRoundness",
    "symmetry", "postureEnergy", "patternComplexity", "colorWarmth",
    "colorSaturation", "bodyLength", "headWidth", "headHeight", "legThickness",
    "footSize", "earWidth", "earAngle", "tailThickness", "crestSize",
    "eyeSpacing", "patternDensity", "patternSymmetry"
]);

function interpolateGenomeNumber(previous, target, rate) {
    return previous + (target - previous) * rate;
}

function parseHexColor(color) {
    const hex = color.replace("#", "");
    return [0, 2, 4].map(function (offset) { return parseInt(hex.slice(offset, offset + 2), 16); });
}

function interpolateHexColor(previous, target, rate) {
    const first = parseHexColor(previous);
    const second = parseHexColor(target);
    const channels = first.map(function (channel, index) {
        return Math.round(interpolateGenomeNumber(channel, second[index], rate));
    });
    return "#" + channels.map(function (channel) { return channel.toString(16).padStart(2, "0"); }).join("");
}

function unlockedDiscreteGenome(previous, target, day) {
    const result = cloneCreatureGenome(previous);
    for(const key of ["primarySpecies","secondarySpecies","skeletonType","blobTheme","silhouetteFamily","earFamily","signatureAccessory","generatedEyeStyle","lashStyle","generatedMouthStyle","mouthColor","mouthColorName","bodyShape","locomotion","earType","tailType","tailTipType","surfaceType","crestType","eyeShape","mouthStyle","paletteName"]){result[key]=target[key];}
    result.speciesScores={...target.speciesScores};
    if (day >= 3) {
        result.locomotion = target.locomotion;
        result.patternType = target.patternType;
    }
    if (day >= 4) {
        result.earType = target.earType;
        result.surfaceType = target.surfaceType;
        result.expressionStyle = target.expressionStyle;
        result.specialFeatures = [...new Set([...previous.specialFeatures, ...target.specialFeatures])];
    }
    if (day >= 5) {
        result.tailType = target.tailType;
        result.bodyShape = target.bodyShape;
        result.paletteName = target.paletteName;
    }
    return result;
}

function createEmptyPhenotypeLocks() {
    return {
        faceLineage: null, faceLockedDay: null,
        mouthColor: null, mouthColorName: null, mouthColorLockedDay: null,
        earFamily: null, silhouetteFamily: null, earLockedDay: null,
        blobTheme: null, primarySpecies: null, secondarySpecies: null,
        paletteName: null, colorPalette: null, themeLockedDay: null,
        mouthFamily: null, lashStyle: null, expressionLockedDay: null,
        signatureAccessory: null, accessoryLockedDay: null
    };
}

function updatePhenotypeLocks(existing, candidate, stage) {
    const locked = { ...createEmptyPhenotypeLocks(), ...(existing || {}) };
    if (stage >= 2 && !locked.mouthColor) {
        locked.mouthColor = candidate.mouthColor || "#ef3f62";
        locked.mouthColorName = candidate.mouthColorName || "berry red";
        locked.mouthColorLockedDay = stage;
    }
    if (stage >= 3 && !locked.faceLineage) {
        locked.faceLineage = candidate.generatedEyeStyle || "oval";
        locked.faceLockedDay = stage;
    }
    if (stage >= 4 && !locked.earFamily) {
        locked.earFamily = candidate.earFamily || "round";
        locked.silhouetteFamily = candidate.silhouetteFamily || "round";
        locked.earLockedDay = stage;
    }
    if (stage >= 5 && !locked.blobTheme) {
        locked.blobTheme = candidate.blobTheme || "soul";
        locked.primarySpecies = candidate.primarySpecies;
        locked.secondarySpecies = candidate.secondarySpecies;
        locked.paletteName = candidate.paletteName;
        locked.colorPalette = { ...candidate.colorPalette };
        locked.themeLockedDay = stage;
    }
    if (stage >= 6 && !locked.mouthFamily) {
        locked.mouthFamily = candidate.generatedMouthStyle || "kitten";
        locked.lashStyle = candidate.lashStyle || "none";
        locked.expressionLockedDay = stage;
    }
    if (stage >= 7 && !locked.signatureAccessory) {
        locked.signatureAccessory = candidate.signatureAccessory || "ear-tip";
        locked.accessoryLockedDay = stage;
    }
    return locked;
}

function applyPhenotypeLocks(candidate, locked) {
    const result = cloneCreatureGenome(candidate);
    if (locked.mouthColor) {
        result.mouthColor = locked.mouthColor;
        result.mouthColorName = locked.mouthColorName;
    }
    if (locked.faceLineage) result.generatedEyeStyle = locked.faceLineage;
    if (locked.earFamily) {
        result.earFamily = locked.earFamily;
        result.silhouetteFamily = locked.silhouetteFamily;
    }
    if (locked.blobTheme) {
        result.blobTheme = locked.blobTheme;
        result.primarySpecies = locked.primarySpecies;
        result.secondarySpecies = locked.secondarySpecies;
        result.paletteName = locked.paletteName;
        result.colorPalette = { ...locked.colorPalette };
    }
    if (locked.mouthFamily) {
        result.generatedMouthStyle = locked.mouthFamily;
        result.lashStyle = locked.lashStyle;
    }
    if (locked.signatureAccessory) result.signatureAccessory = locked.signatureAccessory;
    return result;
}

const CreatureEvolution = Object.freeze({
    createInitialState: function () {
        const baseGenome = createBaseCreatureGenome();
        return {
            stage: 1,
            baseGenome: cloneCreatureGenome(baseGenome),
            previousGenome: cloneCreatureGenome(baseGenome),
            currentGenome: cloneCreatureGenome(baseGenome),
            targetGenome: cloneCreatureGenome(baseGenome),
            designKeywords: [],
            abilityScores: { observation: 0, social: 0, exploration: 0, analysis: 0 },
            unlockedAbilities: [],
            evolutionHistory: [],
            lockedPhenotype: createEmptyPhenotypeLocks()
            ,growthState: createGrowthState(1)
            ,previousGrowthState: createGrowthState(1)
        };
    },

    evolveForDay: function (creatureState, targetGenome, day) {
        const stage = Math.round(clamp(day, 1, 7));
        const rate = DAILY_EVOLUTION_RATES[stage];
        const previous = cloneCreatureGenome(creatureState.currentGenome);
        const lockedPhenotype = updatePhenotypeLocks(creatureState.lockedPhenotype, targetGenome, stage);
        const committedTarget = applyPhenotypeLocks(targetGenome, lockedPhenotype);
        const previousGrowthState = { ...(creatureState.growthState || createGrowthState(Math.max(1,stage-1))) };
        const growthState = createGrowthState(stage);
        const current = unlockedDiscreteGenome(previous, committedTarget, stage);

        for (const key of NUMERIC_GENOME_KEYS) {
            current[key] = stage === 7
                ? committedTarget[key]
                : interpolateGenomeNumber(previous[key], committedTarget[key], rate);
        }

        for (const colorName of Object.keys(current.colorPalette)) {
            current.colorPalette[colorName] = stage === 7
                ? committedTarget.colorPalette[colorName]
                : interpolateHexColor(previous.colorPalette[colorName], committedTarget.colorPalette[colorName], rate);
        }

        const historyWithoutToday = creatureState.evolutionHistory.filter(function (entry) { return entry.day !== stage; });
        const snapshot = {
            day: stage,
            stage: stage,
            genome: cloneCreatureGenome(current),
            lockedPhenotype: { ...lockedPhenotype, colorPalette: lockedPhenotype.colorPalette ? { ...lockedPhenotype.colorPalette } : null },
            growthState: { ...growthState },
            designKeywords: [...creatureState.designKeywords],
            unlockedAbilities: creatureState.unlockedAbilities.map(function (ability) { return { ...ability }; })
        };

        return {
            ...creatureState,
            stage: stage,
            previousGenome: previous,
            currentGenome: current,
            targetGenome: cloneCreatureGenome(committedTarget),
            lockedPhenotype: lockedPhenotype,
            previousGrowthState: previousGrowthState,
            growthState: growthState,
            evolutionHistory: [...historyWithoutToday, snapshot].sort(function (a, b) { return a.day - b.day; })
        };
    },

    createTransitionGenome: function (fromGenome, toGenome, progress) {
        const amount = clamp(progress);
        if (amount >= 1) return cloneCreatureGenome(toGenome);
        const result = cloneCreatureGenome(toGenome);
        for (const key of NUMERIC_GENOME_KEYS) {
            result[key] = interpolateGenomeNumber(fromGenome[key], toGenome[key], amount);
        }
        for (const colorName of Object.keys(result.colorPalette)) {
            result.colorPalette[colorName] = interpolateHexColor(fromGenome.colorPalette[colorName], toGenome.colorPalette[colorName], amount);
        }
        return result;
    },

    createTransitionGrowth: function(fromGrowth,toGrowth,progress){
        return interpolateGrowthState(fromGrowth,toGrowth,progress);
    }
});
