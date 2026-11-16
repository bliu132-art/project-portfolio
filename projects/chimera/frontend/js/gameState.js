// One local save slot. Animation is deliberately session-only and is rebuilt
// after loading so transient pose never affects personality or appearance.

const SAVE_SCHEMA_VERSION = 3;
const SAVE_STORAGE_KEY = "chimera-save-v3";

function createInitialGameState() {
    return {
        schemaVersion: SAVE_SCHEMA_VERSION,
        day: 1,
        maxDay: 7,
        phase: "morning",
        choices: [],
        behaviorHistory: [],
        playerProfile: createNeutralPersonalityProfile(),
        dominantTraits: [],
        creatureState: {
            ...CreatureEvolution.createInitialState(),
            name: "Chimera",
            traits: [],
            abilities: [],
            image: null
        },
        creatureAnimation: CreatureAnimator.createState()
    };
}

function loadSavedGameState() {
    try {
        const rawSave = localStorage.getItem(SAVE_STORAGE_KEY);
        if (!rawSave) return null;
        const saved = JSON.parse(rawSave);
        if (saved.schemaVersion !== SAVE_SCHEMA_VERSION) return null;
        if (!Number.isInteger(saved.day) || saved.day < 1 || saved.day > 7) return null;
        if (!Array.isArray(saved.behaviorHistory) || !saved.creatureState?.currentGenome) return null;
        return { ...saved, creatureAnimation: CreatureAnimator.createState() };
    } catch (error) {
        console.warn("The local save could not be loaded. Starting a new journey.", error);
        return null;
    }
}

function saveGameState() {
    try {
        const saveData = {
            schemaVersion: SAVE_SCHEMA_VERSION,
            day: gameState.day,
            maxDay: gameState.maxDay,
            phase: gameState.phase,
            choices: gameState.choices,
            behaviorHistory: gameState.behaviorHistory,
            playerProfile: gameState.playerProfile,
            dominantTraits: gameState.dominantTraits,
            creatureState: gameState.creatureState
        };
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveData));
    } catch (error) {
        console.warn("Progress could not be saved in this browser.", error);
    }
}

function resetSavedGame() {
    localStorage.removeItem(SAVE_STORAGE_KEY);
    gameState = createInitialGameState();
}

const loadedGameState = loadSavedGameState();
let gameState = loadedGameState || createInitialGameState();
