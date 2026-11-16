# GDevelop Room Exploration Project

A two-person room-exploration and puzzle game created for **CMPM 80K: Foundations of Video Game Design, Fall 2025**. This repository uses a descriptive portfolio title; the original native project retained the default name `Game`.

The player explores connected rooms, finds keys, activates levers, and uses an inventory while unlocking routes through the environment. The project was built with **GDevelop's visual events, conditions, actions, and variables**.

## Team and my contribution

| Contributor | Responsibility |
| --- | --- |
| **Max Liu** | Inventory interface and state, item interactions, and level scenes |
| **Gongjue Sun** | Character and player controls |

My work focused on opening and closing the inventory, selecting slots, connecting item pickup to state changes, arranging interaction objects and room layouts, and coordinating room progression with keys and mechanisms. I connected these systems to my teammate's player controls.

The implementation uses native GDevelop events and engine behaviors. It does not represent a custom engine or a large handwritten JavaScript codebase. The original project uses the `starting-top-down` template and includes the `SpriteMultitouchJoystick` and `SmoothCamera` extensions.

## Implementation highlights

- **Inventory state:** separate variables control whether the interface is open and which slot is selected.
- **Context-sensitive interactions:** key and lever actions combine input, distance, visibility, and state conditions.
- **Room progression:** shared variables track acquired keys, activated mechanisms, the previous room, and progression state.
- **System integration:** a mechanism in one room can change access or feedback in another room.

For example, the native events connect a storage-room lever to a kitchen teleport point, and coordinate room entry with `whichScene`. These are project-level examples of the systems I worked on; the contribution table describes the division of work rather than attributing every event in the shared project to one person.

## Files and current status

- [`source/Game.json`](source/Game.json): native GDevelop scene, object, variable, and event definitions. Editor project identifiers and extension account identifiers were cleared for this portfolio copy; game logic was preserved.
- [`ASSETS.md`](ASSETS.md): asset provenance and redistribution status.
- [`docs/TECHNICAL_NOTES.md`](docs/TECHNICAL_NOTES.md): implementation details, controls, and verification limits.

**The public source snapshot does not include the artwork.** The original local submission contains all 106 image resources referenced by the project, but most have no verified redistribution information. This checkout therefore supports source review and is not a self-contained playable build.

## Opening the native project

1. Use GDevelop 5. The saved `gdVersion` metadata records `major: 5`, `minor: 6`, `revision: 0`, `build: 249`; editor-version compatibility has not been tested for this snapshot.
2. Restore the required, permission-cleared image files at the paths listed in the project's Resources section, relative to `source/Game.json`.
3. Open `source/Game.json` as an existing local project in GDevelop.
4. Open the scene named `Begining` (the original spelling), then use **Preview**.

The intended keyboard controls are arrow keys for movement, **Z** for nearby interactions, and **X** for the inventory. Arrow-key slot navigation is configured while the inventory is open.

GDevelop's [interface documentation](https://wiki.gdevelop.io/gdevelop5/interface/) describes the scene/event editors and Preview. A browser-playable release requires a separate [web export](https://wiki.gdevelop.io/gdevelop5/publishing/); the native JSON file alone is not a web build.

## Verification and limitations

The archived final project was parsed successfully, its resource paths were checked, and all 106 referenced images were found locally. Scene-transition targets were also checked against the saved scene names. The project contains both `End` and `end`; the uppercase `End` scene has no events in this snapshot.

This preparation did **not** run a GDevelop preview, export a web build, or verify completion of every puzzle path. It does not claim that later playtest feedback was fully implemented. No gameplay performance or player-count metrics are asserted.

## Recorded demonstrations

- [Final-project demonstration on YouTube](https://www.youtube.com/watch?v=w-Y8iY3PGwc): a recorded demonstration included in the final-demo submission, rather than a newly verified playable release.
- [Prototype build on gd.games](https://gd.games/instant-builds/cff975eb-7164-48be-8beb-bd5201c28a8e): the link submitted for the prototype stage. Its current availability has not been reverified; it should not be presented as the final build.

## Credits and rights

Project contributors are Max Liu and Gongjue Sun. Engine, template, and extension work is credited separately from the team's coursework. This repository does not claim that its artwork or bundled extension definitions are all original to the team, and it does not grant a blanket license for third-party material. See [`ASSETS.md`](ASSETS.md) before redistributing assets or publishing a playable build.
