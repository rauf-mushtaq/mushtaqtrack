# MushtaqTrack

A low-poly time-trial racer in the style of PolyTrack, in a single HTML file (`index.html`, with Three.js and Ammo.js loaded from CDNs).

## Play

Open `index.html` in a browser. There's nothing to build or install.

To play it from a link, turn on GitHub Pages for this repository (Settings → Pages → Deploy from a branch → `main`, folder `/`). The game is then at `https://<your user name>.github.io/mushtaqtrack/`.

The first time you open the game it asks for your name or nickname. Your times, ghosts, custom tracks and settings are saved in the browser's local storage.

## Features

- **Car physics**: runs on [Ammo.js](https://github.com/kripken/ammo.js), the JavaScript port of the Bullet physics engine. Each car is a Bullet raycast vehicle: a rigid chassis on four raycast wheels with sprung suspension. Grip comes from a friction-circle tyre model that uses each wheel's load from Bullet. The road is Bullet collision geometry built from the track; barriers, pillars and blocks are handled by the car itself, so brushing one slides you along it instead of spinning you round. It's very grippy and fast, and you get weight transfer, wheelspin and real slides. The road is a true 3D surface, so cars can drive banked turns, ride walls and go upside down through loops. A small handling layer on top adds the drift, boosts and air control, and keeps the car on banked and looping road. After a landing the throttle cuts briefly so the back wheels can settle.
- **Air control**: in the air, steering turns the car, W/S pitch the nose down or up, and Space works as an air brake that stops it spinning.
- **Drift**: the cars grip and stay straight through corners. To drift, hold Space (the handbrake) as you turn in to slide the tail out, keep steering into the slide to hold it, then straighten up for a small drift boost; longer drifts give bigger boosts.
- **Track pieces**: road, tight, wide and **banked** turns, **wall rides**, **loops** (exiting a lane left or right), ramps and **long slopes**, kickers, boost pads, **pillars** and **chicane blocks**, **tunnels**, checkpoints, and arrow signs on tight turns.
- **Environments**: Summer, Winter (snowy pines) and Desert (cacti and mesas), combined with time of day.
- **14 cars** in the garage, each with its own model and handling: an open-wheel formula car, an Italian-style supercar, a rear-engine German-style GT, a Le Mans-style prototype, a hypercar, an electric hypercar, a stock car, a muscle car, a drift coupé, a rally hatch, an off-road pickup, a classic roadster and a go-kart. You can repaint any of them. The names are made up and there are no real brand logos.
- **34 official tracks** across Easy, Medium, Hard and Expert, plus a **daily track** and **endless random tracks** from a seed you can share. The generator uses every piece type.
- **Medals** (Bronze, Silver, Gold, Author), and a **ghost of your best run** with live split deltas.
- **Track editor** with 17 piece types, height levels, an environment picker, undo, a route check, and `MT1.` share codes.
- Red/white barriers on every edge (you can clear them when airborne), skid marks, tyre smoke, engine sound, three cameras (the chase camera rolls with the car through loops), a minimap, and keyboard, gamepad and large touch controls.
- An autopilot drives the menu background. It was used to test all 14 cars on all 34 official tracks, and to set the medal times.

## Online features

These need the game to run as a published Claude artifact, which gives the page shared storage, players' identities and live rooms. Opened as a file or from GitHub Pages, the game is single-player: these parts stay hidden and everything else works.

- **Your name** is what other players see on leaderboards, community tracks, ghosts, live races and chat. Change it any time with Change on the menu or in Settings.
- **Community tracks**: press Publish on a track under Yours and everyone who plays the game sees it in the Community tab, with its maker's name. They can race it or copy it into their own editor. You can update or unpublish your own tracks, and the game's owner can remove any track.
- **Leaderboards**: every player's best time on each track goes on a shared board, showing their name and car. Each track card shows the record and your place, and you can click it to see the full board. A board belongs to the track's layout, so the daily, a random seed, a community track or an imported code all have boards too. The game's owner can remove a time.
- **Ghosts of the top times**: a time that makes a track's top ten is posted with its ghost. On a leaderboard (or the finish screen), switch on Ghost next to other players' times to race against them, up to five at once.
- **Live races**: press Race online to host a race or join one from the list of open races. The host picks the track and presses Start, everyone gets the same 3-2-1 countdown, and other racers show as see-through cars with their names. The HUD shows live positions and the finish screen the results; places go by time, and each player's clock runs from their own "Go". The race room has a chat.

Publishing tracks and posting times need Contributor access or higher to the artifact; view-only players can still race, see the boards, and join live races and chat.

## Controls

| Key | Action |
| --- | --- |
| W / ↑ | Accelerate (the clock starts on your first input); in the air, nose down |
| S / ↓ | Brake, then reverse; in the air, nose up |
| A D / ← → | Steer (also in the air) |
| Space / Shift | Handbrake; air brake in the air |
| R | Instant restart (in a live race: back to your last checkpoint) |
| Enter | Back to last checkpoint |
| C | Switch camera |
| Esc / P | Pause |
| M | Mute |
| G | Garage (from the menu) |

Gamepads work too: RT gas, LT brake, X handbrake, Y restart, B checkpoint.
