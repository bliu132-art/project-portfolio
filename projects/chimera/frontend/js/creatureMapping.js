// Deterministic Personality -> Creature Design mapping.

const PERSONALITY_DESIGN_KEYWORDS = Object.freeze({
    curiosity: ["alert eyes", "sensory features", "observant posture"],
    empathy: ["rounded body", "soft outline", "gentle expression"],
    riskTaking: ["long tail", "sharp accents", "forward posture"],
    planning: ["balanced proportions", "stable posture", "structured markings"],
    sociability: ["bright expression", "open crest", "friendly face"],
    independence: ["sleek body", "calm eyes", "reserved posture"],
    orderliness: ["symmetrical markings", "clean pattern", "balanced shape"],
    noveltySeeking: ["unusual pattern", "asymmetrical accent", "special feelers"]
});

const CREATURE_PALETTES = Object.freeze({
    tide: { outline: "#244889", deep: "#3978d6", body: "#38c7e8", light: "#a6fff2", shine: "#fff36b", white: "#f7ffff", eye: "#16305f", accent: "#ff789e" },
    bloom: { outline: "#51458c", deep: "#7469d8", body: "#b58af2", light: "#ffd2ed", shine: "#fff38a", white: "#fffaff", eye: "#352c70", accent: "#ff79b0" },
    ember: { outline: "#7a3155", deep: "#d94768", body: "#ff7a4e", light: "#ffd65a", shine: "#fff2a1", white: "#fff9e8", eye: "#57233f", accent: "#9a73ff" },
    grove: { outline: "#266852", deep: "#28a878", body: "#69d66f", light: "#c8ff83", shine: "#fff36b", white: "#fbfff2", eye: "#194a3b", accent: "#ff8f88" },
    mystic: { outline: "#353477", deep: "#4d54bc", body: "#806ff2", light: "#a9f5ff", shine: "#ffe45b", white: "#fbffff", eye: "#242452", accent: "#ff72c0" }
});

const ABILITY_DEFINITIONS = Object.freeze({
    observation: { label: "Observation", supportingDimensions: ["curiosity", "planning", "orderliness"] },
    social: { label: "Social Insight", supportingDimensions: ["empathy", "sociability"] },
    exploration: { label: "Exploration", supportingDimensions: ["riskTaking", "noveltySeeking", "independence"] },
    analysis: { label: "Analysis", supportingDimensions: ["planning", "orderliness", "curiosity"] }
});

function profileScore(profile, dimension) {
    return clamp(profile[dimension]?.score ?? 0.5);
}

function lerpNumber(minimum, maximum, amount) {
    return minimum + (maximum - minimum) * clamp(amount);
}

function roundedRange(minimum, maximum, amount) {
    return Math.round(lerpNumber(minimum, maximum, amount));
}

function choosePalette(profile) {
    const candidates = [
        { name: "bloom", score: profileScore(profile, "empathy") + profileScore(profile, "sociability") * 0.35 },
        { name: "ember", score: profileScore(profile, "riskTaking") + profileScore(profile, "noveltySeeking") * 0.25 },
        { name: "grove", score: profileScore(profile, "planning") + profileScore(profile, "orderliness") * 0.35 },
        { name: "mystic", score: profileScore(profile, "independence") + profileScore(profile, "noveltySeeking") * 0.35 },
        { name: "tide", score: profileScore(profile, "curiosity") + 0.2 }
    ];
    candidates.sort(function (first, second) { return second.score - first.score; });
    return candidates[0].name;
}

function chooseMouthColor(profile) {
    const candidates = [
        { name: "ocean blue", color: "#3978d6", score: profileScore(profile, "curiosity") },
        { name: "violet", color: "#806ff2", score: profileScore(profile, "independence") },
        { name: "barbie pink", color: "#ff62b0", score: profileScore(profile, "sociability") },
        { name: "berry red", color: "#ef3f62", score: profileScore(profile, "riskTaking") },
        { name: "lagoon teal", color: "#20bfa9", score: profileScore(profile, "planning") },
        { name: "coral", color: "#ff786f", score: profileScore(profile, "empathy") },
        { name: "electric magenta", color: "#d94bd1", score: profileScore(profile, "noveltySeeking") },
        { name: "midnight blue", color: "#344a9f", score: profileScore(profile, "orderliness") }
    ];
    candidates.sort(function(first, second) { return second.score - first.score; });
    return candidates[0];
}

function createTargetGenome(personalityProfile, baseGenome = createBaseCreatureGenome()) {
    const curiosity = profileScore(personalityProfile, "curiosity");
    const empathy = profileScore(personalityProfile, "empathy");
    const risk = profileScore(personalityProfile, "riskTaking");
    const planning = profileScore(personalityProfile, "planning");
    const social = profileScore(personalityProfile, "sociability");
    const independence = profileScore(personalityProfile, "independence");
    const orderliness = profileScore(personalityProfile, "orderliness");
    const novelty = profileScore(personalityProfile, "noveltySeeking");
    const genome = cloneCreatureGenome(baseGenome);
    const speciesSelection = selectCreatureSpecies(personalityProfile);
    const primary = CREATURE_SPECIES[speciesSelection.primarySpecies];
    const secondary = CREATURE_SPECIES[speciesSelection.secondarySpecies];
    const paletteName = primary.paletteName;

    genome.bodyWidth = roundedRange(16, 24, empathy * 0.6 + social * 0.2 + (1 - independence) * 0.2);
    genome.bodyHeight = roundedRange(10, 15, independence * 0.45 + planning * 0.25 + (1 - empathy) * 0.3);
    genome.headSize = roundedRange(11, 15, empathy * 0.45 + curiosity * 0.35 + social * 0.2);
    genome.earLength = roundedRange(6, 12, curiosity * 0.7 + independence * 0.3);
    genome.tailLength = roundedRange(8, 15, risk * 0.6 + novelty * 0.4);
    genome.legLength = roundedRange(5, 8, independence * 0.45 + risk * 0.35 + planning * 0.2);
    genome.eyeSize = roundedRange(1, 3, curiosity * 0.7 + social * 0.3);
    genome.finSize = roundedRange(3, 8, risk * 0.4 + novelty * 0.4 + curiosity * 0.2);
    genome.neckFinSize = roundedRange(4, 8, social * 0.6 + empathy * 0.2 + curiosity * 0.2);
    genome.bodyRoundness = clamp(empathy * 0.7 + (1 - independence) * 0.3);
    genome.symmetry = clamp(orderliness * 0.7 + planning * 0.3);
    genome.postureEnergy = clamp(risk * 0.5 + novelty * 0.3 + social * 0.2);
    genome.patternComplexity = clamp(novelty * 0.6 + curiosity * 0.2 + orderliness * 0.2);
    genome.colorWarmth = clamp(empathy * 0.35 + social * 0.25 + risk * 0.2 + novelty * 0.2);
    genome.colorSaturation = clamp(0.45 + novelty * 0.3 + social * 0.2);
    genome.primarySpecies = speciesSelection.primarySpecies;
    genome.secondarySpecies = speciesSelection.secondarySpecies;
    genome.skeletonType = primary.skeletonType;
    genome.blobTheme = primary.blobTheme;
    const blobForms = {
        mossling: ["sprout", "leaf"], tidekin: ["pear", "fin"],
        sparkhorn: ["pointy", "pointed"], cloudlet: ["puff", "floppy"],
        moonfeel: ["pear", "pointed"], hearthop: ["squish", "round"]
    };
    [genome.silhouetteFamily, genome.earFamily] = blobForms[genome.primarySpecies] || ["round", "round"];
    genome.signatureAccessory = empathy > .7 && social > .58 ? "bow"
        : (empathy > .7 && planning > .5 ? "heart-mark"
        : (curiosity > .68 && novelty > .6 ? "star-mark"
        : (independence > .68 && orderliness > .55 ? "gem" : "ear-tip")));
    genome.generatedEyeStyle = curiosity > .76 && empathy > .55 ? "watery"
        : (independence > .66 && empathy > .5 ? "droopy"
        : (novelty > .7 ? "dot" : "oval"));
    genome.lashStyle = empathy > .72 && social > .65 ? "lush"
        : (novelty > .6 || social > .62 ? "single" : "none");
    genome.generatedMouthStyle = risk > .72 ? "bold-m"
        : (novelty > .68 && social > .52 ? "toothy-pink"
        : (independence > .7 ? "pout"
        : (planning > .68 && orderliness > .58 ? "down-caret" : "kitten")));
    const mouthColor = chooseMouthColor(personalityProfile);
    genome.mouthColor = mouthColor.color;
    genome.mouthColorName = mouthColor.name;
    genome.speciesScores = speciesSelection.speciesScores;
    genome.bodyShape = primary.bodyShape;
    genome.locomotion = primary.locomotion;
    genome.earType = primary.earType;
    genome.tailType = primary.tailType;
    genome.surfaceType = primary.surfaceType;
    genome.crestType = primary.crestType;
    genome.bodyLength = Math.round(primary.bodyLength * .7 + secondary.bodyLength * .3);
    genome.bodyHeight = Math.round(primary.bodyHeight * .7 + secondary.bodyHeight * .3);
    genome.headWidth = Math.round(primary.headWidth * .7 + secondary.headWidth * .3);
    genome.headHeight = Math.round(primary.headHeight * .7 + secondary.headHeight * .3);
    genome.legThickness = primary.legThickness;
    genome.footSize = primary.footSize;
    genome.earWidth = Math.round(primary.earWidth * .7 + secondary.earWidth * .3);
    genome.earAngle = primary.earAngle * .7 + secondary.earAngle * .3;
    genome.tailThickness = primary.tailThickness;
    genome.tailTipType = secondary.tailTipType;
    genome.crestSize = roundedRange(3,7,(curiosity+novelty+social)/3);
    genome.eyeShape = curiosity>.72?"wide":(independence>.72?"calm":"round");
    genome.eyeSpacing = roundedRange(3,5,curiosity);
    genome.mouthStyle = empathy>.7?"smile":(risk>.72?"fang":"tiny");
    genome.patternDensity = clamp(novelty*.6+orderliness*.4);
    genome.patternSymmetry = clamp(orderliness*.8+planning*.2);
    genome.expressionStyle = curiosity >= 0.72 ? "alert" : (empathy >= 0.68 ? "gentle" : (independence >= 0.7 ? "calm" : "neutral"));
    genome.patternType = novelty >= 0.7 ? "spots" : (orderliness >= 0.68 ? "stripes" : (curiosity >= 0.65 ? "waves" : "none"));
    genome.specialFeatures = [];
    if (curiosity >= 0.7) genome.specialFeatures.push("sense-orb");
    if (empathy >= 0.7) genome.specialFeatures.push("heart-crest");
    if (risk >= 0.7) genome.specialFeatures.push("tiny-horns");
    if (novelty >= 0.72) genome.specialFeatures.push("odd-fin");
    if (orderliness >= 0.72) genome.specialFeatures.push("forehead-mark");
    genome.paletteName = paletteName;
    genome.colorPalette = { ...CREATURE_PALETTES[paletteName], accent: CREATURE_PALETTES[secondary.paletteName].accent };
    return genome;
}

function createDesignKeywords(dominantTraits) {
    const keywords = [];
    for (const trait of dominantTraits) {
        for (const keyword of PERSONALITY_DESIGN_KEYWORDS[trait.name] || []) {
            if (!keywords.includes(keyword)) keywords.push(keyword);
            if (keywords.length === 6) return keywords;
        }
    }
    return keywords;
}

function createAbilityScores(profile) {
    return {
        observation: clamp(profileScore(profile, "curiosity") * 0.6 + profileScore(profile, "planning") * 0.2 + profileScore(profile, "orderliness") * 0.2),
        social: clamp(profileScore(profile, "empathy") * 0.6 + profileScore(profile, "sociability") * 0.4),
        exploration: clamp(profileScore(profile, "riskTaking") * 0.45 + profileScore(profile, "noveltySeeking") * 0.35 + profileScore(profile, "independence") * 0.2),
        analysis: clamp(profileScore(profile, "planning") * 0.5 + profileScore(profile, "orderliness") * 0.3 + profileScore(profile, "curiosity") * 0.2)
    };
}

function createUnlockedAbilities(profile, abilityScores, day) {
    if (day < 4) return [];
    return Object.keys(ABILITY_DEFINITIONS)
        .filter(function (abilityName) {
            const definition = ABILITY_DEFINITIONS[abilityName];
            const confidence = Math.max(...definition.supportingDimensions.map(function (dimension) { return profile[dimension].confidence; }));
            return abilityScores[abilityName] >= 0.62 && confidence >= 0.5;
        })
        .sort(function (first, second) { return abilityScores[second] - abilityScores[first]; })
        .map(function (abilityName) { return { id: abilityName, label: ABILITY_DEFINITIONS[abilityName].label, score: abilityScores[abilityName] }; });
}

const CreatureMapping = Object.freeze({
    createTargetGenome: createTargetGenome,
    createDesignKeywords: createDesignKeywords,
    createAbilityScores: createAbilityScores,
    createUnlockedAbilities: createUnlockedAbilities
});
