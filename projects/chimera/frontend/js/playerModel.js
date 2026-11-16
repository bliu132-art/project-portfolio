// Deterministic local Player Model.
//
// Player choices are treated as weighted behavioral evidence. Each dimension
// is calculated independently, so being highly curious does not force another
// trait to become weaker. No network service, random value, or LLM is used.

const PLAYER_DIMENSIONS = Object.freeze([
    "curiosity",
    "empathy",
    "riskTaking",
    "planning",
    "sociability",
    "independence",
    "orderliness",
    "noveltySeeking"
]);


const PERSONALITY_LABELS = Object.freeze({
    curiosity: "Curious",
    empathy: "Empathetic",
    riskTaking: "Bold",
    planning: "Thoughtful",
    sociability: "Sociable",
    independence: "Independent",
    orderliness: "Organized",
    noveltySeeking: "Inventive"
});


const PERSONALITY_COMBINATIONS = Object.freeze([
    { dimensions: ["curiosity", "planning"], label: "Careful Explorer", description: "Investigates unfamiliar situations methodically." },
    { dimensions: ["curiosity", "riskTaking"], label: "Bold Explorer", description: "Moves quickly toward mysteries and new experiences." },
    { dimensions: ["empathy", "sociability"], label: "Warm Connector", description: "Understands others by actively reaching out to them." },
    { dimensions: ["empathy", "independence"], label: "Quiet Guardian", description: "Protects others while trusting personal judgment." },
    { dimensions: ["planning", "orderliness"], label: "Methodical Thinker", description: "Prefers structured evidence and deliberate action." },
    { dimensions: ["riskTaking", "independence"], label: "Self-Directed Adventurer", description: "Accepts uncertainty and acts without waiting for approval." },
    { dimensions: ["sociability", "noveltySeeking"], label: "Playful Initiator", description: "Finds new possibilities through people and spontaneous action." },
    { dimensions: ["curiosity", "empathy"], label: "Perceptive Listener", description: "Looks beneath the surface while considering others' feelings." },
    { dimensions: ["planning", "empathy"], label: "Considerate Strategist", description: "Balances careful decisions with their effect on others." },
    { dimensions: ["orderliness", "independence"], label: "Steady Individualist", description: "Follows a consistent personal method." },
    { dimensions: ["noveltySeeking", "curiosity"], label: "Inventive Seeker", description: "Experiments with unusual ways to discover the truth." },
    { dimensions: ["riskTaking", "empathy"], label: "Courageous Protector", description: "Accepts personal risk when someone needs help." }
]);


function clamp(value, minimum = 0, maximum = 1) {
    return Math.min(maximum, Math.max(minimum, value));
}


function createNeutralPersonalityProfile() {

    const profile = {};

    for (const dimension of PLAYER_DIMENSIONS) {
        profile[dimension] = {
            score: 0.5,
            confidence: 0,
            evidenceCount: 0
        };
    }

    return profile;
}


function createBehaviorHistoryEntry({
    id,
    day,
    phase,
    category,
    context,
    choiceId,
    choiceText,
    behavioralEvidence,
    importance
}) {

    return {
        id: id,
        day: day,
        phase: phase,
        category: category,
        context: context,
        choiceId: choiceId,
        choiceText: choiceText,
        behavioralEvidence: { ...behavioralEvidence },
        importance: importance
    };
}


function getCurrentHistoryDay(history) {

    return history.reduce(function (latestDay, entry) {
        return Math.max(latestDay, Number(entry.day) || 1);
    }, 1);
}


function calculatePersonalityProfile(history) {

    const profile =
        createNeutralPersonalityProfile();

    if (!Array.isArray(history) || history.length === 0) {
        return profile;
    }

    const currentDay =
        getCurrentHistoryDay(history);

    for (const dimension of PLAYER_DIMENSIONS) {

        let weightedEvidence = 0;
        let totalWeight = 0;
        let evidenceCount = 0;

        for (const entry of history) {

            const evidenceValue =
                Number(entry.behavioralEvidence?.[dimension]);

            if (!Number.isFinite(evidenceValue) || evidenceValue === 0) {
                continue;
            }

            const importance =
                Number.isFinite(Number(entry.importance))
                    ? clamp(Number(entry.importance), 0.5, 1.5)
                    : 1;

            const entryDay =
                clamp(Number(entry.day) || 1, 1, currentDay);

            // Recent evidence matters slightly more without erasing the
            // player's earlier, long-term pattern.
            const recencyWeight =
                0.85 + (entryDay / currentDay) * 0.15;

            const weight =
                importance * recencyWeight;

            weightedEvidence +=
                clamp(evidenceValue, -1, 1) * weight;

            totalWeight +=
                Math.abs(weight);

            evidenceCount += 1;
        }

        if (evidenceCount === 0 || totalWeight === 0) {
            continue;
        }

        const weightedMean =
            weightedEvidence / totalWeight;

        profile[dimension] = {
            score: clamp((weightedMean + 1) / 2),
            confidence: clamp(1 - Math.exp(-evidenceCount / 4)),
            evidenceCount: evidenceCount
        };
    }

    return profile;
}


function findDominantTraits(profile) {

    return PLAYER_DIMENSIONS
        .map(function (dimension, stableIndex) {
            return {
                name: dimension,
                label: PERSONALITY_LABELS[dimension],
                score: profile[dimension].score,
                confidence: profile[dimension].confidence,
                evidenceCount: profile[dimension].evidenceCount,
                stableIndex: stableIndex
            };
        })
        .filter(function (trait) {
            return trait.confidence >= 0.35;
        })
        .sort(function (first, second) {

            const scoreDifference =
                second.score - first.score;

            if (Math.abs(scoreDifference) > Number.EPSILON) {
                return scoreDifference;
            }

            return first.stableIndex - second.stableIndex;
        })
        .slice(0, 3)
        .map(function (trait) {

            const result = { ...trait };
            delete result.stableIndex;
            return result;
        });
}


function findPersonalityCombinations(profile) {

    return PERSONALITY_COMBINATIONS
        .map(function (combination, stableIndex) {

            const strength = combination.dimensions.reduce(function (total, dimension) {
                return total + profile[dimension].score * profile[dimension].confidence;
            }, 0) / combination.dimensions.length;

            return {
                ...combination,
                strength: strength,
                stableIndex: stableIndex
            };
        })
        .filter(function (combination) {
            return combination.dimensions.every(function (dimension) {
                return profile[dimension].score >= 0.62
                    && profile[dimension].confidence >= 0.35;
            });
        })
        .sort(function (first, second) {

            const strengthDifference =
                second.strength - first.strength;

            if (Math.abs(strengthDifference) > Number.EPSILON) {
                return strengthDifference;
            }

            return first.stableIndex - second.stableIndex;
        })
        .map(function (combination) {
            return {
                label: combination.label,
                description: combination.description,
                dimensions: [...combination.dimensions]
            };
        })
        .slice(0, 3);
}


function analyzePlayer(history) {

    const safeHistory =
        Array.isArray(history) ? history : [];

    const personalityProfile =
        calculatePersonalityProfile(safeHistory);

    const dominantTraits =
        findDominantTraits(personalityProfile);

    const personalityCombinations =
        findPersonalityCombinations(personalityProfile);

    return {
        personalityProfile: personalityProfile,
        dominantTraits: dominantTraits,
        personalityLabels: dominantTraits.map(function (trait) {
            return trait.label;
        }),
        personalityCombinations: personalityCombinations,

        // Appearance keywords and abilities are intentionally delegated to
        // creatureMapping.js in Commit 4.
        designKeywords: [],
        abilityScores: {},
        unlockedAbilities: []
    };
}
