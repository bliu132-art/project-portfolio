# Chimera

Chimera is a seven-day, single-player narrative prototype in which player choices gradually shape an original procedural pixel creature. It runs entirely in the browser with no LLM, backend, image-generation service, external library, or creature art asset.

## Run locally

Open `frontend/index.html` directly, or serve the `frontend` directory with any static server:

```bash
cd frontend
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8765/`.

## Core loop

```text
Morning Activity
-> Afternoon Investigation
-> Behavior History
-> Night Player Model Analysis
-> Personality Profile
-> Design Keywords and Abilities
-> Target Creature Genome
-> Daily Procedural Evolution
```

The player begins as a tiny, eye-only soul blob. Across seven stages its single connected outline becomes more expressive: a mouth appears, one-pixel limb buds merge into the body, a coherent ear or fin family develops, and color, markings, accessories, and abilities mature without replacing the creature with an unrelated form.

## Local Player Model

Every choice contains designer-authored evidence for eight independent dimensions:

- curiosity
- empathy
- risk-taking
- planning
- sociability
- independence
- orderliness
- novelty-seeking

Evidence values range from `-1` to `1` and are multiplied by choice importance and a small recency weight. Each dimension produces a score, confidence, and evidence count. Empty dimensions remain neutral at `0.5`. Identical histories always produce identical profiles.

## Procedural creature system

`CreatureGenome` owns permanent appearance. `CreatureAnimationState` owns only transient pose and expression. The 24x24 Canvas is redrawn every animation frame using integer-aligned rectangles. It is enlarged with nearest-neighbor scaling, with image smoothing disabled.

The pet always remains a small, connected Tamagotchi-like blob rather than changing skeletons. Personality maps deterministically to a coherent visual lineage: rounded, pointed, floppy, leaf-like, or aquatic fin ears; compatible eyes, lashes, mouth, vivid palette, markings, accessory, and ability family. Once a face and silhouette lineage appears, later stages refine it instead of randomly replacing it.

Animation timing may be random, but it never changes the permanent genome. The idle state machine includes breathing, blinking, squinting, mouth expressions, happy hops, waddling, edge peeking, turning, squashing, waving, cheek puffs, spark reactions, and short naps. Position changes happen inside the 24x24 logical space so the deliberately small creature has room to explore its display frame.

## Evolution stages

1. Soul Egg
2. First Expression — a one-pixel mouth appears and its independent vivid color is locked
3. Connected Limb Buds
4. Ear or Fin Lineage
5. Refined Blob Outline
6. Near Final Form — the committed ear family grows larger while mouth shape and lashes settle
7. Final Form

Daily changes interpolate from the previous genome toward the current target genome. Day 7 exactly matches the final target. Previously unlocked special features are retained.

## Save and debug tools

One save slot is stored in `localStorage` with a schema version. Refreshing restores the current day and phase. New Game and Play Again require confirmation before clearing the creature.

Open the game with `?debug=1` to see Behavior History, personality scores and confidence, dominant traits, design keywords, abilities, current/target genomes, and evolution history.

## Tests

Run the deterministic model and data tests with:

```bash
node tests/playerModel.test.js
```

The test covers all 42 choice records, evidence ranges, three representative player routes, deterministic output, ability gates, evolution history, and final-genome equality.
