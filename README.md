# Bozhuo Max Liu — Project Portfolio

Selected undergraduate projects from **Computer Science: Computer Game Design** at the **University of California, Santa Cruz**. My work includes AI search, experimental evaluation, game flow and state management, boss behavior, and inventory and interaction systems.

[中文介绍](README.zh-CN.md)

## Selected projects

| Project | Focus | My contribution | Explore |
| --- | --- | --- | --- |
| **[Ultimate Tic-Tac-Toe MCTS](projects/p2-mcts/)** | Python · AI search · experiments | Individual implementation of MCTS, an immediate-win rollout heuristic, and search-budget/strategy comparisons | [Code](projects/p2-mcts/src/) · [Reports](projects/p2-mcts/reports/) |
| **[Chimera](projects/chimera/)** | HTML/CSS/JavaScript · interactive systems | Seven-day game framework, phase transitions, choice records, state management, and module integration in a three-person project | [Code](projects/chimera/frontend/) · [Play](https://bliu132-art.github.io/CMPM146-Final-Project-Chimera/) · [Original repository](https://github.com/bliu132-art/CMPM146-Final-Project-Chimera) |
| **[Escape the Card Game](projects/escape-the-card-game/)** | JavaScript · Phaser · game programming | Final Joker Boss and UI in a three-person project | [Team source](https://github.com/IDrinksWaters/CMPM120_escape_the_card) · [Play](https://idrinkswaters.github.io/CMPM120_escape_the_card/) |
| **[GDevelop Room Exploration](projects/gdevelop-escape-room/)** | Visual events · inventory · interactions | Inventory, item interactions, and level scenes in a two-person project | [Native event source](projects/gdevelop-escape-room/source/Game.json) · [Recorded demonstration](https://www.youtube.com/watch?v=w-Y8iY3PGwc) |

## What I worked on

**AI search and evaluation.** In the individual MCTS project, I connected selection, expansion, rollout, and backpropagation, then compared a random rollout with a heuristic that checks for an immediate whole-game win. The submitted reports record seven configurations with 100 games per configuration. These are historical course experiments; the course environment and exact runner configurations are not included in this snapshot.

**Flow, state, and integration.** In Chimera, I worked on the browser game framework and the relationship between daily progress, accumulated choices, and the final reveal. Teammates were responsible for player modeling and evolution, and for narrative and visual direction. The browser source and deterministic tests here are a snapshot of the existing public repository.

**Game behavior and interfaces.** In Escape the Card Game, my assigned work was the final Boss and UI. The project page explains the stage-based behavior, timing, scene transitions, and integration with teammates' player and enemy systems. The original team repository remains the source of the complete game and its credits.

**Visual-event systems.** In the GDevelop project, I worked on inventory state, item interactions, room layouts, and progression conditions. My teammate handled the character and player controls. The native event definitions are included for source review; the public snapshot omits artwork whose redistribution terms have not been established. The archived video demonstrates the original project.

## Running and reviewing

- **Chimera:** open `projects/chimera/frontend/index.html`, or serve that folder with a local static server. Its project README includes the test command.
- **MCTS:** review the two agent modules and reports. Running or reproducing the original experiments also requires the course-provided environment, simulator, and matching budget configurations.
- **Escape:** use the original team repository or its browser demo. The portfolio page identifies my contribution and the relevant files.
- **GDevelop:** review `source/Game.json` in the GDevelop editor. A playable build additionally requires the original image resources; the JSON is not itself a web export.

## Authorship and credits

**Bozhuo Liu / Max Liu** is the contributor described in the personal-work sections. MCTS is an individual course project. The other three are team projects, with each project page distinguishing my work from my teammates' work. Existing source credits are retained. No blanket license for third-party coursework, engines, extensions, or artwork is granted by this portfolio.

