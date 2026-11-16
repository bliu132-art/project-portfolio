# Chimera

A seven-day, single-player interactive narrative and virtual-creature project for **CMPM 146: Game AI, Summer 2026**, at UC Santa Cruz.

Player choices accumulate across daily activities and investigations. A local, rule-driven player model connects the history of choices to personality dimensions and a growing pixel creature. The final reveal presents the resulting creature and its evolution history.

**[Play the existing browser demo](https://bliu132-art.github.io/CMPM146-Final-Project-Chimera/)** · **[Original repository](https://github.com/bliu132-art/CMPM146-Final-Project-Chimera)**

## Team and my contribution

The course project was completed by **Max Liu, Shiyi Sun, and Qiaochu Liu**.

My role was **game framework development and integration**:

- Building the browser framework with HTML, CSS, and JavaScript.
- Organizing Day 1–7 progression and morning, afternoon, and night phases.
- Recording player choices and behavior history, and managing game state.
- Connecting the final reveal and interfaces to the other project modules.

My teammates were responsible for player modeling and creature evolution, and for narrative and visual direction. The complete source snapshot includes shared project modules; it does not attribute every module to me.

## Implementation focus

The main challenge in my assigned work was keeping the current day and phase consistent with accumulated choices and creature-related state. The framework uses shared state, separate phase functions, explicit transition conditions, and a final-day check. This connects the daily interaction loop to the model interface and final reveal.

Useful entry points are [`frontend/js/game.js`](frontend/js/game.js), [`frontend/js/gameState.js`](frontend/js/gameState.js), and [`frontend/index.html`](frontend/index.html). The existing public version also contains a local save slot and deterministic player-model tests.

The game runs locally in the browser. Its local analysis is deterministic; it does not require an external LLM, server, API key, or image-generation service.

## Run locally

Open `frontend/index.html` directly in a browser, or run a static server from this project directory:

```sh
python -m http.server 8765 --bind 127.0.0.1 --directory frontend
```

Then visit `http://127.0.0.1:8765/`.

To run the source repository's deterministic tests with Node.js:

```sh
node tests/playerModel.test.js
```

These tests exercise the player-model/data/evolution modules. Their presence is not a claim that I alone authored those team modules or that every browser interaction is covered.

## Source and scope

The `frontend/` and `tests/` folders are unchanged copies from the existing public repository reviewed on 2026-11-15. The original README is preserved in [`docs/README-upstream.md`](docs/README-upstream.md). Empty Python/backend placeholders from that repository are not included in this browser-focused snapshot.

The original repository remains the place to view project history and later changes. This page describes my confirmed course-project contribution and the code available in the snapshot, without adding performance, user-count, or award claims.
