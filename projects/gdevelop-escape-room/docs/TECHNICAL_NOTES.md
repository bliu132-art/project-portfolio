# Technical notes

## Native project structure

The source is a GDevelop project definition. It describes scenes, objects, visual events, and state variables rather than a browser application that can be served directly.

The original scene list is `Begining`, `Garden`, `Channel`, `Castle`, `Kitchen(left)`, `storage room`, `badroom2`, `badroom1`, `End`, and `end`. These are saved scene entries, not a claim that ten fully completed levels were independently implemented. The uppercase `End` scene has no events.

## Inventory and interaction

`isIventoryOpen` and `selectedSlot` are retained with their original spelling. They separate inventory visibility from slot selection. Item events combine keyboard input with distance and object-state conditions before changing a variable or producing feedback.

Room dependencies use variables such as `whichScene`, `step`, `hasKey_Badroom2_`, and the `isPullRodActivated_...` variables. These support room entry, item acquisition, and mechanism-dependent access. They should be read together with the event conditions and actions, not interpreted as evidence of an independently authored generic inventory framework.

## Controls

The saved events and design material specify arrow-key movement, Z interactions, X inventory access, and arrow-key inventory navigation. Character and movement implementation belongs to Gongjue Sun's contribution. Max Liu's contribution is the inventory, item interactions, and level scenes.

## Preparing a future web build

Restore assets with confirmed permission, open the native project in GDevelop, and preview from `Begining`. Check the inventory, item pickup, cross-room mechanisms, room-entry behavior, and the two differently capitalized ending scenes. GDevelop can then produce a separate HTML5 web export for hosting. See the official [publishing documentation](https://wiki.gdevelop.io/gdevelop5/publishing/).

No preview, export, browser playthrough, or completion test was performed during this repository preparation. The local checks establish file and reference completeness, not end-to-end gameplay correctness.
