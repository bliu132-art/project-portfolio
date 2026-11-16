// Main game logic.
// Controls the Day 1-7 gameplay loop.


// ============================================================
// HTML ELEMENTS
// ============================================================

const dayDisplay =
    document.getElementById("day-display");

const phaseDisplay =
    document.getElementById("phase-display");

const sectionTitle =
    document.getElementById("section-title");

const storyText =
    document.getElementById("story-text");

const choiceContainer =
    document.getElementById("choice-container");

const evolutionSummary =
    document.getElementById("evolution-summary");

const dayProgress =
    document.getElementById("day-progress");

const stageLabel =
    document.getElementById("stage-label");

const sectionKicker =
    document.getElementById("section-kicker");

const startScreen =
    document.getElementById("start-screen");

const beginButton =
    document.getElementById("begin-button");

const newGameButton =
    document.getElementById("new-game-button");

const debugPanel = document.getElementById("debug-panel");
const debugOutput = document.getElementById("debug-output");
const debugOpen = document.getElementById("debug-open");
const debugClose = document.getElementById("debug-close");
const debugExport = document.getElementById("debug-export");
const debugReset = document.getElementById("debug-reset");
const debugEnabled = new URLSearchParams(window.location.search).get("debug") === "1";

const creatureDescription =
    document.getElementById("creature-description");

const creatureAbilities =
    document.getElementById("creature-abilities");

const creatureCanvas =
    document.getElementById("creature-canvas");

const creatureContext =
    creatureCanvas.getContext("2d");

const startCreatureCanvas =
    document.getElementById("start-creature-canvas");

const startCreatureContext =
    startCreatureCanvas.getContext("2d");

// The cover uses the exact same generator and Day 1 genome as the playable
// creature. It is not a separate CSS illustration or image asset.
const startCreatureGenome = createBaseCreatureGenome();
const startCreatureGrowth = createGrowthState(1);
const startCreatureAnimation = CreatureAnimator.createState();


// ============================================================
// BASIC UI
// ============================================================

function updateHeader() {

    dayDisplay.textContent =
        "Day " + gameState.day;

    phaseDisplay.textContent =
        capitalize(gameState.phase);

    dayProgress.innerHTML = "";

    for (let day = 1; day <= gameState.maxDay; day += 1) {
        const node = document.createElement("span");
        node.className = "day-node";
        node.dataset.day = day;
        if (day < gameState.day || gameState.phase === "final") node.classList.add("complete");
        if (day === gameState.day && gameState.phase !== "final") node.classList.add("current");
        dayProgress.appendChild(node);
    }

    const stageNames = ["", "SOUL EGG", "HATCHLING", "WOBBLY BABY", "BUDDING FORM", "YOUNGLING", "GROWING UP", "FINAL FRIEND"];
    const speciesId = gameState.creatureState.currentGenome.primarySpecies;
    const speciesName = CREATURE_SPECIES[speciesId]?.label;
    stageLabel.textContent = "STAGE " + gameState.creatureState.stage + " · " + stageNames[gameState.creatureState.stage]
        + (speciesName && gameState.creatureState.stage >= 4 ? " · " + speciesName.toUpperCase() : "");

    updateDebugPanel();
}


function capitalize(word) {

    return word.charAt(0).toUpperCase()
        + word.slice(1);
}

function formatPhenotype(value) {
    return String(value || "pending").split("-").map(capitalize).join(" ");
}


function clearChoices() {

    choiceContainer.innerHTML = "";
    evolutionSummary.hidden = true;
    evolutionSummary.innerHTML = "";
}


function createButton(text, clickFunction, description = "") {

    const button =
        document.createElement("button");

    button.className =
        "choice-button";

    const title = document.createElement("span");
    title.className = "choice-title";
    title.textContent = text;
    button.appendChild(title);

    if (description) {
        const detail = document.createElement("span");
        detail.className = "choice-description";
        detail.textContent = description;
        button.appendChild(detail);
    }

    button.addEventListener(
        "click",
        clickFunction
    );

    choiceContainer.appendChild(button);
}


// ============================================================
// CREATURE DISPLAY
// ============================================================

// The creature is always generated from its current genome.
function updateCreatureImage() {

    let renderGenome =
        gameState.creatureState.currentGenome;

    let renderGrowth =
        gameState.creatureState.growthState || createGrowthState(gameState.creatureState.stage);

    let evolutionFx = null;

    if (creatureEvolutionTransition) {

        const progress = clamp(
            (performance.now() - creatureEvolutionTransition.startedAt)
            / creatureEvolutionTransition.duration
        );

        const morphProgress = clamp((progress - 0.28) / 0.48);

        renderGenome = CreatureEvolution.createTransitionGenome(
            creatureEvolutionTransition.fromGenome,
            creatureEvolutionTransition.toGenome,
            morphProgress
        );

        renderGrowth = CreatureEvolution.createTransitionGrowth(
            creatureEvolutionTransition.fromGrowth,
            creatureEvolutionTransition.toGrowth,
            morphProgress
        );

        evolutionFx = { progress: progress, reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches };

        if (progress >= 1) {
            creatureEvolutionTransition = null;
        }
    }

    CreatureRenderer.render(
        creatureContext,
        renderGenome,
        gameState.creatureAnimation,
        renderGrowth,
        evolutionFx
    );
}


// Update creature traits and abilities.
function updateCreatureInfo() {

    const traits =
        gameState.creatureState.traits;

    const abilities =
        gameState.creatureState.abilities;


    if (traits.length > 0) {

        creatureDescription.textContent =
            "Current traits: "
            + traits.join(", ");
    }

    else {

        creatureDescription.textContent =
            "Your creature is still young and has not developed any special traits.";
    }


    if (abilities.length > 0) {

        creatureAbilities.textContent =
            "Abilities: "
            + abilities.join(", ");
    }

    else {

        creatureAbilities.textContent =
            "Abilities: None";
    }


    updateCreatureImage();
}


// ============================================================
// MORNING
// ============================================================

function showMorning() {

    gameState.phase =
        "morning";

    updateHeader();
    saveGameState();
    updateDebugPanel();

    clearChoices();

    updateCreatureInfo();


    const currentDayData =
        gameData[gameState.day];


    sectionTitle.textContent =
        "Morning Activity";

    sectionKicker.textContent =
        "FREE ACTIVITY · ONE CHOICE";

    storyText.textContent =
        "Choose one activity for this morning.";


    for (const activity of currentDayData.morningActivities) {

        createButton(
            activity.title,

            function () {

                chooseMorningActivity(
                    activity
                );
            },
            activity.description
        );
    }
}


// Save the player's Morning choice.
function chooseMorningActivity(activity) {

    gameState.choices.push({

        day:
            gameState.day,

        phase:
            "morning",

        choice:
            activity.title
    });


    gameState.behaviorHistory.push(

        createBehaviorHistoryEntry({
            id: activity.id,
            day: gameState.day,
            phase: "morning",
            category: activity.category,
            context: activity.description,
            choiceId: activity.choiceId,
            choiceText: activity.title,
            behavioralEvidence: activity.behavioralEvidence,
            importance: activity.importance
        })
    );


    console.log(
        "Morning Choice:",
        activity.title
    );

    console.log(
        "Morning Behavioral Evidence:",
        activity.behavioralEvidence
    );


    showAfternoon();
}


// ============================================================
// AFTERNOON
// ============================================================

function showAfternoon() {

    gameState.phase =
        "afternoon";

    updateHeader();
    saveGameState();
    updateDebugPanel();

    clearChoices();

    updateCreatureInfo();


    const currentDayData =
        gameData[gameState.day];

    const event =
        currentDayData.afternoonEvent;


    sectionTitle.textContent =
        event.title;

    sectionKicker.textContent =
        "MAIN INVESTIGATION · FOLDBACK ROUTE";

    storyText.textContent =
        gameState.day === 5
            ? event.description + " " + getDayFiveAbilityClue()
            : event.description;


    for (const choice of event.choices) {

        createButton(
            choice.text,

            function () {

                chooseStoryOption(
                    choice
                );
            }
        );
    }
}


function getDayFiveAbilityClue() {

    const strongestAbility =
        gameState.creatureState.unlockedAbilities[0]?.id;

    const approaches = {
        observation: "Its sensory features detect a faint trail beneath the floor.",
        social: "A resident notices its friendly reaction and quietly shares what they saw.",
        exploration: "It slips through a narrow passage and discovers a hidden route.",
        analysis: "It reacts when two details in the testimony fail to match."
    };

    const approach = approaches[strongestAbility]
        || "It stays close until a disturbed floorboard catches your attention.";

    return approach + " The evidence shows that the missing stone was moved through the old cellar.";
}


// Save the player's story choice.
function chooseStoryOption(choice) {

    const currentEvent =
        gameData[gameState.day].afternoonEvent;


    gameState.choices.push({

        day:
            gameState.day,

        phase:
            "afternoon",

        choice:
            choice.text
    });


    gameState.behaviorHistory.push(

        createBehaviorHistoryEntry({
            id: choice.id,
            day: gameState.day,
            phase: "afternoon",
            category: currentEvent.category,
            context: currentEvent.description,
            choiceId: choice.choiceId,
            choiceText: choice.text,
            behavioralEvidence: choice.behavioralEvidence,
            importance: choice.importance
        })
    );


    console.log(
        "Story Choice:",
        choice.text
    );

    console.log(
        "Story Behavioral Evidence:",
        choice.behavioralEvidence
    );


    showNight();
}


// ============================================================
// NIGHT
// ============================================================

function showNight() {

    gameState.phase =
        "night";

    updateHeader();

    clearChoices();


    sectionTitle.textContent =
        "Night Reflection";

    sectionKicker.textContent =
        "NIGHT EVOLUTION · SOULPRINT UPDATED";


    const previousKeywords =
        [...gameState.creatureState.designKeywords];

    const playerModelResult =
        analyzePlayer(
            gameState.behaviorHistory
        );


    // Save the Player Model result.
    gameState.playerProfile =
        playerModelResult.personalityProfile;

    gameState.dominantTraits =
        playerModelResult.dominantTraits;


    const designKeywords =
        CreatureMapping.createDesignKeywords(
            playerModelResult.dominantTraits
        );

    const abilityScores =
        CreatureMapping.createAbilityScores(
            playerModelResult.personalityProfile
        );

    const unlockedAbilities =
        CreatureMapping.createUnlockedAbilities(
            playerModelResult.personalityProfile,
            abilityScores,
            gameState.day
        );

    const targetGenome =
        CreatureMapping.createTargetGenome(
            playerModelResult.personalityProfile,
            gameState.creatureState.baseGenome
        );


    // Save creature appearance keywords.
    gameState.creatureState.traits =
        designKeywords;

    gameState.creatureState.designKeywords =
        designKeywords;

    gameState.creatureState.abilityScores =
        abilityScores;

    gameState.creatureState.targetGenome =
        targetGenome;


    // Save creature abilities.
    gameState.creatureState.abilities =
        unlockedAbilities.map(function (ability) {
            return ability.label;
        });

    gameState.creatureState.unlockedAbilities =
        unlockedAbilities;

    gameState.creatureState =
        CreatureEvolution.evolveForDay(
            gameState.creatureState,
            targetGenome,
            gameState.day
        );

    // The species can change after today's evidence is analyzed, so refresh
    // the stage badge immediately instead of waiting until the next morning.
    updateHeader();

    creatureEvolutionTransition = {
        fromGenome: cloneCreatureGenome(gameState.creatureState.previousGenome),
        toGenome: cloneCreatureGenome(gameState.creatureState.currentGenome),
        fromGrowth: { ...gameState.creatureState.previousGrowthState },
        toGrowth: { ...gameState.creatureState.growthState },
        startedAt: performance.now(),
        duration: 2600
    };


    storyText.textContent =
        "Your choices have influenced your soul creature.";

    showNightEvolutionSummary(
        previousKeywords,
        designKeywords,
        unlockedAbilities
    );

    evolutionSummary.hidden = true;


    updateCreatureInfo();


    const continueButton =
        document.createElement("button");

    continueButton.textContent =
        "Continue to Next Day";

    continueButton.className =
        "continue-button";

    continueButton.disabled =
        true;

    continueButton.textContent =
        "Evolution in progress...";

    continueButton.addEventListener(
        "click",
        nextDay
    );

    choiceContainer.appendChild(
        continueButton
    );

    const skipButton = document.createElement("button");
    skipButton.className = "secondary-button evolution-skip";
    skipButton.textContent = "Skip Evolution";
    choiceContainer.appendChild(skipButton);

    let evolutionFinished = false;
    const finishEvolution = function () {
        if (evolutionFinished) return;
        evolutionFinished = true;
        if (creatureEvolutionTransition) {
            creatureEvolutionTransition.startedAt = performance.now() - creatureEvolutionTransition.duration;
        }
        evolutionSummary.hidden = false;
        continueButton.disabled = false;
        continueButton.textContent = "Continue to Next Day";
        skipButton.remove();
        saveGameState();
        updateDebugPanel();
    };

    skipButton.addEventListener("click", finishEvolution);

    window.setTimeout(finishEvolution, 2600);

    saveGameState();
    updateDebugPanel();
}


function showNightEvolutionSummary(previousKeywords, currentKeywords, abilities) {

    const stageNames = {
        1: "Soul Egg",
        2: "Hatchling",
        3: "Wobbly Baby",
        4: "Budding Form",
        5: "Youngling",
        6: "Growing Up",
        7: "Final Friend"
    };

    const newKeywords = currentKeywords.filter(function (keyword) {
        return !previousKeywords.includes(keyword);
    });

    const visibleChanges = newKeywords.length > 0
        ? newKeywords.slice(0, 3)
        : currentKeywords.slice(0, 2);

    const heading = document.createElement("h3");
    heading.textContent = "Stage " + gameState.day + " · " + stageNames[gameState.day];
    const list = document.createElement("ul");

    for (const change of visibleChanges) {
        const item = document.createElement("li");
        item.textContent = capitalize(change);
        list.appendChild(item);
    }

    const latestAbility = abilities[0];
    if (latestAbility) {
        const item = document.createElement("li");
        item.textContent = "Ability awakened: " + latestAbility.label;
        list.appendChild(item);
    }

    const locks = gameState.creatureState.lockedPhenotype || {};
    const lineageMessages = {
        2: "First mouth color locked: " + formatPhenotype(locks.mouthColorName),
        3: "Face lineage locked: " + formatPhenotype(locks.faceLineage),
        4: "Ear lineage locked: " + formatPhenotype(locks.earFamily),
        5: "Theme locked: " + formatPhenotype(locks.blobTheme),
        6: "Ears grown · expression refined: " + formatPhenotype(locks.mouthFamily) + " · " + formatPhenotype(locks.lashStyle) + " lashes",
        7: "Final accessory: " + formatPhenotype(locks.signatureAccessory)
    };
    if (lineageMessages[gameState.day]) {
        const lineageItem = document.createElement("li");
        lineageItem.textContent = lineageMessages[gameState.day];
        list.appendChild(lineageItem);
    }

    if (gameState.day >= 5) {
        const speciesItem = document.createElement("li");
        const primary = CREATURE_SPECIES[gameState.creatureState.currentGenome.primarySpecies];
        const secondary = CREATURE_SPECIES[gameState.creatureState.currentGenome.secondarySpecies];
        speciesItem.textContent = "Form emerging: " + primary.label + " with " + secondary.label + " traits";
        list.appendChild(speciesItem);
    }

    evolutionSummary.append(heading, list);
    evolutionSummary.hidden = false;
}


// ============================================================
// NEXT DAY
// ============================================================

function nextDay() {

    if (gameState.day >= gameState.maxDay) {

        showFinalReveal();

        return;
    }


    gameState.day += 1;


    // Creature grows a little every day.
    gameState.creatureState.stage += 1;


    showMorning();
}


// ============================================================
// FINAL REVEAL
// ============================================================

function showFinalReveal() {

    gameState.phase =
        "final";

    updateHeader();

    clearChoices();

    updateCreatureInfo();


    sectionTitle.textContent =
        "Final Creature Reveal";

    sectionKicker.textContent =
        "SEVEN DAYS · FINAL SOULPRINT";


    storyText.textContent =
        "After seven days, your soul creature has reached its final form.";


    if (gameState.creatureState.traits.length > 0) {

        creatureDescription.textContent =
            "Final traits: "
            + gameState.creatureState.traits.join(", ");
    }

    renderFinalReveal();
    saveGameState();
    updateDebugPanel();


    console.log(
        "Final Game State:",
        gameState
    );

    console.log(
        "Complete Behavior History:",
        gameState.behaviorHistory
    );
}


function createFinalReflection() {
    const traits = gameState.dominantTraits.slice(0, 2).map(function (trait) { return trait.label.toLowerCase(); });
    const choices = gameState.behaviorHistory.slice(-4).map(function (entry) { return entry.choiceText.toLowerCase(); });
    const traitPhrase = traits.length > 0 ? traits.join(" and ") : "uniquely balanced";
    const choicePhrase = choices.length > 0 ? choices.slice(-2).join(" and ") : "follow your instincts";
    return "Your creature became " + traitPhrase + " because you repeatedly chose to " + choicePhrase + ". Its final form preserves the small soul egg that began the journey.";
}


function renderFinalReveal() {
    evolutionSummary.hidden = false;
    evolutionSummary.className = "final-reveal";
    evolutionSummary.innerHTML = "";

    const traitRow = document.createElement("div");
    traitRow.className = "final-traits";
    for (const trait of gameState.dominantTraits.slice(0, 3)) {
        const badge = document.createElement("span");
        badge.textContent = trait.label;
        traitRow.appendChild(badge);
    }

    const makeBlock = function (title, text) {
        const block = document.createElement("section");
        block.className = "final-block";
        const heading = document.createElement("h3"); heading.textContent = title;
        const copy = document.createElement("p"); copy.textContent = text;
        block.append(heading, copy);
        return block;
    };

    const history = document.createElement("div");
    history.className = "evolution-history";
    const stageNames = ["Egg", "Expression", "Limbs", "Senses", "Form", "Maturing", "Final"];
    for (let day = 1; day <= 7; day += 1) {
        const item = document.createElement("span"); item.textContent = "D" + day + " " + stageNames[day - 1]; history.appendChild(item);
    }

    evolutionSummary.append(
        traitRow,
        makeBlock("SPECIES FAMILY", (CREATURE_SPECIES[gameState.creatureState.currentGenome.primarySpecies]?.label || "Soul Creature") + " · " + (CREATURE_SPECIES[gameState.creatureState.currentGenome.secondarySpecies]?.label || "Original")),
        makeBlock("DESIGN KEYWORDS", gameState.creatureState.designKeywords.join(" · ") || "A balanced form"),
        makeBlock("ABILITIES", gameState.creatureState.abilities.join(" · ") || "Still awakening"),
        makeBlock("YOUR SOULPRINT", createFinalReflection()),
        history
    );

    const restartButton = document.createElement("button");
    restartButton.className = "continue-button";
    restartButton.textContent = "Play Again";
    restartButton.addEventListener("click", requestNewGame);
    choiceContainer.appendChild(restartButton);
}


function requestNewGame() {
    if (!window.confirm("Erase this creature and begin a new seven-day journey?")) return;
    resetSavedGame();
    window.location.reload();
}


// ============================================================
// START GAME
// ============================================================

let previousAnimationTime =
    performance.now();

let creatureEvolutionTransition =
    null;


function creatureAnimationLoop(currentTime) {

    const deltaTime =
        Math.min((currentTime - previousAnimationTime) / 1000, 0.05);

    previousAnimationTime =
        currentTime;

    CreatureAnimator.update(
        gameState.creatureAnimation,
        deltaTime,
        {
            day: gameState.day,
            personalityProfile: gameState.playerProfile,
            genome: gameState.creatureState.currentGenome,
            recentBehavior: gameState.behaviorHistory[gameState.behaviorHistory.length - 1]
        }
    );

    updateCreatureImage();

    if (!startScreen.classList.contains("dismissed")) {
        CreatureAnimator.update(
            startCreatureAnimation,
            deltaTime,
            { day: 1, personalityProfile: {}, genome: startCreatureGenome }
        );
        CreatureRenderer.render(
            startCreatureContext,
            startCreatureGenome,
            startCreatureAnimation,
            startCreatureGrowth,
            null
        );
    }

    requestAnimationFrame(
        creatureAnimationLoop
    );
}


function renderSavedPhase() {
    if (gameState.phase === "afternoon") showAfternoon();
    else if (gameState.phase === "night") showNight();
    else if (gameState.phase === "final") showFinalReveal();
    else showMorning();
}


renderSavedPhase();

beginButton.addEventListener("click", function () {
    startScreen.classList.add("dismissed");
});

if (loadedGameState) {
    beginButton.textContent = "Continue your journey";
    newGameButton.hidden = false;
}

newGameButton.addEventListener("click", requestNewGame);


function updateDebugPanel() {
    if (!debugEnabled || !debugOutput) return;
    const diagnostics = {
        day: gameState.day,
        phase: gameState.phase,
        behaviorHistory: gameState.behaviorHistory,
        personalityProfile: gameState.playerProfile,
        dominantTraits: gameState.dominantTraits,
        designKeywords: gameState.creatureState.designKeywords,
        abilityScores: gameState.creatureState.abilityScores,
        unlockedAbilities: gameState.creatureState.unlockedAbilities,
        currentGenome: gameState.creatureState.currentGenome,
        targetGenome: gameState.creatureState.targetGenome,
        evolutionHistory: gameState.creatureState.evolutionHistory
        ,lockedPhenotype: gameState.creatureState.lockedPhenotype
        ,growthState: gameState.creatureState.growthState
        ,primarySpecies: gameState.creatureState.currentGenome.primarySpecies
        ,secondarySpecies: gameState.creatureState.currentGenome.secondarySpecies
    };
    debugOutput.textContent = JSON.stringify(diagnostics, null, 2);
}


if (debugEnabled) {
    debugPanel.hidden = false;
    debugOpen.hidden = true;
    updateDebugPanel();
}

debugClose.addEventListener("click", function () {
    debugPanel.hidden = true;
    debugOpen.hidden = false;
});

debugOpen.addEventListener("click", function () {
    debugPanel.hidden = false;
    debugOpen.hidden = true;
    updateDebugPanel();
});

debugReset.addEventListener("click", requestNewGame);

debugExport.addEventListener("click", function () {
    const payload = JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, gameState: gameState }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chimera-save-day-" + gameState.day + ".json";
    link.click();
    URL.revokeObjectURL(link.href);
});

requestAnimationFrame(
    creatureAnimationLoop
);
