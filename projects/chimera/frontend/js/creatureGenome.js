// Creature appearance data. Genome values describe what the creature looks
// like; transient animation values belong in CreatureAnimationState instead.

const CREATURE_GENOME_VERSION = 1;


const BASE_CREATURE_PALETTE = Object.freeze({
    outline: "#143451",
    deep: "#23759b",
    body: "#55b9d4",
    light: "#8ee4e6",
    shine: "#d8ffff",
    white: "#f4fffd",
    eye: "#10213c",
    accent: "#68d9cf"
});


function createBaseCreatureGenome() {

    return {
        schemaVersion: CREATURE_GENOME_VERSION,

        // Core proportions. Day 1 renders these values as a neutral soul egg.
        bodyWidth: 18,
        bodyHeight: 20,
        headSize: 13,
        earLength: 8,
        tailLength: 10,
        legLength: 6,
        eyeSize: 2,
        finSize: 4,
        neckFinSize: 4,

        // Continuous shape-language parameters.
        bodyRoundness: 0.8,
        symmetry: 1,
        postureEnergy: 0.25,
        patternComplexity: 0,
        colorWarmth: 0.35,
        colorSaturation: 0.7,

        // Discrete appearance choices. Locked anatomy is controlled by the
        // creature's evolution stage rather than removed from the genome.
        bodyShape: "round",
        locomotion: "unformed",
        earType: "none",
        tailType: "none",
        surfaceType: "smooth",
        expressionStyle: "neutral",
        patternType: "none",
        specialFeatures: [],

        primarySpecies: "soul-egg",
        skeletonType: "blob",
        blobTheme: "soul",
        silhouetteFamily: "round",
        earFamily: "none",
        signatureAccessory: "none",
        generatedEyeStyle: "oval",
        lashStyle: "none",
        generatedMouthStyle: "kitten",
        mouthColor: "#ef3f62",
        mouthColorName: "berry red",
        secondarySpecies: "soul-egg",
        bodyLength: 16,
        headWidth: 12,
        headHeight: 12,
        legThickness: 2,
        footSize: 3,
        earWidth: 3,
        earAngle: 0,
        tailThickness: 2,
        tailTipType: "none",
        crestType: "none",
        crestSize: 4,
        eyeShape: "round",
        eyeSpacing: 4,
        mouthStyle: "tiny",
        patternDensity: 0.4,
        patternSymmetry: 1,
        speciesScores: {},

        colorPalette: { ...BASE_CREATURE_PALETTE }
    };
}

function cloneCreatureGenome(genome) {

    return {
        ...genome,
        specialFeatures: [...genome.specialFeatures],
        speciesScores: { ...(genome.speciesScores || {}) },
        colorPalette: { ...genome.colorPalette }
    };
}
