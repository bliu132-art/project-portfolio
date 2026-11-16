# Escape the Card Game

A three-person, card-themed bullet-hell game developed with **JavaScript and Phaser** for **CMPM 120: Game Development Experience, Spring 2026**, at UC Santa Cruz.

**[Play the team game](https://idrinkswaters.github.io/CMPM120_escape_the_card/)** · **[Original team repository](https://github.com/IDrinksWaters/CMPM120_escape_the_card)**

## Team and my contribution

| Contributor | Assigned work |
| --- | --- |
| **Max Liu** | Final Joker Boss and UI implementation |
| **Gongjue Sun** | Player upgrades and special ability |
| **Yiting Lin** | Elite-enemy movement and attack patterns |

My work focused on the final Boss and the game's interfaces. These modules were integrated with the team's player, enemy, and combat systems. The division above describes the confirmed module-level responsibilities; it is not a claim that each line in a shared file was written by a single contributor.

## Final Boss

The Joker encounter uses three phase configurations, a current-phase index, state variables, and timers to organize movement, attacks, and transitions.

- Phase one includes rotating, multidirectional attacks.
- Phase two combines a changing movement trajectory with large-projectile and sweeping attacks.
- Phase three sequences teleport, attack, and wait states, with additional attacks based on player position.
- Phase transitions clean up earlier projectiles, handle transition timing, and initialize the next phase. The last phase connects to the victory flow.

The main source reference is [`src/JokerBoss.js`](https://github.com/IDrinksWaters/CMPM120_escape_the_card/blob/CMPM/src/JokerBoss.js). Combat and victory integration appear in [`src/Scenes/ArrayBoom.js`](https://github.com/IDrinksWaters/CMPM120_escape_the_card/blob/CMPM/src/Scenes/ArrayBoom.js).

## Interfaces and game flow

I worked on UI and scene-based interaction connecting entry, instructions, combat results, and credits. Useful source entry points in the team repository are:

- [`TitleScreen.js`](https://github.com/IDrinksWaters/CMPM120_escape_the_card/blob/CMPM/src/Scenes/TitleScreen.js): menu buttons, hover feedback, and scene transitions.
- [`TutorialScene.js`](https://github.com/IDrinksWaters/CMPM120_escape_the_card/blob/CMPM/src/Scenes/TutorialScene.js): movement and shooting instructions and tutorial steps.
- [`CreditScene.js`](https://github.com/IDrinksWaters/CMPM120_escape_the_card/blob/CMPM/src/Scenes/CreditScene.js): team responsibilities. The archived credits spell my surname “Lui”; the contribution refers to Max Liu.
- `ArrayBoom.js`: combat information, game-over and victory handling, and the transition to credits. Team-wide player-growth and special-ability rules remain my teammate's contribution.

## Main challenge and learning

The key implementation challenges were coordinating Boss phase changes and attacks, and keeping UI behavior consistent with the game flow. I organized phase parameters and update routines separately, made entry/transition/exit conditions explicit, and connected the encounter to the related scenes.

This project gave me practice with state-based game behavior, timing, interface interactions, and integrating an assigned module into a shared game.

## Reviewing or running the project

The original team repository is the canonical source for the complete game, assets, and credits. Use its README and browser demo to explore the full project. Source links above refer to its archived `CMPM` branch.

This portfolio folder contains my contribution summary and source navigation rather than a separate repackaging of all team files. The described behavior was checked against the archived submission source. Preparing this portfolio did not rerun the game or establish performance, player-count, or bug-free-completion claims.
